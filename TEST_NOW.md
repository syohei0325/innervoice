# 🚀 10/10実証テスト - 今すぐ実行

このガイドは、**queued → succeeded を実証する**ための最短手順です。

---

## ⚠️ 重要: 全プロセス再起動必須

シークレットをローテーションしたため、既に起動中のプロセスは全て停止してください：
- Action Cloud（`npm run dev`）
- Webhook Worker（`npm run webhook-worker`）
- Receiver Kit

---

## 🎯 4ターミナル起動（コピペ用）

### ターミナルA: Action Cloud

```bash
cd /Users/koyamasyohei/Yohaku
npm run dev
```

**確認**: `http://localhost:3000` で起動

---

### ターミナルB: Webhook Worker（1秒ポーリング）

```bash
cd /Users/koyamasyohei/Yohaku
WEBHOOK_POLL_INTERVAL_MS=1000 npm run webhook-worker
```

**期待する出力**:
```
[WEBHOOK_WORKER] Starting...
[WEBHOOK_WORKER] Poll interval: 1000ms
[WEBHOOK_WORKER] Max attempts: 8
[WEBHOOK_WORKER] Batch size: 10
[WEBHOOK_WORKER] DB host: localhost:5432
[WEBHOOK_WORKER] Webhook secret prefix: e029d7...
```

**✅ 確認ポイント**:
- `DB host: localhost:5432` が表示される
- `Webhook secret prefix` が表示される（dotenvロード成功）

---

### ターミナルC: Receiver Kit

```bash
cd /Users/koyamasyohei/Yohaku/receiver-starter-node
export WEBHOOK_SIGNING_SECRET="$(grep WEBHOOK_SIGNING_SECRET /Users/koyamasyohei/Yohaku/.env | cut -d= -f2)"
PORT=4001 npm start
```

**期待する出力**:
```
Yohaku Receiver Starter Kit
Listening on port 4001
Webhook signing secret: e029d7d1...
```

**✅ 確認ポイント**:
- `Webhook signing secret` の先頭6桁がターミナルBと一致

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
  ]
}
```

---

## ✅ 10/10実証完了の判定

### 1. Receiver側のログ（ターミナルC）

```
POST /webhook
✅ Signature verified
✅ Timestamp valid (within 5 minutes)
✅ Idempotency key stored: job_...
Response: 200 OK
```

### 2. Worker側のログ（ターミナルB）

```
[WEBHOOK_WORKER] Processing 1 jobs...
[WEBHOOK_WORKER] ✅ Job job_... succeeded
```

### 3. データベース確認（必須）

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/check-webhook-jobs.sh
```

**期待する結果**:
```
   job_id    |  status   | attempts | last_error | updated_at
-------------+-----------+----------+------------+------------
 job_...     | succeeded |        1 | (none)     | 16:30:45
```

**✅ `status = succeeded` が出たら10/10実証完了！**

---

## 🐛 トラブルシューティング

### 症状1: `queued`のまま減らない

**原因**: Workerが別DBを見ている / dotenv読めていない

**確認**:
```bash
./scripts/check-webhook-jobs.sh
```

`queued`が増えているなら、Workerログの `DB host` が `localhost:5432` になっているか確認。

---

### 症状2: `failed`になる

**確認**:
```bash
./scripts/check-webhook-jobs.sh
```

`last_error`を確認：
- `ECONNREFUSED` → Receiverが起動していない / ポート違い
- `Signature mismatch` → Secret不一致
- `Invalid URL` → URL登録ミス

---

### 症状3: `delivering`で止まる

Receiverのログが動いているか確認。動いていないならURL/接続の問題。

---

## 📸 10/10実証完了後のスクリーンショット4枚

1. **テストスクリプト成功ログ**（ターミナルD）
   - `receipt_id` が表示されている画面

2. **Receiver署名検証成功ログ**（ターミナルC）
   - `✅ Signature verified` が表示されている画面

3. **データベースでsucceeded確認**
   - `./scripts/check-webhook-jobs.sh` の出力
   - `status = succeeded` が表示されている画面

4. **Receipt（KYA表示あり）**
   - ブラウザ: `http://localhost:3000` を開いて、Receiptを表示

---

## 🎯 詰まった時に貼る情報（3点セット）

1. **Workerログ（最後の20行）** - ターミナルBの出力
2. **Receiverログ（最後の20行）** - ターミナルCの出力
3. **webhook_jobs確認**:
```bash
./scripts/check-webhook-jobs.sh
```

---

**次のステップ**: 10/10実証完了後、Conformance Suite v0.3 自動テスト化へ

