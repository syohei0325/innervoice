# DSPL (Display-Specific Language) 仕様

## 概要

DSPLは、NLUI（自然言語UI）とGUI（グラフィカルUI）の「連続体」を実現するための仕様です。LLMが対話の文脈から`confirm_sheet`スキーマに沿ったJSONを生成し、フロントエンドがそれを動的にレンダリングすることで、**7→2→1**のワンショットUXを崩さずに柔軟な確認画面を提供します。

## 目的

- **対話の文脈を保持**: ユーザーの意図や状況に応じた最適な確認画面を生成
- **1画面完結**: 複数ステップを踏まずに、1つのConfirm Sheetで全ての情報を提示
- **安全性の可視化**: リスク、代替案、不可逆性などを明示的に表示

## スキーマ

### ConfirmSheet

```typescript
{
  "confirm_sheet": {
    "title": string,                    // タイトル
    "badges": string[] | Badge[],       // バッジ（簡易表示）
    "sections": Section[],              // セクション配列
    "irreversible": boolean?,           // 不可逆操作フラグ
    "requiresDoubleApproval": boolean?, // 二重承認必須フラグ
    "warmTransferRequired": boolean?    // 人間引き継ぎ必須フラグ
  }
}
```

### Badge

```typescript
{
  "label": string,
  "variant": "info" | "success" | "warning" | "danger"
}
```

### Section

```typescript
// Summary Section
{
  "type": "summary",
  "text": string
}

// Risks Section
{
  "type": "risks",
  "items": [
    {
      "label": string,
      "level": "low" | "medium" | "high",
      "description": string?
    }
  ]
}

// Alternatives Section
{
  "type": "alternatives",
  "items": [
    {
      "label": string,
      "action": string  // e.g., "replan(10:45)"
    }
  ]
}

// Actions Section
{
  "type": "actions",
  "items": [
    {
      "action": string,
      "description": string,
      "icon": string?
    }
  ]
}
```

## 例

### 基本的な予定作成

```json
{
  "confirm_sheet": {
    "title": "朝ラン 07:00",
    "badges": ["費用¥0", "所要30分"],
    "sections": [
      {
        "type": "summary",
        "text": "明日07:00から30分のランニングを予定に追加します。"
      },
      {
        "type": "actions",
        "items": [
          {
            "action": "calendar.create",
            "description": "朝ラン - 07:00 (30分)",
            "icon": "📅"
          }
        ]
      }
    ]
  }
}
```

### 不可逆操作を含む場合

```json
{
  "confirm_sheet": {
    "title": "◯◯クリニック 10:30 予約",
    "badges": ["⚠️ 不可逆操作", "🔐 二重承認必須", "👤 人間確認必要"],
    "sections": [
      {
        "type": "summary",
        "text": "明日10:30で予約確定候補。家族へ共有+出発9:45リマインド。"
      },
      {
        "type": "risks",
        "items": [
          {
            "label": "通話を開始します",
            "level": "high",
            "description": "電話をかけます。通話内容は要約のみ保存されます（録音は既定OFF）。"
          }
        ]
      },
      {
        "type": "alternatives",
        "items": [
          {
            "label": "10:45に変更",
            "action": "replan(10:45)"
          }
        ]
      },
      {
        "type": "actions",
        "items": [
          {
            "action": "call.place",
            "description": "+81XXXXXXXX に電話（予約を取りたいです...）",
            "icon": "📞"
          },
          {
            "action": "calendar.create",
            "description": "Clinic visit - 10:30 (30分)",
            "icon": "📅"
          },
          {
            "action": "message.send",
            "description": "家族 に「10:30に予約取れたよ」",
            "icon": "💬"
          },
          {
            "action": "reminder.create",
            "description": "09:45 - 出発準備",
            "icon": "⏰"
          }
        ]
      }
    ],
    "irreversible": true,
    "requiresDoubleApproval": true,
    "warmTransferRequired": false
  }
}
```

## Irreversibility Gate（不可逆ゲート）

以下の操作は**不可逆**と判定され、特別な扱いが必要です：

- **支払い** (`pay.authorize`)
- **本人確認** (`identity.verify`)
- **規約変更** (`terms.accept`, `contract.sign`)
- **キャンセル不可の操作** (`non_cancellable: true`)

これらが検出された場合：

1. `irreversible: true` フラグを設定
2. `requiresDoubleApproval: true` で二重承認を要求
3. 必要に応じて `warmTransferRequired: true` で人間オペレーターへの引き継ぎを要求

## フロントエンド実装

フロントエンドは `confirm_sheet` を受け取り、以下のように動的にレンダリングします：

1. **タイトル表示**: `title`
2. **バッジ表示**: `badges` を色付きバッジとして表示
3. **セクション表示**: `sections` を順に表示
   - `summary`: テキストブロック
   - `risks`: 警告リスト（レベルに応じた色分け）
   - `alternatives`: 代替案ボタン
   - `actions`: アクションリスト（チェックボックス付き）
4. **特別な警告**: `irreversible`, `requiresDoubleApproval`, `warmTransferRequired` に応じた警告表示

## 実装状況

- ✅ スキーマ定義 (`lib/dspl.ts`)
- ✅ Irreversibility Gate (`detectIrreversibility`)
- ✅ フォールバック生成 (`generateFallbackConfirmSheet`)
- ✅ `/api/plan` への統合
- ⬜ フロントエンドコンポーネント（`ConfirmSheetDynamic.tsx`）
- ⬜ LLMによる動的生成（OpenAI Function Calling）

## 次のステップ

1. フロントエンドコンポーネントの実装
2. LLMによる動的DSPL生成の実装
3. ユーザーフィードバックに基づく改善


















