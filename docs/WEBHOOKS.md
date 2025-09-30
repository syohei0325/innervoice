# Webhooks（InnerVoice）

## 概要
InnerVoice APIのイベントをリアルタイムで受け取るためのWebhook機能です。

## セットアップ

### 1. Webhook URLの登録
ダッシュボードまたはAPIで登録：

```bash
curl -X POST https://api.innervoice.app/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/innervoice",
    "events": ["action.executed", "minutes_back.added"]
  }'
```

### 2. エンドポイント実装
受信エンドポイントを実装：

```typescript
// Node.js + Express の例
app.post('/webhooks/innervoice', express.json(), (req, res) => {
  const signature = req.headers['x-innervoice-signature'];
  const payload = JSON.stringify(req.body);
  
  // 署名検証
  if (!verifySignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  
  // イベント処理
  switch (event.event) {
    case 'action.executed':
      handleActionExecuted(event.data);
      break;
    case 'minutes_back.added':
      handleMinutesBackAdded(event.data);
      break;
  }
  
  res.status(200).send('OK');
});
```

## イベント一覧

### `action.executed`
個別のアクションが実行された時に発火。

**Payload:**
```json
{
  "event": "action.executed",
  "timestamp": "2025-09-19T07:00:00Z",
  "data": {
    "execution_id": "exec_abc",
    "plan_id": "pl_xyz",
    "action": "calendar.create",
    "status": "ok",
    "id": "evt_123",
    "latency_ms": 342
  }
}
```

### `minutes_back.added`
Minutes-Backが加算された時に発火。

**Payload:**
```json
{
  "event": "minutes_back.added",
  "timestamp": "2025-09-19T07:00:05Z",
  "data": {
    "execution_id": "exec_abc",
    "plan_id": "pl_xyz",
    "minutes": 18,
    "source": "plan_execution",
    "user_id": "user_001"
  }
}
```

### `execution.completed`
プラン全体の実行が完了した時に発火。

**Payload:**
```json
{
  "event": "execution.completed",
  "timestamp": "2025-09-19T07:00:11Z",
  "data": {
    "execution_id": "exec_abc",
    "plan_id": "pl_xyz",
    "status": "completed",
    "total_actions": 3,
    "successful_actions": 3,
    "failed_actions": 0,
    "minutes_back": 18
  }
}
```

### `execution.failed`
プラン実行が失敗した時に発火。

**Payload:**
```json
{
  "event": "execution.failed",
  "timestamp": "2025-09-19T07:00:11Z",
  "data": {
    "execution_id": "exec_abc",
    "plan_id": "pl_xyz",
    "error": "Calendar API timeout",
    "failed_action": "calendar.create"
  }
}
```

## セキュリティ

### 署名検証
すべてのWebhookリクエストには署名が含まれます。

**署名生成（InnerVoice側）:**
```
HMAC-SHA256(payload, webhook_secret)
```

**署名検証（あなたのアプリ側）:**
```typescript
import crypto from 'crypto';

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## リトライポリシー

失敗時の再送ルール：
- 初回失敗: 5秒後
- 2回目失敗: 30秒後
- 3回目失敗: 5分後
- 4回目失敗: 30分後
- 5回目失敗: 諦め（ログ記録）

**期待されるレスポンス:**
- `200-299`: 成功
- `それ以外`: 失敗（リトライ対象）

## テスト

### テストイベント送信
```bash
curl -X POST https://api.innervoice.app/v1/webhooks/test \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_id": "wh_abc123",
    "event": "action.executed"
  }'
```

## ログ確認
ダッシュボードで配信ログを確認できます：
- 送信時刻
- ステータスコード
- レスポンス時間
- リトライ回数

## 実装ステータス
🚧 **開発中** - v0.4.0で実装予定
