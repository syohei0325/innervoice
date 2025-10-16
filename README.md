# Yohaku – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

## 核心体験（MVP）
- 入力：**7秒**（音声 or 無音テキスト）
- 出力：**2つの提案**（所要時間ラベル付き）
- 確定：**1タップで .ics を発行**（片方向フォールバックを常時有効）
- 画面：**1枚だけ**（Input / Proposals / Confirm / **Value Receipt**）

## 次の価値（MVP+）: Intent バス & Confirm once Multi‑Action
- 入力：**7秒**（声/無音テキスト）→ **Intent化**（やりたいことをJSON化）
- 提案：**2つの実行プラン**（例：A=カレンダー+メッセ+リマインド / B=代替案）
- 確定：**Confirm once（1回のOK）**で**複数アクションを並列実行**（Calendar / Messenger / Reminders 等）
- フォールバック：**.ics一発発行**（MVPを常時バックアップ経路として維持）
- 可視化：**Verified Minutes‑Back（vMB）**と**Friction Events Avoided（FEA）**を加算（保守的表示）

## Doraemonモード（Proactive / 先読み相棒）
- **覚える**：発話・操作・決定を**Memory OS**に"要約"保存（端末優先PDV、TTL/信頼度つき）。
- **見張る**：**Proactive OS**が"時間の隙間 / 関係の空白 / 期限 / 地理"の信号を**静かにスキャン**（No Feed）。
- **気を利かせる**：**Nudge**を**A/Bの2択**で提案（**朝/移動前/就寝前**の小窓のみ、クールダウン厳守）。
- **気を遣う**：**Relationship Graph**で「最近会っていない」「連絡間隔」を検出 → **メッセ1通＋候補スロット**の最小提案。
- 実行は**Confirm once**（1回のOK）で一括実行、**Undo 10秒**と**監査ログ**は必須。
- **.icsフォールバック**は常時有効（権限未連携/遅延時でも即価値）。

### Pluggable Memory（外部記憶を差し替え可能）
- Coreは**自前（Memory OS）**、Doc/Graphは**プロバイダ切替**（Supermemory / Zep / Mem0 等）
- Providerは**環境変数で選択**＋**A/B**運用、失敗時は**Coreのみ**へ自動降格
- "Why‑this‑for‑you"に**出典（core|doc）/provider/信頼度**を必ず表示

### DoraemonモードのKPI（北極星に追加）
- **Nudge採択率（週） ≥ 25%**
- **Nudge誤提案率 ≤ 10%**
- **Screen‑off完了率 ≥ 70%**（Carモード含む）
- **vMB / FEAのリフト**（先読み適用時の増分）を計測

## Pack 拡張（LifeOps OS）
- **Money Pack**：家計の交渉・解約・乗換（成功報酬/アフィ対応）
- **Civic Pack**：行政/役所/DMV/ビザ等の手続き（書類生成＋枠取り）
- **Family Pack**：家族の段取り（学校/送迎/連絡）
- **Care Pack**：在宅介護の外周（通院/服薬/家族連絡）
- 共通：**ConfirmOS**（承認/取消/監査/二重承認）で安全性を規格化

## 北極星（PMF検証KPI）
- Median **vMB ≥ 15分/日**（D30継続ユーザー｜保守的推定）
- **Screen‑off完了率 ≥ 70%（Carモード含む）**
- **FEA ≥ 10/週（p50）**（アプリ跨ぎ/コピペ/フォーム入力などの削減件数）
- **Nudge採択率 ≥ 25% / 誤提案 ≤ 10% / 誤実行率 < 0.5%**
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
- 使い方：1) APIキー発行 → 2) `POST /v1/plan`でPlanを取得 → 3) `POST /v1/approve`で承認ID発行 → 4) `POST /v1/confirm`で一括実行 → 5) `minutes_back` と `friction_saved` を受領。
- 詳細は **docs/PUBLIC_API.md** / **docs/INTENT_SCHEMA.md** / **docs/WEBHOOKS.md** / **docs/CONNECTOR_SDK.md** を参照。

## For Developers（MCP）
- Yohakuは **MCP（Model Context Protocol）** に準拠したツール群を提供（β）。
- 使い方：1) MCPサーバURLを用意 → 2) Realtime/ClaudeなどのクライアントにURLを渡す → 3) tools（`calendar.create` / `message.send` / `reminder.create` / `call.place` / `places.search` / `reservations.book` / `parking.reserve` / `ride.order` / `pay.authorize` / `notify.push`）を呼び出し。
- **署名・審査・スコープ**の三点で安全運用（マーケット想定）。詳細は **docs/MCP_OVERVIEW.md**。

## For Developers（OS & Calls）
- **OS Deep Integrations**: iOS Shortcuts / App Intents, Android Intents, Windows (Graph/Notifications)。OSからYohakuを直接起動し、フォローアップをバックグラウンド実行。
- **Voice Calls (SIP) β**: 予約/キャンセル/再配達などを**電話**で完了。MCP `call.place` を用い、transcript→summary→Planの後続実行。
- 詳細は **docs/OS_INTEGRATIONS.md** / **docs/CALL_TEMPLATES.md** / **docs/PRD_CALL_OS.md** を参照。

## For ChatGPT Apps（Yohaku Lite）
- ChatGPT内で動く**超軽量版**。**7→2→1（Cal＋Email）**と**Why‑this**を実装。
- 開発：**Apps SDK（MCP準拠）**＋既存API（/api/propose | /api/plan | /api/confirm | .ics）を利用。**Developer Mode**で内テスト。
- 配布：**Appsディレクトリ**への提出を前提に、**最小権限/透明な同意/データ最小化**で審査対応。
- 詳細は **docs/YOHAKU_LITE.md** を参照。

## デザイン原則（共通）
- No Feed / No Scroll / One‑shot UX（7秒→2→1） / Silent First（音声×テキスト両立）
- **Value Receipt**：成功時に**軽量トースト（2–3秒）**＋**任意の週次カード**＋**奥のトラストパネル**（既定OFF）
- データはユーザーのもの（エクスポート/削除）
- アプリ横断は **Intent バス**で配車し、**Confirm once**で一括実行（透明性ある要約を必ず表示）
- Personalization‑first（**Vibe Profile / Taste Embedding / Why‑this（出典明示）** で提案文と確認文を個人最適）
- **Trustパネル常設**（誤実行/取消成功/平均承認時間/証拠係数）＋**理由フィードバック**の1タップ収集
- **プロバイダ分離**：Google検索→Googleマップ／Apple検索→Appleマップに統一（TOS遵守）
- **ConfirmOS**：要約表示・二重承認（支払い/通話）・取消猶予10秒・監査ログ・ロールバック
- **Ask→Anticipate**：人が言う前に"そっと提案"。**ナッジは最小で、騒がない。**
- **Pluggable Memory**：**出典明示**・**乗換自由**・**主権尊重**を守る。

## 将来像（3年の絵 / Super‑App by Voice）
- 目標：**「Yohakuを開いて話すだけで、アプリ横断の用事が全部終わる」**。80/20で"毎日の用事"をカバーし、残りは通話/人に委譲。
- コア：**7→2→1（Confirm once）**、**MCP**（places/reservations/parking/ride/pay/call/notify）、**OS深統合**（Shortcuts/Intents/通知1タップ）。
- 学習：**Taste Embedding**（好みベクトル）と**Partnerモード**（同意ベース共有）で"あなた/相手"に最適化。
- 安全：**要約の強制表示/取消/ロールバック/監査**、金額は**二重承認**、車内は**読み上げ中心**。
- 詳細：**docs/FUTURE_VISION.md** / **docs/TASTE_MODEL.md** / **docs/PARTNER_MODE.md** / **docs/CONFIRM_OS.md** / **docs/PACKS_OVERVIEW.md** を参照。
