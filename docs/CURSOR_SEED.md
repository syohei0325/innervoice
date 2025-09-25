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

## 次の価値（MVP+）: Intent バス & Confirm once Multi‑Action
- 入力：**7秒**（声/無音テキスト）→ **Intent化**（やりたいことをJSON化）
- 提案：**2つの実行プラン**（例：A=カレンダー+メッセ+リマインド / B=代替案）
- 確定：**Confirm once（1回のOK）**で**複数アクションを並列実行**（Calendar/Messenger/Reminders 等）
- フォールバック：**.ics一発発行**（現MVPを常時バックアップ経路として維持）
- 可視化：**Minutes‑Back**は**束ねた実行**で短縮できた合計分を加算

## 北極星（PMF検証KPI）
- Median **Minutes‑Back ≥ 15分/日**（D30継続ユーザー）
- D1≥60% / D7≥35% / D30≥25% / 日あたり確定≥3 / NPS≥50

## 開発クイックスタート
pnpm i
cp .env.example .env.local
pnpm dev

## For Developers（Public API）
- 開発者向けの**公開API/SDK/Webhook**を提供します（β）。
- 使い方：1) APIキー発行 → 2) `POST /v1/plan`でPlanを取得 → 3) `POST /v1/confirm`で一括実行 → 4) `minutes_back` を受領。
- 詳細は **docs/PUBLIC_API.md** / **docs/INTENT_SCHEMA.md** / **docs/WEBHOOKS.md** / **docs/CONNECTOR_SDK.md** を参照。

## デザイン原則
- No Feed / No Scroll
- One‑shot UX（7秒→2提案→1確定）
- Minutes‑Back 可視化
- Silent First（音声×テキスト両立）
- データはユーザーのもの（エクスポート/削除）
- アプリ横断は **Intent バス**で配車し、**Confirm once**で一括実行（透明性ある要約を必ず表示）
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
8. アプリ横断は Intent バスでつなぐ（個別連携のスパゲッティ化を防ぐ）
9. 承認は Confirm once（1回のOKで実行、要約テキストで透明性を担保）
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


# ─────────────────────
# BEGIN: docs/PRD_MVP_PLUS.md
# ─────────────────────
# PRD – MVP+「Intentバス & Confirm once Multi‑Action」

## 目的（MVPからの拡張）
- .ics片方向のMVPに **“アプリ横断の一括実行”** を追加し、**Minutes‑Back**を跳ねさせる。

## ユースケース（最小）
1) 朝の段取り：カレンダー追加 + 家族へ一言メッセ + 起床リマインド
2) 移動前：配車手配 + 先方にETAメッセ + 予定ブロック

## 受け入れ基準（MVP+）
- 7秒入力→**2つの実行プラン（PlanA/PlanB）**を提示（各プランは1–3アクションで構成）
- **Confirm once**で**2アクション以上を並列実行**（初期は Calendar.Create と Messenger.Send）
- 成功/失敗は個別に可視化し、**部分成功**でも全体は完了扱い（失敗分はリトライ/再提案）
- **.ics フォールバック**は常時有効（ネットワーク遅延や権限未連携時）
- p50 レイテンシ < **2s**（提案表示まで）。実行はバックグラウンドで継続し結果通知
- **Minutes‑Back**は束ねた実行の短縮見積を加算（後で実測化）

## 非機能
- 透明性：実行前に **テキスト要約（実行プラン）** を表示。既定で「メッセ送信」はチェックON/OFFを切替可
- プライバシー：音声は即テキスト化し**要約のみ保存**／**感情推定は既定OFF**
# ─────────────────────
# END: docs/PRD_MVP_PLUS.md
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
- **Intentバス**：Intent(JSON)→ Plan → Connector 実行（並列）
- **.ics生成：サーバ（Node.js runtime）**
- コネクタ：Calendar / Messenger / Reminders（最小2種類から開始）
- **DB：Postgres（Neon/Supabase） + Prisma**（初期からPostgres固定）
- E2E：Playwright
- 計測：PostHog or GA4（軽量）
- Public API Gateway（API Key / Rate Limiter / Versioning）
- Webhooks Dispatcher（署名付与 / リトライ）

## データ流れ
入力(7秒音声/テキスト)
 → POST /api/propose（LLMで2案生成）
 → UI表示（ProposalCard×2）
 → ユーザーが1案を選択 → **/api/plan**（Intent化→PlanA/B を生成）
 → **Confirm once**（実行プランの要約＋チェックで最終承認）
 → **/api/confirm**（Plan並列実行：Calendar/Messenger/...）＋ **.icsフォールバック**
 → 結果通知 / Minutes‑Back 加算 / 監査ログ

## データ流れ（外部開発者）
外部App
 → POST /v1/plan（API Key）
 → plans[2] を受領 → ユーザーに要約表示（あなたのUI）
 → POST /v1/confirm（plan_id）
 → Webhook `action.executed` / `minutes_back.added`

## フォールバック
- 失敗/遅延：直近の「My Voice」テンプレA/Bを即時提示
- 音声不可：即テキスト入力表示
- 送信失敗：ローカル再送キュー保持
- Intent/Plan 失敗時：.ics単発発行に自動ダウングレード
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

## 追加テーブル（MVP+）
- intents(id, user_id, text, json, created_at)
- plans(id, user_id, intent_id, actions_json, created_at)
- executions(id, plan_id, status, results_json, created_at)
- connectors(id, user_id, provider, enabled, scopes_json, created_at)

## インデックス（追加）
- plans(user_id, created_at)
- executions(plan_id, created_at)
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

## POST /api/plan
Req:
{ "proposal_id":"p1", "context":{"tz":"Asia/Tokyo"} }
Res:
{ "plans":[
  {"id":"pl1","summary":"07:00-07:30 朝ラン + 妻にメッセ + 06:45リマインド","actions":[
     {"action":"calendar.create","title":"朝ラン","start":"2025-09-19T07:00","duration_min":30},
     {"action":"message.send","to":"妻","text":"7時に走ってくるね"},
     {"action":"reminder.create","time":"2025-09-19T06:45","note":"ストレッチ"}
  ]},
  {"id":"pl2","summary":"雨なら夜ストレッチ15分 + 連絡","actions":[
     {"action":"calendar.create","title":"夜ストレッチ","start":"2025-09-19T21:30","duration_min":15},
     {"action":"message.send","to":"妻","text":"夜にするね"}
  ]}
], "latency_ms": 950 }

## POST /api/confirm（拡張）
Req: { "plan_id":"pl1" }
Res: { "results":[
  {"action":"calendar.create","status":"ok","id":"evt_123"},
  {"action":"message.send","status":"ok","id":"msg_456"},
  {"action":"reminder.create","status":"ok","id":"rmd_789"}
], "minutes_back":18 }

### .ics 配信仕様（Node.js runtime）
- Content-Type: text/calendar; charset=utf-8
- Content-Disposition: attachment; filename="innervoice-evt_*.ics"
# ─────────────────────────
# END: docs/API_CONTRACTS.md
# ─────────────────────────

# ─────────────────────────
# BEGIN: docs/PUBLIC_API.md
# ─────────────────────────
# Public API（β）

## 概要
- ベースURL：`${NEXT_PUBLIC_API_BASE_URL}/v1`
- 認証：`Authorization: Bearer <API_KEY>`
- レート制限：デフォルト **60 req/min**（Key+IP）。超過→HTTP 429
- バージョニング：`/v1`（後方互換に配慮）

## Quickstart（cURL）
```bash
# 1) Planを取得
curl -s -X POST "$BASE/v1/plan" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"明日朝30分ラン","context":{"tz":"Asia/Tokyo"}}'

# 2) Confirm once（pl1を確定）
curl -s -X POST "$BASE/v1/confirm" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"pl1"}'