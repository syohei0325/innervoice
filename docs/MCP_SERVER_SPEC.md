# MCP Server Specification（InnerVoice）

## 概要
InnerVoice MCP Serverは、Model Context Protocol（MCP）に準拠したツール実行サーバーです。
LLM/音声クライアント（OpenAI Realtime、Anthropic Claude等）から、calendar/message/reminder操作を安全に実行できます。

## エンドポイント

### Remote MCP Server
```
wss://mcp.innervoice.app
```

### Local MCP Server
```
ws://127.0.0.1:7777
```

## 認証
```http
Authorization: Bearer YOUR_API_KEY
```

## サポートされるツール（v1）

### `calendar.create`
予定を作成します。

**Parameters:**
```typescript
{
  title: string;        // 予定タイトル（必須）
  start: string;        // ISO8601形式の開始時刻（必須）
  duration_min: number; // 所要時間（分）（必須）
  description?: string; // 説明（オプション）
  location?: string;    // 場所（オプション）
}
```

**Response:**
```typescript
{
  status: "ok" | "error";
  id?: string;          // 作成されたイベントID
  error?: string;       // エラーメッセージ
}
```

### `message.send`
メッセージを送信します。

**Parameters:**
```typescript
{
  to: string;           // 送信先（名前またはID）（必須）
  text: string;         // メッセージ本文（必須）
  platform?: string;    // プラットフォーム指定（オプション: "sms", "email"）
}
```

**Response:**
```typescript
{
  status: "ok" | "error";
  id?: string;          // メッセージID
  error?: string;
}
```

### `reminder.create`
リマインダーを作成します。

**Parameters:**
```typescript
{
  time: string;         // ISO8601形式の通知時刻（必須）
  note: string;         // リマインダーの内容（必須）
  repeat?: string;      // 繰り返し設定（オプション）
}
```

**Response:**
```typescript
{
  status: "ok" | "error";
  id?: string;          // リマインダーID
  error?: string;
}
```

## プロトコル詳細

### WebSocket Handshake
```
GET wss://mcp.innervoice.app
Upgrade: websocket
Connection: Upgrade
Authorization: Bearer YOUR_API_KEY
```

### Tool Execution Message
```json
{
  "jsonrpc": "2.0",
  "id": "req_123",
  "method": "tools/call",
  "params": {
    "name": "calendar.create",
    "arguments": {
      "title": "朝ラン",
      "start": "2025-09-19T07:00:00+09:00",
      "duration_min": 30
    }
  }
}
```

### Response
```json
{
  "jsonrpc": "2.0",
  "id": "req_123",
  "result": {
    "status": "ok",
    "id": "evt_abc123"
  }
}
```

## エラーハンドリング

### 認証エラー
```json
{
  "jsonrpc": "2.0",
  "id": "req_123",
  "error": {
    "code": 401,
    "message": "Invalid API key"
  }
}
```

### Rate Limit
```json
{
  "jsonrpc": "2.0",
  "id": "req_123",
  "error": {
    "code": 429,
    "message": "Rate limit exceeded"
  }
}
```

## セキュリティ

- すべての通信はTLS/WSS暗号化
- API Key認証必須
- Rate Limiting: 100 requests/分/API Key
- 監査ログ記録（全実行履歴）
- ユーザー承認フロー（Confirm once UI）

## 実装ステータス
🚧 **開発中** - v0.3.0で実装予定
