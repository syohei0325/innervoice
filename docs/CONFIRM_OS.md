# ConfirmOS – 承認/取消/監査/二重承認の標準

## 要件
- **Confirm Sheet**（誰に/何を/いつ/影響＋トグル）
- **Undo 10秒** / **ロールバック** / **監査ログ**
- **金額/通話は二重承認** / `/confirm` は **idempotency-key 必須**

## KPI
- 誤実行率 < 0.5% / 取消成功率 / ロールバック成功率 / 平均承認時間

## Call Consent（通話の承認）
- `call.place` は **/api/approve** で発行された **approve_id**（有効期限10分）が**必須**。  
- フロー：**Call Consent 承認** → 通話実行（`call.place`） → **通話要約**（`call.summary`）→ **後続アクション案** → **Confirm once**で確定。  
- **金額/本人確認/規約変更**は **Warm Transfer**（人間へ引き継ぎ）＋**二重承認**を必須化。  
- `approve_id` が無い通話リクエストは **400_CALL_CONSENT_REQUIRED** を返す。

## Execution Ledger（台帳）

- **目的**：承認→実行→取消/ロールバックの**完全監査**。eDiscovery/不正調査/SLO検証に使用。  
- **イベントスキーマ（例）**:
```json
{ "id":"ledg_{{uuid}}", "approve_id":"aprv_abc123", "plan_id":"pl1", "action":"calendar.create", "actor":"user|automation", "status":"approved|executed|failed|rolled_back", "before":null, "after":{"id":"evt_123","start":"..."}, "reversible":true, "rollback_id":null, "ts":"2025-10-19T10:10:02Z" }
```
- **保持**：90日（既定）。エクスポートAPIと削除リクエストに準拠。  
- **KPI**：取消成功率 / ロールバック成功率 / 平均承認時間 / 誤実行率。

## API実装

### POST /api/approve
承認IDを発行（10分有効）

Request:
```json
{ "plan_id": "pl1", "risk_level": "low" }
```

Response:
```json
{ "approve_id": "aprv_abc123", "expires_in_sec": 600 }
```

### POST /api/confirm
承認IDとidempotency-keyで実行

Request:
```json
{
  "plan_id": "pl1",
  "approve_id": "aprv_abc123",
  "idempotency_key": "k_123"
}
```

Response:
```json
{
  "results": [
    { "action": "calendar.create", "status": "ok", "id": "evt_123" }
  ],
  "minutes_back": 18,
  "friction_saved": [
    { "type": "app_switch_avoided", "qty": 1, "evidence": "measured" }
  ]
}
```

## エラーコード
- **400_APPROVAL_NOT_FOUND**: 承認が見つからない
- **400_APPROVAL_EXPIRED**: 承認の有効期限切れ
- **409_APPROVAL_ALREADY_USED**: 承認が既に使用済み
- **409_IDEMPOTENCY_CONFLICT**: 同じidempotency-keyで異なるリクエスト
- **400_CALL_CONSENT_REQUIRED**: 通話に必要な承認が不足

