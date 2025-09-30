# InnerVoice – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

## 核心体験（MVP）
- 入力：**7秒**（音声 or 無音テキスト）
- 出力：**2つの提案**（所要時間ラベル付き）
- 確定：**1タップで .ics を発行**（まずは片方向）
- 画面：**1枚だけ**（Input/Proposals/Confirm/Minutes‑Back）

## 次の価値（MVP+）: Intent バス & Confirm once Multi‑Action
- 入力：**7秒**（声/無音テキスト）→ **Intent化**（やりたいことをJSON化）
- 提案：**2つの実行プラン**（例：A=カレンダー+メッセ+リマインド / B=代替案）
- 確定：**Confirm once（1回のOK）**で**複数アクションを並列実行**（Calendar/Messenger/Reminders 等）
- フォールバック：**.ics一発発行**（現MVPを常時バックアップ経路として維持）
- 可視化：**Minutes‑Back**は**束ねた実行**で短縮できた合計分を加算

## 北極星（PMF検証KPI）
- Median **Minutes‑Back ≥ 15分/日**（D30継続ユーザー）
- D1≥60% / D7≥35% / D30≥25% / 日あたり確定≥3 / NPS≥50

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
NEXT_PUBLIC_APP_NAME=InnerVoice
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
- 開発者向けの**公開API/SDK/Webhook**を提供します（β）。
- 使い方：1) APIキー発行 → 2) `POST /v1/plan`でPlanを取得 → 3) `POST /v1/confirm`で一括実行 → 4) `minutes_back` を受領。
- 詳細は **[docs/PUBLIC_API.md](docs/PUBLIC_API.md)** / **[docs/INTENT_SCHEMA.md](docs/INTENT_SCHEMA.md)** / **[docs/WEBHOOKS.md](docs/WEBHOOKS.md)** / **[docs/CONNECTOR_SDK.md](docs/CONNECTOR_SDK.md)** を参照。

## For Developers（MCP）
- InnerVoiceは **MCP（Model Context Protocol）** に準拠したツール群を提供します（β）。
- 使い方：1) MCPサーバURLを用意 → 2) Realtime/ClaudeなどのクライアントにURLを渡す → 3) tools（`calendar.create` / `message.send` / `reminder.create` …）を呼び出し。
- 詳細は **[docs/MCP_OVERVIEW.md](docs/MCP_OVERVIEW.md)** と **[docs/MCP_SERVER_SPEC.md](docs/MCP_SERVER_SPEC.md)** を参照。

## デザイン原則
- No Feed / No Scroll
- One‑shot UX（7秒→2提案→1確定）
- Minutes‑Back 可視化
- Silent First（音声×テキスト両立）
- データはユーザーのもの（エクスポート/削除）
- アプリ横断は **Intent バス**で配車し、**Confirm once**で一括実行（透明性ある要約を必ず表示）
