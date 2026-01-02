# 🚀 実配送テスト クイックスタート

このガイドは、**queued → succeeded を実証する**ための最短手順です。

---

## 📋 前提条件

- ✅ PostgreSQL起動中（`brew services list | grep postgresql`）
- ✅ `.env` ファイルが設定済み
- ✅ シークレットがローテーション済み

---

## 🎯 4ターミナル起動手順

### ターミナルA: Action Cloud

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

**確認**: ブラウザで `http://localhost:3000` を開く

---

### ターミナルB: Webhook Worker

```bash
cd /Users/koyamasyohei/Yohaku
npm run webhook-worker
```

**期待する出力**:
```
[WEBHOOK_WORKER] Starting...
[WEBHOOK_WORKER] Poll interval: 5000ms
[WEBHOOK_WORKER] Max attempts: 8
[WEBHOOK_WORKER] Batch size: 10
[WEBHOOK_WORKER] DB host: localhost:5432
[WEBHOOK_WORKER] Webhook secret prefix: e029d7...
```

**重要**: `DB host: localhost:5432` と `Webhook secret prefix` が表示されることを確認

---

### ターミナルC: Receiver Kit

```bash
cd /Users/koyamasyohei/Yohaku/receiver-starter-node
export WEBHOOK_SIGNING_SECRET="$(cat /Users/koyamasyohei/Yohaku/.env | grep WEBHOOK_SIGNING_SECRET | cut -d= -f2)"
PORT=4001 npm start
```

**期待する出力**:
```
Yohaku Receiver Starter Kit
Listening on port 4001
Webhook signing secret: e029d7d1...
```

**確認**: `Webhook signing secret` の先頭6桁がターミナルBと一致すること

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

## ✅ 成功判定（これが10/10実証完了）

### 1. Receiver側のログ（ターミナルC）

```
POST /webhook
Headers: {...}
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
psql -d yohaku -c "
SELECT job_id, status, attempts, last_error, updated_at 
FROM webhook_jobs 
ORDER BY created_at DESC 
LIMIT 10;
"
```

**期待する結果**:
```
   job_id    |  status   | attempts | last_error | updated_at
-------------+-----------+----------+------------+--------------
 job_...     | succeeded |        1 |            | 2026-01-02...
```

**✅ これが出たら10/10実証完了！**

---

## 🐛 トラブルシューティング（症状別）

### A) `queued`のまま動かない

**原因**:
- Workerが別のDBを見ている
- Workerがpoll対象のstatus条件ミス

**確認**:
```bash
# Worker起動ログで DB host を確認
# ターミナルBで以下を実行
node -e "console.log(process.env.DATABASE_URL || 'NO_DATABASE_URL')"

# DBで確認
psql -d yohaku -c "SELECT status, count(*) FROM webhook_jobs GROUP BY 1;"
```

---

### B) `delivering`で止まる / `failed`になる

**確認**:
```bash
psql -d yohaku -c "
SELECT job_id, status, attempts, last_error 
FROM webhook_jobs 
ORDER BY created_at DESC 
LIMIT 5;
"
```

**よくある原因**:
- Receiverが起動していない / ポート違い → `connection refused`
- URL完全一致ズレ（`/webhook` vs `/`）
- 署名secret不一致 → `Signature mismatch`
- Timestamp skew（時間ズレ）

**解決策**: Receiverログで `✅ Signature verified` が出るかを確認

---

### C) 署名secret不一致

**確認**:
```bash
# Action Cloud側のsecret
grep WEBHOOK_SIGNING_SECRET /Users/koyamasyohei/Yohaku/.env

# Receiver側のsecret（ターミナルCで実行）
echo $WEBHOOK_SIGNING_SECRET
```

**解決策**: 両方が一致していることを確認。不一致の場合はReceiver Kitを再起動

---

## 📸 スクリーンショット4枚（30分導入デモ用）

1. **テストスクリプト成功ログ**（ターミナルD）
   - `receipt_id` が表示されている画面

2. **Receiver署名検証成功ログ**（ターミナルC）
   - `✅ Signature verified` が表示されている画面

3. **データベースでsucceeded確認**
   - `psql` コマンドの出力
   - `status = succeeded` が表示されている画面

4. **Receipt（KYA表示あり）**
   - ブラウザ: `http://localhost:3000` を開いて、Receiptを表示
   - KYA情報（executor_api_key_id, principal_user_id）が表示されている画面

---

## 🎯 詰まった時に貼る情報（3点セット）

1. **Workerログ（最後の20行）**
```bash
# ターミナルBの出力をコピー
```

2. **Receiverログ（最後の20行）**
```bash
# ターミナルCの出力をコピー
```

3. **webhook_jobs の最新5件**
```bash
psql -d yohaku -c "
SELECT job_id, status, attempts, last_error 
FROM webhook_jobs 
ORDER BY created_at DESC 
LIMIT 5;
"
```

---

**次のステップ**: 10/10実証完了後、Conformance Suite v0.3 自動テスト化へ

