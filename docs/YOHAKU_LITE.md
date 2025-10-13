# YOHAKU LITE – ChatGPT内で動く"超軽量版"

## 目的（Why）
- **配布の面を最大化**：ChatGPT内の巨大動線（Appsディレクトリ）で**広告費ゼロの獲得**を実現。
- **摩擦ゼロ体験**：インストール/権限連携前でも**会話内で価値→確定**まで到達。
- **本体をブースト**：Liteで得た**提案→確定ログ/理由タグ（Why‑this）**が**Taste/Vibe**の学習を加速。

## スコープ（MVP）
- **7→2→1**：7秒入力→**2提案**→**1タップ確定**。
- **アクションは2つに限定**：`calendar.create` + `message.send(email)`。
- **Why‑this‑for‑you**：各提案に"あなた向けの理由"最大3点を表示、👍/👎＋タグを収集。
- **Confirm once**＋**取消猶予 10秒**＋**監査ログ**（ConfirmOS準拠）。
- **.ics フォールバック**：権限未連携でも価値を提供。

## UI（Apps SDK）
- 提案カード（A/B）／Confirmモーダル（要約・トグル・Undo表示）／完了トースト（Minutes‑Back加算）。
- 会話内で完結する**インタラクティブUI**。No‑Feed/No‑Scroll を踏襲。

## 実装（既存資産の再利用）
- API：`/api/propose` → `/api/plan` → `POST /api/confirm`（idempotency必須） → `.ics`。
- MCP：`calendar.create` / `message.send` をAppsから直接呼び出し可能（MCP準拠）。
- 品質運用：**AgentKit Evals**で **Top‑1採択率 / 編集距離 / Time‑to‑Confirm** を自動集計。必要に応じて **RFT** でツール選択を最適化。

## KPI / Go・No‑Go（4週で判定）
- **Top‑1採択率 ≥ 55%**、**TTC p50 ≤ 3s**、**初回体験CVR ≥ 20%**。
- **Lite単体 MRR ≥ $500** *or* **本体Proへの送客 ≥ 5%**。
- ※ 2項目以上未達なら Lite は一旦凍結 → 本体へ100%集中。

## 収益（初期）
- Liteサブスク（¥300–¥600/月）／**Instant Checkout（ACP）**による小口課金（上限・二重承認）。
- 本体Proへのアップセル（OS統合/通話/行政）。

## 配布
- **Developer Mode**で内テスト → **Appsディレクトリ**に審査提出（最小権限/透明な同意/データ最小化）。

## リージョン/ローンチ
- **US/JP 先行**。**EUは後追い**（規制/提供範囲の都合）。アプリ内部で**リージョンゲート**を実装。

## セーフティ/プライバシー
- ConfirmOS準拠（要約/取消/監査/二重承認/Idempotency）。
- **PII最小化**：保存は要約＋操作メタのみ。理由タグは匿名化。

## ロードマップ（14日）
- Day 1–3：Apps UI（提案カード/Confirm）＋ `.ics` フォールバック。
- Day 4–7：Why‑this/理由タグ収集 → **Evals**導入（Top‑1/TTC/編集距離）。
- Day 8–10：審査パッケージ化（権限説明/プライバシー文面）。
- Day 11–14：**Instant Checkout（ACP）**を1ユースケースだけ導入（上限＋二重承認）。

## 計測イベント（lite.*）
- `lite.session_started` / `lite.proposals_shown` / `lite.whythis_shown` / `lite.reason_feedback` / `lite.confirmed` / `lite.ics_downloaded` / `lite.checkout_succeeded`。

