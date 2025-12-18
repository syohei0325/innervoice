# Action Cloud – phase1（Private β / Exit-first）

## 目的
- エージェントが "安全に実行" できる最小基盤を提供する
- コネクタは2本固定（Webhook + CalendarHold）
- Conformance/Treatyを実装物として出す（椅子取り開始）
- 課金のためのメータリングを同時に仕上げる（将来の企業価値に直結）

## phase1 Offer（設計パートナー向け）
- /v1/plan
- /v1/approve
- /v1/confirm
- /v1/ledger/export
- Conformance Suite（CIで回せる）
- Treaty v0（定義と補償）
- Receiver Starter Kit（30分導入）
- Usage Metering（請求の根拠データ）

## Non-goals（phase1でやらない）
- Phone実行
- Marketplace
- External memory import/sync
- Proactive execution
- Public API一般公開

## Go基準（phase1 → phase1_5）
- 設計パートナー3社が週次で使っている（/confirmが増える）
- webhook_delivery_success ≥ 99%
- misexec_pct < 0.5%
- ledger_integrity ≥ 99.9%
- Receiver Kitで導入が"短い"実証がある
- 有料意志（LOI or paid pilot）を最低1社から取る



