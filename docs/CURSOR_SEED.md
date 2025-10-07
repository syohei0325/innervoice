# =========================================
# Cursor Pack – Yohaku (7秒→2提案→1確定 / Confirm once / .ics)
# =========================================
# 目的：Cursorが迷わずMVP→MVP+→Pack拡張まで実装できるよう、文脈・ルール・受入基準・観測まで一式を提供

# ───────────────
# BEGIN: README.md
# ───────────────
# Yohaku – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

## 核心体験（MVP）
- 入力：**7秒**（音声 or 無音テキスト）
- 出力：**2つの提案**（所要時間ラベル付き）
- 確定：**1タップで .ics を発行**（片方向フォールバックを常時有効）
- 画面：**1枚だけ**（Input / Proposals / Confirm / Minutes‑Back）

## 次の価値（MVP+）: Intent バス & Confirm once Multi‑Action
- 入力：**7秒**（声/無音テキスト）→ **Intent化**（やりたいことをJSON化）
- 提案：**2つの実行プラン**（例：A=カレンダー+メッセ+リマインド / B=代替案）
- 確定：**Confirm once（1回のOK）**で**複数アクションを並列実行**（Calendar / Messenger / Reminders 等）
- フォールバック：**.ics一発発行**（MVPを常時バックアップ経路として維持）
- 可視化：**Minutes‑Back**は**束ねた実行**で短縮できた合計分を加算

## Pack 拡張（LifeOps OS）
- **Money Pack**：家計の交渉・解約・乗換（成功報酬/アフィ対応）
- **Civic Pack**：行政/役所/DMV/ビザ等の手続き（書類生成＋枠取り）
- **Family Pack**：家族の段取り（学校/送迎/連絡）
- **Care Pack**：在宅介護の外周（通院/服薬/家族連絡）
- 共通：**ConfirmOS**（承認/取消/監査/二重承認）で安全性を規格化

## 北極星（PMF検証KPI）
- Median **Minutes‑Back ≥ 15分/日**（D30継続ユーザー）
- **Screen‑off完了率 ≥ 70%**
- D1≥60% / D7≥35% / D30≥25% / 日あたり確定≥3 / **誤実行率 < 0.5%** / NPS≥50

## 開発クイックスタート
pnpm i
cp .env.example .env.local
pnpm dev

## For Developers（Public API）
- 開発者向けの**公開API/SDK/Webhook**を提供（β）。
- 使い方：1) APIキー発行 → 2) `POST /v1/plan`でPlanを取得 → 3) `POST /v1/confirm`で一括実行 → 4) `minutes_back` を受領。
- 詳細は **docs/PUBLIC_API.md** / **docs/INTENT_SCHEMA.md** / **docs/WEBHOOKS.md** / **docs/CONNECTOR_SDK.md** を参照。

## For Developers（MCP）
- Yohakuは **MCP（Model Context Protocol）** に準拠したツール群を提供（β）。
- 使い方：1) MCPサーバURLを用意 → 2) Realtime/ClaudeなどのクライアントにURLを渡す → 3) tools（`calendar.create` / `message.send` / `reminder.create` / `call.place` / `places.search` / `reservations.book` / `parking.reserve` / `ride.order` / `pay.authorize` / `notify.push`）を呼び出し。
- 詳細は **docs/MCP_OVERVIEW.md** を参照。

## For Developers（OS & Calls）
- **OS Deep Integrations**: iOS Shortcuts / App Intents, Android Intents, Windows (Graph/Notifications)。OSからYohakuを直接起動し、フォローアップをバックグラウンド実行。
- **Voice Calls (SIP) β**: 予約/キャンセル/再配達などを**電話**で完了。MCP `call.place` を用い、transcript→summary→Planの後続実行。
- 詳細は **docs/OS_INTEGRATIONS.md** / **docs/CALL_TEMPLATES.md** / **docs/PRD_CALL_OS.md** を参照。

## デザイン原則
- No Feed / No Scroll
- One‑shot UX（7秒→2提案→1確定）
- Minutes‑Back / Money‑Back 可視化
- Silent First（音声×テキスト両立）
- データはユーザーのもの（エクスポート/削除）
- アプリ横断は **Intent バス**で配車し、**Confirm once**で一括実行（透明性ある要約を必ず表示）
- Personalization‑first（**Vibe Profile / Taste Embedding / Why‑this** で提案文と確認文を個人最適）
- **Trustパネル常設**（誤実行/取消成功/平均承認時間）＋**理由フィードバック**の1タップ収集

## 将来像（3年の絵 / Super‑App by Voice）
- 目標：**「Yohakuを開いて話すだけで、アプリ横断の用事が全部終わる」**。80/20で“毎日の用事”をカバーし、残りは通話/人に委譲。
- コア：**7→2→1（Confirm once）**、**MCP**（places/reservations/parking/ride/pay/call/notify）、**OS深統合**（Shortcuts/Intents/通知1タップ）。
- 学習：**Taste Embedding**（好みベクトル）と**Partnerモード**（同意ベース共有）で“あなた/相手”に最適化。
- 安全：**要約の強制表示/取消/ロールバック/監査**、金額は**二重承認**。
- 詳細：**docs/FUTURE_VISION.md** / **docs/TASTE_MODEL.md** / **docs/PARTNER_MODE.md** / **docs/CONFIRM_OS.md** / **docs/PACKS_OVERVIEW.md** を参照。
# ───────────────
# END: README.md
# ───────────────


# ────────────────────
# BEGIN: docs/VISION.md
# ────────────────────
# VISION – なぜ作るのか
**人の注意と時間を取り戻す。**  
Yohaku は、スクロールではなく「**決めて、置いて、戻る**」を7秒で完了させる。

## プロダクト憲法
1. 無限フィードは作らない
2. 1画面で完結（7秒→2→1）
3. Minutes‑Back / Money‑Back を常時表示
4. 音声不能時は即テキスト
5. データ最小化・透明性（要約＋操作メタのみ長期保存）
6. 予約/購入/通話は勝手に行わない（**Confirm once**で必ず承認）
7. 失敗を恐れず速く学ぶ（データで意思決定）
8. アプリ横断は **Intent バス**（スパゲッティ連携を回避）
9. 承認は **ConfirmOS** で規格化（取消/ロールバック/監査/二重承認）

## 将来像（World Model）
- **声で完了する横断OS**：地図/予約/駐車/移動/連絡/決済を Plan→Confirm once で連鎖実行。
- **好みの学習**：承認/却下/再訪/滞在時間から Taste Embedding を更新し、提案の当たり率を上げる。
- **Partnerモード**：相手の同意のもと、NG食材/価格帯/雰囲気/移動手段を最小共有（期限付きトークン）。
- **フォールバック**：APIが無い先は `call.place`（通話）＋SMSで確定。常に .ics 退避。
- **KPI**：
- **Top‑1採択率 ≥ 55%**
- **編集距離中央値 ≤ 20%**（提案→確定の差分）
- **Time‑to‑Confirm p50 ≤ 3秒**
- Taste命中率≥40%。
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
- 7秒入力（音声/無音）→**2提案**表示→**.ics生成DL**まで **p50≤1.5s**
- 各提案に **duration_min** と開始時刻候補（slot）
- エラー時は**静音テキストへ自動フォールバック**
- **Minutes‑Back** が今日分に加算・表示
- **PIIは保存しない**（要約+操作メタのみサーバ保存）

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
- **p50 レイテンシ ≤ 1.5s**（提案表示まで）。実行はバックグラウンドで継続し結果通知
- **Minutes‑Back**は束ねた実行の短縮見積を加算（後で実測化）
- **Why‑this‑for‑you**：各プランに「あなた向けの理由」最大3点を表示（例：朝型/徒歩15分圏/過去採択）
- **理由フィードバック**：👍/👎 とタグ（高い/遠い/混雑/暗い等）を1タップ収集→Taste更新

## 非機能
- 透明性：実行前に **テキスト要約（実行プラン）** を表示。既定で「メッセ送信」はチェックON/OFFを切替可
- プライバシー：音声は即テキスト化し**要約のみ保存**／**感情推定は既定OFF**
# ─────────────────────
# END: docs/PRD_MVP_PLUS.md
# ─────────────────────


# ─────────────────────────
# BEGIN: docs/CONFIRM_OS.md
# ─────────────────────────
# ConfirmOS – 安全な自動化の標準（承認/取消/監査/二重承認）

## 目的
- Yohaku内外のエージェントに**同じ安全基準**を提供し、誤実行とコンプラリスクを最小化。

## 要件
- **Confirm Sheet**：実行要約（誰に/何を/いつ/影響）＋トグル（メッセ送信ON/OFF等）
- **取り消し猶予**：デフォルト10秒のUndo（トースト/通知）
- **ロールバック**：実行ごとの逆操作（可能な限り）を保持
- **二重承認**：金額/通話/支払い権限は別承認ダイアログ
- **監査ログ**：承認ID（approve_id）/実行ID/操作者/タイムスタンプ/入力要約
- **Idempotency**：`/confirm`は idempotency‑key 必須

## SDK
- Web/モバイルのDrop‑in：`<ConfirmOSSheet plan={...} onApprove={...} />`
- API：`POST /api/approve` → `{ approve_id }` を発行、`POST /api/confirm`で実行

## KPI
- **誤実行率 < 0.5%** / 取消成功率 / ロールバック成功率 / 平均承認時間
# ─────────────────────────
# END: docs/CONFIRM_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/ARCHITECTURE.md
# ─────────────────────────
# アーキテクチャ（MVP→MVP+）

## スタック
- Web：Next.js (App Router)
- **API ランタイム**：**Node.js runtime** を明示（各 `/app/api/**/route.ts` に `export const runtime = 'nodejs'`）
- 音声→テキスト：OpenAI Whisper API（将来ローカル推論検討）
- 提案生成：LLM API（短文・低温度）
- **Intentバス**：Intent(JSON) → Plan → Connector/MCP 実行（並列）
- **.ics生成：サーバ（Node.js runtime）**
- コネクタ：Calendar / Messenger / Reminders（最小2種類から開始）
- **DB：Postgres（Neon/Supabase） + Prisma**（初期からPostgres固定）
- E2E：Playwright
- 計測：PostHog or GA4（軽量）
- Public API Gateway（API Key / Rate Limiter / Versioning / **Idempotency**）
- Webhooks Dispatcher（署名付与 / リトライ / **アウトボックス**）
- MCPクライアント：OpenAI Realtime / Anthropic Claude から remote/local MCP に接続
- MCPサーバ：**yohaku-mcp**（remote）／**yohaku-mcp-local**（端末内）— tools=`calendar.create`/`message.send`/`reminder.create`/`call.place`/`places.search`/`reservations.book`/`parking.reserve`/`ride.order`/`pay.authorize`/`notify.push`
- SIP通話ゲートウェイ：Twilio/Telnyx Realtime（SIP/WebRTC） + STUN/TURN
- OS深統合：iOS Shortcuts / App Intents、Android Intents、Windows（Graph/Notifications）
- 通知アクション：Push通知のボタンで Confirm/Cancel（バックグラウンド実行）
- 連絡先リゾルバ：ローカル連絡先 + Graph API を名前/関係性で解決
- **Personal Data Vault（PDV）**：端末優先で好み・直近要約・関係グラフを保持
- **Policy Engine**：最小共有/JIT権限/用途別トークン
- Taste Embedding エンジン（端末先行）
- Partner Consent サービス（期限付きトークン/スコープ）
- Packs：Money/Civic/Family/Care コネクタ（無い先は `call.place` フォールバック）

## データ流れ
入力(7秒音声/テキスト)
 → `POST /api/propose`（LLMで2案生成）
 → UI表示（ProposalCard×2）
 → ユーザーが1案を選択 → **/api/plan**（Intent化→PlanA/B を生成）
 → **ConfirmOS**（要約＋トグル＋取消猶予＋二重承認）
 → **/api/confirm**（Plan並列実行：Calendar/Messenger/...）＋ **.icsフォールバック**
 → 結果通知 / Minutes‑Back 加算 / 監査ログ

## データ流れ（外部開発者）
外部App
 → `POST /v1/plan`（API Key）
 → plans[2] を受領 → ユーザーに要約表示（あなたのUI）
 → `POST /v1/approve`（ConfirmOS）→ `approve_id`
 → `POST /v1/confirm`（plan_id, approve_id）
 → Webhook `action.executed` / `minutes_back.added`

## データ流れ（通話）
Intent（7秒の音声/テキスト）
 → PlanA/B 提示（どちらかが「通話」を含む）
 → ConfirmOS（通話スクリプト15秒プレビュー／録音既定OFF）
 → MCP `call.place`（SIP/WebRTC）
 → transcript → 要約 → 結果（成功/不在/留守電/要折返し）
 → 成功：`calendar.create` / `message.send` / `reminder.create` を自動実行
 → 失敗：再提案（日時候補のSMS送付 など）

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
- **pdv(user_id, kv_json, updated_at)**                                 # 端末優先で同期
- proposals(id, user_id, payload_json, created_at)                       # 2案の内容・所要時間
- decisions(id, user_id, proposal_id, ics_blob, minutes_back, decided_at)
- events(id, user_id, source, minutes_back, meta_json, created_at)
- **savings(id, user_id, amount_yen, category, source, created_at)**     # Money‑Back
- **consents(id, user_id, scope_json, expires_at, created_at)**          # Partner/用途別同意
- **docs(id, user_id, type, storage_uri, hash, created_at)**             # 生成書類
- **approvals(id, user_id, approve_id, plan_id, scope_json, created_at)**# ConfirmOS
- **audit_logs(id, user_id, approve_id, action, payload_json, at)**      # 監査
- deletion_requests(id, user_id, status, requested_at)
- **vibe_profiles(user_id, tone, decisiveness, frugality, notification_style, language, updated_at)**
- **reason_feedbacks(id, user_id, plan_id, reason_key, vote_bool, tag, created_at)**
- **personalization_stats(user_id, date, top1_rate, edit_distance_pct, ttc_p50_ms, created_at)**

## インデックス
- decisions(user_id, decided_at)
- events(user_id, created_at)
- approvals(approve_id)
- audit_logs(user_id, at)

## Minutes‑Back / Money‑Back 推定（初期）
- MB：**提案所要時間短縮分** or **自己申告**の小さい方
- ¥B：カテゴリ別の成功報酬/交渉結果を累積
- 将来：移動/画面/完了ログと突合し実測化

## 追加テーブル（MVP+）
- intents(id, user_id, text, json, created_at)
- plans(id, user_id, intent_id, actions_json, created_at)
- executions(id, plan_id, status, results_json, created_at)
- connectors(id, user_id, provider, enabled, scopes_json, created_at)

## インデックス（追加）
- plans(user_id, created_at)
- executions(plan_id, created_at)
- reason_feedbacks(user_id, created_at)
- personalization_stats(user_id, date)
# ──────────────────────
# END: docs/DATA_MODEL.md
# ──────────────────────


# ─────────────────────────
# BEGIN: docs/API_CONTRACTS.md
# ─────────────────────────
# API コントラクト（MVP→MVP+）

## POST /api/propose
Req:
{ "text":"明日朝30分ランニング", "context":{"tz":"Asia/Tokyo","ng":["22:00-06:30"],"mobility":"walk"} }
Res:
{ "proposals":[
  {"id":"p1","title":"朝ラン20分","slot":"07:10","duration_min":20},
  {"id":"p2","title":"夜ストレッチ15分","slot":"21:30","duration_min":15}
], "latency_ms": 850 }

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

## POST /api/approve（ConfirmOS）
Req: { "plan_id":"pl1" }
Res: { "approve_id":"aprv_abc123", "expires_in_sec":600 }

## POST /api/confirm
Req: { "plan_id":"pl1", "approve_id":"aprv_abc123", "idempotency_key":"k_123" }
Res: { "results":[
  {"action":"calendar.create","status":"ok","id":"evt_123"},
  {"action":"message.send","status":"ok","id":"msg_456"},
  {"action":"reminder.create","status":"ok","id":"rmd_789"}
], "minutes_back":18 }

## GET /api/vibe
Res:
{ "tone":"friendly|formal|roast|coach", "decisiveness":"quick|deliberate", "frugality":"high|mid|low", "notification_style":"push|silent", "language":"ja-JP" }

## POST /api/vibe
Req:
{ "patch": { "tone":"coach", "decisiveness":"quick" } }
Res:
{ "ok": true }

## POST /api/whythis
Req:
{ "plan_id":"pl1" }
Res:
{ "reasons":["朝型×過去採択","徒歩<=15分","天気=晴"] }

## 補助API
- `POST /api/estimate` → { mb_min, mb_max, yb_estimate }
- `POST /api/consent`  → Partner/用途別同意の発行/更新
- `POST /api/document` → 申請書/証憑生成（Civic）

### .ics 配信仕様（Node.js runtime）
- Content-Type: text/calendar; charset=utf-8
- Content-Disposition: attachment; filename="yohaku-evt_*.ics"
# ─────────────────────────
# END: docs/API_CONTRACTS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PRD_CALL_OS.md
# ─────────────────────────
# PRD – MVP++「通話（SIP）& 端末深統合」

## 目的
- 7秒→2案→Confirm once を**電話での予約/キャンセル/連絡**にも拡張し、**画面オフ完了率**と **Minutes‑Back** を押し上げる。

## ユースケース（最小3本）
1) 病院予約：通話で希望日時を確定→カレンダー作成→家族へSMS共有  
2) 飲食キャンセル/リスケ：通話→確定→相手へメッセ→代替案を自動提案  
3) 配送再配達：自動音声メニューにDTMF送信→確定→予定ブロック

## 受け入れ基準
- Confirm Sheetに**通話スクリプト（要約）**と**録音ON/OFF**を表示（既定OFF）
- `call.place` 実行で **通話ステータス**（ringing/answered/voicemail/busy/failed）をUIに逐次表示
- 結果サマリ（誰と何を合意したか/次アクション）を自動生成→1タップで確定
- **誤実行率 < 0.5%**（取り消し/再提案で吸収）
- 成功時は **`calendar.create` / `message.send` / `reminder.create`** を自動実行
- 失敗時はテンプレ再提案（SMSで日時候補共有 など）

## KPI
- 通話成功率 ≥ 90%（人が出た通話のうち合意が取れた割合）
- Screen‑off完了率 ≥ 70%
- p50（提案表示まで） ≤ 1.5s（通話はバックグラウンドで継続）
- Minutes‑Back（通話ユースケース）中央値 ≥ 6分/実行

## 非機能/安全
- 録音は既定OFF／ON時は**両者への告知**を読み上げ
- トランスクリプトは**24h保持**→要約のみ長期保持（PIIは自動マスキング）
- 緊急通話/医療判断は**対象外**（ガードレール表示）
# ─────────────────────────
# END: docs/PRD_CALL_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/OS_INTEGRATIONS.md
# ─────────────────────────
# OS Deep Integrations（iOS/Android/Windows）

## iOS
- **Shortcuts / App Intents**：`Confirm once` / `Add to Calendar` / `Send Message` を公開。音声SiriPhraseで起動。
- **通知アクション**：Pushのボタンで Confirm/Cancel。バックグラウンドで Plan 実行。

## Android
- **Intents**：`ACTION_SEND`（メッセ）/ カレンダー挿入 / 通知アクション。
- **デフォルト音声**との共存：音声入力→Yohakuの `One‑shot` にディープリンク。

## Windows（デスクトップ）
- **Notifications + Hotkey**：ホットキー→7秒入力→2案→Confirm once。
- **Graph**（企業向け）：カレンダー/連絡先/Teamsメッセ。

## 設計方針
- 端末側で**ASR/意図分類**までを先行実行（レイテンシ短縮）
- 実行は Plan→Confirm→**MCP/ネイティブ** の優先順。常に **.ics** をフォールバックに保持
# ─────────────────────────
# END: docs/OS_INTEGRATIONS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/CALL_TEMPLATES.md
# ─────────────────────────
# Call Templates（サンプル）

## 病院予約（一次診療）
Plan.summary: 「◯◯クリニックに明日10:30で予約／家族へ共有／9:45リマインド」
Plan.actions:
- { action: "call.place", to: "+1XXX", script: "Hello, I'd like to make an appointment for ...", locale: "ja-JP", record: false }
- { action: "calendar.create", title: "Clinic visit", start: "2025-10-01T10:30:00+09:00", duration_min: 30 }
- { action: "message.send", to: "妻", text: "10:30に予約取れたよ" }
- { action: "reminder.create", time: "2025-10-01T09:45:00+09:00", note: "出発準備" }

## 飲食キャンセル/リスケ
- { action: "call.place", to: "+1YYY", script: "I'd like to cancel my 7pm reservation and reschedule to tomorrow 7pm if possible." }
- 以後は同様

## デート即時（静か/駐車あり/15分圏内）
Plan.summary: 「静かな店で19:00／駐車場確保／相手に地図共有／18:30出発リマインド」
Plan.actions:
- { action: "places.search", query: "静か イタリアン 駐車場 4.2+", radius_min: 15 }
- { action: "reservations.book", place_id: "<from search>", time: "2025-10-01T19:00:00+09:00", party_size: 2 }
- { action: "parking.reserve", near: "<place address>", duration_min: 120 }
- { action: "calendar.create", title: "Dinner", start: "2025-10-01T19:00:00+09:00", duration_min: 90 }
- { action: "message.send", to: "彼女", text: "ここ行こ！地図→ <url>" }
- { action: "reminder.create", time: "2025-10-01T18:30:00+09:00", note: "出発" }
- フォールバック：`call.place` で電話予約→結果に応じて再提案
# ─────────────────────────
# END: docs/CALL_TEMPLATES.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/DISTRIBUTION_PLAYBOOK.md
# ─────────────────────────
# Distribution Playbook（配布の型）

1) **.ics 招待のフッター**：`Scheduled with Yohaku` を自動付与→受信者がワンクリック体験
2) **Minutes‑Back / Money‑Back 週次カード共有**：SNSと職場にシェア→招待リンクで導入
3) **テンプレ/コネクタ市場（MCP）**：外部が `call.place` などを拡張→課金分配（審査制/署名必須）
4) **OSディープリンク**：ショートカット/インテントから起動→日常の入口を占有
5) **Trustパネルの共有**：今週の誤実行/取消成功/承認時間のカードをSNSで共有→信頼×導線
# ─────────────────────────
# END: docs/DISTRIBUTION_PLAYBOOK.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PACKS_OVERVIEW.md
# ─────────────────────────
# Packs – 縦機能の拡張指針

## Money Pack
- 交渉/解約/乗換：`provider.call` / `plan.switch` / `offer.compare`
- 成果：**¥B（Money‑Back）**を算出しダッシュボード表示
- 安全：通話は録音既定OFF、本人確認はJIT同意

## Civic Pack
- 書類生成：`doc.generate`（PDF/WEB） / 予約：`slot.reserve`
- 公式API優先（マイナポータル/e‑Gov 等）、非対応は郵送/来庁誘導

## Family Pack
- 学校/送迎/連絡：`school.message.send` / `pickup.schedule` / `task.assign`

## Care Pack
- 通院/服薬/家族連絡：`care.schedule` / `med.reminder.create` / `family.broadcast`

### 共通
- ConfirmOSを適用（要約/取消/監査/二重承認）
- KPI：完了率 / MB / ¥B / 誤実行 / Screen‑off
# ─────────────────────────
# END: docs/PACKS_OVERVIEW.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/FUTURE_VISION.md
# ─────────────────────────
# FUTURE VISION – Super‑App by Voice（3年像）

## ゴール
- Yohakuを開いて話すだけで、**地図/予約/駐車/移動/連絡/決済**が**Plan→Confirm once**で連鎖実行される。APIが無い先は**通話で確定**。

## フェーズ
- **Now–6m**：Calendar/Message/Reminders/通話テンプレ。近場提案（位置/営業時間/混雑）と駐車の最小連携。
- **6–12m**：Taste Embedding v1、Partnerモードβ、`places.search / reservations.book / parking.reserve / ride.order` のMCP化。通知1タップ承認を普及。
- **12–36m**：`pay.authorize` と実店舗/事業者連携、開発者向けテンプレ市場の拡大、協調エージェント（複数LLM）運用。

## コアシステム
- **Intent Bus + MCP**：`calendar.create / message.send / reminder.create / call.place / places.search / reservations.book / parking.reserve / ride.order / pay.authorize / notify.push`
- **Taste Embedding**：食/雰囲気/価格/距離/混雑耐性/席タイプ…をベクトル表現。信号=承認/却下/再訪/滞在時間。
- **Partnerモード**：同意ベースで最小共有（NG食材/価格帯/雰囲気/移動手段/当日位置）。トークンは期限付き。

## KPI
- MB中央値≥15分/日、Screen‑off≥70%、Confirm中央値≥2.2、**p50≤1.5s**、通話成功≥90%/誤実行<0.5%、Taste命中率≥40%。

## ガードレール
- 感情推定は既定OFF。金額操作は**別承認**。全操作に**要約/取消/監査ログ**を付与。
# ─────────────────────────
# END: docs/FUTURE_VISION.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/TASTE_MODEL.md
# ─────────────────────────
# TASTE MODEL – 好みの学習

## 特徴量
- 系統（和/洋/伊/…）/ 価格帯 / 雰囲気（静/賑）/ 照度 / 席タイプ / 駐車 / 距離 / 混雑耐性 / 訪問時間帯 など。

## 学習信号
- **肯定/否定/再訪/滞在時間/即時反応**（通知アクションへの反応時間）を弱教師として使用。

## 推論
- 端末先行（オンデバイス）で一次推論→サーバで再ランキング。プライバシーは要約＋統計のみ。

## UI
- 却下時に**理由タグ**（うるさい/遠い/高い/暗い/駐車×）を1タップ収集。
# ─────────────────────────
# END: docs/TASTE_MODEL.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PERSONALIZATION.md
# ─────────────────────────
# PERSONALIZATION – Vibe & Why‑this & Pulse

## 1) Vibe Profile（話し方/関わり方の個性）
schema:
- tone: "friendly|formal|roast|coach"
- decisiveness: "quick|deliberate"
- frugality: "high|mid|low"
- notification_style: "push|silent"
- language: "ja-JP|en-US|..."
source: 初回60秒オンボ + インライン微調整
rendering: 提案/確認/失敗文は必ず Vibe でレンダリング

## 2) Why‑this‑for‑you（個人向け理由）
Confirm Sheet に必須:
- reasons[] 最大3（例：「朝型」「過去3回の採択」「徒歩15分圏」）
- 1タップ評価（👍/👎 + タグ：高い/遠い/混雑/暗い/駐車×…）→ Taste を即更新

## 3) Pulse（受動2案、No‑Feed）
schedule: 朝/就寝前のみ
payload: top2_plans + minutes_back_estimate
UX: 通知→1タップConfirm（Screen‑off）
guardrails: 過剰通知抑制、静音時間厳守

## 4) KPI（個人化の質）
- Top‑1採択率 / 編集距離 / Time‑to‑Confirm / MB‑lift（個人化で増えた分）

## 5) セーフティ
- 仕事/公的先へのメッセは礼節モードへ自動切替
- 学習は端末先行（PDV）→サーバ再ランク。長期保存は要約＋統計のみ

# ─────────────────────────
# END: docs/PERSONALIZATION.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PARTNER_MODE.md
# ─────────────────────────
# PARTNER MODE – 同意と共有

## 方針
- **同意が核**。共有は**最小**・**期限付き**・**撤回自由**。

## 共有対象（例）
- NG食材 / 価格帯 / 雰囲気タグ / 移動手段 / 当日限りの位置

## 実装
- 招待→同意→スコープ選択→期限付きトークン発行→Planで利用→期限到来で自動失効。

## 監査
- 誰が何を共有/利用したかを90日保持。個別に削除/エクスポート可。
# ─────────────────────────
# END: docs/PARTNER_MODE.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/ROADMAP_36M.md
# ─────────────────────────
# 36か月ロードマップ（概観）

## 0–6m（土台）
- **ConfirmOS**（取消/監査/二重承認/取り消し猶予）を完成
- 通話テンプレ本番（病院/飲食/配送）と**誤実行<0.5%**
- OS深統合の普及（通知1タップ承認）

## 6–12m（面の拡張）
- Taste v1 / Partner β / MCP: places/reservations/parking/ride
- **Money Pack（JP）**：携帯/電力/光の交渉・乗換を開始（¥B実測）
- **Civic Top10**：転入出/免許/ビザ予約などの書類生成＋枠取り
- SMBパッケージ（共有テンプレ/監査/SSO/Allowlist）で有料50チーム

## 12–24m（深掘り）
- `pay.authorize` の導入（別承認UI）、事業者連携を拡大
- MCPテンプレ市場の月間供給100本規模
- **Family v1**（学校/送迎/連絡）と **Care v1**（非医療外周）

## 24–36m（規模化）
- 協調エージェント運用（複数LLM/小型モデル）
- 地域/業界特化テンプレの外部供給でローカル適応
# ─────────────────────────
# END: docs/ROADMAP_36M.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/MCP_OVERVIEW.md
# ─────────────────────────
# MCP Overview（Yohaku）

## 目的
- YohakuのPlan/Actionを **MCPツール** として公開し、**複数LLM/音声クライアント**から安全に実行可能にする。

## ツール一覧（v1）
- `calendar.create` — 予定を作成
- `message.send` — メッセージ送信
- `reminder.create` — リマインド登録
- `call.place` — 通話（SIP/WebRTC/DTMF/録音トグル）
- `places.search` — 場所検索（評価/距離/混雑）
- `reservations.book` — 予約
- `parking.reserve` — 駐車予約
- `ride.order` — 配車
- `pay.authorize` — 支払い承認（二重承認必須）
- `notify.push` — 通知アクション

## Plan→MCP ツールのマッピング
- `calendar.create` ⇔ Plan.actions[].action = "calendar.create"
- `message.send`   ⇔ "message.send"
- `reminder.create`⇔ "reminder.create"
- その他同名で一対一対応

## 接続方法（例）
- **OpenAI Realtime** / **Anthropic Claude** に **MCPサーバURL** を渡すと、上記ツールがそのまま見える。
- 認証は `Authorization: Bearer <API_KEY>`。

```json
{
  "mcpServers": [
    { "name": "yohaku-mcp", "url": "wss://mcp.yohaku.app" },
    { "name": "yohaku-mcp-local", "url": "ws://127.0.0.1:7777" }
  ]
}