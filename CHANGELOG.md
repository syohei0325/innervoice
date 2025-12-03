# Changelog

All notable changes to the Yohaku project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added - 2025-12-03

#### DSPL (Display-Specific Language)
- ✅ **DSPL スキーマ定義** (`lib/dspl.ts`)
  - LLMが生成するConfirm Sheetの構成スキーマ
  - NLUI×GUIの連続体を実現
  - `ConfirmSheet`, `DSPLSection`, `DSPLBadge` 等の型定義

#### Irreversibility Gate（不可逆ゲート）
- ✅ **不可逆操作の検出** (`detectIrreversibility`)
  - 支払い (`pay.authorize`)
  - 本人確認 (`identity.verify`)
  - 規約変更 (`terms.accept`, `contract.sign`)
  - キャンセル不可の操作 (`non_cancellable: true`)
- ✅ **二重承認フラグ** (`requiresDoubleApproval`)
- ✅ **Warm Transfer フラグ** (`warmTransferRequired`)

#### Model Routing Layer
- ✅ **データ分類** (`lib/model-routing.ts`)
  - P0: PII/決済/録音実体
  - P1: 要約/準特定
  - P2: 一般推論
- ✅ **リージョンゲート**
  - US/JP/EU対応
  - 中国系モデルのopt-in制御（P2のみ）
  - EU越境データ転送の制御
- ✅ **Provider Events記録**
  - 命中率/遅延/コストの計測

#### Supply-Chain Trust Panel
- ✅ **サブプロセッサー管理** (`lib/supply-chain.ts`)
  - 使用ベンダの可視化
  - データ種別とリージョンの明示
  - 署名検証とクロスボーダー警告
- ✅ **API実装** (`/api/supply-chain`)
  - サブプロセッサー一覧
  - 使用履歴の取得

#### AXI & Security KPI
- ✅ **AXI (Action eXecution Index)** (`lib/security-kpi.ts`)
  - TTC p50（Time-to-Confirm）
  - 誤実行率
  - 取消成功率
  - ロールバック成功率
  - 通話成功率
  - Screen-off完了率
- ✅ **Security KPI**
  - 未修正脆弱性数
  - 依存関係の平均遅延日数
  - シークレット漏洩インシデント
  - MTTR（平均修復時間）
  - SBOMカバレッジ
  - サブプロセッサー通知遅延
  - Referrer遮断率
- ✅ **API実装**
  - `/api/axi` - AXI取得
  - `/api/security-kpi` - Security KPI取得

#### Prisma Schema
- ✅ **LedgerEvent に `prevHash` 追加**
  - 改ざん検知用ハッシュチェーン

#### Documentation
- ✅ **DSPL_SPEC.md** - DSPL仕様書
- ✅ **MODEL_ROUTING_GUIDE.md** - Model Routing Layer ガイド
- ✅ **SUPPLY_CHAIN_TRUST.md** - Supply-Chain Trust Panel ガイド
- ✅ **API_REFERENCE.md** - 全APIエンドポイントのリファレンス

#### Environment Variables
- ✅ `YOHAKU_REGION` - リージョン設定（US/JP/EU）
- ✅ `YOHAKU_ALLOW_CHINESE_MODELS` - 中国系モデルの許可（P2のみ）
- ✅ `YOHAKU_ALLOW_EU_CROSS_BORDER` - EU越境データ転送の許可

### Changed

#### `/api/plan`
- ✅ Irreversibility Gate統合
- ✅ DSPL生成（フォールバック）
- ✅ Model Routing統合
- ✅ Provider Events記録
- ✅ レスポンスに `confirm_sheet` と `reasons` 追加

#### `/api/confirm`
- ✅ Supply-Chain Tracking統合
- ✅ Ledger Eventに改ざん検知用ハッシュ追加

#### README.md
- ✅ DSPL & ConfirmOS セクション追加
- ✅ AXI & Security KPI セクション追加

---

## [0.1.0-alpha.1] - 2025-11-25

### Added

#### Core Features (MVP)
- ✅ **7秒入力 → 2提案 → 1確定** のコアフロー
- ✅ 音声入力（Web Speech API）
- ✅ .ics生成・ダウンロード
- ✅ Value Receipt（軽量トースト）
- ✅ LoadingSpinner コンポーネント
- ✅ エラーハンドリング強化（フォールバック提案）

#### MVP+ Features
- ✅ **Intent Bus** - Intent化とPlan生成
- ✅ **Confirm once Multi-Action** - 複数アクション並列実行
- ✅ ConfirmSheet コンポーネント
- ✅ vMB (Verified Minutes-Back) 計測
- ✅ FEA (Friction Events Avoided) 計測

#### Doraemon Mode
- ✅ **Memory OS** - Prismaスキーマ実装
  - `memories` テーブル
  - `observations` テーブル
  - `nudges` テーブル
  - `contact_graph` テーブル
  - `availability` テーブル
- ✅ **Memory APIs**
  - `/api/memory/put`
  - `/api/memory/query`
  - `/api/memory/forget`
  - `/api/memory/export`
  - `/api/memory/purge`
- ✅ **Proactive APIs**
  - `/api/nudges`
  - `/api/nudge/feedback`
  - `/api/availability`
  - `/api/relationship/gaps`

#### Pluggable Memory
- ✅ **Provider Interface** (`lib/providers/types.ts`)
- ✅ **Core Provider** (`lib/providers/core.ts`)
- ✅ **Provider Factory** (`lib/providers/index.ts`)
- ✅ **Provider Status API** (`/api/provider/status`)

#### ConfirmOS
- ✅ **Approval System**
  - `approvals` テーブル
  - `audit_logs` テーブル
  - `ledger_events` テーブル
- ✅ **APIs**
  - `/api/approve`
  - `/api/confirm` (approve_id / idempotency_key 対応)

#### Infrastructure
- ✅ Vercel Analytics統合
- ✅ SEO・OGPメタデータ設定
- ✅ Prismaスキーマ拡張（10個の新テーブル）

#### Documentation
- ✅ **LAUNCH_GUIDE.md** - ローンチガイド
- ✅ **MEMORY_API_USAGE.md** - Memory API使用ガイド
- ✅ **TESTING_GUIDE.md** - テストガイド
- ✅ **README.md** 更新（Yohakuブランディング）

### Changed

#### Branding
- ✅ InnerVoice → Yohaku にリブランド
- ✅ ランディングページ改善

#### UI/UX
- ✅ 音声入力ボタン（🎤）追加
- ✅ LoadingSpinner表示
- ✅ Value Receipt トースト表示

### Fixed
- ✅ TypeScript型エラー修正
- ✅ ESLint警告ゼロ
- ✅ 本番ビルド成功

---

## [0.0.1] - 2025-10-16

### Added
- 🎉 初版リリース
- ✅ Next.js 14 (App Router) セットアップ
- ✅ Prisma + PostgreSQL
- ✅ 基本的なUI（Input / Proposals / Confirm）
- ✅ `/api/propose` - 提案生成API
- ✅ `/api/confirm` - 確定API
- ✅ MBMeter コンポーネント

---

## 今後の予定

### v0.2.0 (予定: 2025-12-15)
- ⬜ フロントエンド DSPL対応（動的Confirm Sheet）
- ⬜ LLMによる動的DSPL生成
- ⬜ Supply-Chain Trust Panel UI
- ⬜ AXI/Security KPI ダッシュボード

### v0.3.0 (予定: 2026-01-15)
- ⬜ ユーザー認証（NextAuth.js）
- ⬜ 実際のGoogle Calendar API統合
- ⬜ 実際のメッセージング API統合
- ⬜ Call Provider統合（Twilio/Telnyx）

### v1.0.0 (予定: 2026-03-15)
- ⬜ Public API GA
- ⬜ Webhooks
- ⬜ MCP (Model Context Protocol) サーバ
- ⬜ iOS/Android アプリ

---

[Unreleased]: https://github.com/yourusername/yohaku/compare/v0.1.0-alpha.1...HEAD
[0.1.0-alpha.1]: https://github.com/yourusername/yohaku/compare/v0.0.1...v0.1.0-alpha.1
[0.0.1]: https://github.com/yourusername/yohaku/releases/tag/v0.0.1
