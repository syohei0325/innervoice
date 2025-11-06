# RELATIONSHIP GRAPH – 人との距離を見える化して、そっと寄せる

## 目的
「最近会っていない」「連絡間隔」を検出 → **メッセ1通＋候補スロット**の最小提案。

## 入力
- **カレンダー参加者**：誰と会ったか
- **メール/メッセメタ**：相手/件数/最終時刻（※本文は既定で不使用）
- **Memoryの`relationship_note`**：関係性メモ

## 指標
- **tie_strength**：関係の強さ = f(freq, recency, channel_diversity)
- **days_since_last_meet**：最後に会ってからの日数
- **days_since_last_msg**：最後に連絡してからの日数
- **cadence_days**：希望接触間隔（学習または手動設定）

## 提案例
「**Aさん、前回から28日**。金曜の**19:00/19:30/20:00**、どれ置きますか？」

### Plan A
```json
{
  "actions": [
    {
      "action": "calendar.create",
      "title": "Aさんと食事",
      "start": "2025-10-24T19:00:00+09:00",
      "duration_min": 90
    },
    {
      "action": "message.send",
      "to": "Aさん",
      "text": "金曜19:00、19:30、20:00のどれかで食事どう？"
    }
  ]
}
```

### Plan B
次週に回す + 軽い一言

## セーフティ
- **メタのみ**：本文解析は明示同意
- **Partnerモード**：最小・期限付き
- **透明性**：誰が何を共有/利用したかを90日保持（削除/エクスポート可）

## API
- `GET /api/relationship/gaps` → 最近会っていない人

Response:
```json
{
  "contacts": [
    {
      "contact_id": "c1",
      "name": "Aさん",
      "days_since_last_meet": 28,
      "days_since_last_msg": 14,
      "cadence_days": 21,
      "gap_score": 0.8,
      "tie_strength": 0.7
    }
  ],
  "count": 1
}
```

## KPI
- **Nudge採択率** ≥ 25%
- **誤提案率** ≤ 10%
- **関係性維持率**：定期接触できている人の割合

## プライバシー
- 本文は保存しない（要約+メタのみ）
- 明示同意（本文解析はOpt-in）
- エクスポート/削除可能

## 詳細
- **docs/DORAEMON_MODE.md**：Doraemonモード全体像
- **docs/PROACTIVE_OS.md**：Proactive OS

