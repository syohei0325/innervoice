# Yohaku – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

## 核心体験（MVP）
- 入力：**7秒**（音声 or 無音テキスト）
- 出力：**2つの提案**（所要時間ラベル付き）
- 確定：**1タップで .ics を発行**（片方向フォールバックを常時有効）
- 画面：**1枚だけ**（Input / Proposals / Confirm / Minutes‑Back）

## 次の価値（MVP+）: Intent バス & Confirm once Multi‑Action
- 入力：**7秒**（声/無音テキスト）→ **Intent化**（やりたいことをJSON化）
- 提案：**2つの実行プラン**（例：A=カレンダー+メッセ+リマインド / B=代替案）
- 確定：**Confirm once（1回のOK）**で**複数アクションを並列実行**（Calendar / Messenger / Reminders 等）
- フォールバック：**.ics一発発行**（MVPを常時バックアップ経路として維持）
- 可視化：**Minutes‑Back**は**束ねた実行**で短縮できた合計分を加算

## Pack 拡張（LifeOps OS）
- **Money Pack**：家計の交渉・解約・乗換（成功報酬/アフィ対応）
- **Civic Pack**：行政/役所/DMV/ビザ等の手続き（書類生成＋枠取り）
- **Family Pack**：家族の段取り（学校/送迎/連絡）
- **Care Pack**：在宅介護の外周（通院/服薬/家族連絡）
- 共通：**ConfirmOS**（承認/取消/監査/二重承認）で安全性を規格化

## 北極星（PMF検証KPI）
- Median **Minutes‑Back ≥ 15分/日**（D30継続ユーザー）
- **Screen‑off完了率 ≥ 70%**
- D1≥60% / D7≥35% / D30≥25% / 日あたり確定≥3 / **誤実行率 < 0.5%** / NPS≥50

## 開発クイックスタート
```bash
# 依存関係インストール
npm install

# 環境変数設定
cp env.example .env.local
# .env.local を編集して OPENAI_API_KEY と DATABASE_URL を設定

# Prisma セットアップ
npm run db:generate
npm run db:push

# 開発サーバー起動
npm run dev
```

## テスト実行
```bash
# E2Eテスト（Playwright）
npm run test

# TypeScript型チェック
npm run type-check

# ESLint
npm run lint
```

## ビルド・本番
```bash
# ビルド
npm run build

# 本番起動
npm run start
```

## .env 設定（必須）

環境変数ファイル `.env.local` を作成し、以下を設定：

```env
# OpenAI API キー（必須）
OPENAI_API_KEY=sk-your-openai-api-key-here

# データベース接続URL（必須）
DATABASE_URL=postgresql://user:password@localhost:5432/innervoice

# アプリ設定
NEXT_PUBLIC_APP_NAME=Yohaku
APP_TIMEZONE_DEFAULT=Asia/Tokyo

# テレメトリ（オプション）
TELEMETRY_WRITE_KEY=your-posthog-key
```

## 既知の制約・TODO

### v0.1.0-alpha.1 制約
- **認証なし**: モックユーザーID使用
- **音声入力**: UI のみ実装（実際の音声処理は未実装）
- **DB**: ローカル開発のみ対応（本番DB設定必要）
- **テレメトリ**: コンソールログのみ（PostHog未統合）
- **エラーハンドリング**: 基本的なフォールバック

### 次期バージョン予定
- 音声入力（Web Speech API / Whisper）
- ユーザー認証（NextAuth.js）
- 本番DB・デプロイ設定
- リアルタイム計測統合
- パフォーマンス最適化（p50 < 1s）

## デモ

![MVP Flow Demo](docs/demo/mvp-flow.gif)

## For Developers（Public API）
- 開発者向けの**公開API/SDK/Webhook**を提供（β）。
- 使い方：1) APIキー発行 → 2) `POST /v1/plan`でPlanを取得 → 3) `POST /v1/confirm`で一括実行 → 4) `minutes_back` を受領。
- 詳細は **docs/PUBLIC_API.md** / **docs/INTENT_SCHEMA.md** / **docs/WEBHOOKS.md** / **docs/CONNECTOR_SDK.md** を参照。

## For Developers（MCP）
- Yohakuは **MCP（Model Context Protocol）** に準拠したツール群を提供（β）。
- 使い方：1) MCPサーバURLを用意 → 2) Realtime/ClaudeなどのクライアントにURLを渡す → 3) tools（`calendar.create` / `message.send` / `reminder.create` / `call.place` / `places.search` / `reservations.book` / `parking.reserve` / `ride.order` / `pay.authorize` / `notify.push`）を呼び出し。
- 詳細は **docs/MCP_OVERVIEW.md** を参照。

## For Developers（OS & Calls）
- **OS Deep Integrations**: iOS Shortcuts / App Intents, Android Intents, Windows (Graph/Notifications)。OSからYohakuを直接起動し、フォローアップをバックグラウンド実行。
- **Voice Calls (SIP) β**: 予約/キャンセル/再配達などを**電話**で完了。MCP `call.place` を用い、transcript→summary→Planの後続実行。
- 詳細は **docs/OS_INTEGRATIONS.md** / **docs/CALL_TEMPLATES.md** / **docs/PRD_CALL_OS.md** を参照。

## デザイン原則
- No Feed / No Scroll
- One‑shot UX（7秒→2提案→1確定）
- Minutes‑Back / Money‑Back 可視化
- Silent First（音声×テキスト両立）
- データはユーザーのもの（エクスポート/削除）
- アプリ横断は **Intent バス**で配車し、**Confirm once**で一括実行（透明性ある要約を必ず表示）
- Personalization‑first（**Vibe Profile / Taste Embedding / Why‑this** で提案文と確認文を個人最適）
- **Trustパネル常設**（誤実行/取消成功/平均承認時間）＋**理由フィードバック**の1タップ収集

## 将来像（3年の絵 / Super‑App by Voice）
- 目標：**「Yohakuを開いて話すだけで、アプリ横断の用事が全部終わる」**。80/20で"毎日の用事"をカバーし、残りは通話/人に委譲。
- コア：**7→2→1（Confirm once）**、**MCP**（places/reservations/parking/ride/pay/call/notify）、**OS深統合**（Shortcuts/Intents/通知1タップ）。
- 学習：**Taste Embedding**（好みベクトル）と**Partnerモード**（同意ベース共有）で"あなた/相手"に最適化。
- 安全：**要約の強制表示/取消/ロールバック/監査**、金額は**二重承認**。
- 詳細：**docs/FUTURE_VISION.md** / **docs/TASTE_MODEL.md** / **docs/PARTNER_MODE.md** / **docs/CONFIRM_OS.md** / **docs/PACKS_OVERVIEW.md** を参照。
