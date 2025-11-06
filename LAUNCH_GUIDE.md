# 🚀 Yohaku ローンチガイド

## ✅ 完了した実装

### 1. コア機能
- ✅ 7秒入力 → 2提案 → 1確定
- ✅ .ics自動生成・ダウンロード
- ✅ 音声入力（Web Speech API）
- ✅ Value Receipt（FEA表示）
- ✅ エラーハンドリング（フォールバック提案）

### 2. 新API
- ✅ `/api/approve` - ConfirmOS承認
- ✅ `/api/vibe` - Vibe Profile
- ✅ `/api/nudges` - Nudge一覧
- ✅ `/api/availability` - 空き時間スロット
- ✅ `/api/relationship/gaps` - 関係性グラフ

### 3. UI/UX
- ✅ ランディングページ改善
- ✅ LoadingSpinner
- ✅ ValueReceipt トースト
- ✅ 音声入力UI

### 4. インフラ
- ✅ Vercel Analytics統合
- ✅ SEO・OGP設定
- ✅ Prismaスキーマ拡張（10+新テーブル）

### 5. ドキュメント
- ✅ 14個の新ドキュメント作成
- ✅ README更新（Action Cloud追加）

---

## 📋 あなたがすべきこと（優先順位順）

### **ステップ1: 環境変数設定（5分）** ⚠️ 必須

Vercelダッシュボードで環境変数を設定：

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables

以下を追加：

```env
# OpenAI API Key（必須）
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Database URL（必須）
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# アプリ設定
NEXT_PUBLIC_APP_NAME=Yohaku
APP_TIMEZONE_DEFAULT=Asia/Tokyo

# Memory Provider（オプション）
YOHAKU_MEMORY_PROVIDER=core
```

4. **Redeploy** ボタンをクリック

---

### **ステップ2: データベースセットアップ（5分）** ⚠️ 必須

Supabaseで新しいテーブルを作成：

1. https://supabase.com/dashboard にアクセス
2. プロジェクトを選択
3. SQL Editor → New Query

以下のSQLを実行：

```bash
# ローカルでPrisma Clientを生成
npm run db:generate

# データベースにテーブルを作成
npm run db:push
```

または、Supabase SQL Editorで直接実行：

```sql
-- Prismaスキーマから生成されたSQLを実行
-- （詳細は prisma/schema.prisma を参照）
```

---

### **ステップ3: デプロイ確認（2分）**

1. Vercelダッシュボードで **Deployments** を確認
2. 最新のデプロイが **Ready** になるまで待つ（約2-3分）
3. **Visit** ボタンをクリックして本番環境を確認

---

### **ステップ4: 動作確認（5分）**

本番環境で以下を確認：

1. ✅ ページが表示される
2. ✅ 「明日朝30分ランニング」と入力
3. ✅ 2つの提案が表示される
4. ✅ 確定ボタンをクリック
5. ✅ Value Receipt（緑のトースト）が表示される
6. ✅ `.ics`ファイルがダウンロードされる

**音声入力のテスト:**
1. ✅ 🎤 ボタンをクリック
2. ✅ 「明日朝30分ランニング」と話す
3. ✅ 自動で提案が表示される

---

### **ステップ5: 初期ユーザー獲得（1週間）**

#### **自分で使う（毎日3回以上）**
- 朝の段取り
- 移動前の調整
- 就寝前のタスク登録

#### **家族・友人に配布（5-10人）**
1. URLを共有
2. フィードバックを収集
3. 改善点をメモ

#### **SNSで共有**
```
🚀 Yohaku をローンチしました！

AIがあなたの代わりに必要な電話を行い、
その結果を予定・連絡・リマインドへ1タップで落とし込む。

7秒で「決めて、置く」。
スクリーンから人を解放する相棒。

https://your-app-url.vercel.app

#Yohaku #AI #生産性 #ライフハック
```

---

## 📊 計測すべきKPI

### **Week 1-2: MVP検証**
- [ ] D1リテンション ≥ 60%
- [ ] D7リテンション ≥ 35%
- [ ] 日あたり確定 ≥ 3回
- [ ] NPS ≥ 50

### **Week 3-4: PMF検証**
- [ ] D30リテンション ≥ 25%
- [ ] vMB中央値 ≥ 6分/日
- [ ] FEA ≥ 10件/週
- [ ] 紹介率 ≥ 0.3（1人が0.3人を紹介）

---

## 🔧 トラブルシューティング

### **Q1: 提案が生成されない**
**A:** OpenAI APIキーが正しく設定されているか確認
```bash
# Vercel環境変数を確認
Settings → Environment Variables → OPENAI_API_KEY
```

### **Q2: データベースエラーが出る**
**A:** DATABASE_URLが正しく設定されているか確認
```bash
# Supabase接続URLを確認
Settings → Database → Connection string
```

### **Q3: 音声入力が動かない**
**A:** 対応ブラウザを使用しているか確認
- ✅ Chrome
- ✅ Edge
- ✅ Safari
- ❌ Firefox（未対応）

### **Q4: Vercel Analyticsが表示されない**
**A:** デプロイ後24時間以内は表示されない場合があります。

---

## 🎯 次のステップ

### **Week 1-2: 安定化**
- [ ] 毎日自分で使う
- [ ] バグを修正
- [ ] フィードバックを収集

### **Week 3-4: 機能追加**
- [ ] ユーザー認証（NextAuth.js）
- [ ] 通話機能（Twilio/Telnyx）
- [ ] MVP+（Intent Bus & Confirm once Multi-Action）

### **Month 2-3: PMF検証**
- [ ] D7リテンション ≥ 35%を達成
- [ ] 100人のユーザー獲得
- [ ] Product Hunt投稿

---

## 📞 サポート

問題が発生した場合：
1. GitHub Issuesで報告
2. ドキュメントを確認（`docs/`配下）
3. コミュニティに質問

---

## 🎉 おめでとうございます！

Yohakuのローンチ準備が完了しました！

**今すぐやるべきこと:**
1. ✅ Vercel環境変数設定
2. ✅ データベースセットアップ
3. ✅ 本番環境で動作確認
4. ✅ 自分で1週間使う
5. ✅ 5-10人に配布

頑張ってください！🚀

