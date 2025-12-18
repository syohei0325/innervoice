# AXI Treaty v0 – 公開契約（定義と補償を数字で固定）

## 目的
- "信頼の価格" を作る
- 定義と補償を数字で固定
- 週次で計測・公開

## Definitions（固定）

### misexec_pct
- **定義**: 誤実行 / confirm件数（週次、7日移動平均）
- **計測**: ledger_events で status='failed' かつ reason='misexec' の件数 / confirm件数
- **公開**: 週次（毎週月曜日）

### ledger_integrity
- **定義**: prev_hash チェーンが検証可能である割合
- **計測**: ledger_events で prev_hash が正しく繋がっている割合
- **公開**: 週次（毎週月曜日）

### webhook_delivery_success
- **定義**: 2h以内に成功した webhook_job の割合（attemptではない）
- **計測**: webhook_jobs で status='succeeded' かつ created_at から 2h以内に完了した割合
- **公開**: 週次（毎週月曜日）

## Treaty v0（初期案）

### misexec_pct > 0.5%（週）
- **補償**: 当該週 Platform Fee の 25% クレジット
- **適用**: 自動（請求書に反映）

### misexec_pct > 1.0%（週）
- **補償**: 当該週 Platform Fee の 100% クレジット
- **適用**: 自動（請求書に反映）

### ledger_integrity < 99.9%（週）
- **補償**: 当該週請求を無効（0円）＋原因レポート
- **適用**: 自動（請求書に反映）＋48h以内に原因レポート提出

### webhook_delivery_success < 99.0%（週）
- **補償**: 当該週 usage の 25% クレジット（当社起因のみ）
- **適用**: 自動（請求書に反映）
- **除外**: 顧客側endpointの不具合は対象外（ただし運用支援はする）

## 計測方法

### misexec_pct
```sql
SELECT 
  COUNT(CASE WHEN status='failed' AND reason='misexec' THEN 1 END) * 100.0 / COUNT(*) as misexec_pct
FROM ledger_events
WHERE ts >= NOW() - INTERVAL '7 days'
  AND action = 'confirm';
```

### ledger_integrity
```sql
SELECT 
  COUNT(CASE WHEN prev_hash IS NOT NULL AND verify_hash(prev_hash) THEN 1 END) * 100.0 / COUNT(*) as ledger_integrity
FROM ledger_events
WHERE ts >= NOW() - INTERVAL '7 days';
```

### webhook_delivery_success
```sql
SELECT 
  COUNT(CASE WHEN status='succeeded' AND (updated_at - created_at) <= INTERVAL '2 hours' THEN 1 END) * 100.0 / COUNT(*) as webhook_delivery_success
FROM webhook_jobs
WHERE created_at >= NOW() - INTERVAL '7 days';
```

## 公開方法
- GET /v1/axi - AXI指標取得
- GET /v1/treaty - Treaty定義取得
- 週次レポート（メール）

## Versioning
- TREATY_VERSION=0.1
- Breaking change は major を上げる
- 変更は30日前に通知



