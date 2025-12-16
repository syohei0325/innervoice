# Model Routing Layer ガイド

## 概要

Model Routing Layerは、データ分類（P0/P1/P2）とリージョンに基づいて、最適なLLMプロバイダーを自動選択する仕組みです。コスト、遅延、規制整合性を考慮した中立的なルーティングを実現します。

## データ分類

### P0: PII/決済/録音実体

**対象データ**:
- メールアドレス、電話番号
- クレジットカード情報、SSN、パスポート
- 決済情報（`amount_yen`等）
- 録音実体、トランスクリプト

**ルーティング方針**:
- **信頼プロバイダ固定**: OpenAI / Anthropic
- **中国系/未審査は不可**
- **リージョン**: US/JP/EUで固定

### P1: 要約/準特定

**対象データ**:
- 要約テキスト
- 個人名を含まない準特定情報
- 日付、住所（詳細なし）

**ルーティング方針**:
- **匿名化後に価格/遅延で選択**
- **JPは中国系はopt-in**
- **EUは越境既定OFF**

### P2: 一般推論

**対象データ**:
- 一般的な推論タスク
- 個人情報を含まないテキスト

**ルーティング方針**:
- **最安/最速ルート優先**
- **中国系モデルはopt-in**（JP）

## リージョンゲート

### US（アメリカ）

- P0: OpenAI固定
- P1: OpenAI（コスト優先）
- P2: OpenAI / Anthropic（最安）

### JP（日本）

- P0: OpenAI固定
- P1: OpenAI（中国系はopt-in）
- P2: OpenAI / DeepSeek（opt-in）

**中国系モデルの扱い**:
- P0: **不可**
- P1: **opt-in**（環境変数で明示的に許可）
- P2: **opt-in**（環境変数で明示的に許可）

### EU（欧州連合）

- P0: OpenAI固定（越境既定OFF）
- P1: OpenAI（越境既定OFF、同意時のみON）
- P2: OpenAI（越境既定OFF、同意時のみON）

**越境データ転送**:
- 既定で**OFF**
- ユーザーの明示的な同意がある場合のみ**ON**

## 環境変数

```env
# リージョン設定（US/JP/EU）
YOHAKU_REGION=JP

# 中国系モデルの許可（P2のみ）
YOHAKU_ALLOW_CHINESE_MODELS=false

# EU越境データ転送の許可
YOHAKU_ALLOW_EU_CROSS_BORDER=false
```

## 使用例

```typescript
import { modelRouter, DataClassification } from '@/lib/model-routing';

// データ分類を自動推定
const dataClass = modelRouter.classifyData(requestData);

// リージョンを取得
const region = modelRouter.getRegion();

// 最適なモデルを選択
const route = modelRouter.route({
  dataClass,
  region,
  allowChinese: modelRouter.getAllowChinese(),
});

console.log(`Using ${route.provider} (${route.model})`);
console.log(`Reason: ${route.reason}`);

// Provider Event記録
await recordProviderEvent(userId, route.provider, 'inference', {
  data_class: dataClass,
  reason: route.reason,
});
```

## Provider Events

すべてのモデル使用は `provider_events` テーブルに記録されます：

```typescript
{
  userId: string,
  provider: string,  // openai|anthropic|google|kimi|deepseek
  event: string,     // inference|plan_generation|error
  payloadJson: string, // { data_class, reason, latency_ms, ... }
  at: DateTime
}
```

これにより、以下が可能になります：

- **命中率の計測**: どのプロバイダーが最も精度が高いか
- **遅延の計測**: どのプロバイダーが最も速いか
- **コストの計測**: どのプロバイダーが最も安いか
- **AXI週次公開**: 上記指標を週次でサマリ公開

## 実装状況

- ✅ スキーマ定義 (`lib/model-routing.ts`)
- ✅ データ分類ロジック (`classifyData`)
- ✅ ルーティングロジック (`route`)
- ✅ Provider Events記録 (`recordProviderEvent`)
- ✅ `/api/plan` への統合
- ⬜ 実際のLLM呼び出しへの適用
- ⬜ A/Bテストフレームワーク

## セキュリティ考慮事項

1. **P0データの保護**: 信頼プロバイダーのみに送信
2. **匿名化**: P1データは匿名化後に送信
3. **リージョン遵守**: EUの越境制限を厳守
4. **監査証跡**: すべての使用を記録
5. **透明性**: ユーザーにどのプロバイダーを使用したかを開示

## 次のステップ

1. 実際のLLM呼び出しへの適用
2. A/Bテストフレームワークの構築
3. コスト/遅延/精度のリアルタイム計測
4. AXI週次公開への統合















