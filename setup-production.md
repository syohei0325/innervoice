# 本番環境セットアップガイド

## 1. データベース設定（Neon）
1. https://neon.tech/ でサインアップ
2. プロジェクト作成: "innervoice-prod"
3. Region: Tokyo 選択
4. 接続URL をコピー

## 2. OpenAI API キー取得
1. https://platform.openai.com/ でサインアップ
2. API Keys セクションで新しいキー作成
3. キーをコピー（一度しか表示されません）

## 3. 本番用 .env.local 作成
```env
# 本番環境変数（.env.local）
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://username:password@host/database
NEXT_PUBLIC_APP_NAME=InnerVoice
APP_TIMEZONE_DEFAULT=Asia/Tokyo
NODE_ENV=production
```

## 4. データベース初期化
```bash
# 本番DBにテーブル作成
npm run db:push

# または
npx prisma db push
```

## 5. ローカルで本番設定テスト
```bash
# 本番環境変数でローカルテスト
npm run dev

# 動作確認後
npm run build
npm start
```
