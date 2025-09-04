# テスト戦略

## ユニット
- .ics生成 / TZ計算 / 提案バリデータ

## 結合
- propose→UI→confirm→.ics→MB加算の一連

## E2E（Playwright）
- 7秒入力（モック）→2提案→1タップ→.ics存在 で PASS
- p50/p95レイテンシ閾値超過で失敗

## SLO
- propose→confirm 転換≥70% / iv.error<1%
