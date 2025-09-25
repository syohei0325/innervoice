# 📊 Neon データベース作成ガイド（画像付き手順）

## Step 2: Neon データベース作成（5分）

### 🌐 ブラウザで実行する手順

**❌ GitHubではありません！**  
**✅ 別のサービス「Neon」のウェブサイトで作業します**

---

## 📱 手順1: Neon にアクセス

1. **新しいタブを開く**
2. **https://neon.tech/** と入力してアクセス
3. 画面に「Start building」ボタンが表示される

---

## 📱 手順2: アカウント作成

1. **「Start building」をクリック**
2. **「Continue with GitHub」をクリック**（GitHubアカウントで登録）
3. GitHub の認証画面が表示されたら **「Authorize」をクリック**

---

## 📱 手順3: プロジェクト作成

1. ダッシュボードが表示される
2. **「New Project」ボタンをクリック**
3. 以下を入力：
   - **Project name**: `innervoice-prod`
   - **Region**: プルダウンから **「Tokyo (ap-southeast-1)」** を選択
   - **Database name**: `innervoice`（最初から入力されている）
4. **「Create Project」をクリック**

---

## 📱 手順4: 接続URL取得

1. プロジェクト作成後、ダッシュボード画面が表示される
2. **「Connection string」** または **「Connection details」** を探す
3. **長いURL（postgresql://から始まる）をコピー**

例：
```
postgresql://username:password@ep-abc123.aws.neon.tech/innervoice?sslmode=require
```

---

## ✅ 完了確認

以下が揃ったらStep 2完了：
- [ ] Neon アカウント作成済み
- [ ] プロジェクト「innervoice-prod」作成済み
- [ ] 接続URL（postgresql://...）をコピー済み

---

## 🆘 よくあるトラブル

**Q:「Start building」ボタンが見つからない**
A: ページを再読み込みするか、https://console.neon.tech/ に直接アクセス

**Q: Region で Tokyo が見つからない**
A: 「ap-southeast-1」で検索するか、Asia の項目を確認

**Q: 接続URLがどこにあるかわからない**
A: ダッシュボードの「Connection」「Database」「Settings」タブを確認

---

## 🚀 次のステップ

接続URLを取得できたら：
1. **安全な場所にコピー保存**（後で使用）
2. **Step 3: OpenAI API キー取得** に進む

**何か困ったことがあれば、スクリーンショットを送ってください！**
