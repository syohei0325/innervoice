# Public API（InnerVoice）

## 概要
InnerVoiceの機能を外部アプリケーションから利用するためのREST APIです。

## Base URL
```
https://api.innervoice.app/v1
```

## 認証
すべてのリクエストにAPI Keyが必要です。

```http
Authorization: Bearer YOUR_API_KEY
```

## エンドポイント

### `POST /v1/plan`
テキスト入力からプランを生成します。

**Request:**
```json
{
  "text": "明日朝30分ランニング",
  "context": {
    "tz": "Asia/Tokyo",
    "ng": ["22:00-06:30"],
    "mobility": "walk"
  }
}
```

**Response:**
```json
{
  "plans": [
    {
      "id": "pl1",
      "summary": "07:00-07:30 朝ラン + 妻にメッセ + 06:45リマインド",
      "actions": [
        {
          "action": "calendar.create",
          "title": "朝ラン",
          "start": "2025-09-19T07:00",
          "duration_min": 30
        },
        {
          "action": "message.send",
          "to": "妻",
          "text": "7時に走ってくるね"
        },
        {
          "action": "reminder.create",
          "time": "2025-09-19T06:45",
          "note": "ストレッチ"
        }
      ]
    },
    {
      "id": "pl2",
      "summary": "雨なら夜ストレッチ15分 + 連絡",
      "actions": [
        {
          "action": "calendar.create",
          "title": "夜ストレッチ",
          "start": "2025-09-19T21:30",
          "duration_min": 15
        },
        {
          "action": "message.send",
          "to": "妻",
          "text": "夜にするね"
        }
      ]
    }
  ],
  "latency_ms": 950
}
```

### `POST /v1/confirm`
プランを実行します。

**Request:**
```json
{
  "plan_id": "pl1",
  "enabled_actions": [0, 1, 2]  // 実行するアクションのインデックス
}
```

**Response:**
```json
{
  "results": [
    {
      "action": "calendar.create",
      "status": "ok",
      "id": "evt_123"
    },
    {
      "action": "message.send",
      "status": "ok",
      "id": "msg_456"
    },
    {
      "action": "reminder.create",
      "status": "ok",
      "id": "rmd_789"
    }
  ],
  "minutes_back": 18,
  "execution_id": "exec_abc"
}
```

## Webhooks
プラン実行の結果を非同期で受け取ることができます。

### イベント種類

#### `action.executed`
個別のアクションが実行された時に発火。

```json
{
  "event": "action.executed",
  "timestamp": "2025-09-19T07:00:00Z",
  "data": {
    "execution_id": "exec_abc",
    "action": "calendar.create",
    "status": "ok",
    "id": "evt_123"
  }
}
```

#### `minutes_back.added`
Minutes-Backが加算された時に発火。

```json
{
  "event": "minutes_back.added",
  "timestamp": "2025-09-19T07:00:05Z",
  "data": {
    "execution_id": "exec_abc",
    "minutes": 18,
    "source": "plan_execution"
  }
}
```

## Rate Limiting
- Free Tier: 100 requests/日
- Pro Tier: 10,000 requests/日
- Enterprise: カスタム

## エラーコード

| Code | 説明 |
|------|------|
| 400 | Bad Request - 不正なリクエスト |
| 401 | Unauthorized - API Keyが無効 |
| 429 | Too Many Requests - Rate Limit超過 |
| 500 | Internal Server Error - サーバーエラー |

## SDK（予定）
- JavaScript/TypeScript
- Python
- Ruby
- Go

## 実装ステータス
🚧 **開発中** - v0.4.0で実装予定
