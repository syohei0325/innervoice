# MEMORY OS – 覚える/忘れる/言い換える

## コンセプト
Memory = (key, value, kind, confidence, TTL)

### kind
- `preference`：好み（コーヒーに砂糖0、静かな店が好き）
- `fact`：事実（誕生日、住所）
- `alias`：言い換え（「妻」→「田中花子」）
- `goal`：目標（3ヶ月で5kg減量）
- `routine`：習慣（毎朝7時にランニング）
- `relationship_note`：関係性メモ（Aさんは猫アレルギー）
- `autopilot_rule`：自動化ルール（金曜夜は自動で飲み会候補提示）

### source
- `utterance`：発話から
- `action`：操作から
- `calendar`：カレンダーから
- `message_meta`：メッセージメタから
- `import`：インポート
- `manual`：手動入力

## TTLマトリクス（推奨）
- **alias**：∞（手動forget可）
- **preference**：365d（最終使用で延長）
- **routine**：180d（未使用で自然消滅）
- **relationship_note**：180d
- **goal**：90d
- **autopilot_rule**：30d（自動失効→再学習）

## ルール
- **最小保存**：本文は保存しない（要約+メタのみ）
- **可撤回**：いつでもforget / TTL満了で自動削除
- **証拠係数**：出所×回数でconfidence更新（人手訂正は強制上書き）
- **出典表示**：Why‑this には必ず `source: core|doc` を付ける

## API
- `POST /api/memory/put` → Memory保存
- `POST /api/memory/query` → Memory検索
- `POST /api/memory/forget` → Memory削除
- `GET /api/memory/export` → 全Memoryエクスポート
- `DELETE /api/memory/purge` → 全Memory削除

## KPI
- **命中率**：提案に使われたMemoryの精度
- **誤記憶率**：間違ったMemoryの割合
- **手動修正率**：ユーザーが修正した割合

## プライバシー
- 本文は保存しない（要約+メタのみ）
- 端末優先（PDV: Personal Data Vault）
- エクスポート/削除可能

## 詳細
- **docs/MEMORY_API_USAGE.md**：API使用例
- **docs/MEMORY_PROVIDERS.md**：外部プロバイダ連携

