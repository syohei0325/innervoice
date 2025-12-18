# Yohaku Action Cloud - クイックスタートガイド

## 🚀 5分で始める Action Cloud

### ステップ1: 環境変数設定

`.env.local`を編集して以下を設定：

```env
# Phase設定（必須）
YOHAKU_PHASE=phase1

# データベース（必須）
DATABASE_URL=postgresql://user:password@localhost:5432/yohaku

# OpenAI API Key（必須）
OPENAI_API_KEY=sk-your-openai-api-key-here

# Webhook署名シークレット（必須）
WEBHOOK_SIGNING_SECRET=your-secret-here-change-in-production

# PoEx署名シークレット（必須）
YOHAKU_SERVER_SECRET=your-server-secret-here

# リージョン
YOHAKU_REGION=JP
DEFAULT_TZ=Asia/Tokyo
```

### ステップ2: データベースセットアップ

```bash
# Prismaクライアント生成
npm run db:generate

# データベーススキーマ適用
npm run db:push
```

### ステップ3: 開発サーバー起動

```bash
npm run dev
```

### ステップ4: ダッシュボードを開く

ブラウザで以下を開く：

```
http://localhost:3000/dashboard
```

---

## 📝 API使用例

### 1. Plan生成

```bash
curl -X POST http://localhost:3000/api/v1/plan \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Send webhook to https://example.com/webhook when order is created",
    "context": {
      "tenant_id": "tenant_001",
      "user_id": "user_001",
      "tz": "Asia/Tokyo"
    }
  }'
```

**レスポンス例:**
```json
{
  "plans": [
    {
      "id": "pl_abc123",
      "summary": "Send webhook on order creation",
      "actions": [
        {
          "action": "webhook.dispatch",
          "target_url": "https://example.com/webhook",
          "event": "order.created",
          "body": {...}
        }
      ],
      "confirm_sheet": {...}
    }
  ],
  "latency_ms": 850,
  "phase": "phase1"
}
```

### 2. 承認ID発行

```bash
curl -X POST http://localhost:3000/api/v1/approve \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "pl_abc123",
    "tenant_id": "tenant_001",
    "user_id": "user_001"
  }'
```

**レスポンス例:**
```json
{
  "approve_id": "aprv_xyz789",
  "expires_in_sec": 600,
  "expires_at": "2025-12-17T12:10:00Z",
  "phase": "phase1"
}
```

### 3. 実行確定

```bash
curl -X POST http://localhost:3000/api/v1/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "pl_abc123",
    "approve_id": "aprv_xyz789",
    "idempotency_key": "unique_key_123"
  }'
```

**レスポンス例:**
```json
{
  "success": true,
  "results": [
    {
      "action": "webhook.dispatch",
      "status": "queued",
      "job_id": "job_def456"
    }
  ],
  "receipt_id": "rcp_ghi789",
  "metering": {
    "confirm": 1,
    "webhook_job": 1,
    "calendar_hold": 0
  }
}
```

---

## 🔒 Phase Guard（SEALED機能）

phase1では以下の機能は**実行禁止**（403エラー）：

- ❌ `call.place` - Phone実行
- ❌ `nudge.create` - Proactive実行
- ❌ `memory.import` - 外部Memory import
- ❌ `os.shortcut` - OS Deep Integrations

**テスト例:**
```bash
# call.place は phase1 で SEALED なので 403 が返る
curl -X POST http://localhost:3000/api/v1/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "pl_with_call",
    "approve_id": "aprv_xxx",
    "idempotency_key": "key_789"
  }'

# レスポンス:
# {
#   "results": [
#     {
#       "action": "call.place",
#       "status": "error",
#       "error": "SEALED_IN_PHASE1: Action \"call.place\" is SEALED in phase1..."
#     }
#   ]
# }
```

---

## 📦 Receiver Starter Kit

Webhookを受信するサンプル実装：

```bash
cd receiver-starter-node
npm install
npm start
```

詳細は `receiver-starter-node/README.md` を参照。

---

## 📊 30日スコアカード（合格条件）

phase1の成功条件：

- ✅ 設計パートナー 3社（週次利用）
- ✅ confirm >= 500 / week（3社合算）
- ✅ approve→confirm conversion >= 60%
- ✅ webhook_delivery_success >= 99%
- ✅ ledger_integrity >= 99.9%
- ✅ misexec_pct < 0.5%
- ✅ Receiver Kit で '30分導入' の実証 3社中2社以上

---

## 📚 ドキュメント

- **README.md** - プロジェクト概要
- **docs/VISION.md** - なぜExit-firstなのか
- **docs/PRD_PHASE1.md** - Phase1の要件定義
- **docs/CONFORMANCE_SUITE.md** - テスト仕様
- **docs/TREATY_V0.md** - 公開契約

---

## 🆘 トラブルシューティング

### データベース接続エラー
```bash
# DATABASE_URL が正しいか確認
echo $DATABASE_URL

# Prismaクライアント再生成
npm run db:generate
```

### Phase Guard エラー
```bash
# YOHAKU_PHASE が phase1 に設定されているか確認
echo $YOHAKU_PHASE

# phase1 で許可されるアクション:
# - webhook.dispatch
# - calendar.hold.create
```

### Webhook署名エラー
```bash
# WEBHOOK_SIGNING_SECRET が設定されているか確認
echo $WEBHOOK_SIGNING_SECRET

# 受信側でも同じシークレットを使用しているか確認
```

---

## 📞 サポート

- Email: support@yohaku.app
- Docs: https://docs.yohaku.app
- Status: https://status.yohaku.app



