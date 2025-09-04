# Cursor向け 初回タスクリスト（順番厳守）

1) スキャフォールド
- Next.js(App Router) 初期化、/app 配下に 1画面UI（InputBar/ProposalList/ProposalCard/ConfirmButton/MBMeter）
- ESLint/Prettier/Playwright 設定

2) DB & Prisma
- Postgres 接続（.env参照）、schema.prisma に users/profiles/proposals/decisions/events を定義
- マイグレーション実行

3) API – propose
- Node.js runtime を宣言
- LLM呼び出し→ proposals[2] を返す（duration_min/slot 付与）

4) API – confirm
- Node.js runtime を宣言
- .ics 生成→DLレスポンス（ヘッダ仕様厳守）、decisions/events を保存、MBを返す

5) E2E
- 7秒入力(モック)→2提案→1クリック→.ics存在 で PASS

6) 計測 & ダッシュボード
- 必須イベント送信 / 今日のMB合計表示

7) Silent‑Mode & フォールバック
- 音声不可→即テキスト / 失敗時テンプレA/B提示

完了後：README 更新・GIF録画・PR作成
