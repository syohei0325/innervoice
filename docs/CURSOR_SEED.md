# =========================================
# Cursor Pack – Yohaku (7秒→2提案→1確定 / Confirm once / .ics / Doraemonモード)
# =========================================
# 目的：Cursorが迷わずMVP→MVP+→先読みProactiveまで実装できるよう、文脈・ルール・受入基準・観測/KPI・安全規範を一式で提供

# ───────────────
# BEGIN: README.md
# ───────────────
# Yohaku – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

## 核心体験（MVP）
- 入力：**7秒**（音声 or 無音テキスト）
- 出力：**2つの提案**（所要時間ラベル付き）
- 確定：**1タップで .ics を発行**（片方向フォールバックを常時有効）
- 画面：**1枚だけ**（Input / Proposals / Confirm / **Value Receipt**）

## 次の価値（MVP+）: Intent バス & Confirm once Multi‑Action
- 入力：**7秒**（声/無音テキスト）→ **Intent化**（やりたいことをJSON化）
- 提案：**2つの実行プラン**（例：A=カレンダー+メッセ+リマインド / B=代替案）
- 確定：**Confirm once（1回のOK）**で**複数アクションを並列実行**（Calendar / Messenger / Reminders 等）
- フォールバック：**.ics一発発行**（MVPを常時バックアップ経路として維持）
- 可視化：**Verified Minutes‑Back（vMB）**と**Friction Events Avoided（FEA）**を加算（保守的表示）

## Doraemonモード（Proactive / 先読み相棒）
- **覚える**：発話・操作・決定を**Memory OS**に“要約”保存（端末優先PDV、TTL/信頼度つき）。
- **見張る**：**Proactive OS**が“時間の隙間 / 関係の空白 / 期限 / 地理”の信号を**静かにスキャン**（No Feed）。
- **気を利かせる**：**Nudge**を**A/Bの2択**で提案（**朝/移動前/就寝前**の小窓のみ、クールダウン厳守）。
- **気を遣う**：**Relationship Graph**で「最近会っていない」「連絡間隔」を検出 → **メッセ1通＋候補スロット**の最小提案。
- 実行は**Confirm once**（1回のOK）で一括実行、**Undo 10秒**と**監査ログ**は必須。
- **.icsフォールバック**は常時有効（権限未連携/遅延時でも即価値）。

### DoraemonモードのKPI（北極星に追加）
- **Nudge採択率（週） ≥ 25%**
- **Nudge誤提案率 ≤ 10%**
- **Screen‑off完了率 ≥ 70%**（Carモード含む）
- **vMB / FEAのリフト**（先読み適用時の増分）を計測

### デザイン原則（共通）
- No Feed / No Scroll / One‑shot UX（7秒→2→1） / Silent First（音声×テキスト両立）
- **Value Receipt**：軽量トースト（2–3秒）＋任意の週次カード＋奥のトラストパネル（既定OFF）
- **プロバイダ分離**：Google系→Googleマップ、Apple系→Appleマップ（TOS遵守）
- **Personalization‑first**：Vibe / Taste / Why‑this‑for‑you
- **ConfirmOS**：要約表示・二重承認（支払い/通話）・取消猶予10秒・監査ログ・ロールバック

## 北極星（PMF検証KPI）
- Median **vMB ≥ 15分/日**（D30継続ユーザー｜保守的推定）
- **Screen‑off完了率 ≥ 70%（Carモード含む）**
- **FEA ≥ 10/週（p50）**
- **Nudge採択率 ≥ 25% / 誤提案 ≤ 10% / 誤実行率 < 0.5%**
- D1≥60% / D7≥35% / D30≥25% / 日あたり確定≥3 / NPS≥50

## For Developers（Public API / MCP / OS）
- 公開API/SDK/Webhook（/v1/plan → /v1/approve → /v1/confirm → vMB/FEA受領）
- **MCPツール**：`calendar.create` / `message.send` / `reminder.create` / `call.place` / `places.search` / `reservations.book` / `parking.reserve` / `ride.order` / `pay.authorize` / `notify.push`
- OS深統合：iOS Shortcuts / App Intents、Android Intents、Windows Graph/Notifications（通知1タップ承認）
- Voice Calls (SIP) β：電話で予約/キャンセル/再配達、transcript→要約→Plan連鎖

## For ChatGPT Apps（Yohaku Lite）
- ChatGPT内で動く**超軽量版**（7→2→1、Cal+Email、Why‑this、ConfirmOS、.icsフォールバック）

# ───────────────
# END: README.md
# ───────────────


# ────────────────────
# BEGIN: docs/VISION.md
# ────────────────────
# VISION – なぜ作るのか
**人の注意と時間を取り戻す。**  
スクロールではなく「**決めて、置いて、戻る**」を7秒で完了させる。

## プロダクト憲法
1. 無限フィードは作らない
2. 1画面で完結（7秒→2→1）
3. **Value Receiptを最小で見せる**（軽量トースト／任意の週次カード／奥のトラストパネル）
4. 音声不能時は即テキスト
5. データ最小化・透明性（要約＋操作メタのみ長期保存）
6. 予約/購入/通話は勝手に行わない（**Confirm once**で必ず承認）
7. 失敗を恐れず速く学ぶ（データで意思決定）
8. アプリ横断は **Intent バス**（スパゲッティ連携を回避）
9. 承認は **ConfirmOS** で規格化（取消/ロールバック/監査/二重承認）
10. 車内は**読み上げ中心**・操作最小（Carガイドライン準拠）
11. **Ask→Anticipate**：人が言う前に“そっと提案”。**ナッジは最小で、騒がない。**

## 将来像
- **声で完了する横断OS**：地図/予約/駐車/移動/連絡/決済を Plan→Confirm once で連鎖実行（APIが無い先は通話）。
- **好みと記憶の学習**：Taste + Memory + Relationship Graph で当たり率を上げる。
- **Partnerモード**：同意のもと必要最小の共有。

## KPI（保守的表示）
- Top‑1採択率≥55% / 編集距離中央値≤20% / Time‑to‑Confirm p50≤3秒 / Screen‑off≥70% / vMB & FEA並行計測

# ────────────────────
# END: docs/VISION.md
# ────────────────────


# ─────────────────────
# BEGIN: docs/PRD_MVP.md
# ─────────────────────
# PRD – MVP「7秒→2提案→1確定（.ics）」

### ユースケース（3本柱）
1) 朝の段取り：空き45分→A/B/C  
2) 移動前：今出る/配車/延期  
3) 就寝前：明日の自分へ1タスク

### 受け入れ基準
- 7秒入力→**2提案**→**.ics生成DL**まで **p50≤1.5s**
- 提案に **duration_min** と開始候補（slot）
- エラー時は**静音テキストへ自動フォールバック**
- Value Receipt：軽量トースト（FEA件数主）＋時間は小さく保守的
- vMB/FEAを記録（UI常時表示はしない）
- PIIは保存しない（要約+操作メタのみ）

# ─────────────────────
# END: docs/PRD_MVP.md
# ─────────────────────


# ─────────────────────
# BEGIN: docs/PRD_MVP_PLUS.md
# ─────────────────────
# PRD – MVP+「Intentバス & Confirm once Multi‑Action」

### 受け入れ基準
- 7秒入力→**PlanA/PlanB**を提示（各1–3アクション）
- **Confirm once**で**2アクション以上を並列実行**（初期：Calendar.Create / Messenger.Send）
- **部分成功**でも全体完了扱い（失敗分はリトライ/再提案）
- **.icsフォールバック**常時有効
- 提案表示 **p50 ≤ 1.5s**、実行はBGで継続し結果通知
- **Why‑this‑for‑you**（最大3理由）と**理由フィードバック**（👍/👎+タグ）

# ─────────────────────
# END: docs/PRD_MVP_PLUS.md
# ─────────────────────


# ─────────────────────────
# BEGIN: docs/CONFIRM_OS.md
# ─────────────────────────
# ConfirmOS – 承認/取消/監査/二重承認の標準

### 要件
- **Confirm Sheet**（誰に/何を/いつ/影響＋トグル）
- **Undo 10秒** / **ロールバック** / **監査ログ**
- **金額/通話は二重承認** / `/confirm` は **idempotency-key 必須**

### KPI
- 誤実行率 < 0.5% / 取消成功率 / ロールバック成功率 / 平均承認時間

# ─────────────────────────
# END: docs/CONFIRM_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/ARCHITECTURE.md
# ─────────────────────────
# アーキテクチャ（MVP→MVP+）

- Web: Next.js(App Router) / **API runtime='nodejs'** を明記
- 音声→テキスト: Whisper（将来ローカル）
- **Intentバス**：Intent(JSON)→Plan→Connector/MCP（並列）
- **.ics生成**：サーバ（Node.js runtime）
- DB: Postgres(+Prisma) / E2E: Playwright / 計測: PostHog or GA4
- Public API GW（API Key / Rate / Version / **Idempotency**）
- Webhooks Dispatcher（署名 / リトライ / アウトボックス）
- MCPクライアント：OpenAI Realtime / Anthropic Claude
- MCPサーバ：`calendar.create` `message.send` `reminder.create` `call.place` `places.search` `reservations.book` `parking.reserve` `ride.order` `pay.authorize` `notify.push`
- SIP: Twilio/Telnyx Realtime（SIP/WebRTC）
- OS深統合：iOS Shortcuts/App Intents、Android Intents、Windows Graph/Notifications
- 通知アクション：Pushボタンで Confirm/Cancel（BG実行）
- 連絡先リゾルバ：ローカル連絡先 + Graph API
- **PDV**（端末優先）/ **Policy Engine**（最小共有/JIT権限/用途別トークン）

### レイテンシSLO（提案表示）
ASR ≤ 250ms / 意図→2案 ≤ 700ms / UI描画 ≤ 300ms → **合計 p50 ≤ 1.5s**

### データ流れ（要点）
7秒入力 → `/api/propose` → 2案 → `/api/plan` → **ConfirmOS** → `/api/confirm`（並列実行 + **.icsフォールバック**）→ 結果通知 / vMB/FEA / 監査ログ

# ─────────────────────────
# END: docs/ARCHITECTURE.md
# ─────────────────────────


# ──────────────────────
# BEGIN: docs/DATA_MODEL.md
# ──────────────────────
# データモデル（既存＋Doraemon拡張）

## 既存（抜粋）
users / profiles / **pdv** / proposals / decisions / events / approvals / audit_logs / deletion_requests / vibe_profiles / reason_feedbacks / personalization_stats / **friction_events**

## Doraemon拡張（新規）
- **memories**(id, user_id, kind, key, value_json, source, confidence, expires_at, created_at, updated_at)
- **observations**(id, user_id, signal, payload_json, observed_at)  
  signal: `free_slot|deadline_near|relationship_gap|location|open_loop|habit_window`
- **nudges**(id, user_id, summary, plan_json, reason_keys[], status, created_at, resolved_at)  
  status: `shown|accepted|dismissed|snoozed|expired`
- **contact_graph**(user_id, contact_id, tie_strength, last_met_at, last_msg_at, cadence_days, channels_json, updated_at)
- **availability**(user_id, date, slots_json, source, updated_at)

## インデックス
memories(user_id,key) / nudges(user_id,created_at) / contact_graph(user_id,updated_at) / decisions(user_id,decided_at) / approvals(approve_id) / audit_logs(user_id,at)

## Verified Minutes‑Back / FEA（保守推定）
`vMB_action = max(0, Baseline_p10(action, user) − (Confirm_ms + 実行レイテンシ + オーバーヘッド)) × EvidenceFactor`  
EvidenceFactor：1.0=実測, 0.6=類推, 0.3=初期テーブル  
FEA: `copy_paste_avoided` / `app_switch_avoided` / `typing_avoided_chars` / `search_avoided` / `form_fill_avoided` / `call_tree_avoided`  
**UIは件数が主役**、時間は小さく保守的に添える

# ──────────────────────
# END: docs/DATA_MODEL.md
# ──────────────────────


# ─────────────────────────
# BEGIN: docs/API_CONTRACTS.md
# ─────────────────────────
# API コントラクト（MVP→MVP+→Doraemon）

## 既存
`POST /api/propose` / `POST /api/plan` / `POST /api/approve` / `POST /api/confirm`  
`.ics`：`text/calendar` + `Content-Disposition: attachment; filename="yohaku-evt_*.ics"`

## 新規：Memory
- `POST /api/memory.put`  — `{ "kind":"preference","key":"coffee.sugar","value":0,"ttl_days":365 }` → `{ "ok":true,"confidence":1.0 }`
- `POST /api/memory.forget`— `{ "key":"coffee.sugar" }` → `{ "ok":true }`
- `POST /api/memory.query` — `{ "keys":["coffee.*","alias.*"] }` → `{ "items":[...] }`

## 新規：Proactive/Nudge
- `GET /api/nudges`           → `{ items:[ { id, summary, plan, reasons[], created_at } ] }`
- `POST /api/nudge.feedback`  → `{ id, action:"accept|dismiss|snooze", reason_key? }`
- `GET /api/availability`     → `{ date, slots:["2025-10-20T19:00/30m", ...] }`
- `GET /api/relationship.gaps`→ `{ contacts:[ {name, days_since_last_meet, cadence_days} ] }`

## 状態・監査
- `/api/approve` → `{ approve_id }`（ConfirmOS）。`/api/confirm` は **idempotency-key** 必須。
- 監査：approve_id / 実行ID / 操作者 / 要約 / タイムスタンプ

# ─────────────────────────
# END: docs/API_CONTRACTS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/MEMORY_OS.md
# ─────────────────────────
# MEMORY OS – 覚える/忘れる/言い換える

### コンセプト
Memory = (key, value, kind, confidence, TTL)  
kind: `preference|fact|alias|goal|routine|relationship_note|autopilot_rule`  
source: `utterance|action|calendar|message_meta|import|manual`

### ルール
- **最小保存**：本文は保存しない（要約+メタのみ）
- **可撤回**：いつでもforget / TTL満了で自動削除
- **証拠係数**：出所×回数でconfidenceを更新

### KPI
命中率 / 誤記憶率 / 手動修正率

# ─────────────────────────
# END: docs/MEMORY_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PROACTIVE_OS.md
# ─────────────────────────
# PROACTIVE OS – 見張る/気を利かせる/騒がない

### 信号（observations）
`free_slot | relationship_gap | deadline_near | habit_window | location`

### Nudge設計
- A/Bの2択、2行以内、Why‑this‑for‑you（最大2）
- 朝/移動前/就寝前のみ（Pulse）。クールダウン厳守
- 行為：`calendar.create | message.send | reminder.create | places.search | reservations.book`

### 受け入れ
Nudge表示 p50≤300ms / Confirm once / Undo10秒 / 監査 / 部分成功OK / .icsフォールバック

### KPI
採択≥25% / 誤提案≤10% / 苦情≤0.5% / Screen‑off / TTC / Top‑1 / vMB/FEAリフト

# ─────────────────────────
# END: docs/PROACTIVE_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/RELATIONSHIP_GRAPH.md
# ─────────────────────────
# RELATIONSHIP GRAPH – 人との距離を見える化して、そっと寄せる

### 入力
- カレンダー参加者、メール/メッセ**メタ**（相手/件数/最終時刻）※本文は既定で不使用
- Memoryの`relationship_note`

### 指標
tie_strength / days_since_last_meet / last_msg / cadence_days

### 提案例
「**Aさん、前回から28日**。金曜の**19:00/19:30/20:00**、どれ置きますか？」  
A: `calendar.create` + `message.send(A)`（候補提示）  
B: 次週に回す + 軽い一言

### セーフティ
メタのみ（本文解析は明示同意）/ Partnerモードで最小共有・期限付き

# ─────────────────────────
# END: docs/RELATIONSHIP_GRAPH.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/OS_INTEGRATIONS.md
# ─────────────────────────
# OS Deep Integrations（iOS/Android/Windows）

### Background Scouts
OS許容範囲でカレンダー変化・位置・接続イベントを購読→**observations**に記録（端末先行、PDV優先）

### 通知アクション/Car
Nudgeは**2件まで**・**Undo 10秒**・**礼節モード**・**クールダウン**  
**Carモード**：候補2件を読み上げ→「AでOK？」で実行（視線ゼロ）

### 設計
一次推論は端末、サーバで再ランク  
実行は Plan→Confirm→MCP/ネイティブ、**.icsフォールバック**常備  
**プロバイダ分離**：Google系→Googleマップ／Apple系→Appleマップ

# ─────────────────────────
# END: docs/OS_INTEGRATIONS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PRD_CALL_OS.md
# ─────────────────────────
# PRD – MVP++「通話（SIP）& 端末深統合」

- Confirm Sheetに通話スクリプト要約・録音ON/OFF（既定OFF）
- `call.place` ステータス（ringing/answered/voicemail/busy/failed）
- 結果要約→1タップ確定→`calendar.create` / `message.send` / `reminder.create`
- 録音ON時は両者アナウンス / transcriptは24h保持→要約のみ長期
- 緊急通話/医療判断は対象外

KPI: 通話成功≥90% / Screen‑off≥70% / 提案表示p50≤1.5s / vMB中央値≥6分/実行

# ─────────────────────────
# END: docs/PRD_CALL_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/DISTRIBUTION_PLAYBOOK.md
# ─────────────────────────
# 配布の型
1) **.icsフッター**：`Scheduled with Yohaku` → 受信側が即体験  
2) **週次カード共有**：FEA件数＋保守的vMBをSNS/職場共有  
3) **テンプレ/コネクタ市場（MCP）**：署名/審査/スコープ  
4) **OSディープリンク**：ショートカット/インテント起動  
5) **Trustパネル共有**：誤実行/取消成功/承認時間/証拠係数  
6) **ChatGPT Appsディレクトリ**：Lite→本体Proへ導線  
7) **リージョンゲート**：EUは後追い・データ最小化厳守

# ─────────────────────────
# END: docs/DISTRIBUTION_PLAYBOOK.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PACKS_OVERVIEW.md
# ─────────────────────────
# Packs – 縦機能

**Money**（交渉/解約/乗換：¥Bを可視化） / **Civic**（書類生成＋枠取り） / **Family** / **Care**  
共通：ConfirmOS／KPI＝完了率/vMB/¥B/誤実行/Screen‑off

# ─────────────────────────
# END: docs/PACKS_OVERVIEW.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/FUTURE_VISION.md
# ─────────────────────────
# 3年像 – Super‑App by Voice
Now–6m：Cal/Message/Reminders/通話テンプレ & Car KPI本番  
6–12m：Taste v1 / Partner β / MCP: places,reservations,parking,ride（署名/審査/スコープ）  
12–36m：`pay.authorize`・事業者連携・テンプレ市場拡大・協調エージェント

KPI：vMB≥15分/日 / Screen‑off≥70% / Confirm中央値≥2.2 / 提案表示p50≤1.5s / 通話成功≥90% / 誤実行<0.5% / Taste命中≥40%

# ─────────────────────────
# END: docs/FUTURE_VISION.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/TASTE_MODEL.md
# ─────────────────────────
特徴量：系統/価格/雰囲気/照度/席/駐車/距離/混雑/時間帯  
学習：承認/却下/再訪/滞在時間/即時反応（弱教師）  
推論：端末先行→サーバ再ランク（要約＋統計のみ）  
UI：却下時に理由タグ（高い/遠い/混雑/暗い/駐車×…）を1タップ収集

# ─────────────────────────
# END: docs/TASTE_MODEL.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PERSONALIZATION.md
# ─────────────────────────
Vibe Profile（tone/decisiveness/frugality/notification_style/language）  
Why‑this‑for‑you（最大3理由＋👍/👎+タグ）  
Pulse（受動2案、朝/寝る前のみ、No‑Feed、静音時間厳守）  
KPI：Top‑1/編集距離/TTC/**MB‑lift & FEA‑lift**

# ─────────────────────────
# END: docs/PERSONALIZATION.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PARTNER_MODE.md
# ─────────────────────────
同意が核。共有は最小・期限付き・撤回自由  
共有例：NG食材/価格帯/雰囲気/移動手段/当日位置（必要最小）  
監査：誰が何を共有/利用したかを90日保持（削除/エクスポート可）

# ─────────────────────────
# END: docs/PARTNER_MODE.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/ROADMAP_36M.md
# ─────────────────────────
## 0–6m
- **Memory OS v0**（preference/alias/goal）
- **Nudge v0**（free_slot/relationship_gap）
- Social Pack v0（contact_graphをメタで構築）
- Nudge KPI運用（採択/誤提案/苦情）

## 6–12m
- **Memory OS v1**（routine/relationship_note/TTL）
- Relationship Gaps→Meet提案（候補3スロット）
- LINE/WhatsApp/Emailコネクタ（TOS順守）

## 12–24m
- Autopilot budgets（週Nインパクト上限）
- パーソナライズNudge窓
- Why‑this品質の協調エージェント最適化

# ─────────────────────────
# END: docs/ROADMAP_36M.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/MCP_OVERVIEW.md
# ─────────────────────────
目的：YohakuのPlan/ActionをMCPツールとして公開し、複数LLM/音声クライアントから安全実行  
ツール：`calendar.create` `message.send` `reminder.create` `call.place` `places.search` `reservations.book` `parking.reserve` `ride.order` `pay.authorize` `notify.push`  
接続例：
```json
{
  "mcpServers": [
    { "name": "yohaku-mcp", "url": "wss://mcp.yohaku.app" },
    { "name": "yohaku-mcp-local", "url": "ws://127.0.0.1:7777" }
  ]
}
```

# ─────────────────────────
# END: docs/MCP_OVERVIEW.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/YOHAKU_LITE.md
# ─────────────────────────
Yohaku Lite（ChatGPT Apps）：7→2→1（Cal+Email）/ Why‑this / ConfirmOS / .ics フォールバック  
KPI（4週判定）：Top‑1≥55% / TTC p50≤3s / 初回CVR≥20% / Lite MRR≥¥ or 本体送客≥5%

# ─────────────────────────
# END: docs/YOHAKU_LITE.md
# ─────────────────────────