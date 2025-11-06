# PERSONALIZATION – 個人最適化

## Vibe Profile
ユーザーの**トーン/決断速度/節約志向/通知スタイル/言語**を設定。

### 項目
- **tone**：friendly / coach / concise / warm
- **decisiveness**：quick / balanced / cautious
- **frugality**：low / mid / high
- **notification_style**：push / silent / scheduled
- **language**：ja-JP / en-US / etc.

### API
- `GET /api/vibe` → 現在の設定を取得
- `POST /api/vibe` → 設定を更新

## Why‑this‑for‑you
提案に**理由**を添える（最大3理由＋出典＋信頼度）。

### 例
```json
{
  "reasons": [
    {
      "key": "morning_person",
      "source": "core",
      "confidence": 0.84,
      "evidence": ["memories.habit_window"]
    },
    {
      "key": "<=15min_walk",
      "source": "doc",
      "provider": "supermemory",
      "confidence": 0.72
    }
  ]
}
```

### フィードバック
- **👍/👎**：理由に対する評価
- **タグ**：却下時の理由（too_expensive / too_far / too_crowded 等）

## Pulse（受動提案）
朝/寝る前のみ、**2案**を静かに提示。

### ルール
- **No Feed / No Scroll**：フィードは作らない
- **窓**：朝(06:30–09:30) / 就寝前(21:00–23:00)
- **クールダウン**：最短90分、1日上限3件、週上限12件

## KPI
- **Top‑1採択率** ≥ 55%
- **編集距離** ≤ 20%
- **Time‑to‑Confirm** p50 ≤ 3秒
- **vMB‑lift & FEA‑lift**：個人化適用時の増分

## プライバシー
- 要約＋操作メタのみ長期保存
- 出典明示（core / doc / provider）
- エクスポート/削除可能

