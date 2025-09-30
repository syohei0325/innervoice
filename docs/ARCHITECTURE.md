# アーキテクチャ（MVP + MVP+）

## スタック
- Web：Next.js (App Router)
- **API ランタイム**：**Node.js runtime** を明示（各 /app/api/**/route.ts に `export const runtime = 'nodejs'`）
- 音声→テキスト：OpenAI Whisper API（将来ローカル推論検討）
- 提案生成：LLM API（短文・低温度）
- **Intentバス**：Intent(JSON)→ Plan → Connector 実行（並列）
- **.ics生成：サーバ（Node.js runtime）**
- コネクタ：Calendar / Messenger / Reminders（最小2種類から開始）
- **DB：Postgres（Neon/Supabase） + Prisma**（初期からPostgres固定）
- E2E：Playwright
- 計測：PostHog or GA4（軽量）
- Public API Gateway（API Key / Rate Limiter / Versioning）
- Webhooks Dispatcher（署名付与 / リトライ）
- MCPクライアント：OpenAI Realtime / Anthropic Claude から remote/local MCP に接続
- MCPサーバ：innervoice-mcp（remote）／innervoice-mcp-local（端末内）— tools=calendar.create/message.send/reminder.create/...

## データ流れ（MVP）
入力(7秒音声/テキスト)
 → POST /api/propose（LLMで2案生成）
 → UI表示（ProposalCard×2）
 → ユーザーが1案確定
 → POST /api/confirm（**.ics生成 + MB加算**）
 → .icsダウンロード / イベント記録

## データ流れ（MVP+）
入力(7秒音声/テキスト)
 → POST /api/propose（LLMで2案生成）
 → UI表示（ProposalCard×2）
 → ユーザーが1案を選択 → **/api/plan**（Intent化→PlanA/B を生成）
 → **Confirm once**（実行プランの要約＋チェックで最終承認）
 → **/api/confirm**（Plan並列実行：Calendar/Messenger/...）＋ **.icsフォールバック**
 → 結果通知 / Minutes‑Back 加算 / 監査ログ

## データ流れ（外部開発者）
外部App
 → POST /v1/plan（API Key）
 → plans[2] を受領 → ユーザーに要約表示（あなたのUI）
 → POST /v1/confirm（plan_id）
 → Webhook `action.executed` / `minutes_back.added`

## Executor（MCP）構成
- 既定：MCPクライアント → remote/local MCP サーバへ tools を並列実行
- 代替：ネイティブConnector直叩き（Android Intents / iOS Shortcuts / Graph 等）
- フォールバック：.ics 単発発行（常時）

## フォールバック
- 失敗/遅延：直近の「My Voice」テンプレA/Bを即時提示
- 音声不可：即テキスト入力表示
- 送信失敗：ローカル再送キュー保持
- Intent/Plan 失敗時：.ics単発発行に自動ダウングレード