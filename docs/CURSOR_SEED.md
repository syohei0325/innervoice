# =========================================
# Cursor Pack – InnerVoice (7秒→2提案→1確定 .ics)
# =========================================
# 目的：Cursorが迷わずMVPを実装できるよう、文脈・ルール・受入基準・観測まで一式を提供

# ───────────────
# BEGIN: README.md
# ───────────────
# InnerVoice – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

## 核心体験（MVP）
- 入力：**7秒**（音声 or 無音テキスト）
- 出力：**2つの提案**（所要時間ラベル付き）
- 確定：**1タップで .ics を発行**（まずは片方向）
- 画面：**1枚だけ**（Input/Proposals/Confirm/Minutes‑Back）

## 北極星（PMF検証KPI）
- Median **Minutes‑Back ≥ 15分/日**（D30継続ユーザー）
- D1≥60% / D7≥35% / D30≥25% / 日あたり確定≥3 / NPS≥50

## 開発クイックスタート
pnpm i
cp .env.example .env.local
pnpm dev

## デザイン原則
- No Feed / No Scroll
- One‑shot UX（7秒→2提案→1確定）
- Minutes‑Back 可視化
- Silent First（音声×テキスト両立）
- データはユーザーのもの（エクスポート/削除）
# ───────────────
# END: README.md
# ───────────────


# ────────────────────
# BEGIN: docs/VISION.md
# ────────────────────
# VISION – なぜ作るのか
**人の注意と時間を取り戻す。**  
InnerVoice は、スクロールではなく「**決めて、置いて、戻る**」を7秒で完了させる。

## プロダクト憲法
1. 無限フィードは作らない
2. 1画面で完結（7秒→2→1）
3. Minutes‑Back を常時表示
4. 音声不能時は即テキスト
5. データ最小化・透明性
6. 予約/購入は勝手に行わない（必ず1タップ承認）
7. 失敗を恐れず速く学ぶ（データで意思決定）
# ────────────────────
# END: docs/VISION.md
# ────────────────────


# ─────────────────────
# BEGIN: docs/PRD_MVP.md
# ─────────────────────
# PRD – MVP「7秒→2提案→1確定（.ics）」

## ペルソナ（初期）
- 25–40歳、忙しくて「決め切れない/先送り」が日常的課題

## ユースケース（3本柱）
1) 朝の段取り：空き45分→A/B/C どれかに置く  
2) 移動前：今出る/配車/延期の小決断  
3) 就寝前：明日の自分へ1タスク置き土産

## 受け入れ基準
- 7秒入力（音声/無音）→**2提案**表示→**.ics生成DL**まで **p50<2s**
- 各提案に **duration_min** と開始時刻候補（slot）
- エラー時は**静音テキストへ自動フォールバック**
- **Minutes‑Back** が今日分に加算・表示
- PIIは保存せず、**要約+操作メタ**のみサーバ保存

## 計測イベント（必須）
- iv.input_started / iv.proposals_shown / iv.confirmed / iv.ics_downloaded  
- iv.minutes_back_added{minutes,source} / iv.error{type} / iv.nps_submitted
# ─────────────────────
# END: docs/PRD_MVP.md
# ─────────────────────


# ─────────────────────────
# BEGIN: docs/ARCHITECTURE.md
# ─────────────────────────
# アーキテクチャ（MVP）

## スタック
- Web：Next.js (App Router)
- **API ランタイム**：**Node.js runtime** を明示（各 /app/api/**/route.ts に `export const runtime = 'nodejs'`）
- 音声→テキスト：OpenAI Whisper API（将来ローカル推論検討）
- 提案生成：LLM API（短文・低温度）
- **.ics生成：サーバ（Node.js runtime）**
- **DB：Postgres（Neon/Supabase） + Prisma**（初期からPostgres固定）
- E2E：Playwright
- 計測：PostHog or GA4（軽量）

## データ流れ
入力(7秒音声/テキスト)
 → POST /api/propose（LLMで2案生成）
 → UI表示（ProposalCard×2）
 → ユーザーが1案確定
 → POST /api/confirm（**.ics生成 + MB加算**）
 → .icsダウンロード / イベント記録

## フォールバック
- 失敗/遅延：直近の「My Voice」テンプレA/Bを即時提示
- 音声不可：即テキスト入力表示
- 送信失敗：ローカル再送キュー保持
# ─────────────────────────
# END: docs/ARCHITECTURE.md
# ─────────────────────────


# ──────────────────────
# BEGIN: docs/DATA_MODEL.md
# ──────────────────────
# データモデル

## テーブル
- users(id, email_hash, created_at)
- profiles(user_id, tz, display_name, commute_minutes, sleep_window, ng_hours_json, mobility_pref)
- proposals(id, user_id, payload_json, created_at)       # 2案の内容・所要時間
- decisions(id, user_id, proposal_id, ics_blob, minutes_back, decided_at)
- events(id, user_id, source, minutes_back, meta_json, created_at)
- deletion_requests(id, user_id, status, requested_at)

## インデックス
- decisions(user_id, decided_at)
- events(user_id, created_at)

## Minutes‑Back 概算（初期）
- ルール：**提案所要時間短縮分** or **自己申告**の小さい方
- 将来：移動/画面/完了ログと突合し実測化
# ──────────────────────
# END: docs/DATA_MODEL.md
# ──────────────────────


# ─────────────────────────
# BEGIN: docs/API_CONTRACTS.md
# ─────────────────────────
# API コントラクト（MVP）

## POST /api/propose
Req:
{ "text":"明日朝30分ランニング", "context":{"tz":"Asia/Tokyo","ng":["22:00-06:30"],"mobility":"walk"} }
Res:
{ "proposals":[
  {"id":"p1","title":"朝ラン20分","slot":"07:10","duration_min":20},
  {"id":"p2","title":"夜ストレッチ15分","slot":"21:30","duration_min":15}
], "latency_ms": 850 }

## POST /api/confirm
Req: {"proposal_id":"p1"}
Res: { "ics_url":"/download/evt_abc123.ics", "minutes_back":18 }

### .ics 配信仕様（Node.js runtime）
- Content-Type: text/calendar; charset=utf-8
- Content-Disposition: attachment; filename="innervoice-evt_abc123.ics"
# ─────────────────────────
# END: docs/API_CONTRACTS.md
# ─────────────────────────


# ─────────────────────────────
# BEGIN: docs/SECURITY_PRIVACY.md
# ─────────────────────────────
# セキュリティ / プライバシー

- **データ最小化**：音声は即テキスト化→**要約のみ保存**（原音は既定保存しない/任意ONでも90日ローテ）
- 暗号化：At‑Rest AES‑256 / In‑Transit TLS1.2+
- 削除API：/api/account/delete（48h以内完了）
- エクスポート：/api/account/export（JSON）
- ログ：PII無し・ハッシュ化
- 透明性：月次 Transparency Report（削除件数/保持期間/障害）
# ─────────────────────────────
# END: docs/SECURITY_PRIVACY.md
# ─────────────────────────────


# ─────────────────────────────
# BEGIN: docs/TEST_STRATEGY.md
# ─────────────────────────────
# テスト戦略

## ユニット
- .ics生成 / TZ計算 / 提案バリデータ

## 結合
- propose→UI→confirm→.ics→MB加算の一連

## E2E（Playwright）
- 7秒入力（モック）→2提案→1タップ→.ics存在 で PASS
- p50/p95レイテンシ閾値超過で失敗

## SLO
- propose→confirm 転換≥70% / iv.error<1%
# ─────────────────────────────
# END: docs/TEST_STRATEGY.md
# ─────────────────────────────


# ─────────────────────────
# BEGIN: docs/OBSERVABILITY.md
# ─────────────────────────
# モニタリング / 計測

### 北極星
- Median Minutes‑Back

### コアイベント
- input_started / proposals_shown / confirmed / ics_downloaded / minutes_back_added / error / nps_submitted

### ダッシュボード
- 今日/週/月 MB
- シーン別MB（morning/move/night）
- p50/p95 レイテンシ
# ─────────────────────────
# END: docs/OBSERVABILITY.md
# ─────────────────────────


# ──────────────────────────
# BEGIN: docs/CURSOR_RULES.md
# ──────────────────────────
# Cursor 依頼ルール（重要）

## 目的
- **MVP実装**：7秒→2提案→1確定（.ics）、1画面UI、E2E 1本、MB集計

## コーディング規約
- TypeScript / ESLint / Prettier
- コンポーネント小さく / hooksに副作用
- 例外は Result<T,E> で扱う

## 各APIファイルの先頭に必ず記述
export const runtime = 'nodejs';

## 依頼テンプレ（最初に実行）
Task: MVP "7秒→2提案→.ics" を実装して PR 作成  
Acceptance:
- 1画面UI（InputBar / ProposalList / ProposalCard×2 / ConfirmButton / MBMeter）
- 7秒入力→2提案→.icsダウンロード（p50<2s）/ フォールバック動作
- Prisma(Postgres)で decisions/events へ記録
- E2E(Playwright)1本 PASS / Lint/Type OK
Deliverables:
- PR 1本（スクショ/動画/GIF・README更新）

## 次の依頼（順番）
1) /api/propose 実装最適化（p50<1s目標）
2) Silent‑Mode（音声不可時テキスト最短導線）
3) MBダッシュボード（今日/週/月）
4) NPSと不満収集フォーム
# ──────────────────────────
# END: docs/CURSOR_RULES.md
# ──────────────────────────


# ────────────────────────────
# BEGIN: docs/UI_SKETCH.md
# ────────────────────────────
# 1画面UI ワイヤー & 命名

[ InputBar ] ← 7秒（音声/無音切替）
[ ProposalList ]
  ├─ ProposalCard(A) 〈duration_min/slot〉 [ConfirmButton]
  └─ ProposalCard(B) 〈duration_min/slot〉 [ConfirmButton]
[ MBMeter ] 今日の Minutes‑Back 合計
[ Footer ] エラートースト / Silent切替 / 設定（最小）

コンポーネント：InputBar, ProposalList, ProposalCard, ConfirmButton, MBMeter
# ────────────────────────────
# END: docs/UI_SKETCH.md
# ────────────────────────────


# ────────────────────────────
# BEGIN: docs/ROADMAP_90DAYS.md
# ────────────────────────────
# 90日ロードマップ（PMF検証）

## W1–W3（コア体験のみ）
- 7秒→2提案→.ics / p50<2s / ics成功率>99%

## W4–W7（記憶ミニ）
- My Voice（5項目）で当たり率UP
- 朝/移動/夜テンプレ提案

## W8–W12（半自動）
- Google/Apple Calendar 片→双方向
- 朝イチ「空き◯分→A/B/C」提案
- 週次MBレポート & 招待インセンティブ
# ────────────────────────────
# END: docs/ROADMAP_90DAYS.md
# ────────────────────────────


# ─────────────────────────
# BEGIN: docs/FOUNDERS_50.md
# ─────────────────────────
# Founder's 50（コア検証ユーザー）

条件：14日連続使用 / 週1×30分フィードバック  
特典：Pro1年/クレジット/称号  
指標：D1/D7/D30 / 日確定数 / MB / NPS / 定性不満
# ─────────────────────────
# END: docs/FOUNDERS_50.md
# ─────────────────────────


# ──────────────────
# BEGIN: docs/PROMPTS.md
# ──────────────────
# LLM プロンプト方針（MVP）

目的：**2案だけ**出す。各案に **duration_min** を必須付与。冗長説明なし。

System:
「あなたは"時間を返す"アシスタント。出力は JSON で proposals[] を2つ返す。」

User例: 「明日朝ランニングしたい。30分くらい。」

出力例:
{"proposals":[
 {"title":"朝ラン20分","slot":"07:10","duration_min":20},
 {"title":"夜ストレッチ15分","slot":"21:30","duration_min":15}
]}
# ──────────────────
# END: docs/PROMPTS.md
# ──────────────────


# ─────────────────────
# BEGIN: docs/ICS_SPEC.md
# ─────────────────────
# .ics 仕様（MVP）

TZ：profiles.tz / 未設定はブラウザTZ  
SUMMARY：提案タイトル  
DESCRIPTION：Generated by InnerVoice（所要時間含む）  
Content-Type: text/calendar; charset=utf-8  
Content-Disposition: attachment; filename="innervoice-evt_*.ics"
# ─────────────────────
# END: docs/ICS_SPEC.md
# ─────────────────────


# ─────────────────────────
# BEGIN: docs/DELETION_EXPORT.md
# ─────────────────────────
# データ削除 / エクスポート

GET /api/account/export → JSON（要約/操作メタ/MB履歴）  
POST /api/account/delete → 48h以内に完了（確認メール）
# ─────────────────────────
# END: docs/DELETION_EXPORT.md
# ─────────────────────────


# ─────────────────────
# BEGIN: .env.example
# ─────────────────────
OPENAI_API_KEY=<your-key>
NEXT_PUBLIC_APP_NAME=InnerVoice
APP_TIMEZONE_DEFAULT=Asia/Tokyo
TELEMETRY_WRITE_KEY=<posthog-or-ga4>
DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>?sslmode=require
# ─────────────────────
# END: .env.example
# ─────────────────────


# ─────────────────────────────
# BEGIN: .github/PULL_REQUEST_TEMPLATE.md
# ─────────────────────────────
## 概要
- ユーザーストーリー / 背景

## 受け入れ基準
- [ ] 7秒→2提案→.ics の経路（p50<2s）
- [ ] フォールバック動作確認
- [ ] Prisma(Postgres)への記録
- [ ] E2E 1本 PASS / Lint/Type OK

## スクショ/動画
（貼付）

## 影響範囲
- UI / API / DB

## メモ
- リスク / 次の一手
# ─────────────────────────────
# END: .github/PULL_REQUEST_TEMPLATE.md
# ─────────────────────────────


# ─────────────────────────────
# BEGIN: docs/TASKS_BOOTSTRAP.md
# ─────────────────────────────
# Cursor向け 初回タスクリスト（順番厳守）

1) スキャフォールド
- Next.js(App Router) 初期化、/app 配下に 1画面UI（InputBar/ProposalList/ProposalCard/ConfirmButton/MBMeter）
- ESLint/Prettier/Playwright 設定

2) DB & Prisma
- Postgres 接続（.env参照）、schema.prisma に users/profiles/proposals/decisions/events を定義
- マイグレーション実行

3) API – propose
- Node.js runtime を宣言
- LLM呼び出し→ proposals[2] を返す（duration_min/slot 付与）

4) API – confirm
- Node.js runtime を宣言
- .ics 生成→DLレスポンス（ヘッダ仕様厳守）、decisions/events を保存、MBを返す

5) E2E
- 7秒入力(モック)→2提案→1クリック→.ics存在 で PASS

6) 計測 & ダッシュボード
- 必須イベント送信 / 今日のMB合計表示

7) Silent‑Mode & フォールバック
- 音声不可→即テキスト / 失敗時テンプレA/B提示

完了後：README 更新・GIF録画・PR作成
# ─────────────────────────────
# END: docs/TASKS_BOOTSTRAP.md
# ─────────────────────────────
