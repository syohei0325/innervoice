# テストガイド

## 🎯 ローカルでの Memory API 動作確認

Memory API が正しく動作するか、ローカル環境でテストする手順です。

---

## 📋 前提条件

1. PostgreSQL が起動していること
2. `.env.local` が設定されていること
3. Prisma Client が生成されていること

---

## 🚀 ステップ1: 環境準備

### 1.1 環境変数を確認

`.env.local` に以下が設定されているか確認：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yohaku
YOHAKU_MEMORY_PROVIDER=core
```

### 1.2 Prisma セットアップ

```bash
# Prisma Client を生成
npm run db:generate

# データベースをマイグレーション
npm run db:push
```

### 1.3 開発サーバー起動

```bash
npm run dev
```

→ http://localhost:3000 で起動します。

---

## 🧪 ステップ2: Memory API をテスト

### 方法1: curl でテスト

#### 2.1 Memory を保存（PUT）

```bash
curl -X POST http://localhost:3000/api/memory/put \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "preference",
    "key": "test.coffee.sugar",
    "value": 0,
    "source": "manual",
    "confidence": 1.0,
    "ttl_days": 365
  }'
```

**期待される結果:**
```json
{
  "ok": true,
  "confidence": 1.0,
  "key": "test.coffee.sugar"
}
```

---

#### 2.2 Memory を検索（QUERY）

```bash
curl -X POST http://localhost:3000/api/memory/query \
  -H "Content-Type": application/json" \
  -d '{
    "query": "coffee",
    "limit": 10
  }'
```

**期待される結果:**
```json
{
  "items": [
    {
      "key": "test.coffee.sugar",
      "value": 0,
      "confidence": 1.0,
      "source": "core",
      "evidence": ["memories.preference"],
      "created_at": "2025-10-20T10:00:00.000Z"
    }
  ],
  "count": 1,
  "latency_ms": 45
}
```

---

#### 2.3 Memory をエクスポート（EXPORT）

```bash
curl http://localhost:3000/api/memory/export
```

**期待される結果:**
```json
{
  "exported_at": "2025-10-20T10:00:00.000Z",
  "total_count": 1,
  "items": [
    {
      "kind": "preference",
      "key": "test.coffee.sugar",
      "value": 0,
      "source": "manual",
      "confidence": 1.0,
      "created_at": "2025-10-20T10:00:00.000Z",
      "updated_at": "2025-10-20T10:00:00.000Z"
    }
  ],
  "latency_ms": 85
}
```

---

#### 2.4 Provider 状態を確認（STATUS）

```bash
curl http://localhost:3000/api/provider/status
```

**期待される結果:**
```json
{
  "current": "core",
  "healthy": true,
  "latency_ms": 12,
  "last_check": "2025-10-20T10:00:00.000Z",
  "provider_info": {
    "name": "core",
    "version": "1.0.0"
  }
}
```

---

#### 2.5 Memory を削除（FORGET）

```bash
curl -X POST http://localhost:3000/api/memory/forget \
  -H "Content-Type: application/json" \
  -d '{
    "key": "test.coffee.sugar"
  }'
```

**期待される結果:**
```json
{
  "ok": true,
  "deleted_keys": ["test.coffee.sugar"],
  "count": 1
}
```

---

### 方法2: Playwright E2E テストで確認

```bash
# E2Eテストを実行
npm run test
```

**期待される結果:**
```
✓ Memory API > PUT /api/memory/put - Memory を保存できる
✓ Memory API > QUERY /api/memory/query - Memory を検索できる
✓ Memory API > FORGET /api/memory/forget - Memory を削除できる
✓ Memory API > EXPORT /api/memory/export - すべての Memory をエクスポートできる
✓ Memory API > PURGE /api/memory/purge - 確認文字列なしではエラー
✓ Memory API > PURGE /api/memory/purge - 正しい確認文字列で削除成功
✓ Memory API > Provider Status /api/provider/status - プロバイダ状態を取得できる

All tests passed! (7/7)
```

---

### 方法3: ブラウザの開発者ツールで確認

1. ブラウザで http://localhost:3000 を開く
2. 開発者ツール（F12）を開く
3. Console タブで以下を実行：

```javascript
// Memory を保存
await fetch('/api/memory/put', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    kind: 'preference',
    key: 'browser.test',
    value: 'hello',
  }),
});

// Memory を検索
const res = await fetch('/api/memory/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'browser',
  }),
});
console.log(await res.json());

// Provider 状態を確認
const status = await fetch('/api/provider/status');
console.log(await status.json());
```

---

## 🐛 トラブルシューティング

### エラー: `Cannot find module '@prisma/client'`

**解決策:**
```bash
npm run db:generate
```

---

### エラー: `Error: P1001: Can't reach database server`

**解決策:**
1. PostgreSQL が起動しているか確認
2. `DATABASE_URL` が正しいか確認

```bash
# PostgreSQL の状態確認（Mac）
brew services list | grep postgresql

# PostgreSQL を起動（Mac）
brew services start postgresql@14
```

---

### エラー: `Table 'memories' does not exist`

**解決策:**
```bash
# データベーステーブルを作成
npm run db:push
```

---

### エラー: `500 Internal Server Error`

**解決策:**
1. サーバーログを確認（ターミナル）
2. データベース接続を確認
3. Prisma Client を再生成

```bash
npm run db:generate
```

---

## ✅ 動作確認チェックリスト

以下をすべて確認してください：

- [ ] `POST /api/memory/put` で Memory を保存できる
- [ ] `POST /api/memory/query` で Memory を検索できる
- [ ] `POST /api/memory/forget` で Memory を削除できる
- [ ] `GET /api/memory/export` で全 Memory をエクスポートできる
- [ ] `DELETE /api/memory/purge` で全 Memory を削除できる
- [ ] `GET /api/provider/status` で Provider 状態を取得できる
- [ ] TypeScript 型チェックが通る（`npm run type-check`）
- [ ] ESLint が通る（`npm run lint`）
- [ ] E2E テストが通る（`npm run test`）

---

## 🚢 デプロイ確認

### Vercel での確認

1. https://vercel.com/your-username/yohaku にアクセス
2. 最新のデプロイが成功しているか確認
3. デプロイされたURL（例: https://yohaku-xxx.vercel.app）にアクセス
4. 同じ API テストを実行：

```bash
# 本番環境でテスト
curl https://yohaku-xxx.vercel.app/api/provider/status
```

**期待される結果:**
```json
{
  "current": "core",
  "healthy": true,
  ...
}
```

---

**ローカルテストで品質を担保し、自信を持ってデプロイ！** 🚀✨

