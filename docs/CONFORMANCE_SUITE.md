# Conformance Suite – ConfirmOS準拠テスト（v0）

## 目的
- ConfirmOS互換性を機械保証
- CIで回せるテストスイート
- Yohaku-Compatibleバッジの根拠

## Artifacts（最低限）
- confirmos.schema.json
- confirmos.semantics.md
- conformance_tests/
  - T01_approve_ttl_10m
  - T02_confirm_requires_idempotency_key
  - T03_idempotency_conflict_returns_409
  - T04_undo_10s_reversible_only
  - T05_irreversibility_gate_double_approve_required
  - T06_execution_ledger_append_only_chain(prev_hash)
  - T07_webhook_signature_required
  - T08_webhook_idempotency_24h
  - T09_partial_success_contract(422/shape)
  - T10_webhook_retry_policy_backoff
  - T11_calendar_hold_reversible_or_ics_fallback
  - T12_policy_denies_out_of_allowlist_connector
  - T13_kill_switch_denies_when_frozen
  - T14_metering_counts_confirm_once

## Versioning
- CONFIRMOS_VERSION=0.1
- Breaking change は major を上げる

## テスト実行
```bash
# 全テスト実行
npm run conformance

# 個別テスト
npm run conformance:T01
npm run conformance:T02
# ... T01-T14

# CI統合
npm run conformance:ci
```

## T01: approve_ttl_10m
- **要件**: /approve で発行された approve_id は10分後に expire する
- **テスト**: approve_id を発行 → 10分後に /confirm → 400_APPROVAL_EXPIRED

## T02: confirm_requires_idempotency_key
- **要件**: /confirm は idempotency_key を必須とする
- **テスト**: idempotency_key なしで /confirm → 400_IDEMPOTENCY_KEY_REQUIRED

## T03: idempotency_conflict_returns_409
- **要件**: 同じ idempotency_key で2回 /confirm → 2回目は 409
- **テスト**: 同じ idempotency_key で /confirm を2回 → 2回目は 409_IDEMPOTENCY_CONFLICT

## T04: undo_10s_reversible_only
- **要件**: 可逆アクションのみ10秒以内に undo 可能
- **テスト**: calendar.hold.create → 10秒以内に /undo → 成功

## T05: irreversibility_gate_double_approve_required
- **要件**: 不可逆アクションは二重承認が必要（phase1は実行禁止）
- **テスト**: payment.authorize → 403_IRREVERSIBLE_ACTION_SEALED

## T06: execution_ledger_append_only_chain(prev_hash)
- **要件**: ledger_events は append-only chain（prev_hash で繋がる）
- **テスト**: /confirm を3回 → ledger_events の prev_hash が正しく繋がっている

## T07: webhook_signature_required
- **要件**: webhook は HMAC署名が必須
- **テスト**: webhook_jobs で signature が空 → 送信しない

## T08: webhook_idempotency_24h
- **要件**: webhook は24h以内に重複送信しない
- **テスト**: 同じ webhook_job を2回 enqueue → 2回目は skip

## T09: partial_success_contract(422/shape)
- **要件**: 部分成功時は 422 + shape を返す
- **テスト**: 2アクション（1成功、1失敗）→ 422 + { results: [...] }

## T10: webhook_retry_policy_backoff
- **要件**: webhook は指定された backoff で retry
- **テスト**: webhook が 5xx → retry が [5, 15, 45, ...] で実行される

## T11: calendar_hold_reversible_or_ics_fallback
- **要件**: calendar.hold.create は常に ICS fallback
- **テスト**: calendar.hold.create → ICS が生成される

## T12: policy_denies_out_of_allowlist_connector
- **要件**: phase1 allowlist外コネクタは 403
- **テスト**: call.place（SEALED）→ 403_SEALED_IN_PHASE1

## T13: kill_switch_denies_when_frozen
- **要件**: freeze中は /confirm が 403
- **テスト**: tenant freeze → /confirm → 403_FROZEN

## T14: metering_counts_confirm_once
- **要件**: metering は idempotency で二重課金しない
- **テスト**: 同じ idempotency_key で /confirm を2回 → metering は1回のみ

## Yohaku-Compatible Badge
- 全テスト pass → Yohaku-Compatible v0.1 バッジ取得
- README.md に貼れる
- 導入の説得が楽になる

