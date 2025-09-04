# アーキテクチャ（MVP）

## スタック
- Web：Next.js (App Router)
- **API ランタイム**：**Node.js runtime** を明示（各 /app/api/**/route.ts に `export const runtime = 'nodejs'`）
- 音声→テキスト：OpenAI Whisper API（将来ローカル推論検討）
- 提案生成：LLM API（短文・低温度）
- **.ics生成：サーバ（Node.js runtime）**
- **DB：Postgres（Neon/Supabase） + Prisma**（初期からPostgres固定）
- E2E：Playwright
- 計測：PostHog or GA4（軽量）

## データ流れ
入力(7秒音声/テキスト)
 → POST /api/propose（LLMで2案生成）
 → UI表示（ProposalCard×2）
 → ユーザーが1案確定
 → POST /api/confirm（**.ics生成 + MB加算**）
 → .icsダウンロード / イベント記録

## フォールバック
- 失敗/遅延：直近の「My Voice」テンプレA/Bを即時提示
- 音声不可：即テキスト入力表示
- 送信失敗：ローカル再送キュー保持
