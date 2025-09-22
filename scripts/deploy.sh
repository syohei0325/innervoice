#!/bin/bash
# InnerVoice 本番デプロイスクリプト

echo "🚀 InnerVoice 本番デプロイ開始..."

# 1. 環境変数チェック
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL が設定されていません"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY が設定されていません"
    exit 1
fi

echo "✅ 環境変数確認完了"

# 2. データベースセットアップ
echo "📊 データベース初期化中..."
npx prisma generate
npx prisma db push

if [ $? -eq 0 ]; then
    echo "✅ データベース初期化完了"
else
    echo "❌ データベース初期化失敗"
    exit 1
fi

# 3. ビルドテスト
echo "🔨 アプリケーションビルド中..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ ビルド成功"
else
    echo "❌ ビルド失敗"
    exit 1
fi

echo "🎉 デプロイ準備完了！"
echo "Vercel URL: https://your-app.vercel.app"
