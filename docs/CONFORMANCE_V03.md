# Conformance Suite v0.3 – ConfirmOS準拠テスト

## 概要
Conformance Suite v0.3は、Yohaku Action Cloud（ConfirmOS）に準拠するための必須テストスイートです。
すべてのテストに合格することで、**Yohaku-Compatible** バッジを取得できます。

## バージョン
- **CONFIRMOS_VERSION**: 0.3
- **Breaking change** は major を上げる

## テストケース一覧

### T01: approve_ttl_10m
**目的**: Approvalが10分でexpireすることを確認

**テスト手順**:
1. `/v1/approve` でapprove_idを取得
2. 10分後に `/v1/confirm` を実行
3. `400_APPROVAL_EXPIRED` が返ることを確認

**合格基準**:
- TTL10分が正確に動作する
- Expired後のconfirmは拒否される

---

### T02: confirm_requires_idempotency_key
**目的**: Confirmにidempotency_keyが必須であることを確認

**テスト手順**:
1. `/v1/confirm` をidempotency_key無しで実行
2. `400_IDEMPOTENCY_KEY_REQUIRED` が返ることを確認

**合格基準**:
- idempotency_keyが無いリクエストは拒否される

---

### T03: idempotency_conflict_returns_409
**目的**: 同じidempotency_keyでの再実行が409を返すことを確認

**テスト手順**:
1. `/v1/confirm` を実行（idempotency_key: "test_key_001"）
2. 同じidempotency_keyで再度実行
3. `409_IDEMPOTENCY_CONFLICT` が返ることを確認

**合格基準**:
- 同じidempotency_keyでの再実行は409を返す
- 二重実行を防止できる

---

### T04: undo_10s_reversible_only
**目的**: 可逆アクションのみ10秒以内にundoできることを確認

**テスト手順**:
1. 可逆アクション（calendar.hold.create）を実行
2. 10秒以内に `/v1/undo` を実行
3. 成功することを確認

**合格基準**:
- 可逆アクションは10秒以内にundoできる
- 不可逆アクションはundoできない（phase1は実行禁止）

---

### T05: irreversibility_gate_double_approve_required
**目的**: 不可逆アクションは二重承認が必要であることを確認（phase1は実行禁止）

**テスト手順**:
1. 不可逆アクション（payment.execute）を含むplanを作成
2. `/v1/confirm` を実行
3. `403_IRREVERSIBLE_ACTION_SEALED_IN_PHASE1` が返ることを確認

**合格基準**:
- phase1では不可逆アクションは実行禁止
- phase2以降では二重承認が必要

---

### T06: execution_ledger_append_only_chain(prev_hash)
**目的**: Ledgerがappend-only chainであることを確認

**テスト手順**:
1. 複数のconfirmを実行
2. `ledger_events` テーブルを確認
3. 各イベントの `prev_hash` が前のイベントのハッシュと一致することを確認

**合格基準**:
- prev_hashチェーンが正しく構築されている
- 改ざん検知が可能

---

### T07: webhook_signature_required
**目的**: Webhook送信時に署名が必須であることを確認

**テスト手順**:
1. webhook.dispatchを実行
2. Webhook受信側で `X-Yohaku-Signature` ヘッダーを確認
3. HMAC-SHA256署名が正しいことを確認

**合格基準**:
- すべてのWebhookに署名が付与されている
- 署名検証が成功する

---

### T08: webhook_idempotency_24h
**目的**: Webhookの冪等性が24時間保持されることを確認

**テスト手順**:
1. 同じ `X-Idempotency-Key` でWebhookを2回受信
2. 2回目は重複として処理されることを確認

**合格基準**:
- 同じidempotency_keyでの再送は重複として処理される
- 24時間以内は冪等性が保証される

---

### T09: partial_success_contract(422/shape)
**目的**: Partial successの契約が守られることを確認

**テスト手順**:
1. 複数アクションを含むplanを実行（一部が失敗する）
2. レスポンスが `422` または `200` で返ることを確認
3. `results` 配列に各アクションの結果が含まれることを確認

**合格基準**:
- 一部失敗でも全体が失敗しない
- 各アクションの結果が明確に返される

---

### T10: webhook_retry_policy_backoff
**目的**: Webhookのリトライポリシーが正しく動作することを確認

**テスト手順**:
1. webhook.dispatchを実行（受信側は5xxを返す）
2. リトライが指数バックオフで実行されることを確認
3. `giveup_after_seconds` 後に停止することを確認

**合格基準**:
- リトライが指定されたbackoffで実行される
- 最大リトライ回数またはgiveup時間で停止する

---

### T11: calendar_hold_reversible_or_ics_fallback
**目的**: Calendar Holdが可逆またはICS fallbackであることを確認

**テスト手順**:
1. calendar.hold.createを実行
2. ICS URLが返されることを確認
3. ICSファイルがダウンロード可能であることを確認

**合格基準**:
- phase1ではICS fallback-firstで動作する
- ICSファイルが正しく生成される

---

### T12: policy_denies_out_of_allowlist_connector
**目的**: Allowlist外のコネクタが拒否されることを確認

**テスト手順**:
1. phase1で `call.place` を含むplanを実行
2. `403_SEALED_IN_PHASE1` が返ることを確認

**合格基準**:
- phase1ではwebhook/calendar_hold以外は拒否される
- SEALEDアクションは実行されない

---

### T13: kill_switch_denies_when_frozen
**目的**: Freeze時にconfirmが拒否されることを確認

**テスト手順**:
1. `freeze_rules` にactive=trueのルールを追加
2. `/v1/confirm` を実行
3. `403_FROZEN` が返ることを確認

**合格基準**:
- Freeze時はすべてのconfirmが拒否される
- 即座に停止できる

---

### T14: metering_counts_confirm_once
**目的**: Meteringが冪等であることを確認（二重課金しない）

**テスト手順**:
1. 同じidempotency_keyで2回confirmを実行
2. `usage_counters_daily` を確認
3. confirmが1回だけカウントされていることを確認

**合格基準**:
- 同じidempotency_keyでの再実行は二重にカウントされない
- 課金が正確

---

### T15: kya_executor_is_recorded(api_key_id_or_agent_id)
**目的**: KYA executorが記録されることを確認

**テスト手順**:
1. `X-Yohaku-Api-Key-Id` ヘッダーを付けて `/v1/confirm` を実行
2. `ledger_events` の `executor_api_key_id` を確認
3. `receipts` の `executor_api_key_id` を確認

**合格基準**:
- executorが必ず記録される
- ledgerとreceiptの両方に含まれる

---

### T16: kya_principal_is_traceable(approve→confirm)
**目的**: KYA principalが追跡可能であることを確認

**テスト手順**:
1. `/v1/approve` で承認者情報を記録
2. `/v1/confirm` を実行
3. `ledger_events` の `principal_user_id` を確認

**合格基準**:
- principalが必ず記録される
- approve→confirmの鎖が追跡可能

---

### T17: webhook_timestamp_replay_protected
**目的**: Webhookのtimestamp replay protectionが動作することを確認

**テスト手順**:
1. webhook.dispatchを実行
2. 受信側で `X-Yohaku-Timestamp` を確認
3. 古いtimestampで再送した場合に拒否されることを確認

**合格基準**:
- timestampが署名対象に含まれる
- 5分以上古いtimestampは拒否される

---

### T18: webhook_target_must_be_registered
**目的**: Webhook targetが事前登録制であることを確認

**テスト手順**:
1. 未登録のURLでwebhook.dispatchを実行
2. エラーが返ることを確認

**合格基準**:
- 未登録URLは拒否される
- connector_configs.registered_urlsに登録済みのみ送信可能

---

### T19: provider_neutral_planner_mock_rules_work
**目的**: Provider Neutral（mock/rules）が動作することを確認

**テスト手順**:
1. `YOHAKU_PLANNER_MODE=mock` で `/v1/plan` を実行
2. OpenAI無しでplanが返ることを確認
3. `/v1/approve` → `/v1/confirm` が通ることを確認

**合格基準**:
- OpenAI無しでも検証が止まらない
- mock/rulesでplanが生成される

---

### T20: receipt_contains_kya_and_policy_ref
**目的**: ReceiptにKYAとpolicy_refが含まれることを確認

**テスト手順**:
1. `/v1/confirm` を実行
2. レスポンスの `kya` フィールドを確認
3. `executor_api_key_id`, `principal_user_id` が含まれることを確認

**合格基準**:
- ReceiptにKYA情報が含まれる
- 監査に必要な情報が揃っている

---

## Conformance Suite実行方法

### 自動テスト
```bash
# すべてのテストを実行
npm run test:conformance

# 特定のテストを実行
npm run test:conformance -- --test T15
```

### CI統合
```yaml
# .github/workflows/conformance.yml
name: Conformance Suite
on: [push, pull_request]
jobs:
  conformance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test:conformance
```

---

## Yohaku-Compatible Badge取得条件

### 必須条件
- ✅ T01〜T20 すべてに合格
- ✅ Conformance Suite v0.3 準拠
- ✅ Treaty v0 の指標を計測可能

### Badge表示
```markdown
[![Yohaku-Compatible](https://yohaku.app/badge/compatible/v0.3)](https://yohaku.app/conformance)
```

---

## 更新履歴
- 2025-12-29: v0.3 リリース（T15-T20追加：KYA/timestamp/registered target/provider neutral）
- 2025-12-17: v0.2 リリース（T01-T14）
- 2025-12-01: v0.1 初版

