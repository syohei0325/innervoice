# Yohaku – 7秒で「決めて、置く」。スクリーンから人を解放する相棒
> We don't optimize for screen‑time. We optimize for life‑time.

### 一言要約（Call‑first）
- AIがあなたの代わりに必要な**電話**を行い、その結果を**予定・連絡・リマインド**へ**1タップ（Confirm once）**で落とし込む。
- **勝手に実行しない**：**通話の開始（Call Consent）**と**後続アクションの確定（Confirm once）**はあなたの承認が必要。

## 核心体験（MVP：Phase 2-first「通話→予定化」）
- 入力：**7秒**（音声/無音テキスト）
- 実行：**Call Consent**承認→`call.place`→`call.summary`→**PlanA/B**提示
- 確定：**Confirm once**で `calendar.create / message.send / reminder.create` を**並列実行**
- フォールバック：**.ics一発発行**（権限未連携/外部ダウン時でも即価値）
- 画面：**1枚だけ**（Input / PlanA-B / Confirm / **Value Receipt**）
- KPI（p50）：提案表示≤1.5s / 通話成功≥90% / 誤実行<0.5% / vMB中央値≥6分  
> 方針：**Phase 1（.icsのみ）をスキップ**し、需要の強い**通話テンプレ**（病院/飲食/再配達）から着手。.icsは**常時フォールバック**として残す。

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

## For Developers（Memory API）
- **Memory API**: ユーザーの好み・習慣・関係性を保存・検索・削除するAPI。
- **Pluggable Memory**: Core（自前）と外部Provider（Supermemory/Zep/Mem0）を環境変数で切替可能。
- **主な API**:
  - `POST /api/memory/put` - Memory保存
  - `POST /api/memory/query` - Memory検索
  - `POST /api/memory/forget` - Memory削除
  - `GET /api/memory/export` - 全Memoryエクスポート（データポータビリティ権）
  - `DELETE /api/memory/purge` - 全Memory削除
  - `GET /api/provider/status` - Provider状態確認
- 詳細は **docs/MEMORY_API_USAGE.md** を参照。

## For Developers（DSPL & ConfirmOS）
- **DSPL (Display-Specific Language)**: LLMが生成するConfirm Sheetの構成スキーマ。NLUI×GUIの連続体を実現。
- **Irreversibility Gate**: 支払い/本人確認/規約変更などの不可逆操作を検出し、二重承認とWarm Transferを要求。
- **Model Routing Layer**: データ分類（P0/P1/P2）とリージョンに基づいた中立的なモデル選択。
- **Supply-Chain Trust Panel**: 実行ごとにどのベンダに何を渡したかを可視化。
- 詳細は **docs/DSPL_SPEC.md** / **docs/MODEL_ROUTING_GUIDE.md** / **docs/SUPPLY_CHAIN_TRUST.md** を参照。

## For Developers（AXI & Security KPI）
- **AXI (Action eXecution Index)**: 実行品質指標を週次で公開（TTC/誤実行/取消成功/ロールバック成功/通話成功/Screen-off完了）。
- **Security KPI**: セキュリティ指標を週次で公開（脆弱性/依存関係遅延/シークレット漏洩/MTTR/SBOM/サブプロセッサー通知遅延/Referrer遮断率）。
- **主な API**:
  - `GET /api/axi` - AXI取得
  - `GET /api/security-kpi` - Security KPI取得
  - `GET /api/supply-chain` - Supply-Chain Trust Panel
- 詳細は **docs/EVALS.md** を参照。

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

## Yohaku → Action Cloud（最大EVへの道筋）

**結論**：Yohakuの「通話→予定化」で**実運用データ（AXI/台帳）**を積み、その**規格（ConfirmOS）とAPI（/plan→/approve→/confirm）**を**Action Cloud**としてSLA付きで外販する。

**3段階の道筋**
1) **Phase 1 – Yohaku（0–9m）**：通話テンプレ（病院/飲食/再配達）→**AXIを週次公開**→**Execution Ledger**（席課金）  
   **到達基準**：通話成功≥90% / 誤実行<0.5% / vMB中央値≥6分 / 有償≥30社
2) **Phase 2 – Action Cloud β（9–18m）**：**/v1/plan → /v1/approve → /v1/confirm** を**SLA 99.5%**で外部に提供（中立・プロバイダ差し替え可）  
   価格：**$0.03/アクション**＋**台帳$20/席**。**Call Provider Spec**（`call.place/status/summary`）準拠
3) **Phase 3 – Action Cloud GA（18–36m）**：**Enterprise SLA 99.9%**（リージョン固定、監査証跡/EU DPA）＋**ConfirmOS v1**公開仕様＋**AXIリーダーボード**

**ポジショニング**
- 入口（会話UI/検索/モデル）を持つ大手に対し、Yohaku/Action Cloudは**出口＝結果確定の標準**（**実行のUSB‑C**）を握る。  
- **Open‑box（AXI/台帳公開）**・**規制整合（Call Consent/監査）**・**プロバイダ中立**をコア原則として維持。

**10/10 Moat（競争優位の堀）**
- **データモート**：確定データ≥1,000万件/年、Frontier Ratio≥35%
- **埋め込み**：台帳SaaS有償≥1,000社
- **生態系**：Provider認定≥50社、外部入口からの`/confirm`≥3億/月
- **COGS**：粗利≥70%、SLA 99.9%
- **カウンターポジショニング**：売上の≥80%が成果課金＋台帳SaaS
- **透明性**：AXI/Security KPI連続52週公開
- **規制/ブランド**：SOC2/ISO+JP/EU準拠

**決定打**
- **PoEx（実行証明）**：改ざん不可能な証明で信頼を数学的に担保
- **AXI Leaderboard**：Provider品質を公開比較（勝率/遅延/原価）
- **Provider認定プログラム**：Yohaku-Compatibleバッジで生態系形成

詳細は **docs/ACTION_CLOUD.md** / **docs/MOAT_10_OF_10.md** / **docs/PROVIDER_PROGRAM.md** / **docs/ROADMAP_36M.md** / **docs/EVALS.md** を参照。
