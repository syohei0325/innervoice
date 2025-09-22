# Changelog

All notable changes to InnerVoice will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.0-alpha.1] - 2024-12-01

### ✨ Added
- **MVP Core Flow**: 7秒入力 → 2提案 → 1確定（.ics）
- **1画面UI**: InputBar / ProposalList / ProposalCard×2 / ConfirmButton / MBMeter
- **API Endpoints**: 
  - `/api/propose` - OpenAI統合による2提案生成
  - `/api/confirm` - .ics生成とDB記録
  - `/api/download/[eventId]` - .icsファイル配信
  - `/api/account/export` - データエクスポート（stub）
  - `/api/account/delete` - アカウント削除（stub）
- **Database**: Prisma + PostgreSQL（users/profiles/proposals/decisions/events）
- **Minutes-Back**: タスク確定時の時間節約計測・表示
- **E2E Testing**: Playwright による MVPフロー検証
- **Telemetry**: イベント計測基盤（コンソールログ）

### 🔧 Technical
- **Next.js 14**: App Router + TypeScript
- **Node.js Runtime**: 全APIエンドポイントで明示
- **Tailwind CSS**: レスポンシブUI
- **OpenAI Integration**: GPT-3.5-turbo による提案生成
- **Fallback System**: API失敗時の代替提案
- **Type Safety**: TypeScript + ESLint設定

### 📋 MVP Constraints
- **認証**: モックユーザーID使用（本認証未実装）
- **音声入力**: UI表示のみ（実際の音声処理未実装）
- **DB環境**: ローカル開発のみ対応
- **テレメトリ**: ログ出力のみ（外部サービス未統合）
- **エラーハンドリング**: 基本的なフォールバック

### 🎯 Performance Targets
- **提案生成**: < 2秒（p50）
- **UI応答性**: 即座のフィードバック
- **エラー率**: < 1%（目標）

### 📁 Project Structure
```
app/
├── components/     # UI コンポーネント
├── api/           # API エンドポイント（Node.js runtime）
├── globals.css    # Tailwind スタイル
docs/
├── *.md          # プロダクト・技術仕様
├── demo/         # デモ素材
prisma/
├── schema.prisma # データベーススキーマ
├── migrations/   # DB マイグレーション
tests/
├── *.spec.ts     # E2E テスト
```

---

## [v0.2.0-alpha.1] - 2024-12-01

### ✨ Added - MVP+ Features
- **Intent Bus**: テキスト→JSON Intent→Plan生成システム
- **Confirm once**: 複数アクション（Calendar+Messenger+Reminder）の一括実行
- **ConfirmSheet UI**: 要約表示・個別チェック・透明性確保
- **Parallel Execution**: Calendar.Create / Messenger.Send の並列処理
- **Fallback Integrity**: .ics フォールバック経路を常時維持

### 🔧 Technical - MVP+ Infrastructure
- **Intent Schema**: Zod による型安全なIntent/Plan/Action定義
- **Connector Pattern**: Calendar/Messenger/Reminder の統一インターフェース
- **Database Extension**: intents/plans/executions/connectors テーブル追加
- **API Enhancement**: `/api/plan` エンドポイント / `/api/confirm` 拡張
- **Error Handling**: 部分成功・並列エラーの適切な処理

### 📋 MVP+ User Flow
1. 7秒入力 → 2提案表示（従来通り）
2. **NEW**: 提案クリック → Intent化 → PlanA/B 生成
3. **NEW**: ConfirmSheet でアクション確認・選択
4. **NEW**: Confirm once で並列実行（Calendar+Message+Reminder）
5. **NEW**: 実行結果表示・部分成功対応
6. **継続**: .ics フォールバック・Minutes-Back 加算

### 🎯 Performance & Reliability
- **Plan Generation**: < 1秒（95%）
- **Parallel Execution**: Calendar/Messenger同時実行
- **Fault Tolerance**: 個別アクション失敗でも継続
- **Backward Compatibility**: MVP v0.1.0 フォールバック維持

---

## [Unreleased]

### 🚀 Planned Features
- **監査ログ**: 実行履歴・ロールバック・リトライ機能
- **Google Calendar API**: 実際のカレンダー統合
- **Messaging API**: LINE/Slack 連携
- **音声入力**: Web Speech API / OpenAI Whisper 統合
- **ユーザー認証**: NextAuth.js 導入
- **本番デプロイ**: Vercel + Neon/Supabase
- **リアルタイム計測**: PostHog統合
- **パフォーマンス最適化**: p50 < 1秒目標
