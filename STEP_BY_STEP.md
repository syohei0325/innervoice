# 🚀 InnerVoice 公開手順（実行順序）

## ✅ Step 1: GitHub リポジトリ作成（5分）

### 1-1. GitHub でリポジトリ作成
1. https://github.com/new にアクセス
2. Repository name: `innervoice`
3. Description: `InnerVoice - 7秒で決めて、置く`  
4. **Public** を選択
5. "Create repository" をクリック

### 1-2. ローカルからプッシュ
GitHub で作成後、画面に表示されるコマンドを実行：

```bash
# 例（YOUR_USERNAMEを実際のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/innervoice.git
git branch -M main
git push -u origin main
```

---

## ⏳ Step 2: OpenAI API キー取得（5分）

### 2-1. OpenAI アカウント作成
1. https://platform.openai.com/ にアクセス
2. サインアップ（電話番号認証必要）
3. 左サイドバー "API Keys" をクリック
4. "Create new secret key" をクリック
5. Name: "InnerVoice-Production"
6. **キーをコピー**（一度しか表示されません！）

### 2-2. 使用量制限設定（重要）
1. 左サイドバー "Settings" → "Limits"
2. Hard limit: $20/month（推奨）
3. Soft limit: $10/month（推奨）

---

## ⏳ Step 3: Neon データベース作成（5分）

### 3-1. Neon アカウント作成
1. https://neon.tech/ にアクセス
2. "Start building" → GitHub でサインアップ
3. "New Project" をクリック
4. Project name: `innervoice-prod`
5. Region: **Tokyo (ap-southeast-1)** を選択
6. "Create Project" をクリック

### 3-2. 接続URL取得
1. ダッシュボードで "Connection string" をコピー
2. 形式: `postgresql://username:password@ep-xxx.aws.neon.tech/innervoice?sslmode=require`

---

## ⏳ Step 4: Vercel デプロイ（10分）

### 4-1. Vercel アカウント作成
1. https://vercel.com/ にアクセス
2. "Start Deploying" → **GitHub でサインアップ**
3. GitHub アカウント連携を承認

### 4-2. プロジェクトインポート
1. Vercel ダッシュボードで "New Project"
2. GitHub から `innervoice` リポジトリを選択
3. Framework: **Next.js** （自動検出）
4. Root Directory: `./`（デフォルト）
5. **"Deploy" をクリック**

### 4-3. 環境変数設定（重要）
デプロイ後、プロジェクト設定で環境変数を追加：

1. プロジェクト → Settings → Environment Variables
2. 以下を追加：

```
Name: OPENAI_API_KEY
Value: sk-proj-あなたの実際のキー

Name: DATABASE_URL  
Value: postgresql://あなたのNeon接続URL

Name: NEXT_PUBLIC_APP_NAME
Value: InnerVoice

Name: APP_TIMEZONE_DEFAULT
Value: Asia/Tokyo
```

3. "Save" をクリック
4. **"Redeploy" をクリック**（環境変数反映のため）

---

## ⏳ Step 5: 本番テスト（5分）

### 5-1. 本番URL確認
1. Vercel ダッシュボードで本番URLをコピー
2. 例: `https://innervoice-abc123.vercel.app`

### 5-2. 動作テスト
ブラウザで本番URLにアクセス：

1. ✅ ページが表示される
2. ✅ テキスト入力: "明日朝30分ランニング"
3. ✅ "2つの提案を取得" をクリック
4. ✅ 2つの提案が表示される
5. ✅ 提案をクリック → ConfirmSheet 表示
6. ✅ "Confirm once" → 実行結果表示
7. ✅ .ics ダウンロード動作

### 5-3. 本番テストスクリプト実行（オプション）
```bash
# ローカルで実行
PRODUCTION_URL=https://your-actual-url.vercel.app node scripts/production-test.js
```

---

## 🎉 Step 6: 公開完了

### 公開URL確認
- 本番URL: `https://your-app.vercel.app`
- 独自ドメイン設定も可能（Vercel Settings → Domains）

### 次のアクション
1. **SNS シェア**: Twitter/LinkedIn でプロダクト紹介
2. **友人テスト**: 5-10名に試してもらう
3. **フィードバック収集**: 使用感をヒアリング
4. **Product Hunt 投稿**: 新プロダクトとして登録

---

## 🆘 トラブル時の対処

### よくある問題

**Q: Vercel デプロイが失敗する**
A: 環境変数が設定されているか確認。特に OPENAI_API_KEY と DATABASE_URL

**Q: "環境変数エラー"が出る**  
A: Vercel Settings → Environment Variables で値を再確認

**Q: API エラーが出る**
A: OpenAI の使用量制限・クレジット残高を確認

**Q: データベースエラー**
A: Neon ダッシュボードでデータベースステータス確認

---

## 📞 サポート

問題が解決しない場合：
1. エラーメッセージをスクリーンショット
2. 実行した手順を詳しく記録  
3. 技術サポートに相談

**成功を心から応援しています！** 🚀




