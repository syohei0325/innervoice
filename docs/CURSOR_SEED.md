# =========================================
# Cursor Pack – Yohaku (7秒→2提案→1確定 / Confirm once / .ics / Doraemonモード / Pluggable Memory)
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

### Pluggable Memory（外部記憶を差し替え可能）
- Coreは**自前（Memory OS）**、Doc/Graphは**プロバイダ切替**（Supermemory / Zep / Mem0 等）
- Providerは**環境変数で選択**＋**A/B**運用、失敗時は**Coreのみ**へ自動降格
- "Why‑this‑for‑you"に**出典（core|doc）/provider/信頼度**を必ず表示

### DoraemonモードのKPI（北極星に追加）
- **Nudge採択率（週） ≥ 25%**
- **Nudge誤提案率 ≤ 10%**
- **Screen‑off完了率 ≥ 70%**（Carモード含む）
- **vMB / FEAのリフト**（先読み適用時の増分）を計測

### デザイン原則（共通）
- No Feed / No Scroll / One‑shot UX（7秒→2→1） / Silent First（音声×テキスト両立）
- **Value Receipt**：軽量トースト（2–3秒）＋任意の週次カード＋奥のトラストパネル（既定OFF）
- **プロバイダ分離**：Google系→Googleマップ、Apple系→Appleマップ（TOS遵守）
- **Personalization‑first**：Vibe / Taste / Why‑this‑for‑you（**出典明示**）
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
12. **Pluggable Memory**：**出典明示**・**乗換自由**・**主権尊重**を守る。

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
- **Why‑this‑for‑you**（最大3理由・**出典明示**）と**理由フィードバック**（👍/👎+タグ）

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
- **Memory Provider Layer**：`providers/supermemory|zep|mem0` を **env** と **A/B** で切替

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

## 既存（拡張）
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
- **friction_events(id, user_id, type, qty, evidence, action, created_at)** # FEA集計用

## Doraemon拡張（新規）
- **memories**(id, user_id, kind, key, value_json, source, confidence, expires_at, created_at, updated_at)
- **observations**(id, user_id, signal, payload_json, observed_at)  
  signal: `free_slot|deadline_near|relationship_gap|location|open_loop|habit_window`
- **nudges**(id, user_id, summary, plan_json, reasons_json, status, created_at, resolved_at)  
  status: `shown|accepted|dismissed|snoozed|expired`
- **contact_graph**(user_id, contact_id, tie_strength, last_met_at, last_msg_at, cadence_days, channels_json, updated_at)
- **availability**(user_id, date, slots_json, source, updated_at)
- **provider_events**(user_id, provider, event, payload_json, at)        # Memory Provider状態

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

## 既存（Core）
### POST /api/propose
Req:
```json
{ "text":"明日朝30分ランニング", "context":{"tz":"Asia/Tokyo","ng":["22:00-06:30"],"mobility":"walk"} }
```
Res:
```json
{ "proposals":[
  {"id":"p1","title":"朝ラン20分","slot":"07:10","duration_min":20},
  {"id":"p2","title":"夜ストレッチ15分","slot":"21:30","duration_min":15}
], "latency_ms": 850 }
```

### POST /api/plan
Req:
```json
{ "proposal_id":"p1", "context":{"tz":"Asia/Tokyo"} }
```
Res:
```json
{ "plans":[
  {"id":"pl1","summary":"07:00-07:30 朝ラン + 妻にメッセ + 06:45リマインド","actions":[
     {"action":"calendar.create","title":"朝ラン","start":"2025-10-19T07:00:00+09:00","duration_min":30},
     {"action":"message.send","to":"妻","text":"7時に走ってくるね"},
     {"action":"reminder.create","time":"2025-10-19T06:45:00+09:00","note":"ストレッチ"}
  ],
  "reasons":[
     {"key":"morning_person","source":"core","confidence":0.84,"evidence":["memories.habit_window"]},
     {"key":"<=15min_walk","source":"doc","provider":"supermemory","confidence":0.72}
  ]},
  {"id":"pl2","summary":"雨なら夜ストレッチ15分 + 連絡","actions":[
     {"action":"calendar.create","title":"夜ストレッチ","start":"2025-10-19T21:30:00+09:00","duration_min":15},
     {"action":"message.send","to":"妻","text":"夜にするね"}
  ],
  "reasons":[{"key":"evening_window","source":"core","confidence":0.61}]}
], "latency_ms": 950 }
```

### POST /api/approve（ConfirmOS）
Req:
```json
{ "plan_id":"pl1" }
```
Res:
```json
{ "approve_id":"aprv_abc123", "expires_in_sec":600 }
```

### POST /api/confirm
Req:
```json
{ "plan_id":"pl1", "approve_id":"aprv_abc123", "idempotency_key":"k_123" }
```
Res:
```json
{ "results":[
  {"action":"calendar.create","status":"ok","id":"evt_123"},
  {"action":"message.send","status":"ok","id":"msg_456"},
  {"action":"reminder.create","status":"ok","id":"rmd_789"}
], "minutes_back":18, "minutes_back_confidence":1.0,
   "friction_saved":[{"type":"copy_paste_avoided","qty":1,"evidence":"measured"}] }
```

### GET /api/vibe  /  POST /api/vibe
- GET Res:
```json
{ "tone":"friendly","decisiveness":"quick","frugality":"mid","notification_style":"push","language":"ja-JP" }
```
- POST Req:
```json
{ "patch": { "tone":"coach", "decisiveness":"quick" } }
```
- POST Res: `{ "ok": true }`

### .ics 配信仕様
- Content-Type: text/calendar; charset=utf-8  
- Content-Disposition: attachment; filename="yohaku-evt_*.ics"

## 新規：Memory
- `POST /api/memory.put`  — `{ "kind":"preference","key":"coffee.sugar","value":0,"ttl_days":365 }` → `{ "ok":true,"confidence":1.0 }`
- `POST /api/memory.forget`— `{ "key":"coffee.sugar" }` → `{ "ok":true }`
- `POST /api/memory.query` — `{ "keys":["coffee.*","alias.*"] }` → `{ "items":[...] }`
- `GET  /api/memory.export`— すべてのCore Memoryをエクスポート（JSON）
- `DELETE /api/memory.purge`— Core Memory全削除（確認ダイアログ必須）

## 新規：Proactive/Nudge
- `GET /api/nudges`           → `{ items:[ { id, summary, plan, reasons[], created_at } ] }`
- `POST /api/nudge.feedback`  → `{ id, action:"accept|dismiss|snooze", reason_key? }`
- `GET /api/availability`     → `{ date, slots:["2025-10-20T19:00/30m", ...] }`
- `GET /api/relationship.gaps`→ `{ contacts:[ {name, days_since_last_meet, cadence_days} ] }`

## 新規：Provider Control
- `GET  /api/provider.status` → `{ current:"supermemory|zep|mem0|none", healthy:true }`
- `POST /api/provider.switch` → `{ to:"zep" }`（管理者専用・A/B運用）

## 状態・監査・注意
- `/api/approve` → `{ approve_id }`（ConfirmOS）。`/api/confirm` は **idempotency-key** 必須。  
- 監査：approve_id / 実行ID / 操作者 / 要約 / タイムスタンプ  
- **PII最小化**：長期は要約＋操作メタのみ。録音/本文は既定OFF（明示同意で段階解放）。

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

### TTLマトリクス（推奨）
- alias：∞（手動forget可）
- preference：365d（最終使用で延長）
- routine：180d（未使用で自然消滅）
- relationship_note：180d
- goal：90d
- autopilot_rule：30d（自動失効→再学習）

### ルール
- **最小保存**：本文は保存しない（要約+メタのみ）
- **可撤回**：いつでもforget / TTL満了で自動削除
- **証拠係数**：出所×回数でconfidence更新（人手訂正は強制上書き）
- **出典表示**：Why‑this には必ず `source: core|doc` を付ける

### KPI
命中率 / 誤記憶率 / 手動修正率

# ─────────────────────────
# END: docs/MEMORY_OS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/MEMORY_PROVIDERS.md
# ─────────────────────────
# MEMORY PROVIDERS – 外部記憶の差し替え

## 目的
- Drive/Notion/メールなど**広い情報源**の検索/参照を**プロバイダ切替**で取り込む

## Provider Interface（擬似）
```ts
export interface MemoryProvider {
  put(items: MemoryItem[], container?: string): Promise<PutResult[]>;
  search(query: string | Embedding, opts: SearchOpts): Promise<MemoryHit[]>;
  forget(keys: string[]): Promise<void>;
  sync?(provider: "google-drive"|"notion"|string): Promise<void>;
  health(): Promise<ProviderHealth>;
}
```

## 実装
- `providers/supermemory.ts` / `providers/zep.ts` / `providers/mem0.ts`
- ENV: `YOHAKU_MEMORY_PROVIDER=supermemory|zep|mem0|none`
- A/B: `YOHAKU_MEMORY_PROVIDER_AB=A|B`（`provider_events`に採択率/遅延を記録）

## フォールバック
- 外部が落ちたら**Coreのみ**で推論（.icsフォールバックは常時有効）

# ─────────────────────────
# END: docs/MEMORY_PROVIDERS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/PROACTIVE_OS.md
# ─────────────────────────
# PROACTIVE OS – 見張る/気を利かせる/騒がない

### 信号（observations）
`free_slot | relationship_gap | deadline_near | habit_window | location`

### Nudge設計
- A/Bの2択、2行以内、Why‑this‑for‑you（最大2・**出典明示**）
- **窓**：朝(06:30–09:30) / 移動前 / 就寝前(21:00–23:00)
- **クールダウン**：最短90分、1日上限3件、週上限12件
- **Autopilot budgets**：週Nインパクト上限（ユーザー調整可）
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
- `tie_strength = f(freq, recency, channel_diversity)`
- `days_since_last_meet / last_msg`
- `cadence_days`（希望接触間隔）

### 提案例
「**Aさん、前回から28日**。金曜の**19:00/19:30/20:00**、どれ置きますか？」  
A: `calendar.create` + `message.send(A)`（候補提示）  
B: 次週に回す + 軽い一言

### セーフティ
メタのみ（本文解析は明示同意）/ Partnerモード（最小・期限付き）

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
Why‑this‑for‑you（最大3理由＋👍/👎+タグ＋**出典**）  
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
# BEGIN: docs/SECURITY_PRIVACY.md
# ─────────────────────────
# SECURITY & PRIVACY – 最小化/保持/監査

## 最小化
- 音声：即時テキスト化、**音声データは保持しない**（録音ON時のみ24hで破棄）
- テキスト：**要約＋操作メタのみ長期保存**
- 外部Doc：**要約/参照URIのみ**をCoreに保存、本体は外部プロバイダ側

## 保持期間（推奨）
- transcript：24h（録音ON時）→要約のみ長期
- audit_logs：90d
- decisions/approvals：1y（ユーザー削除で即時消去）
- memories：TTLマトリクスに従う

## 透明性
- Why‑thisに**出典と信頼度**を表示
- エクスポート/削除API（memory.export / memory.purge）を提供

# ─────────────────────────
# END: docs/SECURITY_PRIVACY.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/REGULATORY.md
# ─────────────────────────
# REGULATORY – リージョン/同意/データ移転

- **リージョンゲート**：US/JP先行、EUは後追い。提供範囲と機能を制御（通話/外部連携は別審査）。
- **同意**：録音/本文解析/支払いは明示同意、撤回自由。
- **データ移転**：外部プロバイダに預けるデータは**最小化**し、出典のみCoreに保持。

# ─────────────────────────
# END: docs/REGULATORY.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/EVALS.md
# ─────────────────────────
# EVALS – 自動評価スイート

- **Top‑1採択率** / **編集距離** / **Time‑to‑Confirm** / **Nudge採択/誤提案** / **vMB/FEA**
- 失敗例の**理由タグ**を収集→Taste/Memory閾値に反映
- Provider A/B：採択率/レイテンシ/誤提案で比較、週次で切替判断

# ─────────────────────────
# END: docs/EVALS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/ROADMAP_36M.md
# ─────────────────────────
## 0–6m
- **Memory OS v0**（preference/alias/goal）
- **Nudge v0**（free_slot/relationship_gap）
- Provider PoC（supermemory **or** zep）＋**A/B装置**
- Social Pack v0（contact_graphをメタで構築）
- Nudge KPI運用（採択/誤提案/苦情）

## 6–12m
- **Memory OS v1**（routine/relationship_note/TTL）
- Relationship Gaps→Meet提案（候補3スロット）
- LINE/WhatsApp/Emailコネクタ（TOS順守）
- Provider二社冗長（自動降格/ヘルスチェック）

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
# BEGIN: docs/PUBLIC_API.md
# ─────────────────────────
# PUBLIC API – 外部アプリ向け

## 認証
- `Authorization: Bearer <API_KEY>`
- リミット：**60 req/min / key**（初期）

## エンドポイント
### POST /v1/plan
- 入力：自然文 or Intent JSON  
- 出力：**plans[2]**（各1–3アクションの要約とWhy‑this候補）

### POST /v1/approve
- 入力：`plan_id`  
- 出力：`{ "approve_id": "..." }`（10分有効）

### POST /v1/confirm
- 入力：`plan_id, approve_id, idempotency_key`  
- 出力：`results[]`, `minutes_back`, `friction_saved[]`

## Idempotency / バージョニング
- `Idempotency-Key` ヘッダ必須（重複実行防止）
- `X-Yohaku-Version` でAPIバージョン固定

## Webhooks
- `action.executed` / `minutes_back.added` / `friction_saved` / `error`  
- 署名：`X-Yohaku-Signature: sha256=<hex>`（秘密鍵でHMAC）

# ─────────────────────────
# END: docs/PUBLIC_API.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/WEBHOOKS.md
# ─────────────────────────
# WEBHOOKS – 仕様

## 署名
- `X-Yohaku-Signature: sha256=<hex>`、ボディに対するHMAC。時刻ドリフト±5分。

## イベント
### action.executed
```json
{ "event":"action.executed","id":"evt_1","plan_id":"pl1","action":{"action":"calendar.create","status":"ok"},"ts":"2025-10-19T10:10:00Z" }
```

### minutes_back.added
```json
{ "event":"minutes_back.added","user_id":"u1","minutes":6,"confidence":1.0,"source":"measured","ts":"2025-10-19T10:10:01Z" }
```

### friction_saved
```json
{ "event":"friction_saved","user_id":"u1","type":"app_switch_avoided","qty":2,"evidence":"measured","ts":"2025-10-19T10:10:01Z" }
```

### provider.health
```json
{ "event":"provider.health","provider":"zep","status":"degraded","latency_ms":920,"ts":"2025-10-19T10:09:51Z" }
```

### error
```json
{ "event":"error","code":"CONNECTOR_TIMEOUT","plan_id":"pl1","action":"message.send","ts":"2025-10-19T10:10:02Z" }
```

# ─────────────────────────
# END: docs/WEBHOOKS.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/CONNECTOR_SDK.md
# ─────────────────────────
# CONNECTOR SDK – 安全な拡張

## 目的
- 外部が `message.send / reservations.book / ride.order ...` を追加実装できる仕組み。**ConfirmOS準拠**が必須。

## インタフェース（擬似）
```ts
export type Action =
  | { action:"message.send", to:string, text:string }
  | { action:"calendar.create", title:string, start:string, duration_min:number }
  | { action:"reservations.book", place_id:string, time:string, party_size:number }
  // ...略

export interface Connector {
  name: string; version: string;
  supports(action: Action): boolean;
  execute(action: Action, ctx: ExecContext): Promise<ExecResult>;
}
```

## 審査
- 署名 / 権限スコープ / ロールバック可否 / ConfirmOS互換 / ログ透明性

# ─────────────────────────
# END: docs/CONNECTOR_SDK.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/CALL_TEMPLATES.md
# ─────────────────────────
# Call Templates（サンプル）

## 病院予約（一次診療）
Plan.summary: 「◯◯クリニックに明日10:30で予約／家族へ共有／9:45リマインド」
Plan.actions:
- { action: "call.place", to: "+81XXXXXXXX", script: "受診予約を取りたいです。明日10時半は空いていますか？", locale: "ja-JP", record: false }
- { action: "calendar.create", title: "Clinic visit", start: "2025-10-19T10:30:00+09:00", duration_min: 30 }
- { action: "message.send", to: "家族", text: "10:30に予約取れたよ" }
- { action: "reminder.create", time: "2025-10-19T09:45:00+09:00", note: "出発準備" }

## 飲食キャンセル/リスケ
- { action: "call.place", to: "+81YYYYYYYY", script: "19時の予約をキャンセルし、明日19時に変更できますか？" }
- 後続は `calendar.create` / `message.send` / `reminder.create` を状況に応じて

## デート即時（静か/駐車あり/15分圏内）
Plan.summary: 「静かな店で19:00／駐車場確保／相手に地図共有／18:30出発リマインド」
Plan.actions:
- { action: "places.search", query: "静か イタリアン 駐車場 4.2+", radius_min: 15 }
- { action: "reservations.book", place_id: "<from search>", time: "2025-10-19T19:00:00+09:00", party_size: 2 }
- { action: "parking.reserve", near: "<place address>", duration_min: 120 }
- { action: "calendar.create", title: "Dinner", start: "2025-10-19T19:00:00+09:00", duration_min: 90 }
- { action: "message.send", to: "相手", text: "ここ行こ！地図→ <url>" }
- { action: "reminder.create", time: "2025-10-19T18:30:00+09:00", note: "出発" }
- フォールバック：`call.place` で電話予約→結果に応じて再提案

# ─────────────────────────
# END: docs/CALL_TEMPLATES.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/YOHAKU_LITE.md
# ─────────────────────────
Yohaku Lite（ChatGPT Apps）：7→2→1（Cal+Email）/ Why‑this / ConfirmOS / .ics フォールバック  
KPI（4週判定）：Top‑1≥55% / TTC p50≤3s / 初回CVR≥20% / Lite MRR≥¥ or 本体送客≥5%

# ─────────────────────────
# END: docs/YOHAKU_LITE.md
# ─────────────────────────


# ─────────────────────────
# BEGIN: docs/CHANGELOG.md
# ─────────────────────────
# CHANGELOG

- **2025-10-16**: Pluggable Memory導入（Provider Interface/API/健康監視/出典表示）、Security&Privacy/EVALS/REGULATORY追加、Nudge窓&予算明確化、reasonsに`source/provider/confidence`を追加。

# ─────────────────────────
# END: docs/CHANGELOG.md
# ─────────────────────────