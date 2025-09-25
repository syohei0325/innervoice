# 🟢 Supabase データベース作成ガイド（推奨）

## Step 2: Supabase データベース作成（5分）

### 🌟 Supabase の方が簡単で使いやすいです！

---

## 📱 手順1: Supabase にアクセス

1. **新しいタブを開く**
2. **https://supabase.com/** と入力してアクセス
3. **「Start your project」** をクリック

---

## 📱 手順2: アカウント作成

1. **「Sign up」をクリック**
2. **「Continue with GitHub」をクリック**（GitHubアカウントで登録）
3. GitHub の認証画面が表示されたら **「Authorize supabase」をクリック**

---

## 📱 手順3: プロジェクト作成

1. ダッシュボードが表示される
2. **「New project」ボタンをクリック**
3. 以下を入力：
   - **Name**: `innervoice-prod`
   - **Database Password**: 強いパスワードを入力（自動生成ボタンを使用推奨）
   - **Region**: **「Northeast Asia (Tokyo)」** を選択
   - **Pricing Plan**: **「Free」** を選択
4. **「Create new project」をクリック**

⏰ **約2-3分でプロジェクトが作成されます**

---

## 📱 手順4: 接続URL取得

1. プロジェクト作成後、左サイドバーの **「Settings」** をクリック
2. **「Database」** をクリック
3. **「Connection string」** セクションを探す
4. **「URI」** をコピー

例：
```
postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres
```

---

## ✅ Supabase の利点

- **日本語対応**: UIが分かりやすい
- **無料枠が大きい**: 月500MB、2つのプロジェクト
- **管理画面**: データベースの中身が見やすい
- **自動バックアップ**: 無料プランでも7日間保持

---

## 🔧 Prisma 設定も同じ

接続URLさえ取得できれば、Prisma の設定は **Neon と全く同じ** です：

```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

---

## ✅ 完了確認

以下が揃ったらStep 2完了：
- [ ] Supabase アカウント作成済み
- [ ] プロジェクト「innervoice-prod」作成済み
- [ ] 接続URL（postgresql://...）をコピー済み

---

## 🚀 次のステップ

接続URLを取得できたら：
1. **安全な場所にコピー保存**（後で使用）
2. **Step 3: OpenAI API キー取得** に進む

**Supabase は初心者にも優しいので、おすすめです！** 🎉
