# 🚀 Receiver Kit 実配送テスト手順

このガイドでは、Webhook配送が完全に動作することを確認します。

---

## 📋 前提条件

- ✅ PostgreSQL起動中
- ✅ `.env` ファイルが設定済み
- ✅ Webhook URLが `connector_configs` に登録済み

---

## 🎯 テスト手順

### ターミナルA: Action Cloud起動

```bash
cd /Users/koyamasyohei/Yohaku
npm run dev
```

**期待する出力**:
```
▲ Next.js 14.2.32
- Local:        http://localhost:3000
✓ Ready in ...ms
```

---

### ターミナルB: Webhook Worker起動

```bash
cd /Users/koyamasyohei/Yohaku
npm run webhook-worker
```

**期待する出力**:
```
[WEBHOOK_WORKER] Starting...
[WEBHOOK_WORKER] Poll interval: 5000ms
[WEBHOOK_WORKER] Max attempts: 3
[WEBHOOK_WORKER] Batch size: 10
```

---

### ターミナルC: Receiver Kit起動

```bash
cd /Users/koyamasyohei/Yohaku/receiver-starter-node
export WEBHOOK_SIGNING_SECRET="$(cat /Users/koyamasyohei/Yohaku/.env | grep WEBHOOK_SIGNING_SECRET | cut -d= -f2)"
PORT=4001 npm start
```

**期待する出力**:
```
Yohaku Receiver Starter Kit
Listening on port 4001
Webhook signing secret: 7a0ce38a...
```

---

### ターミナルD: テスト実行

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/test-action-cloud.sh
```

**期待する出力**:
```json
{
  "success": true,
  "results": [
    {
      "action": "webhook.dispatch",
      "status": "queued",
      "job_id": "job_..."
    },
    ...
  ],
  "receipt_id": "rcp_...",
  ...
}
```

---

## ✅ 成功確認

### 1. Receiver側のログ確認

ターミナルCで以下が表示されるはずです:

```
POST /webhook
Headers: {
  'x-yohaku-signature': '...',
  'x-yohaku-job-id': 'job_...',
  'x-yohaku-timestamp': '...'
}
✅ Signature verified
✅ Timestamp valid (within 5 minutes)
✅ Idempotency key stored: job_...
Response: 200 OK
```

### 2. Worker側のログ確認

ターミナルBで以下が表示されるはずです:

```
[WEBHOOK_WORKER] Processing 1 jobs...
[WEBHOOK_WORKER] ✅ Job job_... succeeded
```

### 3. データベース確認

```bash
psql -d yohaku -c "
SELECT job_id, status, attempts, last_error, succeeded_at 
FROM webhook_jobs 
ORDER BY created_at DESC 
LIMIT 5;
"
```

**期待する結果**:
```
   job_id    |  status   | attempts | last_error | succeeded_at
-------------+-----------+----------+------------+--------------
 job_...     | succeeded |        1 |            | 2026-01-02...
```

---

## 🎬 30分導入デモ用スクリーンショット

以下の4枚を撮影してください:

### 1. テストスクリプト成功ログ
- ターミナルD: `./scripts/test-action-cloud.sh` の出力
- `receipt_id` が表示されている画面

### 2. Receiver署名検証成功ログ
- ターミナルC: `✅ Signature verified` が表示されている画面

### 3. データベースでsucceeded確認
- `psql` コマンドの出力
- `status = succeeded` が表示されている画面

### 4. Receipt（KYA表示あり）
- ブラウザ: `http://localhost:3000` を開いて、Receiptを表示
- KYA情報（executor_api_key_id, principal_user_id）が表示されている画面

---

## 🐛 トラブルシューティング

### エラー: `Target URL not found in registered_urls`

**原因**: Webhook URLが `connector_configs` に登録されていない

**解決策**:
```bash
psql -d yohaku <<EOF
INSERT INTO connector_configs (id, tenant_id, connector, config_json, created_at, updated_at)
VALUES (
  'webhook_config_001',
  'tenant_demo_001',
  'webhook',
  '{"registered_urls":[{"url":"http://localhost:4001/webhook","enabled":true,"note":"dev receiver"}]}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET config_json = EXCLUDED.config_json;
EOF
```

### エラー: `Signature verification failed`

**原因**: `WEBHOOK_SIGNING_SECRET` が一致していない

**解決策**:
1. `.env` ファイルの `WEBHOOK_SIGNING_SECRET` を確認
2. Receiver起動時に同じ値を使っているか確認
3. 両方のターミナルを再起動

### エラー: `Connection refused (ECONNREFUSED)`

**原因**: Receiver Kitが起動していない、またはポートが違う

**解決策**:
1. ターミナルCでReceiver Kitが起動しているか確認
2. ポート4001で起動しているか確認
3. `connector_configs` のURLが `http://localhost:4001/webhook` になっているか確認

---

## 📊 期待する最終状態

- ✅ Action Cloud（ターミナルA）: 起動中
- ✅ Webhook Worker（ターミナルB）: ポーリング中、ジョブ配送成功
- ✅ Receiver Kit（ターミナルC）: 起動中、署名検証成功
- ✅ テスト実行（ターミナルD）: `receipt_id` 発行成功
- ✅ データベース: `webhook_jobs.status = succeeded`
- ✅ スクリーンショット4枚: 撮影完了

---

**次のステップ**: Conformance Suite v0.3 自動テスト化

