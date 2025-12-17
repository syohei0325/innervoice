# Yohaku Action Cloud – エージェントの"出口（確定）"を安全にする実行レイヤー
> We don't sell "agents". We sell "safe confirmation".

## 一言要約（phase1 / Exit-first / Private β）
- AIエージェントが増える世界で一番危ないのは「勝手に実行される」こと。
- Yohakuは、どの入口（LLM/音声/UI）から来ても、**Plan→Approve→Confirm** を安全に回す **Exitレイヤー**。
- phase1は **Webhook + Calendar Hold（ICS）** の2本だけに固定して、速度と信頼を最大化する。
- 導入摩擦は **Receiver Starter Kit** で潰す（30分でWebhook受け口）。

## Phase1のコア体験（Builders / Teams）
1) Agentが /plan を叩く（複数案 or 1案）
2) 人間 or ルールが /approve（TTL10分）
3) /confirm が実行（idempotency必須）
4) ledger（監査台帳）に残る
5) "Value Receipt（実行レシート）"で社内共有（Team Viral）

## "出口を握る"の核（ここが本体）
- 実行の責任（同意/監査/可逆性/冪等）を **ConfirmOS** として標準化
- **Conformance（準拠テスト）+ Treaty（公開契約）** で互換の中心と信頼の価格を作る
- コネクタは後から増やせる。出口の仕様を先に固定するのが勝ち筋。

## phase1 Focus Rules（非交渉）
- ✅ Exit-first：ConfirmOS + Action Cloud（Private β）
- ✅ コネクタ2本固定：Webhook + Calendar Hold（増やさない）
- ✅ Conformance + Treaty v0 を"実装物"として完成
- ✅ Receiver Starter Kit（導入摩擦を潰す）を同時に出す
- ✅ Kill/Freeze（事故停止）を仕組みで持つ
- ❌ Phone（実行）/ Proactive（実行）/ 外部Memory import / OS deep / Marketplace / Public API一般公開（SEALED）

## KPI（phase1：週次で見る）
- confirm_count / tenant / week
- ttc_p50 / ttc_p95（Time-to-Confirm）
- misexec_pct（誤実行）
- ledger_integrity
- webhook_delivery_success（2h以内成功）
- approve_to_confirm_conversion
- team_viral_rate（approveリンク経由の社内拡散）
- receiver_time_to_first_success（導入時間）

## 30日スコアカード（合格条件）
- 設計パートナー 3社（週次利用）
- 合計 confirm >= 500 / week（3社合算、最低でも週次で増加傾向）
- approve→confirm conversion >= 60%
- webhook_delivery_success >= 99%（当社起因）
- ledger_integrity >= 99.9%
- misexec_pct < 0.5%（理想は0）
- Receiver Starter Kit で '30分導入' の実証 3社中2社以上

## 開発クイックスタート
```bash
# 依存関係インストール
npm install

# 環境変数設定
cp env.example .env.local
# .env.local を編集して必要な環境変数を設定

# Prisma セットアップ
npm run db:generate
npm run db:push

# 開発サーバー起動
npm run dev
```

## 環境変数（phase1必須）
```env
# Phase設定
YOHAKU_PHASE=phase1

# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/yohaku

# OpenAI（Plan生成用）
OPENAI_API_KEY=sk-your-openai-api-key-here

# Webhook署名
WEBHOOK_SIGNING_SECRET=GENERATE_AT_DEPLOY_AND_ROTATE

# PoEx（実行証明）
YOHAKU_SERVER_SECRET=your-server-secret-for-poex

# リージョン
YOHAKU_REGION=JP
DEFAULT_TZ=Asia/Tokyo
```

## アーキテクチャ（phase1）
- Web/API: Next.js(App Router) / runtime='nodejs'
- DB: Postgres + Prisma
- Queue: outbox/inbox（webhook delivery用）
- Observability: OpenTelemetry（server-only）
- Idempotency: 24h（409 on conflict）
- Webhook: HMAC署名 + 再送 + 2h収束
- CalendarHold: ICS生成（server）
- Freeze: middlewareで強制（global/tenant/connector/target）

## ドキュメント
- **docs/VISION.md** - なぜ作るのか
- **docs/PRD_PHASE1.md** - Phase1の要件定義
- **docs/CONFIRM_OS.md** - ConfirmOS仕様
- **docs/ACTION_CLOUD_PHASE1.md** - Action Cloud概要
- **docs/MONETIZATION.md** - 課金設計
- **docs/ICP.md** - 最初の3社の条件
- **docs/RECEIVER_STARTER_KIT.md** - 30分導入の仕組み
- **docs/INCIDENTS_KILL_SWITCH.md** - Kill/Freeze運用
- **docs/30_DAY_SCORECARD.md** - 合格/失格条件
- **docs/IMPLEMENTATION_RAILS_CURSOR.md** - 実装ガイド
- **docs/MOAT_10_OF_10.md** - 10/10 Moat戦略
- **docs/ROADMAP_36M.md** - 3年ロードマップ

## API（phase1：Private β）
```
POST /v1/plan       - Plan生成
POST /v1/approve    - 承認ID発行（TTL10分）
POST /v1/confirm    - 実行（idempotency必須）
GET  /v1/ledger/export - 監査台帳エクスポート
GET  /v1/billing/usage - 使用量取得
```

## Conformance（準拠テスト）
```bash
# Conformance Suite実行
npm run conformance

# 個別テスト
npm run conformance:T01  # approve_ttl_10m
npm run conformance:T02  # confirm_requires_idempotency_key
npm run conformance:T03  # idempotency_conflict_returns_409
# ... T01-T14
```

## Treaty v0（公開契約）
- misexec_pct > 0.5%（週）：当該週 Platform Fee の 25% クレジット
- misexec_pct > 1.0%（週）：当該週 Platform Fee の 100% クレジット
- ledger_integrity < 99.9%（週）：当該週請求を無効（0円）＋原因レポート
- webhook_delivery_success < 99.0%（週）：当該週 usage の 25% クレジット（当社起因のみ）

## Receiver Starter Kit
```bash
# 署名検証ライブラリ
npm install @yohaku/signature

# サンプル（Cloudflare Worker）
git clone https://github.com/yohaku/receiver-starter-cloudflare

# サンプル（Node/Express）
git clone https://github.com/yohaku/receiver-starter-node

# Webhook Playground
open https://yohaku.app/playground
```

## SEALED（phase1で実行禁止）
以下の機能は設計/スタブのみで、実行パスは403/NotImplementedを返します：
- Phone（/api/call.* / call.place 実行）
- Proactive/Nudge 実行（/api/nudges/*）
- Relationship Graph 実行（/api/relationship/*）
- External Memory import/sync（Drive/Notion/Email）
- OS Deep Integrations 実行（Shortcuts/Extensions）
- Marketplace / Connector SDK 一般公開
- Public /v1/* の一般公開（Private β専用の認証なしで露出させない）

## ライセンス
MIT

## コントリビューション
phase1はPrivate βのため、設計パートナーのみ受付中。

## サポート
- Email: support@yohaku.app
- Docs: https://docs.yohaku.app
- Status: https://status.yohaku.app
