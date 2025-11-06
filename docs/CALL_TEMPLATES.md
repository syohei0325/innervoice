# Call Templates（サンプル）

## 病院予約（一次診療）
Plan.summary: 「◯◯クリニックに明日10:30で予約／家族へ共有／9:45リマインド」

Plan.actions:
```json
[
  {
    "action": "call.place",
    "to": "+81XXXXXXXX",
    "script": "受診予約を取りたいです。明日10時半は空いていますか？",
    "locale": "ja-JP",
    "record": false
  },
  {
    "action": "calendar.create",
    "title": "Clinic visit",
    "start": "2025-10-19T10:30:00+09:00",
    "duration_min": 30
  },
  {
    "action": "message.send",
    "to": "家族",
    "text": "10:30に予約取れたよ"
  },
  {
    "action": "reminder.create",
    "time": "2025-10-19T09:45:00+09:00",
    "note": "出発準備"
  }
]
```

## 飲食キャンセル/リスケ
```json
[
  {
    "action": "call.place",
    "to": "+81YYYYYYYY",
    "script": "19時の予約をキャンセルし、明日19時に変更できますか？"
  }
]
```

後続は `calendar.create` / `message.send` / `reminder.create` を状況に応じて。

## デート即時（静か/駐車あり/15分圏内）
Plan.summary: 「静かな店で19:00／駐車場確保／相手に地図共有／18:30出発リマインド」

Plan.actions:
```json
[
  {
    "action": "places.search",
    "query": "静か イタリアン 駐車場 4.2+",
    "radius_min": 15
  },
  {
    "action": "reservations.book",
    "place_id": "<from search>",
    "time": "2025-10-19T19:00:00+09:00",
    "party_size": 2
  },
  {
    "action": "parking.reserve",
    "near": "<place address>",
    "duration_min": 120
  },
  {
    "action": "calendar.create",
    "title": "Dinner",
    "start": "2025-10-19T19:00:00+09:00",
    "duration_min": 90
  },
  {
    "action": "message.send",
    "to": "相手",
    "text": "ここ行こ！地図→ <url>"
  },
  {
    "action": "reminder.create",
    "time": "2025-10-19T18:30:00+09:00",
    "note": "出発"
  }
]
```

フォールバック：`call.place` で電話予約→結果に応じて再提案。

## 再配達
```json
[
  {
    "action": "call.place",
    "to": "+81ZZZZZZZZZ",
    "script": "伝票番号123456の荷物を、明日18時に再配達お願いします。",
    "locale": "ja-JP",
    "record": false
  },
  {
    "action": "calendar.create",
    "title": "荷物受取",
    "start": "2025-10-20T18:00:00+09:00",
    "duration_min": 30
  },
  {
    "action": "reminder.create",
    "time": "2025-10-20T17:45:00+09:00",
    "note": "在宅確認"
  }
]
```

