# Yohaku Receiver Starter Kit - Node.js / Express

Yohaku Action CloudからのWebhookを受信するための最小限の実装例です。

## 必須要件

1. **X-Yohaku-Signature を検証**（HMAC-SHA256）
2. **X-Idempotency-Key を保存**して重複処理しない（24h）
3. **2xxでack**（成功）、5xx/timeoutはリトライされる

## セットアップ

```bash
cd receiver-starter-node
npm install
```

## 環境変数

```bash
# .env ファイルを作成
WEBHOOK_SIGNING_SECRET=your-secret-from-yohaku-dashboard
PORT=3001
```

## 起動

```bash
# 本番
npm start

# 開発（ホットリロード）
npm run dev
```

## テスト

```bash
# Yohaku側から送信されるWebhookの例
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -H "X-Yohaku-Signature: sha256=..." \
  -H "X-Idempotency-Key: unique_key_123" \
  -H "X-Yohaku-Job-Id: job_abc123" \
  -d '{
    "event": "hold.created",
    "tenant_id": "t1",
    "confirm_id": "c_123",
    "payload": {
      "title": "Follow-up meeting",
      "start": "2026-01-10T10:00:00+09:00",
      "duration_min": 30
    }
  }'
```

## 本番環境への展開

### Cloudflare Workers版
- より高速で、グローバルエッジで動作
- `receiver-starter-cloudflare/` を参照

### Vercel / Netlify
- サーバーレス関数として展開可能
- 環境変数を設定して `npm start`

### Docker
```bash
docker build -t yohaku-receiver .
docker run -p 3001:3001 -e WEBHOOK_SIGNING_SECRET=your-secret yohaku-receiver
```

## セキュリティ

- **署名検証は必須**：X-Yohaku-Signatureを必ず検証してください
- **Idempotency**：重複処理を防ぐため、X-Idempotency-Keyを保存してください
- **HTTPS**：本番環境では必ずHTTPSを使用してください
- **Rate Limiting**：必要に応じてレート制限を実装してください

## トラブルシューティング

### 署名検証が失敗する
- `WEBHOOK_SIGNING_SECRET`が正しいか確認
- リクエストボディが改変されていないか確認

### Webhookが届かない
- エンドポイントがHTTPSか確認
- ファイアウォール設定を確認
- Yohakuダッシュボードでログを確認

## サポート

- Docs: https://docs.yohaku.app
- Email: support@yohaku.app

