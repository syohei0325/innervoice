# InnerVoice MVP: 7秒→2提案→1確定（.ics）

## 目的
「7秒入力 → 2提案 → 1クリック確定（.ics）」の1画面MVPを実装

## 変更
- **UI**: InputBar / ProposalList / ProposalCard×2 / ConfirmButton / MBMeter
- **API**: /api/propose, /api/confirm, /api/download（全て runtime='nodejs'）
- **DB**: schema.prisma（users/profiles/decisions/events）
- **E2E**: Playwright でMVPフロー1本
- **Lint/Type**: エラー0

## 動作確認
1) `npm install && npm run db:migrate`
2) `npm run dev` → http://localhost:3000
3) 入力→2提案→「これに決定」→ .ics 確認
4) Minutes‑Back が加算される

## 証跡
- **GIF**: docs/demo/mvp-flow.gif
- **CHANGELOG**: v0.1.0-alpha.1 追加
- **README**: 起動手順・制約・デモ追加

## 受け入れ基準
- [x] 1画面UI
- [x] 7秒→2提案→.ics
- [x] Prisma 記録
- [x] E2E PASS
- [x] ESLint/TS OK

## パフォーマンス
- 提案生成レスポンス: 目標 < 2秒（p50）
- OpenAI API統合 + フォールバック実装
- Minutes-Back 計測・表示

## 制約・TODO
- 認証: モックユーザーID使用
- 音声: UI表示のみ（実処理未実装）
- DB: ローカル開発環境のみ
- 次期: 本認証・音声入力・本番デプロイ

## ファイル構成
```
app/
├── components/    # UI (InputBar, ProposalList, etc.)
├── api/          # API endpoints (Node.js runtime)
└── page.tsx      # メインページ

docs/
├── *.md         # 仕様書・設計書
└── demo/        # デモGIF

prisma/
├── schema.prisma # DB スキーマ
└── migrations/   # マイグレーション

tests/
└── mvp-flow.spec.ts # E2E テスト
```

## レビュー観点
1. **UX**: 7秒→2提案→1確定の流れ
2. **パフォーマンス**: API応答時間
3. **エラーハンドリング**: フォールバック動作
4. **データ整合性**: Prisma記録確認
5. **コード品質**: TypeScript/ESLint準拠
