# 電話代行機能 実装サマリー

**実装日**: 2025年12月16日  
**CURSOR_SEED.md 仕様準拠**: ✅ 完了

---

## 📋 実装概要

CURSOR_SEED.mdの最新仕様に基づき、Yohakuを**電話代行アプリ**として実装しました。

### **コア体験**
- ユーザーが「明日の午前中で◯◯クリニック予約して」と入力
- AIが意図を検出（病院予約 / 再配達 / 美容室 / 役所など）
- **PlanA/B**（日時/場所/連絡手段の異なる2案）を生成
- ユーザーが**Confirm once**（1タップ）
- Yohakuが**代わりに電話**し、結果を予定/連絡/リマインドに落とし込む

---

## ✅ 実装完了項目

### **1. 意図検出 (`lib/intent-detector.ts`)**
- ✅ ユーザー入力から意図タイプを自動判定
  - `hospital_appointment` (病院予約)
  - `redelivery` (再配達)
  - `salon_appointment` (美容室・サロン予約)
  - `government_inquiry` (役所問い合わせ)
  - `restaurant_reservation` (レストラン予約)
  - `simple_calendar` (単純なカレンダー予定)
- ✅ OpenAI GPT-4o-mini を使用
- ✅ 確信度（confidence）と電話必要性（requiresCall）を判定
- ✅ 施設名・電話番号・希望時間などを抽出

### **2. PlanA/B生成 (`lib/plan-generator.ts`)**
- ✅ 意図から2つの実行プラン（PlanA/PlanB）を生成
- ✅ 日時・アプローチ・所要時間が異なる2案
- ✅ 電話が必要な場合は`call.place`アクションを含む
- ✅ フォールバックプラン（OpenAI失敗時）

### **3. 通話プロバイダー (`lib/call-provider.ts`)**
- ✅ **MockCallProvider**: 開発用（実際には電話しない）
- ✅ **TwilioCallProvider**: Twilio API対応準備（未実装）
- ✅ **BlandAICallProvider**: Bland.ai API対応準備（未実装）
- ✅ 環境変数で切り替え可能（`YOHAKU_CALL_PROVIDER`）
- ✅ 通話結果（summary, transcript, appointmentTime, confirmationNumber）を返却

### **4. Call Rules (`lib/call-rules.ts`)**
- ✅ **Call Ethics**: 勧誘・営業と誤認されないための前置き
- ✅ **Call Budget**: 1日あたりの通話回数制限（デフォルト10回）
- ✅ **Blacklist**: ユーザーが通話を禁止した番号の管理
- ✅ 営業時間チェック（9:00-21:00）

### **5. API更新**

#### **`/api/propose`**
- ✅ 意図検出 → PlanA/B生成
- ✅ レスポンス形式変更:
  ```json
  {
    "intent": {
      "type": "hospital_appointment",
      "description": "病院予約",
      "requiresCall": true,
      "confidence": 0.95
    },
    "plans": [
      {
        "id": "plan_xxx_a",
        "summary": "電話予約（午前中）",
        "actions": [
          {
            "action": "call.place",
            "phone": "03-1234-5678",
            "purpose": "病院予約",
            "details": {...}
          },
          {
            "action": "calendar.create",
            "title": "田中クリニック",
            "start": "2025-12-17T10:00:00Z",
            "duration_min": 30
          }
        ],
        "reasons": [...]
      }
    ]
  }
  ```

#### **`/api/confirm`**
- ✅ `call.place`アクションの実行
- ✅ Call Rules検証（Blacklist / Budget / 営業時間）
- ✅ 通話結果の取得と表示
- ✅ FEA（Friction Events Avoided）の記録
  - `call_made_for_you`: 電話代行
  - `waiting_time_avoided`: 待ち時間回避
- ✅ 通話成功時、予約時間を`.ics`に反映

### **6. UI更新**

#### **`app/components/InputBar.tsx`**
- ✅ プレースホルダー変更: `明日の午前中で◯◯クリニック予約して`
- ✅ ボタン文言変更: `2つのプランを取得`

#### **`app/page.tsx`**
- ✅ 新しいAPI形式（intent + plans）に対応
- ✅ 通話結果の表示（alert）
- ✅ Value Receipt（FEA表示）

### **7. データベーススキーマ更新**

#### **`Execution`モデル**
```prisma
model Execution {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  planId      String   @map("plan_id")
  action      String   // calendar.create, message.send, reminder.create, call.place
  status      String   @default("pending")
  resultsJson String?  @map("results_json")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId, action, createdAt])
}
```

#### **`Blacklist`モデル**
```prisma
model Blacklist {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  phone     String   // 電話番号
  type      String   @default("phone") // phone|domain|keyword
  reason    String?  // ブロック理由
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, phone])
  @@index([userId, type])
}
```

### **8. 環境変数**

#### **`env.example`**
```env
# Call Provider Configuration
YOHAKU_CALL_PROVIDER=mock  # mock | twilio | bland_ai

# Twilio Configuration
# TWILIO_ACCOUNT_SID=your-twilio-account-sid
# TWILIO_AUTH_TOKEN=your-twilio-auth-token
# TWILIO_FROM_NUMBER=+1234567890

# Bland.ai Configuration
# BLAND_AI_API_KEY=your-bland-ai-api-key

# Call Rules
YOHAKU_DAILY_CALL_LIMIT=10
```

---

## 🚀 使い方

### **開発環境（MockProvider）**

1. **サーバー起動**
   ```bash
   npm run dev
   ```

2. **ブラウザで開く**
   ```
   http://localhost:3000
   ```

3. **入力例**
   - 「明日の午前中で田中クリニック予約して」
   - 「不在票の再配達お願いしといて」
   - 「来週金曜日に美容室予約して」

4. **動作確認**
   - 2つのプランが表示される
   - 「確定」ボタンをクリック
   - 通話結果がalertで表示される（Mock: 2秒で成功）
   - `.ics`ファイルがダウンロードされる
   - Value Receipt（緑のトースト）が表示される

### **本番環境（Twilio / Bland.ai）**

1. **環境変数設定**
   ```env
   YOHAKU_CALL_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_FROM_NUMBER=+1234567890
   ```

2. **Twilio / Bland.ai API実装**
   - `lib/call-provider.ts`の`TwilioCallProvider`または`BlandAICallProvider`を実装
   - 実際のAPI呼び出しを追加

---

## 📊 KPI（北極星）

CURSOR_SEED.mdで定義されたKPI:

- **Median vMB ≥ 15分/日** (D30継続ユーザー)
- **Screen-off完了率 ≥ 70%** (Carモード含む)
- **FEA ≥ 10/週** (p50)
- **Nudge採択率 ≥ 25%** / 誤提案 ≤ 10% / 誤実行率 < 0.5%
- **D1≥60%** / D7≥35% / D30≥25%
- **日あたり確定≥3**
- **NPS≥50**

---

## 🔒 安全性・倫理

### **Call Ethics**
- 通話開始時に必ず前置き:
  ```
  こんにちは。私は個人のAIアシスタントYohakuです。
  ユーザーの[目的]の依頼を代行しています。
  この通話は営業や勧誘ではありません。
  ```

### **Call Budget**
- 1日あたりの通話上限（デフォルト10回）
- 上限に達したらエラーを返す

### **Blacklist**
- ユーザーが通話を禁止した番号をブロック
- `/api/blacklist/add`で追加可能

### **営業時間チェック**
- 9:00-21:00以外は通話しない

---

## 🎯 次のステップ

### **短期（1週間）**
1. ✅ MockProviderで動作確認
2. ⏳ Twilio / Bland.ai API実装
3. ⏳ 実際の電話テスト（小規模）
4. ⏳ フィードバック収集

### **中期（1ヶ月）**
1. ⏳ Nudge機能（先読み相棒）
2. ⏳ Relationship Graph（最近会っていない人）
3. ⏳ Memory OS（覚える/忘れる）
4. ⏳ PLG Loop（SNS共有/.icsフッター）

### **長期（3-6ヶ月）**
1. ⏳ Action Cloud（API化）
2. ⏳ Provider Certification Program
3. ⏳ B2B展開（Design Partner Program）

---

## 📝 重要なファイル

- `lib/intent-detector.ts` - 意図検出
- `lib/plan-generator.ts` - PlanA/B生成
- `lib/call-provider.ts` - 通話プロバイダー
- `lib/call-rules.ts` - Call Rules（Ethics/Budget/Blacklist）
- `app/api/propose/route.ts` - 提案API
- `app/api/confirm/route.ts` - 確定API
- `prisma/schema.prisma` - データベーススキーマ
- `docs/CURSOR_SEED.md` - 完全な仕様書

---

## 🎉 完了！

電話代行機能の実装が完了しました。

**次にやること:**
1. ブラウザで http://localhost:3000 を開く
2. 「明日の午前中で田中クリニック予約して」と入力
3. 2つのプランが表示されることを確認
4. 「確定」ボタンをクリック
5. 通話結果（Mock）が表示されることを確認
6. `.ics`ファイルがダウンロードされることを確認
7. Value Receipt（緑のトースト）が表示されることを確認

**問題があれば:**
- ターミナルのログを確認
- ブラウザのコンソールを確認
- `npm run dev`でサーバーが起動しているか確認

---

**実装完了日**: 2025年12月16日  
**コミットハッシュ**: f29a0e7




