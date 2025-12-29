# Action Cloud セットアップチェックリスト

## ✅ 完了済み

- [x] Prisma schema更新（Action Cloud用）
- [x] データベースマイグレーション実行
- [x] Phase Guard実装（SEALED機能の制限）
- [x] 新API実装（/v1/plan, /v1/approve, /v1/confirm）
- [x] Receiver Starter Kit作成
- [x] ダッシュボードUI作成
- [x] ドキュメント作成

---

## ⚠️ 次にやること（あなたが手動で実行）

### 1. 環境変数の設定

`.env.local`ファイルを編集して、以下を追加：

```env
# Phase設定（必須）
YOHAKU_PHASE=phase1

# Webhook署名シークレット（必須）
# ランダムな文字列を生成してください
WEBHOOK_SIGNING_SECRET=GENERATE_RANDOM_STRING_HERE

# PoEx署名シークレット（必須）
# ランダムな文字列を生成してください
YOHAKU_SERVER_SECRET=GENERATE_RANDOM_STRING_HERE

# リージョン
YOHAKU_REGION=JP
```

**シークレット生成方法:**
```bash
# macOS/Linux
openssl rand -hex 32

# または
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. 開発サーバー起動

```bash
npm run dev
```

### 3. ダッシュボードでテスト

ブラウザで以下を開く：
```
http://localhost:3000/dashboard
```

**テスト手順:**
1. 入力欄に「Send webhook to https://example.com/webhook when order is created」と入力
2. 「Generate Plan」をクリック
3. Plan Response が表示されたら「Approve」をクリック
4. Approval Response が表示されたら「Confirm」をクリック
5. Confirm Response が表示されれば成功！

### 4. Phase Guardの動作確認

電話機能（SEALED）が正しく拒否されるか確認：

```bash
# call.place を含むプランを生成しようとすると、
# phase1 では SEALED エラーが返るはず
```

---

## 📋 phase1の制約（SEALED機能）

以下の機能は**設計/スタブのみ**で、実行時に403エラーが返ります：

- ❌ Phone（call.place実行）
- ❌ Proactive/Nudge実行
- ❌ Relationship Graph実行
- ❌ External Memory import/sync
- ❌ OS Deep Integrations実行
- ❌ Marketplace / Connector SDK一般公開

**phase1で許可される機能:**
- ✅ webhook.dispatch
- ✅ calendar.hold.create

---

## 🎯 30日スコアカード（目標）

phase1の成功条件：

| 指標 | 目標値 | 現在値 |
|------|--------|--------|
| 設計パートナー | 3社（週次利用） | 0社 |
| confirm | >= 500 / week | 0 |
| approve→confirm conversion | >= 60% | - |
| webhook_delivery_success | >= 99% | - |
| ledger_integrity | >= 99.9% | - |
| misexec_pct | < 0.5% | - |
| Receiver Kit導入時間 | <= 30分（2社以上） | - |

---

## 📚 次のマイルストーン

### Week 1-2: 基盤整備
- [ ] 環境変数設定完了
- [ ] ダッシュボードでテスト成功
- [ ] Receiver Starter Kitで受信テスト成功

### Week 3-4: 設計パートナー獲得
- [ ] ICP（最初の3社）を定義
- [ ] アウトリーチ開始
- [ ] 1社目との初回ミーティング

### Week 5-6: 導入支援
- [ ] Receiver Starter Kitで30分導入を実証
- [ ] 初回confirm実行
- [ ] フィードバック収集

### Week 7-8: 品質改善
- [ ] webhook_delivery_success >= 99% 達成
- [ ] ledger_integrity >= 99.9% 達成
- [ ] misexec_pct < 0.5% 達成

---

## 🚨 トラブルシューティング

### データベース接続エラー
```bash
# DATABASE_URL が正しいか確認
cat .env.local | grep DATABASE_URL

# Prismaクライアント再生成
npm run db:generate
```

### OpenAI API エラー
```bash
# OPENAI_API_KEY が正しいか確認
cat .env.local | grep OPENAI_API_KEY

# APIキーが有効か確認
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Phase Guard エラー
```bash
# YOHAKU_PHASE が phase1 に設定されているか確認
cat .env.local | grep YOHAKU_PHASE

# phase1 で許可されるアクション:
# - webhook.dispatch
# - calendar.hold.create
```

---

## 📞 サポート

質問や問題がある場合：

1. **ドキュメント確認**
   - QUICKSTART.md
   - docs/PRD_PHASE1.md
   - docs/CONFORMANCE_SUITE.md

2. **ログ確認**
   - ブラウザのコンソール
   - ターミナルのログ
   - データベースのログ

3. **コミュニティ**
   - GitHub Issues
   - Email: support@yohaku.app

---

## ✅ 完了確認

すべて完了したら、このチェックリストを更新してください：

- [ ] 環境変数設定完了
- [ ] 開発サーバー起動成功
- [ ] ダッシュボードでテスト成功
- [ ] Phase Guardの動作確認完了
- [ ] Receiver Starter Kitのテスト完了

**すべて完了したら、設計パートナー獲得に進みましょう！** 🚀










