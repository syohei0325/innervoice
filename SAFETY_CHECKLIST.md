# Safety Checklist - 事故りやすいポイントを潰す

## ✅ 完了した修正

### 1. test-action-cloud.sh の shebang 修正 ✅
- **問題**: `#!/bin/bash` が壊れる可能性
- **修正**: `#!/usr/bin/env bash` に変更
- **理由**: OSが "/bin/bash#" を探しに行って死ぬのを防ぐ

### 2. Dashboard APIキー露出チェック ✅
- **状態**: 問題なし
- **確認**: ブラウザから直接 `/api/v1/*` を叩くが、APIキーは含まれていない
- **正解パターン**: APIキーはサーバー側（`/api/v1/plan/route.ts`）で環境変数から読み込み

### 3. Webhook任意URL問題を修正（事前登録制） ✅
- **問題**: プロンプトで任意URLに送るとSSRF/情報漏洩
- **修正**: 
  - `lib/webhook-validator.ts` を作成
  - `/api/v1/confirm` で事前登録チェックを追加
  - `connector_configs` に登録済みURLのみ許可
- **dev対応**: `DEV_ALLOW_LOCALHOST=true` で localhost を許可

### 4. Prisma migrate運用に切り替え ✅
- **状態**: 初期マイグレーションファイル作成
- **ファイル**: `prisma/migrations/20251217_init_action_cloud/migration.sql`
- **今後**: 新しい変更は `prisma migrate dev` で管理

---

## 🎯 5つの最小チェック（勝ち筋確認）

これが全部通れば「勝ち筋に乗ってる」：

### チェック1: Plan→Approve→Confirm が通る
```bash
# ダッシュボードでテスト
open http://localhost:3000/dashboard

# または APIテスト
./test-api.sh
```

**期待結果**:
- Plan生成成功
- 承認ID発行成功
- 実行確定成功
- レシートID取得

### チェック2: Receiver Kit で Webhook受信
```bash
# Receiver Kit起動
cd receiver-starter-node
npm install
npm start

# 別ターミナルでWebhook送信テスト
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -H "X-Yohaku-Signature: sha256=test" \
  -H "X-Idempotency-Key: test_123" \
  -H "X-Yohaku-Job-Id: job_test" \
  -d '{"event":"test","tenant_id":"t1","confirm_id":"c1","payload":{}}'
```

**期待結果**:
- 署名検証OK
- Idempotency チェックOK
- 200 OK レスポンス

### チェック3: ledger_events が増える（prev_hashチェーン）
```sql
-- Supabaseで確認
SELECT id, action, status, prev_hash, ts 
FROM ledger_events 
ORDER BY ts DESC 
LIMIT 10;
```

**期待結果**:
- 各confirmごとにレコードが増える
- prev_hashが前のレコードのハッシュと一致
- チェーンが壊れていない

### チェック4: usage_counters_daily が冪等
```sql
-- Supabaseで確認
SELECT tenant_id, day, confirms, webhook_jobs, calendar_holds 
FROM usage_counters_daily 
ORDER BY day DESC 
LIMIT 5;
```

**期待結果**:
- 同じidempotency_keyで2回confirmしても、カウントは1回のみ
- confirms / webhook_jobs / calendar_holds が正しく増加

### チェック5: Freeze が効く
```sql
-- Supabaseで freeze_rules を追加
INSERT INTO freeze_rules (id, tenant_id, level, active, reason, created_at, updated_at)
VALUES ('freeze_test', 'tenant_demo_001', 'tenant', true, 'Test freeze', NOW(), NOW());
```

```bash
# confirmを試す
curl -X POST http://localhost:3000/api/v1/confirm \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"pl_xxx","approve_id":"aprv_xxx","idempotency_key":"key_freeze_test"}'
```

**期待結果**:
- 403_FROZEN エラーが返る
- Webhook Jobが作成されない
- キューも止まる

---

## 🔒 セキュリティチェックリスト

### APIキー露出
- [ ] ブラウザのNetwork タブで OPENAI_API_KEY が見えないか確認
- [ ] .env.local が .gitignore に含まれているか確認
- [ ] 環境変数がクライアント側（NEXT_PUBLIC_*）に漏れていないか確認

### Webhook SSRF対策
- [ ] 任意URLに送信できないか確認（事前登録制）
- [ ] localhost は dev のみ許可されているか確認
- [ ] プライベートIPアドレスが禁止されているか確認

### Idempotency
- [ ] 同じidempotency_keyで2回confirmしても、2回目は409が返るか確認
- [ ] 課金が二重にならないか確認

### Freeze
- [ ] freeze中は confirm が 403 で止まるか確認
- [ ] Webhook Job が作成されないか確認
- [ ] 解除後は正常に動作するか確認

---

## 📝 次のアクション

### 今すぐやること
1. **5つの最小チェックを実行**
   - 各チェックの結果を記録
   - 失敗したものは修正

2. **Receiver Kit で 30分導入を再現**
   - ローカルでOK
   - 録画/スクショを残す

3. **設計パートナー3社に刺しに行く**
   - 30分導入の証拠を武器にする
   - "安全な実行" の価値を訴求

### 今後の運用
1. **新しいテーブル追加時**
   ```bash
   # schema.prisma を編集
   npx prisma migrate dev --name add_xxx_table
   ```

2. **本番環境へのデプロイ時**
   ```bash
   npx prisma migrate deploy
   ```

3. **Webhook URL登録時**
   ```sql
   -- connector_configs に登録
   INSERT INTO connector_configs (id, tenant_id, connector, config_json, created_at, updated_at)
   VALUES (
     'webhook_config_001',
     'tenant_001',
     'webhook',
     '{"registered_urls": [{"url": "https://example.com/webhook", "enabled": true}]}',
     NOW(),
     NOW()
   );
   ```

---

## ✅ 完了確認

すべて完了したら、このチェックリストを更新してください：

- [x] test-action-cloud.sh の shebang 修正
- [x] Dashboard APIキー露出チェック
- [x] Webhook任意URL問題を修正
- [x] Prisma migrate運用に切り替え
- [ ] 5つの最小チェック実行
- [ ] Receiver Kit で 30分導入を再現
- [ ] 設計パートナー3社を探す

**すべて完了したら、安心して次（設計パートナー獲得）に進めます！** 🚀



