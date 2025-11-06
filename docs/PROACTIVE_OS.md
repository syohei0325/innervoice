# PROACTIVE OS – 見張る/気を利かせる/騒がない

## 目的
人が言う前に"そっと提案"。**ナッジは最小で、騒がない。**

## 信号（observations）
- `free_slot`：空き時間
- `relationship_gap`：最近会っていない人
- `deadline_near`：期限が近い
- `habit_window`：習慣の時間帯
- `location`：移動開始/到着
- `open_loop`：未完了タスク

## Nudge設計
- **A/Bの2択**：2行以内
- **Why‑this‑for‑you**：最大2理由＋**出典明示**
- **窓**：朝(06:30–09:30) / 移動前 / 就寝前(21:00–23:00)
- **クールダウン**：最短90分、1日上限3件、週上限12件
- **Autopilot budgets**：週Nインパクト上限（ユーザー調整可）

## 行為
- `calendar.create`
- `message.send`
- `reminder.create`
- `places.search`
- `reservations.book`

## 受け入れ基準
- Nudge表示 p50 ≤ 300ms
- Confirm once
- Undo 10秒
- 監査ログ
- 部分成功OK
- .icsフォールバック

## KPI
- **採択率** ≥ 25%
- **誤提案率** ≤ 10%
- **苦情率** ≤ 0.5%
- **Screen‑off完了率** ≥ 70%
- **TTC** p50 ≤ 3秒
- **Top‑1採択率** ≥ 55%
- **vMB/FEAリフト**：先読み適用時の増分

## API
- `GET /api/nudges` → Nudge一覧
- `POST /api/nudge/feedback` → フィードバック（accept/dismiss/snooze）
- `GET /api/availability` → 空き時間スロット
- `GET /api/relationship/gaps` → 最近会っていない人

## プライバシー
- 本文は保存しない（要約+メタのみ）
- 端末優先（PDV: Personal Data Vault）
- エクスポート/削除可能

## 詳細
- **docs/DORAEMON_MODE.md**：Doraemonモード全体像
- **docs/RELATIONSHIP_GRAPH.md**：関係性グラフ

