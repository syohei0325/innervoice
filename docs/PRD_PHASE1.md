# PRD – phase1（Exit-first / Private β / Webhook + Calendar Hold）

## 対象ユーザー（phase1 / ICP）
- エージェント開発チーム（LLM/Agentを作ってる）
- 縦SaaSの自動化チーム（社内/顧客向けワークフローを持つ）
- 企業内自動化（Ops/RevOps/CS）チーム
※ "Webhook受け口を作れる" が必須条件（Receiver Starter Kitで補助）

## phase1の"確定"とは
- 人間 or ポリシーが approve した内容だけを実行する
- 実行結果を ledger と receipt に残す
- 失敗しても価値が落ちない（CalendarはICS fallback）
- 危ないもの（不可逆）は Gate で止める（phase1は実行禁止）

## コネクタ（phase1固定）
### Connector A: Webhook（主戦場）
- 顧客所有の endpoint へ HMAC署名付きで送る
- 冪等キー + リトライ + 2h以内収束
- 失敗しても ledger に理由が残り、再実行できる

### Connector B: Calendar Hold（低リスク確定）
- 直接OAuthは phase1 SEALED
- phase1は ICS fallback-first（確実に価値を届ける）
- 可逆：ユーザーが取り込まなくても損しない

## Must（機能要件）
1) /plan → /approve → /confirm
2) approve TTL10分 / confirm idempotency必須（24h）
3) Execution Ledger（append-only chain）
4) Undo 10秒（可逆アクションのみ）
5) Partial success（1つ失敗でも全体はレシート化）
6) Receipt（実行レシート）生成（Team Viral導線）
7) Policy Engine（phase1は allowlist + freeze だけでOK）
8) Usage metering（課金のための計測：confirm/webhook_job/calendar_hold）
9) Receiver Starter Kit（署名検証・冪等・ack例）を提供

## 受け入れ基準（DoD）
- approveなしconfirm不可（400_APPROVAL_REQUIRED）
- 409 on idempotency conflict
- ledger_integrity ≥ 99.9%（週）
- webhook_delivery_success（2h以内）≥ 99.0%（週）
- ttc_p50 ≤ 2.0s（Webhookのみのケース）
- CalendarHoldは必ずICS生成（常時フォールバック）
- phase1 allowlist外コネクタは必ず 403
- 署名検証がないWebhookは拒否（送らない/受けない）
- retry/backoffが仕様通りに動く（T10）
- freezeが効く（T13）
- meteringが二重に数えない（T14）

## SEALED（phase1で実行禁止）
以下の機能は設計/スタブのみで、実行パスは403/NotImplementedを返す：
- Phone（/api/call.* / call.place 実行）
- Proactive/Nudge 実行（/api/nudges/*）
- Relationship Graph 実行（/api/relationship/*）
- External Memory import/sync（Drive/Notion/Email）
- OS Deep Integrations 実行（Shortcuts/Extensions）
- Marketplace / Connector SDK 一般公開
- Public /v1/* の一般公開（Private β専用の認証なしで露出させない）

## Phase Switch（実装で必ず使う）
```typescript
// env.example
YOHAKU_PHASE=phase1  // phase1 | phase1_5 | phase2 | phase3

// middleware/phase-guard.ts
if (process.env.YOHAKU_PHASE === 'phase1') {
  if (action === 'call.place') {
    return res.status(403).json({ error: 'SEALED_IN_PHASE1' });
  }
}
```

## Connector Allowlist（phase1は2本固定）
```typescript
const CONNECTOR_ALLOWLIST_PHASE1 = ['webhook', 'calendar_hold'];

if (!CONNECTOR_ALLOWLIST_PHASE1.includes(connector)) {
  return res.status(403).json({ error: 'CONNECTOR_NOT_ALLOWED_IN_PHASE1' });
}
```

## Webhook Connector（phase1の主戦場）
```typescript
// 署名
WEBHOOK_SIGNING_SECRET=GENERATE_AT_DEPLOY_AND_ROTATE
WEBHOOK_SIGNING_ALG=HMAC-SHA256

// リトライポリシー
WEBHOOK_RETRY_POLICY={
  max_attempts: 8,
  backoff_seconds: [5, 15, 45, 120, 300, 600, 1200, 2400],
  giveup_after_seconds: 7200
}

// リージョンポリシー
WEBHOOK_REGION_POLICY={
  allowed_regions: ["JP", "US"],
  default_region: "JP"
}

// 許可ターゲット
WEBHOOK_ALLOWED_TARGETS={
  customer_owned_only: true,
  https_only: true,
  disallow_public_internet_without_allowlist: true,
  allowlist_domains: []
}
```

## Calendar Hold（phase1は "可逆 + 失敗しても価値が落ちない" を最優先）
```typescript
CALENDAR_HOLD_MODE=ics_fallback_first
ICS_TTL_DAYS=14
CALENDAR_DIRECT_OAUTH=SEALED  // phase1は禁止。phase1_5で検討
```

## Budget / Rate limit（事故防止：phase1は厳格）
```typescript
APPROVE_TTL_SECONDS=600
IDEMPOTENCY_TTL_HOURS=24
MAX_ACTIONS_PER_CONFIRM=5
MAX_WEBHOOKS_PER_MINUTE_PER_TENANT=120
MAX_CONFIRM_PER_MINUTE_PER_TENANT=30
```

## Conformance（ConfirmOS準拠テスト）v0
```
Artifacts（最低限）
- confirmos.schema.json
- confirmos.semantics.md
- conformance_tests/
  - T01_approve_ttl_10m
  - T02_confirm_requires_idempotency_key
  - T03_idempotency_conflict_returns_409
  - T04_undo_10s_reversible_only
  - T05_irreversibility_gate_double_approve_required
  - T06_execution_ledger_append_only_chain(prev_hash)
  - T07_webhook_signature_required
  - T08_webhook_idempotency_24h
  - T09_partial_success_contract(422/shape)
  - T10_webhook_retry_policy_backoff
  - T11_calendar_hold_reversible_or_ics_fallback
  - T12_policy_denies_out_of_allowlist_connector
  - T13_kill_switch_denies_when_frozen
  - T14_metering_counts_confirm_once

Versioning
- CONFIRMOS_VERSION=0.1
- Breaking change は major を上げる
```

## AXI Treaty（公開契約）v0
```
Definitions（固定）
- misexec_pct = 誤実行 / confirm件数（週次、7日移動平均）
- ledger_integrity = prev_hash チェーンが検証可能である割合
- webhook_delivery_success = 2h以内に成功した webhook_job の割合（attemptではない）

Treaty v0（初期案）
- misexec_pct > 0.5%（週）：当該週 Platform Fee の 25% クレジット
- misexec_pct > 1.0%（週）：当該週 Platform Fee の 100% クレジット
- ledger_integrity < 99.9%（週）：当該週請求を無効（0円）＋原因レポート
- webhook_delivery_success < 99.0%（週）：当該週 usage の 25% クレジット（当社起因のみ）
```

## Unit Economics Inputs（phase1：最低限）
```
avg_confirm_latency_ms_p50=1200
avg_confirm_latency_ms_p95=2500
avg_llm_cost_per_confirm_yen=1.2
avg_infra_cost_per_confirm_yen=0.8
target_gross_margin_phase1=75%
```

## Monetization（phase1：料金・課金単位・請求定義を確定）
```
BILLING_CURRENCY=JPY
BILLING_MODE_PHASE1=contract_then_invoice  # phase1は手動請求でもOK。必ず"計測"は自動でやる。

BILLING_UNIT_DEFINITIONS={
  confirm: "/v1/confirm が accept され ledger に CONFIRMED が1回書かれたもの（idempotencyで重複課金しない）",
  webhook_job: "webhook.dispatch action 1つ = 1 job（retry回数は課金しない）",
  calendar_hold: "calendar.hold.create action 1つ（ICS生成）"
}

PRICING_PHASE1_DEFAULTS={
  plan_design_partner: {
    price_jpy_per_month: 0,
    duration_days: 60,
    eligibility: "設計パートナー（週次で使う。改善に協力。ロゴ/事例は任意）",
    limits: {
      included_confirms_per_month: 50000,
      included_webhook_jobs_per_month: 50000
    },
    terms: {
      overage_confirm_jpy: 0,
      overage_webhook_job_jpy: 0
    }
  },
  plan_private_beta_starter: {
    price_jpy_per_month: 50000,
    included_confirms_per_month: 100000,
    included_webhook_jobs_per_month: 100000,
    included_calendar_holds_per_month: 100000,
    overage_confirm_jpy: 1.0,
    overage_webhook_job_jpy: 0.5,
    overage_calendar_hold_jpy: 0.2,
    support: "community + 48h response",
    sla: "none (phase1)"
  },
  plan_private_beta_pro: {
    price_jpy_per_month: 200000,
    included_confirms_per_month: 500000,
    included_webhook_jobs_per_month: 500000,
    included_calendar_holds_per_month: 500000,
    overage_confirm_jpy: 0.8,
    overage_webhook_job_jpy: 0.4,
    overage_calendar_hold_jpy: 0.15,
    support: "private channel + 24h response",
    sla: "none (phase1)"
  }
}

MONETIZATION_GOALS_PHASE1={
  by_day_45: "有料意志（LOI or paid pilot）を最低1社から取る",
  by_month_3: "MRR 50万円（=スターター10社 or プロ2〜3社）",
  by_month_6: "MRR 300万円（=スターター60社 or プロ15社目安）"
}
```

## ICP（phase1：最初の3社を"取りにいく相手"として確定）
```
ICP_PRIMARY="Webhookを受けられる（受け口を作れる）チーム"

ICP_PERSONA={
  title: "Agent / Automation Engineer (Owner)",
  pain: "実行が怖い（承認/監査/冪等/ロールバックを自前で作りたくない）",
  success: "安全に本番実行でき、監査で怒られない"
}

ICP_FIT_CHECKLIST（全部YESなら設計パートナー適格）={
  "社内に業務API or ワークフローがある（Webhookで受けたい）",
  "Slack/Email/Calendarが業務で必須",
  "承認が必要な作業がある（例：顧客通知、チケット作成、更新作業）",
  "監査/可視化の要求がある（ログが必要）",
  "PoCに2週間コミットできる（週1で改善サイクル）"
}

ICP_EXCLUDE_PHASE1（NO GO）={
  "支払い/解約/不可逆アクションが最初から必須（phase1は避ける）",
  "Webhook受け口を作れない（Receiver Starter Kitでも無理）",
  "法務/稟議が重すぎて3ヶ月以内に動かない"
}
```

## Receiver Starter Kit（phase1：導入摩擦を潰す"必須成果物"）
```
GOAL="相手がWebhook受け口を30分で作れる状態"

SHIP_IN_PHASE1={
  "@yohaku/signature (HMAC verify) ライブラリ",
  "receiver-starter (Cloudflare Worker) サンプル",
  "receiver-starter (Node/Express) サンプル",
  "Webhook Playground（署名/冪等/リトライを確認できる簡易UI）"
}

NON_GOALS_PHASE1={
  "大量のコネクタテンプレを増やす（2本固定）",
  "Marketplace（phase3）"
}
```

## Kill/Freeze（phase1：事故った瞬間に止められる"仕組み＋運用"を確定）
```
FREEZE_LEVELS={
  global: "全tenant停止",
  tenant: "特定tenant停止",
  connector: "特定tenantの特定connector停止",
  target: "特定target_url_hash停止"
}

BREAK_GLASS_COMMANDS（管理者のみ）={
  "POST /admin/freeze/global",
  "POST /admin/freeze/tenant/:id",
  "POST /admin/freeze/connector/:tenant/:connector",
  "POST /admin/freeze/target/:tenant/:target_hash"
}

AUTO_FREEZE_TRIGGERS（phase1は保守的に）={
  "misexec suspected event が1件でも発生 → tenant freeze + incident",
  "webhook delivery の 5xx/timeout が連続で一定回数 → connector freeze（再開は手動）",
  "allowlist外のconnector/actionが検出 → confirm拒否 + incident",
  "signature key mismatch の異常多発 → target freeze"
}

RUNBOOK_REQUIRED=true
POSTMORTEM_REQUIRED=true
```

## 30日スコアカード（phase1：合格/失格を固定して迷わない）
```
PASS_CONDITIONS_BY_DAY_30={
  "設計パートナー 3社（週次利用）",
  "合計 confirm >= 500 / week（3社合算、最低でも週次で増加傾向）",
  "approve→confirm conversion >= 60%",
  "webhook_delivery_success >= 99%（当社起因）",
  "ledger_integrity >= 99.9%",
  "misexec_pct < 0.5%（理想は0）",
  "Receiver Starter Kit で '30分導入' の実証 3社中2社以上"
}

FAIL_FAST_TRIGGERS={
  "Day14時点で設計パートナー0〜1社 → ICP/導線/Receiver kitを最優先で修正",
  "misexecが発生 → 即Freeze + 原因解明が終わるまで拡販停止",
  "webhook_successが当社起因で98%未満が継続 → 信頼改善まで新規導入停止",
  "TTC（Time-to-Confirm）p95が5秒を超えて悪化 → 性能改善まで拡張禁止"
}
```

## Go基準（phase1 → phase1_5）
- 設計パートナー3社が週次で使っている（/confirmが増える）
- webhook_delivery_success ≥ 99%
- misexec_pct < 0.5%
- ledger_integrity ≥ 99.9%
- Receiver Kitで導入が"短い"実証がある
- 有料意志（LOI or paid pilot）を最低1社から取る

