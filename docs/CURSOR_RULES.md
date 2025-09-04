# Cursor 依頼ルール（重要）

## 目的
- **MVP実装**：7秒→2提案→1確定（.ics）、1画面UI、E2E 1本、MB集計

## コーディング規約
- TypeScript / ESLint / Prettier
- コンポーネント小さく / hooksに副作用
- 例外は Result<T,E> で扱う

## 各APIファイルの先頭に必ず記述
export const runtime = 'nodejs';

## 依頼テンプレ（最初に実行）
Task: MVP "7秒→2提案→.ics" を実装して PR 作成  
Acceptance:
- 1画面UI（InputBar / ProposalList / ProposalCard×2 / ConfirmButton / MBMeter）
- 7秒入力→2提案→.icsダウンロード（p50<2s）/ フォールバック動作
- Prisma(Postgres)で decisions/events へ記録
- E2E(Playwright)1本 PASS / Lint/Type OK
Deliverables:
- PR 1本（スクショ/動画/GIF・README更新）

## 次の依頼（順番）
1) /api/propose 実装最適化（p50<1s目標）
2) Silent‑Mode（音声不可時テキスト最短導線）
3) MBダッシュボード（今日/週/月）
4) NPSと不満収集フォーム
