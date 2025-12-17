# ConfirmOS – 承認/取消/監査/二重承認の標準（出口＝確定の規格）

## 要件（v0）
- Confirm Sheet（誰が/何を/いつ/影響）
- /approve（TTL10分）→ /confirm（idempotency必須）
- Undo 10秒（可逆のみ）
- ledger（append-only chain）
- Partial success contract（422/shapeを固定）

## DSPL – Display‑Specific Language
- LLMは confirm_sheet スキーマに沿った DSPL JSON を返す
- Viewerは1画面にレンダリング（承認を迷わせない）

## Irreversibility Gate（不可逆ゲート）
- 支払い / 個人情報提出 / 取り消し不可 など
- phase1は Gate 命中＝実行禁止（必ず人へ）
- phase2以降：二重承認＋Warm Transfer（人間）で段階解禁

## Proof‑of‑Execution（PoEx）
- confirmごとに receipt 発行（server_sig）
- 将来：Merkle Root / 透明性ログ

## Execution Ledger（台帳）
- すべての実行を追跡できる（誰が何を承認し、何が起きたか）
- prev_hash で改ざん検知
- 保持：90日（既定）

## Standardization（phase1で実装物として完成）
### Conformance
- schema + semantics + tests で互換性を機械保証
### Treaty
- misexec/ledger_integrity/webhook_success を定義し、補償（クレジット）を固定
