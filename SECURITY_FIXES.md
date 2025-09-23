# 🚨 セキュリティ修正必須項目

## Critical Issues（公開前に必ず修正）

### 1. **環境変数検証不足**
```typescript
// 現状: app/api/propose/route.ts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // undefined チェックなし
});

// 修正後: 環境変数検証を追加
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured');
}
```

### 2. **入力値検証不足**
```typescript
// 現状: 長い入力でAPI料金爆発のリスク
const { text, context } = await request.json();

// 修正後: 文字数制限・サニタイズ
if (text.length > 1000) {
  return NextResponse.json({ error: 'Input too long' }, { status: 400 });
}
```

### 3. **レート制限なし**
```typescript
// 現状: 無制限API呼び出し可能
// 修正後: レート制限実装（1分間に10回まで等）
```

### 4. **エラー情報漏洩**
```typescript
// 現状: 詳細エラーをクライアントに返している
console.error('Error in /api/propose:', error);

// 修正後: 本番では一般的なエラーメッセージのみ
```

### 5. **SQLインジェクション対策**
```typescript
// 現状: Prisma使用でリスクは低いが、手動クエリ注意
// 修正後: すべてのDB操作をPrisma経由で実行確認
```

## Medium Priority

### 6. **CORS設定**
```typescript
// 本番では適切なCORS設定が必要
```

### 7. **CSP (Content Security Policy)**
```typescript
// XSS攻撃対策のためのCSP設定
```
