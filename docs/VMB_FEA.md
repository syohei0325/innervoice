# vMB & FEA – 保守的な価値測定

## 概要
- **vMB (Verified Minutes-Back)**: 検証可能な時間短縮（保守的推定）
- **FEA (Friction Events Avoided)**: 削減された摩擦イベント件数

## vMB の計算式

### 基本式
```
vMB_action = max(0, Baseline_p10(action, user) − (Confirm_ms + 実行レイテンシ + オーバーヘッド)) × EvidenceFactor
```

### EvidenceFactor（証拠係数）
- **1.0**: 実測/外部往復含む（最も信頼できる）
- **0.6**: 類推（類似アクションからの推定）
- **0.3**: 初期テーブルのみ（最も保守的）

### Baseline_p10
- ユーザーごと、アクションごとの**10パーセンタイル**ベースライン時間
- 楽観的な値ではなく、**保守的な下限**を使用

### 例
```
Action: calendar.create
Baseline_p10(user_123, calendar.create) = 45秒
Confirm_ms = 2秒
実行レイテンシ = 1秒
オーバーヘッド = 5秒
EvidenceFactor = 0.6（類推）

vMB = max(0, 45 - (2 + 1 + 5)) × 0.6
    = max(0, 37) × 0.6
    = 22.2秒
    ≈ 22秒
```

## FEA カテゴリ

### 主要カテゴリ
1. **copy_paste_avoided**: コピペ削減
2. **app_switch_avoided**: アプリ切替削減
3. **typing_avoided_chars**: 文字入力削減（文字数）
4. **search_avoided**: 検索削減
5. **form_fill_avoided**: フォーム入力削減
6. **call_tree_avoided**: 電話メニュー操作削減

### 計測方法
```json
{
  "friction_saved": [
    {
      "type": "copy_paste_avoided",
      "qty": 1,
      "evidence": "measured"
    },
    {
      "type": "app_switch_avoided",
      "qty": 2,
      "evidence": "inferred"
    }
  ]
}
```

## UI表示原則

### 主役は件数、時間は添える
```
✓ 3つの手間を削減（約2分）
```

### 週次カード（任意ON）
```
今週: 42件の手間削減
保守的推定: 18分
```

### Trustパネル（詳細）
```
証拠係数平均: 0.75
vMB詳細:
- calendar.create: 22秒 (EF=0.6)
- message.send: 15秒 (EF=1.0)
```

## データベーススキーマ

### friction_events テーブル
```sql
CREATE TABLE friction_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  qty INTEGER NOT NULL,
  evidence VARCHAR(20) NOT NULL, -- 'measured' | 'inferred' | 'table'
  action VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### decisions テーブルへの追加
```sql
ALTER TABLE decisions ADD COLUMN minutes_back_confidence DECIMAL(3,2);
-- 1.0 = 完全実測, 0.6 = 類推, 0.3 = 初期テーブル
```

## API レスポンス例

```json
{
  "results": [
    {"action": "calendar.create", "status": "ok", "id": "evt_123"},
    {"action": "message.send", "status": "ok", "id": "msg_456"}
  ],
  "minutes_back": 18,
  "minutes_back_confidence": 0.75,
  "friction_saved": [
    {"type": "copy_paste_avoided", "qty": 1, "evidence": "measured"},
    {"type": "app_switch_avoided", "qty": 2, "evidence": "inferred"}
  ]
}
```

## KPI
- **vMB中央値 ≥ 15分/日**（D30継続ユーザー）
- **FEA ≥ 10/週（p50）**
- **証拠係数平均 ≥ 0.6**（実測・類推の混合）

