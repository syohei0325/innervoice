# Supply-Chain Trust Panel ガイド

## 概要

Supply-Chain Trust Panelは、Yohakuが実行する各アクションで**どのベンダに何を渡したか**を可視化する仕組みです。供給網（サプライチェーン）の透明性を確保し、ユーザーに信頼を提供します。

## 目的

1. **透明性**: どのサブプロセッサー（外部ベンダ）を使用したかを明示
2. **監査**: データの流れを追跡可能にする
3. **警告**: 署名エラーや越境データ転送を警告
4. **主権**: ユーザーが自分のデータの流れを把握できる

## サブプロセッサー

Yohakuが使用する主なサブプロセッサー：

| 名前 | 目的 | データ種別 | リージョン | DPA |
|------|------|-----------|----------|-----|
| OpenAI | AI推論・自然言語処理 | user_input_summary, intent_json | US | [Link](https://openai.com/policies/data-processing-addendum) |
| Google Calendar API | カレンダーイベント作成・管理 | event_title, start_time, duration, attendees | US | [Link](https://cloud.google.com/terms/data-processing-addendum) |
| Twilio | 通話実行・SMS送信 | phone_number, call_summary, sms_text | US | [Link](https://www.twilio.com/legal/data-protection-addendum) |
| Stripe | 決済処理 | amount, payment_method, transaction_id | US | [Link](https://stripe.com/legal/dpa) |
| Vercel | ホスティング・インフラ | request_logs, error_logs | US | [Link](https://vercel.com/legal/dpa) |
| Supabase | データベース・ストレージ | all_user_data | US | [Link](https://supabase.com/legal/dpa) |

## Supply-Chain Event

各アクション実行時に記録される情報：

```typescript
{
  id: string,                    // イベントID
  timestamp: string,             // タイムスタンプ
  action: string,                // アクション名（calendar.create等）
  subprocessors: [               // 使用したサブプロセッサー
    {
      name: string,              // ベンダ名
      purpose: string,           // 使用目的
      dataTypes: string[],       // 渡したデータ種別
      region: string,            // データ保管リージョン
      signatureVerified: boolean, // 署名検証結果
      crossBorder: boolean       // 越境データ転送の有無
    }
  ],
  warnings: string[]             // 警告メッセージ
}
```

## 警告の種類

### 署名エラー

```
⚠️ 署名エラー: [ベンダ名]
```

Webhookやレスポンスの署名検証に失敗した場合に表示されます。データの完全性が保証されていない可能性があります。

### 越境データ転送

```
⚠️ 越境データ転送: [ベンダ名]
```

データが国境を越えて転送される場合に表示されます（特にEUユーザーに重要）。

## API

### GET /api/supply-chain

ユーザーのサプライチェーンイベント履歴を取得します。

**パラメータ**:
- `user_id`: ユーザーID（オプション、デフォルト: `user_mock_001`）
- `limit`: 取得件数（オプション、デフォルト: `50`）

**レスポンス**:

```json
{
  "subprocessors": [
    {
      "name": "OpenAI",
      "purpose": "AI推論・自然言語処理",
      "dataTypes": ["user_input_summary", "intent_json"],
      "region": "US",
      "dpaUrl": "https://openai.com/policies/data-processing-addendum"
    }
  ],
  "recent_events": [
    {
      "id": "sc_1234567890_abc",
      "timestamp": "2025-12-03T10:00:00Z",
      "action": "calendar.create",
      "subprocessors": [
        {
          "name": "Google Calendar API",
          "purpose": "カレンダーイベント作成",
          "dataTypes": ["event_title", "start_time", "duration"],
          "region": "US",
          "signatureVerified": true,
          "crossBorder": true
        }
      ],
      "warnings": ["⚠️ 越境データ転送: Google Calendar API"]
    }
  ],
  "updated_at": "2025-12-03T10:00:00Z"
}
```

## フロントエンド表示

### Trust Panel（奥のパネル）

ユーザーが明示的に開く詳細パネル：

1. **サブプロセッサー一覧**: 使用しているすべてのベンダ
2. **最近のイベント**: 直近50件のサプライチェーンイベント
3. **警告**: 署名エラーや越境データ転送の警告

### 実行時の軽量表示

アクション実行時に軽量トーストで表示：

```
✅ 実行完了
📊 使用ベンダ: Google Calendar API, OpenAI
```

警告がある場合：

```
⚠️ 実行完了（警告あり）
📊 使用ベンダ: Twilio (越境データ転送)
```

## 実装状況

- ✅ スキーマ定義 (`lib/supply-chain.ts`)
- ✅ サブプロセッサー特定ロジック (`identifySubprocessors`)
- ✅ イベント記録 (`trackExecution`)
- ✅ API実装 (`/api/supply-chain`)
- ✅ `/api/confirm` への統合
- ⬜ フロントエンドTrust Panel
- ⬜ 実行時の軽量表示

## セキュリティ考慮事項

1. **72時間以内の通知**: サブプロセッサー変更時は72時間以内にユーザーに通知
2. **DPA（Data Processing Addendum）**: すべてのサブプロセッサーとDPAを締結
3. **地域固定**: データ保管リージョンを明示し、契約で固定
4. **再委託制限**: サブプロセッサーの再委託を制限
5. **監査証跡**: すべてのデータフローを監査可能にする

## 次のステップ

1. フロントエンドTrust Panelの実装
2. 実行時の軽量表示の実装
3. サブプロセッサー変更通知の自動化
4. エクスポートAPI（外部監査用）の実装



