# =========================================
# Cursor Pack – Yohaku
# FULL INTEGRATED MASTER / EXIT-FIRST / KYA-READY / VALUATION LADDER (Gate1=100B → Gate2=1500B → Gate3=Notion) / M&A-READY / SHIP-RAILS
# vNext + Legacy Chapters ✅10/10³
#
# North Star（矛盾ゼロ：Gate1→Gate2→Gate3の“増やし方”を最初から固定し、M&Aは常に“選べるオプション”にする）
#   - Gate1（100B / 独立が成立する最低ライン）:
#       - 目標：Valuation >= ¥10B（=100億円+）
#       - 目安：ARR ¥0.7B〜¥1.0B（7〜10億円） × 10〜15x
#       - 到達の意味：プロダクトが“事業”になり、買収が来ても断れる土台ができる
#   - Gate2（1500B / ユニコーン級＝標準化が現実になるライン）:
#       - 目標：Valuation >= ¥150B（=1,500億円+）
#       - 目安：ARR ¥7.5B〜¥10B（75〜100億円） × 15〜20x（勝者multiple前提）
#       - 到達の意味：/confirmが“業界の当たり前”に寄り、Compatibleが外部で回り始める
#   - Gate3（Notion級 / Decacornレンジ＝産業のOSを書き換えるライン）:
#       - 目標：Valuation >= ¥1T〜¥2T（=1兆〜2兆円）
#       - 目安：ARR ¥50B〜¥120B（500〜1,200億円） × 15〜25x（標準化×高NRR×高成長）
#       - 到達の意味：Exit（ConfirmOS）が“中立インフラ”として埋め込まれ続ける
#   - 原理：/confirm（確定）の“流量” × “規格（Conformance+Treaty+KYA）” × “中立（Provider Neutral）”
#   - 重要：Phase1（0–6m）はGate1の最短ルートに全振り（Webhook+Calendar Hold固定）。
#           Gate2/3は phase2/3 で段階解禁（Cursorの暴走＝拡張実装を防ぐ）。
#
# Action Cloud (Exit Layer) FIRST:
#   /plan → /approve → /confirm → ledger → receipt（PoEx）
#
# Phase1（0–6m）:
#   Webhook + Calendar Hold（低リスクなデジタルアクション2本に固定）
#
# KYA（Know Your Agent）:
#   “誰が（どのエージェントが）/誰の代理で/どの権限で” 実行したかを
#   すべてのconfirmで必ず刻む（監査・責任・停止の前提）
#
# Conformance + Treaty（標準化）:
#   “設計”ではなく“実装物”として前倒し（椅子取り開始）
#
# M&A Optionality（買収が来ても断れる状態）:
#   - 中立Exit（入口に依存しない） + 互換性（Conformance） + 信頼の価格（Treaty） + 責任（KYA）で、
#     “どこかの機能”ではなく“業界標準”になりに行く
#
# Phone / Proactive / Memory imports / OS deep / Marketplace / Public API一般公開は SEALED
#
# 10/10³化（Gate1→Gate2→Gate3 & 断れるM&Aのための追加10点）
# 1) Gate1/2/3 Gate（ARR/NRR/GM/Trust/SLO）を明文化（評価軸を固定）
# 2) “M&Aが来ても断れる” 条件（独立スケールの方程式）を明文化
# 3) Pricing Ladder（小→中→大）を追加：MRR 8,000万円級までの道筋を固定（Gate1）
# 4) “Enterpriseに行ける設計”をSEALEDで保持（SAML/SCIM/RBAC/Region/SOC2）
# 5) Multi‑planner / Provider Neutral（OpenAI依存を断つ）を“仕様”に格上げ
# 6) Standard Flywheel（Compatible badge → Treaty → Audit/Receipt）を配布の主軸に格上げ
# 7) Expansion Engine（同一tenant内で agent数・action数が増える）をKPI化
# 8) Data Room Ready（買収・調達に強い指標/ログ/契約）を最初から整備
# 9) “Giant’s Perimeter” 戦略（巨人の周辺を顧客にする）をGTMに固定
# 10) Funding Rails（薄めても勝つ / 薄めずに勝つ の分岐条件）を固定
# =========================================


# =========================================
# 目的（ズレたら負け）
# =========================================
# - 「AIエージェントの出口（ConfirmOS）」を握る：
#     安全に“確定（Confirm）”できる実行レイヤーを標準化する
# - 0–6mは “電話でPMF” ではなく “ExitレイヤーでPMF” を最短で取る
# - phase1は “低リスクなデジタルアクション2本（Webhook + Calendar Hold）” に絞り、速度と信頼を最大化する
# - “勝手に増える” を作る：Team Viral（承認リンク）＋ Receiver Starter Kit（導入テンプレ）＋ Compatible badge でPLGを回す
# - 2026の前提（a16z/DeepMind文脈）：
#     AIは「答える」→「実行する」。その世界では“承認設計/KYA/監査/停止”が必須インフラになる
# - Valuation Ladderの前提（Gate1→Gate2→Gate3）：
#     Exitは“機能”ではなく“標準（互換+責任+監査+補償）”になった瞬間に爆発する
#
# このファイルの読み方（最重要）
# 1) Phase1 Focus Rules と SEALED を守る（ここに違反する実装は禁止）
# 2) PRD_PHASE1（Exit-first）の受け入れ基準（DoD）に沿って作る
# 3) ConfirmOS（approve/confirm/idempotency/ledger/undo/gate/KYA）を最優先で堅くする
# 4) Conformance Suite + Treaty v0 を “実装物” として完成させる（椅子取り開始）
# 5) 30日スコアカードを毎週見て、勝ち筋だけに集中する（増やさない）
# 6) Gate1（100B）→Gate2（1500B）→Gate3（Notion級）の順で、拡張の順番を間違えない
#
# 用語
# - “Exit” = 実行の責任・監査・可逆性・停止を提供する層（ConfirmOS）
# - “SEALED” = phase1で「DB/ログ/スタブはOK」だが「本番で実行されるパスは禁止」な機能群
# - “Phase Switch” = YOHAKU_PHASE で実行可能機能を強制（文章ではなくガードで縛る）
# - “KYA” = Know Your Agent：実行主体（agent）/代理（principal）/委任（delegation）を追跡可能にする
# - “Dynamic Agent Layer” = UIではなくエージェントが業務を進める層（入口）。Yohakuは中立のExitとして埋め込まれる
#
# =========================================
# Phase Switch（実装で必ず使う）
# =========================================
# - YOHAKU_PHASE = phase1 | phase1_5 | phase2 | phase3
#   - phase1   : 0–6m（Exit-first / Webhook+CalendarHold固定 / Private β / Conformance+Treaty v0 / 低リスクのみ）
#   - phase1_5 : 6–12m（Private β拡張 / 追加コネクタ最小 / Phone=限定解禁“可” だが主戦場ではない）
#   - phase2   : 12–24m（β / 招待制 / Enterprise要件の一部解禁 / Conformance公開 / Yohaku-Compatible開始 / KYA強化）
#   - phase3   : 24–36m（GA / Enterprise / SLA 99.9% / Marketplace解禁）
#
# SEALED強制（必須）
# - phase1 では以下のAPI/機能は必ず 403/NotImplemented を返す（実装しても実行不可）
#   - Phone（/api/call.* / call.place 実行） ※設計・スタブのみ
#   - Proactive/Nudge 実行（/api/nudges/*）
#   - Relationship Graph 実行（/api/relationship/*）
#   - External Memory import/sync（Drive/Notion/Email）
#   - OS Deep Integrations 実行（Shortcuts/Extensions）
#   - Marketplace / Connector SDK 一般公開
#   - Public /v1/* の一般公開（Private β専用の認証なしで露出させない）
# - CI/Lint で "SEALED_EXECUTION" タグが production build に入ったら fail
#
# =========================================
# Valuation Ladder STRATEGY（Gate1=100B / Gate2=1500B / Gate3=Notion級）
# =========================================
# 重要：M&Aが来ても断れる会社は「標準化で勝ってる」会社だけ。
# 逆に “買われるための会社” は買われなかった瞬間に終わる。
#
# Valuation Ladder（矛盾ゼロの定義）
# - Gate1 = 100B（¥10B）: “事業として成立”。最短で踏む。
# - Gate2 = 1500B（¥150B）: “標準化が現実になる”。勝者multipleが付く。
# - Gate3 = Notion級（¥1T〜¥2T）: “産業のOSを書き換える”。グローバル標準として埋め込まれる。
#
# ルール（最重要）
# - phase1は Gate1 に全振り（2本固定）。Gate2/3を狙うほど、phase1で増やすと死ぬ。
# - Gate2/3は “機能の追加” ではなく “標準の外部循環（Conformance+Treaty）” と “流量の増加（/confirm）” が本体。
#
# -----------------------------------------
# Gate1（100B Gate / 達成条件の目安）
# -----------------------------------------
# - Valuation: >= ¥10B（=100億円+）
# - ARR: ¥0.7B〜¥1.0B（7〜10億円）
# - Gross Margin: >= 70%（理想80%+）
# - NRR: >= 130%（同一tenant内で agent数・confirm数が増える設計＝Expansion）
# - Trust: misexec_pct < 0.2%（理想0） / ledger_integrity >= 99.95% / webhook_delivery_success >= 99.5%（当社起因）
# - Standardization: Conformance runs が週次で外部で回り、Compatibleが増え続ける
#
# Gate1 Recipe（到達の典型パターン）
# - Pattern A（Enterprise少数×高単価）
#   - 30社 × ¥2,000,000/月（Platform）= MRR ¥60,000,000（ARR ¥720,000,000）
#   - Usage overage + Expansion で ARR ¥1.0B+ を狙う
# - Pattern B（Mid-market多数×中単価）
#   - 150社 × ¥500,000/月 = MRR ¥75,000,000（ARR ¥900,000,000）
# - Pattern C（PLG長尾×Usage爆発）
#   - 1,000社 × ¥80,000/月（平均）= MRR ¥80,000,000（ARR ¥960,000,000）
#
# -----------------------------------------
# Gate2（1500B Gate / 達成条件の目安）
# -----------------------------------------
# - Valuation: >= ¥150B（=1,500億円+）
# - ARR: ¥7.5B〜¥10B（75〜100億円）
# - Multiple: 15〜20x（勝者条件：高成長・高NRR・高粗利・低リスク）
# - Gross Margin: >= 80%（COGS最適化：plannerコスト/配信/運用を圧縮）
# - NRR: >= 135%（Expansionが“当たり前”）
# - Trust: misexec_pct < 0.1% / ledger_integrity >= 99.99% / webhook_delivery_success >= 99.7%
# - Standardization: Conformance + Treaty が“外部”で回り、Compatibleが増え続ける（自社営業に依存しない）
# - Distribution: Team Viral + Compatible badge + Receipt/監査導線が “勝手に増える” を成立させている
#
# Gate2 Recipe（典型パターン）
# - Pattern D（Enterprise 〜数百社×高単価）
#   - 300社 × ¥3,000,000/月 = MRR ¥900,000,000（ARR ¥10.8B）
# - Pattern E（Mid-market 〜数千社×中単価）
#   - 2,000社 × ¥400,000/月 = MRR ¥800,000,000（ARR ¥9.6B）
# - Pattern F（PLG長尾×Usageがデファクト化）
#   - 10,000社 × ¥80,000/月（平均）= MRR ¥800,000,000（ARR ¥9.6B）
#
# Gate2で “増やすもの”（順番）
# 1) Conformance公開（Compatibleを外部循環させる）※phase2で開始
# 2) Enterprise要件を段階解禁（SAML/SCIM/RBAC/Region）※phase2→phase3
# 3) Connector増加は “低リスク→中リスク” の順（不可逆は最後）※phase2以降
# 4) Treatyを現実の購買要件にする（監査/補償/停止のパッケージ化）
#
# -----------------------------------------
# Gate3（Notion級 Gate / 達成条件の目安）
# -----------------------------------------
# - Valuation: >= ¥1T〜¥2T（=1兆〜2兆円）
# - ARR: ¥50B〜¥120B（500〜1,200億円）
# - Multiple: 15〜25x（標準化の覇権 + 高成長 + 高NRR）
# - NRR: >= 140%（“同一社内で増える”が極まる）
# - Standardization: ConfirmOS（Exit）が “中立インフラ” として埋め込まれ続ける（入口が変わっても残る）
# - Ecosystem: Marketplace + Provider/Connector認定 + Compatible network effects
# - Trust: Treatyが“調達/監査/法務”の共通言語になる（買い手が違っても通る）
#
# Gate3で “増やすもの”（順番）
# 1) Marketplace（phase3）で“入口”を爆増（ただしExit準拠が前提）
# 2) グローバルリージョン/SLA/監査基盤（Enterpriseの本丸）
# 3) 透明性ログ（PoExの強化：Merkle/透明性）で監査の中心へ
# 4) “規格の戦争”を勝つ（Conformance + Treaty を外部の共通インフラにする）
#
# “断れるM&A” を成立させる条件（非交渉）
# 1) Provider Neutral（OpenAI/Google/Anthropic どれでも動く）= planner/LLMを交換可能
# 2) 中立Exit（入口に寄らない）= どこが買っても “採用しやすい”
# 3) 規格（Conformance）と契約（Treaty）が “外部で回ってる”
# 4) Receipt/ledger が監査の中心になり始めている（スイッチングコスト）
# 5) “巨人の周辺” に既に顧客がいる（買収の動機が強い）
#
# =========================================
# 10/10³ FINALIZATION ADDENDUM（phase1で必ず守る：未確定のまま実装しない）
# =========================================

## A) ENV / 実運用パラメータ（あなたの環境で差し替え）
- YOHAKU_APP_ORIGIN= https://yohaku.app
- YOHAKU_API_ORIGIN= https://api.yohaku.app
- YOHAKU_STATUS_ORIGIN= https://status.yohaku.app
- DEFAULT_TZ= Asia/Tokyo
- YOHAKU_PHASE= phase1

## B) Phase1 Connector Allowlist（phase1は2本固定）
- CONNECTOR_ALLOWLIST_PHASE1= ["webhook", "calendar_hold"]
- Any other connector MUST be 403 in phase1.

## C) Webhook Connector（phase1の主戦場）
- WEBHOOK_SIGNING_SECRET= GENERATE_AT_DEPLOY_AND_ROTATE
- WEBHOOK_SIGNING_ALG= HMAC-SHA256
- WEBHOOK_SIGNATURE_HEADERS=
  - required: ["X-Yohaku-Signature", "X-Yohaku-Timestamp", "X-Idempotency-Key", "X-Yohaku-Job-Id"]
  - timestamp_skew_seconds: 300   # 5分以上ズレたら拒否（replay対策）
- WEBHOOK_RETRY_POLICY=
  - max_attempts: 8
  - backoff_seconds: [5, 15, 45, 120, 300, 600, 1200, 2400]
  - giveup_after_seconds: 7200
- WEBHOOK_REGION_POLICY=
  - allowed_regions: ["JP", "US"]
  - default_region: "JP"
- WEBHOOK_ALLOWED_TARGETS（SSRF/誤送信の根）
  - customer_owned_only: true
  - https_only: true           # devのみ http可（DEV_ALLOW_LOCALHOST）
  - disallow_private_ip: true  # 127.0.0.1/10.0.0.0/169.254/::1 等は禁止（dev例外のみ）
  - must_be_registered: true   # connector_configs.registered_urls に登録済みだけ送る（phase1必須）
  - deny_redirect: true        # 30xで別hostへ逃げるの禁止（初期は保守）
  - allowlist_domains: []      # 追加制限したい時だけ使う（空=制限なし）
- CONNECTOR_CONFIG_SCHEMA_WEBHOOK（phase1の事前登録制）
  - connector_configs.config_json.registered_urls:
      - url: "https://example.com/webhook"
        enabled: true
        note: "customer-owned"
      - url: "http://localhost:4001/webhook"
        enabled: true
        note: "dev only"

## D) Calendar Hold（phase1は “可逆 + 失敗しても価値が落ちない” を最優先）
- CALENDAR_HOLD_MODE= "ics_fallback_first"
- ICS_TTL_DAYS= 14
- CALENDAR_DIRECT_OAUTH= SEALED (phase1は禁止。phase1_5で検討)

## E) Budget / Rate limit（事故防止：phase1は厳格）
- APPROVE_TTL_SECONDS= 600
- IDEMPOTENCY_TTL_HOURS= 24
- MAX_ACTIONS_PER_CONFIRM= 5
- MAX_WEBHOOKS_PER_MINUTE_PER_TENANT= 120
- MAX_CONFIRM_PER_MINUTE_PER_TENANT= 30

## F) Conformance（ConfirmOS準拠テスト）v0.3（10/10³）
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
  - T15_kya_executor_is_recorded(api_key_id_or_agent_id)
  - T16_kya_principal_is_traceable(approve→confirm)
  - T17_webhook_timestamp_replay_protected
  - T18_webhook_target_must_be_registered
  - T19_provider_neutral_planner_mock_rules_work
  - T20_receipt_contains_kya_and_policy_ref

Versioning
- CONFIRMOS_VERSION= 0.3
- Breaking change は major を上げる

## G) AXI Treaty（公開契約）v0：数字で責任を固定（“標準の牙”）
Definitions（固定）
- misexec_pct = 誤実行 / confirm件数（週次、7日移動平均）
- ledger_integrity = prev_hash チェーンが検証可能である割合
- webhook_delivery_success = 2h以内に成功した webhook_job の割合（attemptではない）
Treaty v0（初期案）
- misexec_pct > 0.5%（週）：当該週 Platform Fee の 25% クレジット
- misexec_pct > 1.0%（週）：当該週 Platform Fee の 100% クレジット
- ledger_integrity < 99.9%（週）：当該週請求を無効（0円）＋原因レポート
- webhook_delivery_success < 99.0%（週）：当該週 usage の 25% クレジット（当社起因のみ）

## H) Unit Economics Inputs（phase1：最低限）
- avg_confirm_latency_ms_p50= 1200
- avg_confirm_latency_ms_p95= 2500
- avg_llm_cost_per_confirm_yen= 1.2
- avg_infra_cost_per_confirm_yen= 0.8
- target_gross_margin_phase1= 75%

## I) Monetization（phase1：料金・課金単位・請求定義を確定）※Gate1対応でLadder追加
- BILLING_CURRENCY= JPY
- BILLING_MODE_PHASE1= "contract_then_invoice"   # phase1は手動請求でもOK。必ず“計測”は自動でやる。
- BILLING_UNIT_DEFINITIONS=
  - confirm: "/v1/confirm が accept され ledger に CONFIRMED が1回書かれたもの（idempotencyで重複課金しない）"
  - webhook_job: "webhook.dispatch action 1つ = 1 job（retry回数は課金しない）"
  - calendar_hold: "calendar.hold.create action 1つ（ICS生成）"
- PRICING_PHASE1_DEFAULTS=
  - plan_design_partner:
      price_jpy_per_month: 0
      duration_days: 60
      eligibility: "設計パートナー（週次で使う。改善に協力。ロゴ/事例は任意）"
      limits:
        included_confirms_per_month: 50000
        included_webhook_jobs_per_month: 50000
        included_calendar_holds_per_month: 50000
      terms:
        overage_confirm_jpy: 0
        overage_webhook_job_jpy: 0
        overage_calendar_hold_jpy: 0
  - plan_private_beta_starter:
      price_jpy_per_month: 50000
      included_confirms_per_month: 100000
      included_webhook_jobs_per_month: 100000
      included_calendar_holds_per_month: 100000
      overage_confirm_jpy: 1.0
      overage_webhook_job_jpy: 0.5
      overage_calendar_hold_jpy: 0.2
      support: "community + 48h response"
      sla: "none (phase1)"
  - plan_private_beta_pro:
      price_jpy_per_month: 200000
      included_confirms_per_month: 500000
      included_webhook_jobs_per_month: 500000
      included_calendar_holds_per_month: 500000
      overage_confirm_jpy: 0.8
      overage_webhook_job_jpy: 0.4
      overage_calendar_hold_jpy: 0.15
      support: "private channel + 24h response"
      sla: "none (phase1)"
  - plan_private_beta_team:            # Gate1 Ladder（中単価）
      price_jpy_per_month: 500000
      included_confirms_per_month: 2000000
      included_webhook_jobs_per_month: 2000000
      included_calendar_holds_per_month: 2000000
      overage_confirm_jpy: 0.6
      overage_webhook_job_jpy: 0.3
      overage_calendar_hold_jpy: 0.10
      support: "private channel + 12h response"
      sla: "none (phase1)"
  - plan_enterprise_preview:           # phase1でも契約は可能（SLA無し/監査強化で価値）
      price_jpy_per_month: 2000000
      included_confirms_per_month: 10000000
      included_webhook_jobs_per_month: 10000000
      included_calendar_holds_per_month: 10000000
      overage_confirm_jpy: 0.4
      overage_webhook_job_jpy: 0.2
      overage_calendar_hold_jpy: 0.06
      support: "private channel + 4h response"
      sla: "none (phase1)"
      note: "Enterprise機能（SAML/SCIM等）はphase2で解禁。phase1は“Exit品質+監査+Treaty”で売る。"
- MONETIZATION_GOALS（Gate1逆算の目標：レンジで持つ）
  - by_month_3:  "MRR ¥1,000,000〜¥3,000,000（有料意志を2社以上）"
  - by_month_6:  "MRR ¥3,000,000〜¥10,000,000（Starter/Pro/Teamが混ざる）"
  - by_month_12: "MRR ¥15,000,000〜¥30,000,000（Team/Enterpriseが入り始める）"
  - by_month_18: "MRR ¥40,000,000〜¥60,000,000（ARR ¥480,000,000〜¥720,000,000）"
  - by_month_24: "MRR ¥70,000,000〜¥90,000,000（ARR ¥840,000,000〜¥1,080,000,000）= Gate1圏内"
- RULE（Gate1のための非交渉）
  - "Usage課金は ‘/confirm’ に寄せる（出口＝確定が主商品）"
  - "retry/attempt課金しない（信頼の毀損）"
  - "Platform Fee は ‘信頼（監査/停止/KYA/Treaty/Conformance）’ で正当化する"
  - "単価を上げる前に ‘SLO/監査/責任’ を固める（Treatyが裏付け）"

## J) ICP（phase1：最初の3社 + Gate2/3へ伸びる顧客像）
- ICP_PRIMARY= "Webhookを受けられる（受け口を作れる）チーム"
- ICP_WEDGE_TEMPLATE（推奨）:
  - "ITSM/SRE/運用：申請→承認→実行（チケット/権限/通知/ロールバック）"
  - 理由：confirm頻度が高い / 監査が必要 / 事故コストが見える（Exit価値が刺さる）
- ICP_PERSONA=
  - title: "Agent / Automation Engineer (Owner)"
  - pain: "実行が怖い（承認/監査/冪等/ロールバック/停止/KYAを自前で作りたくない）"
  - success: "安全に本番実行でき、監査で怒られない。誰の代理で何をしたか追える。止められる。"
- ICP_SECONDARY（Gate2/3で重要）:
  - title: "Security / Compliance / Platform Team"
  - pain: "エージェントが増えるほど責任が崩れる。誰が実行したか追えない。止められない。"
  - success: "KYA + Treaty + ledger/receipt が標準で、審査が通る。"
- ICP_FIT_CHECKLIST（全部YESなら設計パートナー適格）=
  - "社内に業務API or ワークフローがある（Webhookで受けたい）"
  - "Slack/Email/Calendarが業務で必須"
  - "承認が必要な作業がある（例：顧客通知、チケット作成、更新作業）"
  - "監査/可視化の要求がある（ログが必要）"
  - "エージェントが複数走っている/走らせたい（誰が実行したか追跡したい）"
  - "PoCに2週間コミットできる（週1で改善サイクル）"
- ICP_EXCLUDE_PHASE1（NO GO）=
  - "支払い/解約/不可逆アクションが最初から必須（phase1は避ける）"
  - "Webhook受け口を作れない（Receiver Starter Kitでも無理）"
  - "法務/稟議が重すぎて3ヶ月以内に動かない"

## K) Receiver Starter Kit（phase1：導入摩擦を潰す“必須成果物”）
- GOAL= "相手がWebhook受け口を30分で作れる状態"
- SHIP_IN_PHASE1=
  - "@yohaku/signature (HMAC verify + timestamp skew) ライブラリ"
  - "receiver-starter (Cloudflare Worker) サンプル"
  - "receiver-starter (Node/Express) サンプル"
  - "Webhook Playground（署名/冪等/リトライ/スキューを確認できる簡易UI）"
- NON_GOALS_PHASE1=
  - "大量のコネクタテンプレを増やす（2本固定）"
  - "Marketplace（phase3）"

## L) Kill/Freeze（phase1：事故った瞬間に止められる“仕組み＋運用”）
- FREEZE_LEVELS=
  - global: "全tenant停止"
  - tenant: "特定tenant停止"
  - connector: "特定tenantの特定connector停止"
  - target: "特定target_url_hash停止"
- BREAK_GLASS_COMMANDS（管理者のみ）=
  - "POST /admin/freeze/global"
  - "POST /admin/freeze/tenant/:id"
  - "POST /admin/freeze/connector/:tenant/:connector"
  - "POST /admin/freeze/target/:tenant/:target_hash"
- AUTO_FREEZE_TRIGGERS（phase1は保守的に）=
  - "misexec suspected event が1件でも発生 → tenant freeze + incident"
  - "webhook delivery の 5xx/timeout が連続で一定回数 → connector freeze（再開は手動）"
  - "allowlist外のconnector/actionが検出 → confirm拒否 + incident"
  - "signature mismatch / timestamp skew の異常多発 → target freeze"
- RUNBOOK_REQUIRED= true
- POSTMORTEM_REQUIRED= true

## M) 30日スコアカード（phase1：合格/失格を固定して迷わない）
- PASS_CONDITIONS_BY_DAY_30=
  - "設計パートナー 3社（週次利用）"
  - "合計 confirm >= 500 / week（3社合算、最低でも週次で増加傾向）"
  - "approve→confirm conversion >= 60%"
  - "webhook_delivery_success >= 99%（当社起因）"
  - "ledger_integrity >= 99.9%"
  - "misexec_pct < 0.5%（理想は0）"
  - "KYA: 実行者（agent/api_key）と承認者（principal）が追跡可能（T15/T16 pass）"
  - "Receiver Starter Kit で ‘30分導入’ の実証 3社中2社以上"
- FAIL_FAST_TRIGGERS=
  - "Day14時点で設計パートナー0〜1社 → ICP/導線/Receiver kitを最優先で修正"
  - "misexecが発生 → 即Freeze + 原因解明が終わるまで拡販停止"
  - "webhook_successが当社起因で98%未満が継続 → 信頼改善まで新規導入停止"
  - "TTC（Time-to-Confirm）p95が5秒を超えて悪化 → 性能改善まで拡張禁止"

## N) KYA（Know Your Agent）/ Delegation（phase1の最小・必須）
目的：エージェント時代の“責任”を成立させる。
phase1でやるのは「強い暗号証明」ではなく「確実な追跡・監査」＝事故を減らす最小。

- KYA_IDENTITY_MODEL_PHASE1（必須）:
  - “Agent identity = API Key” を基本とする（エージェントごとにAPIキーを分ける。共有禁止）
  - すべての /plan /approve /confirm は request_context に api_key_id を持ち、ledger/receiptに刻む
- OPTIONAL_AGENT_LABEL（任意・推奨）:
  - Header: X-Yohaku-Agent-Id（顧客側の安定ID。存在すれば hash して保存）
  - Header: X-Yohaku-Agent-Label（表示名。ログ/receiptに載せる）
- PRINCIPAL_MODEL_PHASE1（必須）:
  - “Principal = 承認者（human）” を approvals に刻み、confirmで参照可能にする（approve→confirmの鎖）
  - 承認がAPI経由でも、人間の識別子（user_id/email_hash/SSO subject）を残す
- DELEGATION_CHAIN_PHASE1（必須）:
  - approve_id が delegation の基点（誰が何を承認したか）
  - confirm は approve_id を必須とし、executor（api_key_id）とprincipal（approve actor）を結びつける
- RECEIPT_REQUIREMENTS（必須）:
  - receiptに “executor(api_key_id/agent_id)” と “principal(approver)” と “policy_ref（もしあれば）” を表示
  - 監査エクスポートで同じ情報が出る
- PHASE2_UPGRADE（SEALED：設計のみ）:
  - agent certificate / attestation（署名付き）
  - delegation token（期限付き権限委任）
  - KYA registry（agents table）と失効

## O) Provider Neutral / Planner Resilience（OpenAIが死んでも検証が止まらない）
- PLANNER_MODE= "openai" | "mock" | "rules"
  - openai: 通常
  - mock: 決め打ちプラン（最小チェック/CI/デモ用）
  - rules: ルールベース（入力パターン→固定テンプレ）
- PROVIDER_NEUTRAL_RULE（必須）
  - "plannerは差し替え可能（OpenAI / Anthropic / Google / local）"
  - "Exit（approve/confirm/ledger/receipt/freeze）はproviderに依存しない"
- RULE: “openaiが落ちても /approve /confirm /ledger /webhook /freeze /metering は検証できる” を絶対に守る
- MOCK_PLAN_DEFAULT（例）
  - calendar.hold.create(ics)
  - webhook.dispatch(registered connector_id)
  - confirm_sheet（Reversible/Idempotent）を必ず付ける

## P) Ship Rails（Cursorが暴走しない“出す”ためのルール）
- 1 PR = 1論点（200〜400行目安）
- 追加コネクタは禁止（phase1固定）
- 追加DBテーブルは最小（KYAはまず “api_key_idを刻む”）
- Conformance（T01〜T20）をCIで毎回回す
- SEALED lint（sealed実行パス/ルートがprodに入ったらfail）
- “見た目UI”より “実行の責任（ledger/receipt/freeze/KYA/Treaty）” を優先

## Q) Funding Rails（薄めても勝つ / 薄めずに勝つ）
- FUNDING_STRATEGY_DEFAULT（推奨：Gate2/3まで射程に入れる）
  - "PMFまで：最小（できれば薄めない）"
  - "PMF後：スピードが勝つなら調達（薄めてもGate2/3に行けるなら正解）"
- FUNDING_TRIGGERS（調達が合理的になる条件）
  - "週次confirmが増え続ける（3社→10社で再現）"
  - "NRRの兆し（同一社でagent数が増える）"
  - "Treaty/Conformanceが ‘審査に効く’ と証明できた"
- DILUTION_GUARDRAILS（目安）
  - "Series A後でもFounder >= 20% を目標（難しければ ‘Gate2/3到達の速度’ を優先）"
  - "Board control は “方向性がブレない” ために守る（細部は弁護士と設計）"


# =========================================
# BEGIN: README.md
# =========================================
# Yohaku Action Cloud – エージェントの“出口（確定）”を安全にする実行レイヤー
> We don’t sell “agents”. We sell “safe confirmation”.

## 一言要約（phase1 / Exit-first / Private β）
- AIエージェントが増える世界で一番危ないのは「勝手に実行される」こと。
- Yohakuは、どの入口（LLM/音声/UI）から来ても、**Plan→Approve→Confirm** を安全に回す **中立Exitレイヤー**。
- phase1は **Webhook + Calendar Hold（ICS）** の2本だけに固定して、速度と信頼を最大化する。
- 導入摩擦は **Receiver Starter Kit** で潰す（30分でWebhook受け口）。
- すべての実行は **KYA（どのagentが誰の代理で何をしたか）** を追跡可能にする。

## Valuation Ladder（Gate1→Gate2→Gate3）
- Gate1（100億）：事業として成立し、買収が来ても断れる土台
- Gate2（1500億）：標準化が現実になり、勝者multipleが付く
- Gate3（Notion級）：中立インフラとして産業に埋め込まれ続ける
- Yohakuの勝ち筋は一貫：**/confirmの流量 × 規格（Conformance+Treaty+KYA） × 中立（Provider Neutral）**

## Phase1のコア体験（Builders / Teams）
1) Agentが /plan を叩く（複数案 or 1案）
2) 人間 or ルールが /approve（TTL10分）
3) /confirm が実行（idempotency必須）
4) ledger（監査台帳）に残る（KYA込み）
5) “Value Receipt（実行レシート）”で社内共有（Team Viral）

## “出口を握る”の核（ここが本体）
- 実行の責任（同意/監査/可逆性/冪等/停止/KYA）を **ConfirmOS** として標準化
- **Conformance（準拠テスト）+ Treaty（公開契約）** で互換の中心と信頼の価格を作る
- コネクタは後から増やせる。出口の仕様を先に固定するのが勝ち筋。

## phase1 Focus Rules（非交渉）
- ✅ Exit-first：ConfirmOS + Action Cloud（Private β）
- ✅ コネクタ2本固定：Webhook + Calendar Hold（増やさない）
- ✅ Conformance + Treaty v0.3 を“実装物”として完成
- ✅ Receiver Starter Kit（導入摩擦を潰す）を同時に出す
- ✅ Kill/Freeze（事故停止）を仕組みで持つ
- ✅ KYA（executor/principal/delegation）をledger/receiptに刻む
- ✅ Provider Neutral / Planner resilience（mock/rules）で検証を止めない
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
- kya_executor_coverage（executorが欠損してない割合=100%）
- unique_agents_per_tenant（API key/agent idの数）

# =========================================
# END: README.md
# =========================================


# =========================================
# BEGIN: docs/VISION.md
# =========================================
# VISION – AI時代の“責任ある実行”を標準化する（Gate2/3は標準化で取る）
エージェントが普及すると「実行」の総量が増える。  
事故の総量も増える。  
だから世界は **Exit（確定/責任/監査/停止）** を必要とする。

## Valuation Ladderのコア仮説（Gate1→Gate2→Gate3）
- “システムを作った人”ではなく、“業界標準を作った人”が勝つ。
- Gate1は「事業として成立」。
- Gate2は「標準化が回り始める」。
- Gate3は「産業のOSとして埋め込まれ続ける」。
- Exitの標準は
  - 互換（Conformance）
  - 補償（Treaty）
  - 責任（KYA）
  - 監査（ledger/receipt）
 で成立する。

## プロダクト憲法
1. 実行は必ず approve を通す（例外なし）
2. すべての confirm は ledger に残る（監査可能）
3. 取り消し可能なものは取り消せる（Undo/rollback）
4. 不可逆は Gate（二重承認＋人）を必須にする（phase1は実行禁止）
5. phase1は“低リスク”だけ（Webhook/CalendarHold）
6. 仕様はConformanceで縛る（互換性をテストで保証）
7. 信頼はTreatyで売る（定義と補償を数字で固定）
8. 開発者体験（DX）で10xを作る（自前実装の地獄から救う）
9. 入口（LLM/UI）は中立（どの入口でも使える）
10. 拡張は後（phase1は増やさない）
11. KYA：すべての実行は“誰が/誰の代理で”を追跡可能にする（責任がない実行は禁止）
12. 検証は止めない：Plannerはmock/rulesで落ちても回る
13. Gate2/3は “流量×規格” で取る（売上は結果）

## Riskiest Assumptions（phase1）
1) “安全な実行” を欲しがる設計パートナーを3社取れるか
2) /confirm が週次で増えるか（volumeが出るか）
3) Conformance/Treatyが導入の摩擦を下げるか（逆に上げないか）
4) Webhook/CalendarHoldだけで “10x価値” を感じてもらえるか
5) 30分導入（Receiver Kit）が本当に実現できるか
6) KYA（executor/principal）が“導入理由”になるか（監査・責任）
7) Provider Neutral が本当に効くか（買収・独立の両方で重要）

# =========================================
# END: docs/VISION.md
# =========================================


# =========================================
# BEGIN: docs/PRD_PHASE1.md
# =========================================
# PRD – phase1（Exit-first / Private β / Webhook + Calendar Hold）

## 対象ユーザー（phase1 / ICP）
- エージェント開発チーム（LLM/Agentを作ってる）
- 縦SaaSの自動化チーム（社内/顧客向けワークフローを持つ）
- 企業内自動化（Ops/RevOps/CS）チーム
※ “Webhook受け口を作れる” が必須条件（Receiver Starter Kitで補助）

## phase1の“確定”とは
- 人間 or ポリシーが approve した内容だけを実行する
- 実行結果を ledger と receipt（PoEx）に残す
- 実行主体（KYA：executor agent/api_key）と承認者（principal）を追跡できる
- 失敗しても価値が落ちない（CalendarはICS fallback）
- 危ないもの（不可逆）は Gate で止める（phase1は実行禁止）

## コネクタ（phase1固定）
### Connector A: Webhook（主戦場）
- 顧客所有の endpoint へ HMAC署名付きで送る（timestamp含む）
- 事前登録制（connector_configs.registered_urls のみ送信）
- 冪等キー + リトライ + 2h以内収束
- 失敗しても ledger に理由が残り、再実行できる

### Connector B: Calendar Hold（低リスク確定）
- 直接OAuthは phase1 SEALED
- phase1は ICS fallback-first（確実に価値を届ける）
- 可逆：ユーザーが取り込まなくても損しない

## Must（機能要件）
1) /plan → /approve → /confirm
2) approve TTL10分 / confirm idempotency必須（24h）
3) Execution Ledger（append-only chain + KYA）
4) Undo 10秒（可逆アクションのみ）
5) Partial success（1つ失敗でも全体はレシート化）
6) Receipt（実行レシート）生成（Team Viral導線）
7) Policy Engine（phase1は allowlist + freeze + registered target だけでOK）
8) Usage metering（課金のための計測：confirm/webhook_job/calendar_hold）
9) Receiver Starter Kit（署名検証・timestamp skew・冪等・ack例）を提供
10) Provider Neutral / Planner resilience（mock/rules）でOpenAI無しでも検証可能

## 受け入れ基準（DoD）
- approveなしconfirm不可（400_APPROVAL_REQUIRED）
- 409 on idempotency conflict
- ledger_integrity ≥ 99.9%（週）
- webhook_delivery_success（2h以内）≥ 99.0%（週）
- ttc_p50 ≤ 2.0s（Webhookのみのケース）
- CalendarHoldは必ずICS生成（常時フォールバック）
- phase1 allowlist外コネクタは必ず 403
- 署名検証がないWebhookは拒否（送らない/受けない）
- timestamp skew のWebhookは拒否（T17）
- webhook target は登録済みのみ（T18）
- retry/backoffが仕様通りに動く（T10）
- freezeが効く（T13）
- meteringが二重に数えない（T14）
- KYA: executor/principal が追跡可能（T15/T16）
- Provider Neutral: mock/rulesでplanが返り、最小チェックが止まらない（T19）

# =========================================
# END: docs/PRD_PHASE1.md
# =========================================


# =========================================
# BEGIN: docs/CONFIRM_OS.md
# =========================================
# ConfirmOS – 承認/取消/監査/二重承認/KYAの標準（出口＝確定の規格）

## 要件（v0.3）
- Confirm Sheet（誰が/何を/いつ/影響）
- /approve（TTL10分）→ /confirm（idempotency必須）
- KYA（executor/principal/delegation）を追跡できる
- Undo 10秒（可逆のみ）
- ledger（append-only chain）
- Partial success contract（422/shapeを固定）
- Provider Neutral（planner差し替え可能）

## DSPL – Display‑Specific Language
- LLMは confirm_sheet スキーマに沿った DSPL JSON を返す
- Viewerは1画面にレンダリング（承認を迷わせない）
- “人間向け装飾”より “機械可読性” を優先（将来エージェントが読む）

## KYA（Know Your Agent）
- executor: 実行主体（phase1は api_key_id を必須で記録。任意で agent_id/label）
- principal: 承認主体（approve actor）
- delegation: approve→confirm の鎖（approve_id）
- 目的：事故時に「誰の代理で、どの権限で、何が起きたか」を一発で説明できる

## Irreversibility Gate（不可逆ゲート）
- 支払い / 個人情報提出 / 取り消し不可 など
- phase1は Gate 命中＝実行禁止（必ず人へ）
- phase2以降：二重承認＋Warm Transfer（人間）で段階解禁

## Proof‑of‑Execution（PoEx）
- confirmごとに receipt 発行（server_sig）
- phase2以降：Merkle Root / 透明性ログ

## Execution Ledger（台帳）
- すべての実行を追跡できる（KYA込み）
- prev_hash で改ざん検知
- 保持：90日（既定）

## Standardization（phase1で実装物として完成）
### Conformance
- schema + semantics + tests で互換性を機械保証
### Treaty
- misexec/ledger_integrity/webhook_success を定義し、補償（クレジット）を固定

# =========================================
# END: docs/CONFIRM_OS.md
# =========================================


# =========================================
# BEGIN: docs/ACTION_CLOUD_PHASE1.md
# =========================================
# Action Cloud – phase1（Private β / Exit-first / Gate1 seed / Gate2&3 seed）
## 目的
- エージェントが “安全に実行” できる最小基盤を提供する
- コネクタは2本固定（Webhook + CalendarHold）
- KYA（executor/principal）を必ず追跡可能にする
- Conformance/Treatyを実装物として出す（椅子取り開始）
- 課金のためのメータリングを同時に仕上げる（将来の企業価値に直結）
- Provider Neutral を最初から成立させる（買収も独立も強くなる）

## phase1 Offer（設計パートナー向け）
- /v1/plan
- /v1/approve
- /v1/confirm
- /v1/ledger/export
- Conformance Suite（CIで回せる）
- Treaty v0（定義と補償）
- Receiver Starter Kit（30分導入）
- Usage Metering（請求の根拠データ）
- Planner mode（openai/mock/rules）で検証を止めない

## Non-goals（phase1でやらない）
- Phone実行
- Marketplace
- External memory import/sync
- Proactive execution
- Public API一般公開
- Enterprise auth（SAML/SCIM）はSEALED（phase2）

## Go基準（phase1 → phase1_5）
- 設計パートナー3社が週次で使っている（/confirmが増える）
- webhook_delivery_success ≥ 99%
- misexec_pct < 0.5%
- ledger_integrity ≥ 99.9%
- KYAの欠損なし（executor/principal 追跡可能）
- Receiver Kitで導入が“短い”実証がある
- 有料意志（LOI or paid pilot）を最低1社から取る

# =========================================
# END: docs/ACTION_CLOUD_PHASE1.md
# =========================================


# =========================================
# BEGIN: docs/DISTRIBUTION_PLAYBOOK.md
# =========================================
# Distribution（phase1：PLGが主 / Salesは最小 / Gate2/3は拡張で取る）

## 基本方針
- 最初の3社は Founder-led（=設計パートナー獲得）
- その後は PLG（勝手に広がる導線）で増えるように設計する
- “配布ループを1本に絞る”：phase1は Team Viral を最優先
- 導入摩擦は Receiver Starter Kit で潰す（PLGの初速）
- Gate2/3に行くには “Enterprise拡張 + 標準化の外部循環” が必ず必要になる（ただしphase1は土台作り）

## ループ1（主戦場）：Team Viral（承認リンクで社内拡散）
- approve通知（Slack/Email）→ 承認者が増える → 同じ会社内で席数が増える
KPI:
- approver_count_per_tenant
- approve_link_open_rate
- approve_to_confirm_conversion

## ループ2：Standard Flywheel（Compatible badge）
- “Yohaku-Compatible” を貼れる → 導入の説得が楽 → 次のチームへ
KPI:
- conformance_runs_per_week
- badge_usage_count
- compatible_integrations_count

## ループ3：Receipt Flywheel（監査と共有）
- receipt（PoEx）が社内の“説明責任”の中心になる → 次の実行がYohaku前提になる
KPI:
- receipt_share_rate
- audit_export_usage

## Giant’s Perimeter（Gate2/3 & M&A両方に効く）
- “巨人の周辺（大企業のSaaS/Cloudを使う企業）” を顧客にする
- 理由：巨人が買う動機が強い（顧客が既に使ってるから）
KPI:
- customers_using_big_platforms（SNOW/Jira/GitHub/AWS等）
- enterprise_preview_deals

## phase1でやらない
- Marketplace型拡散（phase3）
- OS deep拡散（phase2以降）
- Phone口コミ（主戦場ではない）

# =========================================
# END: docs/DISTRIBUTION_PLAYBOOK.md
# =========================================


# =========================================
# BEGIN: docs/ARCHITECTURE.md
# =========================================
# アーキテクチャ（phase1：Exit-first）
- Web/API: Next.js(App Router) / runtime='nodejs'
- DB: Postgres + Prisma
- Queue: outbox/inbox（webhook delivery用）
- Observability: OpenTelemetry（server-only）
- Idempotency: 24h（409 on conflict）
- Webhook: HMAC署名 + timestamp + 再送 + 2h収束（job課金、attempt課金しない）
- CalendarHold: ICS生成（server）
- Freeze: middlewareで強制（global/tenant/connector/target）
- Planner: openai|mock|rules（provider neutral前提）

## SLO（phase1）
- /plan p50 ≤ 1.0s（軽い。mock/rulesならさらに速い）
- /approve p50 ≤ 200ms
- /confirm p50 ≤ 2.0s（webhook dispatch “enqueue” まで）
- webhook delivery：2h以内成功 ≥ 99.0%（週）

## Default HTTP Headers（推奨）
- Referrer-Policy: no-referrer
- Content-Security-Policy: default-src 'self'; connect-src 'self' https://api.yohaku.app; frame-ancestors 'none'
- Permissions-Policy: geolocation=(), microphone=(), camera=()
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin

# =========================================
# END: docs/ARCHITECTURE.md
# =========================================


# =========================================
# BEGIN: docs/DATA_MODEL.md
# =========================================
# データモデル（phase1本番 + SEALED未来）

## phase1（本番）
- tenants(id, name, region, status, frozen_reason, created_at, updated_at)
  status: active|frozen

- users(id, tenant_id, email_hash, role, created_at)

- api_keys(id, tenant_id, name, key_hash, scopes_json, created_at, revoked_at)
  note: phase1のKYAでは “api_key = agent identity” を基本とする（共有禁止）
  optional: agent_label（nameに含めてもOK）

- proposals(id, tenant_id, user_id, payload_json, created_at)
- plans(id, tenant_id, user_id, proposal_id, payload_json, created_at)

- approvals(
    id, tenant_id,
    approve_id, plan_id,
    approved_by_user_id, approved_by_email_hash,
    approved_via,                # ui|api
    approved_at,
    scope_json, expires_at, created_at
  )

- audit_logs(id, tenant_id, user_id, approve_id, action, payload_json, at)

- ledger_events(
    id, tenant_id, approve_id, plan_id,
    action, status,
    executor_api_key_id, executor_agent_id_hash, executor_agent_label,
    principal_user_id, principal_email_hash,
    policy_ref, risk_tier,
    before_json, after_json, reversible, rollback_id,
    ts, prev_hash
  )

- freeze_rules(
    id, tenant_id, level, connector, target_url_hash,
    active, reason, created_at, updated_at
  )
  level: global|tenant|connector|target

- connector_configs(id, tenant_id, connector, config_json, created_at, updated_at)
  webhook:
    config_json.registered_urls[] = { url, enabled, note }

- webhook_jobs(
    id, tenant_id, job_id, target_url_hash,
    payload_json, signature, timestamp,
    status, attempts, next_attempt_at, last_error,
    created_at, updated_at
  )
  status: queued|delivering|succeeded|failed

- receipts(
    id, tenant_id, plan_id, status, summary_text,
    executor_api_key_id, principal_user_id,
    created_at
  )
- receipt_links(id, tenant_id, receipt_id, token_hash, expires_at, revoked_at, created_at)

- growth_events(id, tenant_id, type, meta_json, created_at)
  type: approve_link_opened|receipt_shared|template_exported|template_imported

## Billing（phase1：メータリング必須 / 請求は手動でもOK）
- billing_contracts(
    id, tenant_id, plan, currency,
    platform_fee_jpy, included_confirms, included_webhook_jobs, included_calendar_holds,
    overage_confirm_jpy, overage_webhook_job_jpy, overage_calendar_hold_jpy,
    effective_from, effective_to, created_at
  )

- usage_counters_daily(
    id, tenant_id, day,
    confirms, webhook_jobs, calendar_holds,
    created_at
  )

- invoices(
    id, tenant_id, month,
    platform_fee_jpy, overage_fee_jpy, credits_jpy, total_jpy,
    status, issued_at, paid_at
  )
  status: draft|issued|paid

## SEALED（phase1はテーブルだけ）
- call_jobs(...) / call_summaries(...)           # Phone connector用（phase1実行禁止）
- memories(...) / observations(...) / nudges(...)
- contact_graph(...) / availability(...)
- marketplace_listings(...) / connector_registry(...)
- agent_certificates(...) / delegations(...)     # phase2のKYA強化（設計のみ）
- saml_configs(...) / scim_tokens(...) / rbac_roles(...)  # Enterprise auth（phase2で解禁）

# =========================================
# END: docs/DATA_MODEL.md
# =========================================


# =========================================
# BEGIN: docs/API_CONTRACTS.md
# =========================================
# API コントラクト（phase1：Private β）

## Auth（phase1）
- API Key（tenant単位。agentごとに分ける推奨）
- scope: plan:write, approve:write, confirm:write, ledger:read, billing:read

## Common Headers（推奨）
- Authorization: Bearer <api_key>
- X-Yohaku-Agent-Id: <string>（任意。ある場合はhashして保存）
- X-Yohaku-Agent-Label: <string>（任意。receipt表示用）
- X-Idempotency-Key: <string>（confirmは必須）
- X-Request-Id: <uuid>（任意）

## POST /v1/plan
Req:
{
  "input": "If the user asks to schedule a follow-up, propose a calendar hold.",
  "context": {"tenant_id":"t1","user_id":"u1","tz":"Asia/Tokyo"},
  "planner": {"mode":"openai|mock|rules"}   # 任意（サーバー既定あり）
}
Res:
{
  "plans":[
    {"id":"pl1","summary":"Create a calendar hold and notify via webhook",
     "actions":[
       {"action":"calendar.hold.create","title":"Follow-up (hold)","start":"2026-01-10T10:00:00+09:00","duration_min":30},
       {"action":"webhook.dispatch","connector_id":"wh_1","event":"hold.created","body":{"hold":"..."}}
     ],
     "confirm_sheet":{
       "title":"Create hold + notify",
       "badges":["Reversible","Idempotent"],
       "sections":[]
     }
    }
  ],
  "planner_mode":"openai|mock|rules",
  "warnings":[]
}

## POST /v1/approve
Req: { "plan_id":"pl1", "approved_by": {"user_id":"u1"} }
Res: { "approve_id":"aprv_abc123", "expires_in_sec":600 }

## POST /v1/confirm
Req: { "plan_id":"pl1", "approve_id":"aprv_abc123", "idempotency_key":"k_123" }
Res:
{
  "results":[
    {"action":"calendar.hold.create","status":"ok","mode":"ics","ics_url":"..."},
    {"action":"webhook.dispatch","status":"queued","job_id":"job_123"}
  ],
  "receipt_id":"rcp_123",
  "kya": {
    "executor_api_key_id":"key_1",
    "executor_agent_label":"cursor-agent",
    "principal_user_id":"u1"
  },
  "metering": {"confirm": 1, "webhook_job": 1, "calendar_hold": 1}
}

## GET /v1/ledger/export?since=...
- 監査・検証用（CSV/JSON）
- KYA（executor/principal）を含む

## Billing export（phase1：請求根拠）
- GET /v1/billing/usage?month=YYYY-MM
- GET /v1/billing/invoice?month=YYYY-MM

## Receipt / Team Viral
- POST /v1/receipt/share
  Req: { "receipt_id":"rcp_123", "channel":"slack|email|link" }
  Res: { "share_url":"https://yohaku.app/r/<token>", "expires_in_sec":604800 }

# =========================================
# END: docs/API_CONTRACTS.md
# =========================================


# =========================================
# BEGIN: docs/WEBHOOKS.md
# =========================================
# WEBHOOKS – phase1（Customer-owned endpoint）

## Yohaku → Customer
Headers:
- X-Yohaku-Signature: sha256=<hex>（HMAC。署名対象にtimestamp含む）
- X-Yohaku-Timestamp: <unix_epoch_seconds>
- X-Idempotency-Key: <string>
- X-Yohaku-Job-Id: <uuid>

Body:
{
  "event":"hold.created",
  "tenant_id":"t1",
  "confirm_id":"c_123",
  "kya": {"executor_api_key_id":"key_1"},
  "payload":{...}
}

## Delivery rules（job単位）
- 2xx で成功（job=succeeded）
- 4xx は原則停止（設定ミス）→ job=failed（ledgerに残す）
- 5xx/timeout は retry（backoff）
- giveup_after_seconds で終了（job=failed、ledgerに残す）
- retry回数は課金しない（job課金）

# =========================================
# END: docs/WEBHOOKS.md
# =========================================


# =========================================
# BEGIN: docs/CALENDAR_HOLD.md
# =========================================
# Calendar Hold（phase1：ICS fallback-first）
目的：可逆で、失敗しても価値が落ちない“確定”を作る

## Action: calendar.hold.create
- mode:
  - ics（phase1 default）
  - oauth_direct（SEALED：phase1禁止）
- ics は常に生成できる（権限ゼロでも価値）

## Undo/rollback
- ics は “未取り込み” なら rollback不要（no-op）
- 将来oauth_directは event.delete が可逆（phase1_5で）

# =========================================
# END: docs/CALENDAR_HOLD.md
# =========================================


# =========================================
# BEGIN: docs/IMPLEMENTATION_RAILS_CURSOR.md
# =========================================
# Cursor Implementation Rails（phase1：Exit-first / 10/10³版）
# “コネクタを増やす” ではなく “Exitを標準化し、導入摩擦を潰し、止められる/KYAで責任を成立させる” が仕事。

## Epic 0：土台（Day 1–2）
- Prisma schema（tenant/users/api_keys/plans/approvals/ledger/webhook_jobs/freeze/billing）
- Security headers
- OpenTelemetry（server only）
- Idempotency middleware（24h）

DoD:
- migrations OK
- /health OK

## Epic 0.5：Provider Neutral / Planner Resilience（Day 2）
- PLANNER_MODE=openai|mock|rules
- mock/rulesで最小プランが返る
- openaiキー不備でも /approve /confirm /webhook /ledger /freeze /metering が検証できる

DoD:
- 5つの最小チェックが “openai無し” でも2〜5は実行可能

## Epic 1：/plan /approve /confirm（Day 3–7）
- /v1/plan（actions+confirm_sheet）
- /v1/approve（TTL10m）
- /v1/confirm（idempotency必須）
- ledger_events append-only chain
- undo 10秒（可逆のみ）
- KYA（executor api_key / principal approver）を記録
- receiptにKYA表示（T20）

DoD:
- approveなしconfirm不可
- 409 idempotency
- T15/T16 pass
- ledger_integrity OK

## Epic 2：Webhook connector（Day 8–14）
- connector_configs（webhook registered_urls）
- webhook_jobs（outbox + retry/backoff）
- signer（HMAC + timestamp）
- SSRF guard（registered target only / private ip deny）
- delivery結果を ledger に反映

DoD:
- T07/T10/T17/T18 pass
- webhook_delivery_success 計測

## Epic 3：Calendar Hold（ICS）（Day 15–18）
- ics generator
- calendar.hold.create（mode=ics）
- receiptにicsリンクを埋め込む

DoD:
- T11 pass
- ics import可能

## Epic 4：Receipt + Team Viral（Day 19–22）
- receipt生成（10秒で読める）
- receipt share link（revocable/ttl）
- growth_events（approve_link_opened/receipt_shared）
- receiptにKYA（executor/principal）を表示

DoD:
- share_url発行
- open計測

## Epic 5：Receiver Starter Kit（Day 23–26）
- @yohaku/signature（署名+timestamp検証）
- receiver-starter（Cloudflare Worker）
- receiver-starter（Node/Express）
- Webhook Playground（署名/冪等/再送/スキュー確認）

DoD:
- “30分導入”がデモできる

## Epic 6：Billing Metering（Day 27–28）
- usage_counters_daily を更新（confirm/webhook_job/calendar_hold）
- billing export endpoints
- 二重計測しない（idempotency）

DoD:
- T14 pass
- 月次usageが出る

## Epic 7：Kill/Freeze + Runbook（Day 29）
- freeze_rules + middleware enforcement
- admin freeze endpoints（管理者のみ）
- auto-freeze triggers
- incident doc

DoD:
- T13 pass
- freezeが即効く

## Epic 8：Conformance + Treaty（Day 30）
- confirmos.schema.json / semantics.md
- tests（T01〜T20）
- treaty定義を docs化（v0）
- 30日スコアカードを固定

DoD:
- Conformance SuiteがCIで回る
- treaty指標が計測できる
- 30日PASS/FAILが動く

## SEALED（phase1禁止：実行パスなし）
- Phone connector（call.place）
- Proactive/Nudge実行
- External Memory import
- Marketplace / Public API一般公開
- agent certificates / delegation tokens（phase2以降）
- Enterprise auth（SAML/SCIM/RBAC）はphase2以降

# =========================================
# END: docs/IMPLEMENTATION_RAILS_CURSOR.md
# =========================================


# =========================================
# BEGIN: docs/MOAT_10_OF_10.md
# =========================================
# 10/10³ Moat スコアカード（Exit-first + KYA + Standard）

## Gate1→Gate3で勝つMoat（要約）
- 規格化：Conformance + Treaty が“互換の中心”になっている
- 埋め込み：/confirm が複数入口から流入し、監査がYohaku前提になっている
- KYA：agent/principal/delegationが標準になっている（“責任ある実行=Yohaku”）
- 透明性：AXI/Treatyが52週継続で改善されている
- COGS：粗利≥70%（Gate1）、≥80%（Gate2+）、SLA 99.9%（phase3）
- 生態系：Compatibleバッジ + Provider/Connector 認定が回っている
- Provider Neutral：入口が変わってもExitが残る（巨人に潰されにくい）

## 決定打（Moatをロック）
1) Conformance Test + Yohaku-Compatible
2) Treaty（定義/補償）で“信頼の価格”を作る
3) Ledger/PoEx（実行証明）で監査の中心になる
4) Freeze（止められる）を標準の一部にする
5) KYA（誰が実行したか）を標準の一部にする
6) Receiver Starter Kit（導入摩擦ゼロ）で勝手に広がる入口を作る
7) Standard Flywheel（Compatible→採用→監査→さらに採用）

# =========================================
# END: docs/MOAT_10_OF_10.md
# =========================================


# =========================================
# BEGIN: docs/M_AND_A_OPTIONALITY.md
# =========================================
# M&A Optionality（買収が来ても断れる / 来たら選べる）
目的：買収を“狙う”のではなく、“選べる状態”を作る。

## 買収が来る理由（現実）
- 顧客が既に使っていて、置き換えが難しい
- 規格（Conformance）と契約（Treaty）があり、採用が速い
- KYA/ledger/freezeで“責任”が成立している
- Provider Neutral で自社製品に組み込みやすい

## Data Room Ready（phase1から整える）
- KPI（週次）：confirm/NRR proxy/latency/misexec/ledger_integrity/webhook_success
- 契約：billing_contracts + Treaty文面
- 監査：ledger_export + receipt
- セキュリティ：SSRF対策、署名、freeze、権限
- 依存：planner provider差し替え可能の証明（mock/rules含む）

## “断る”基準（目安）
- Gate1の手応え（ARRへの道筋が見えてる）
- Compatibleが外部で回り始めている（Gate2の前兆）
- 主要顧客が増えている（巨人の周辺）
- 入口依存がない（Provider Neutral）

## “受ける”基準（目安）
- 価格：将来の独立シナリオより期待値が明確に高い
- 条件：Exitの標準化が継続できる（Conformance/Treaty/KYAが死なない）
- タイミング：独立で伸びる前の最適点（ただし焦って売らない）

# =========================================
# END: docs/M_AND_A_OPTIONALITY.md
# =========================================


# =========================================
# BEGIN: docs/ROADMAP_36M.md
# =========================================
## 0–6m（phase1：Exit-first / Private β / Gate1の種）
- Action Cloud（/plan /approve /confirm /ledger）
- コネクタ2本固定：Webhook + CalendarHold（ICS）
- KYA（executor/principal）をledger/receiptに必ず刻む
- Provider Neutral / Planner resilience（mock/rules）で検証を止めない
- Conformance + Treaty v0.3 を“実装物”として完成
- PLG：Team Viral（承認リンク）を主戦場
- 導入摩擦：Receiver Starter Kit（30分導入）
- 信頼：Kill/Freeze（事故停止）を最初から仕組み化
- Phone/Proactive/Memory import/Marketplace はSEALED
- 目標：設計パートナー3社＋週次confirm増加

## 6–12m（phase1_5：再現性 + 単価の階段を上る）
- Private β拡張（10〜30社）
- 追加コネクタ最小（2本まで、低リスクのみ）
- Enterprise Preview（高単価）を少数導入（SLA無しでも“監査/責任”で売る）
- Compatible badge（公開）開始
- KYA強化の設計開始（agents registry / delegation tokens）
- 目標：MRR 1,500万〜3,000万円レンジ

## 12–24m（phase2：Gate1を確定し、Gate2の前兆を作る）
- Action Cloud β（招待制、Enterprise要件の一部解禁）
  - SAML/SCIM/RBAC/Region（順次）
- Conformance公開、Yohaku-Compatibleが外部で回り始める
- Treaty強化、AXI外部公開（慎重に）
- 目標：MRR 7,000万〜9,000万円（ARR 8.4〜10.8億）= Gate1圏内
- 追加目標：Compatibleが“外部週次”で回り始める（Gate2の前兆）

## 24–36m（phase3：GA / Enterprise / Marketplace）
- GA（Enterprise、SLA 99.9%、リージョン固定）
- Connector Marketplace解禁
- Proactive実行 解禁（条件付き）
- 目標：ARR 15〜30億（評価はさらに跳ねる：複数入口から/confirmが流入）

## 36–72m（phase3継続：Gate2（1500B）を取りに行く）
- “規格の外部循環” を勝たせる（Compatible network effects）
- Enterprise拡大（数百社） or Mid-market拡大（数千社）
- Treatyを購買要件へ（監査/補償/停止が標準装備）
- 目標：ARR 75〜100億（= Gate2レンジ）

## 72–120m（phase3継続：Gate3（Notion級））
- Marketplaceを“規格準拠”で拡大（Connector/Provider認定）
- グローバル標準として埋め込まれ続ける（入口が変わってもExitが残る）
- 目標：ARR 500〜1,200億（= Gate3レンジ）

# =========================================
# END: docs/ROADMAP_36M.md
# =========================================


# =========================================
# BEGIN: docs/PUBLIC_API.md
# =========================================
# PUBLIC API（phase1：一般公開しない）
- phase1：設計パートナーのみ（Private β）
- phase2：招待制β
- 一般公開（Public）はphase3以降（ただしConformance/Badgeはphase1_5で公開可）

# =========================================
# END: docs/PUBLIC_API.md
# =========================================


# =========================================
# BEGIN: docs/CONNECTOR_SDK.md
# =========================================
# CONNECTOR SDK（SEALED：phase1は設計のみ）
- ConfirmOS準拠（可逆性/冪等/署名/監査/Freeze/KYA）
- Marketplace解禁はphase3

# =========================================
# END: docs/CONNECTOR_SDK.md
# =========================================


# =========================================
# BEGIN: docs/MCP_OVERVIEW.md
# =========================================
# MCP OVERVIEW（SEALED：phase1は設計のみ）
目的：複数LLM/音声クライアントから、安全にConfirmOSへ接続する  
phase1は “接続の仕様” を保持するだけ。一般公開はphase2以降。

# =========================================
# END: docs/MCP_OVERVIEW.md
# =========================================


# =========================================
# BEGIN: docs/SECURITY_PRIVACY.md
# =========================================
# SECURITY & PRIVACY – 最小化/保持/監査（Exit-first）

## 最小化
- 入力テキスト：要約＋実行に必要な最小だけ
- 外部送信：Webhook payloadは最小
- 署名：HMAC（rotate可能）
- KYA：agent/principalを追跡できる最小情報を保持（過剰収集しない）

## 保持（推奨）
- audit_logs：90d
- ledger_events：90d
- idempotency keys：24h
- receipt_links：7d（revocable）
- billing usage counters：必要最小（集計値）

## Enterprise（SEALED：phase2）
- SOC2/ISO/GDPRはphase2で整備（今は設計だけ持つ）

# =========================================
# END: docs/SECURITY_PRIVACY.md
# =========================================


# =========================================
# BEGIN: docs/REGULATORY.md
# =========================================
# REGULATORY（phase1：低リスクに限定して回避）
- phase1は “不可逆” を避ける（Gate命中は実行禁止）
- Phone/録音/本人確認の重い領域はSEALED（phase1_5以降）

# =========================================
# END: docs/REGULATORY.md
# =========================================


# =========================================
# BEGIN: docs/MEMORY_OS.md
# =========================================
# MEMORY OS – 覚える/忘れる/言い換える（SEALED：phase1は最小ログのみ）
Memory = (key, value, kind, confidence, TTL)
phase1は “実行の安全” が主戦場なので、外部Doc importはSEALED。

# =========================================
# END: docs/MEMORY_OS.md
# =========================================


# =========================================
# BEGIN: docs/PROACTIVE_OS.md
# =========================================
# PROACTIVE OS（SEALED：phase1は実行禁止）
- phase1は observations のデータモデルとログだけ
- 実行（nudge配信/自動提案）はphase2以降

# =========================================
# END: docs/PROACTIVE_OS.md
# =========================================


# =========================================
# BEGIN: docs/RELATIONSHIP_GRAPH.md
# =========================================
# RELATIONSHIP GRAPH（SEALED：phase1は実行禁止）
- phase1は contact_graph のスキーマ/ログだけ

# =========================================
# END: docs/RELATIONSHIP_GRAPH.md
# =========================================


# =========================================
# BEGIN: docs/OS_INTEGRATIONS.md
# =========================================
# OS Deep Integrations（SEALED：phase1は実行禁止）
- phase1はスタブのみ

# =========================================
# END: docs/OS_INTEGRATIONS.md
# =========================================


# =========================================
# BEGIN: docs/PHONE_CONNECTOR_SEALED.md
# =========================================
# Phone Connector（SEALED：phase1は実行禁止）
目的：将来 “現実世界もExitで握れる” を示すためのコネクタ
- phase1：設計/スタブ/テーブルのみ
- phase1_5：限定解禁を検討（Clinic Liteだけ等）
- 注意：Phoneはブランド/規制/炎上コストが重い。主戦場にはしない。

# =========================================
# END: docs/PHONE_CONNECTOR_SEALED.md
# =========================================


# =========================================
# BEGIN: docs/EVALS.md
# =========================================
# EVALS – phase1（Exit品質の生存指標 + Gate2/3の前兆）

## AXI（週次）
- confirm_count
- ttc_p50 / ttc_p95
- misexec_pct
- ledger_integrity
- webhook_delivery_success（2h以内）
- kya_executor_coverage（100%）
- unique_agents_per_tenant（増加＝自動化が浸透）

## Expansion（Gate2/3に必須）
- confirms_per_tenant_growth_rate
- unique_agents_per_tenant_growth_rate
- usage_overage_rate（無料枠を超え始める兆し）
- NRR proxy（同一社の支払い増加）

## Funnel
- approve_to_confirm_conversion

## PLG
- approver_count_per_tenant
- approve_link_open_rate
- receipt_share_rate
- template_exports/imports
- conformance_runs_per_week

## Adoption（導入摩擦）
- receiver_time_to_first_success（30分目標）
- receiver_error_top_reasons

## Monetization
- paying_intent_count（LOI/paid pilot）
- mrr（手動でも集計）
- usage_per_tenant（confirm/job/hold）

# =========================================
# END: docs/EVALS.md
# =========================================


# =========================================
# BEGIN: docs/CHANGELOG.md
# =========================================
# CHANGELOG
- 2025-12-17: EXIT-FIRST へ全面リライト（10/10版）
  - phase1の主戦場を “電話B2C” から “Action Cloud（Exit）Private β” に変更
  - phase1コネクタは Webhook + Calendar Hold（ICS）に固定
  - Phoneは SEALED に降格（設計/スタブのみ。phase1実行禁止）
  - 配布は Team Viral（承認リンク）中心に再設計
  - Conformance + Treaty を phase1で“実装物”として完成させる前提に更新

- 2025-12-29: 10/10²（KYA/Resilience/Ship Rails）追加
  - KYA（executor/principal/delegation）をphase1の必須要件に昇格
  - webhook署名にtimestamp/スキュー検証を追加
  - webhook target を事前登録制に固定
  - Planner Resilience（openai|mock|rules）で検証を止めない
  - Ship Rails（小PR/CI conformance/SEALED lint）で“出す速度”を固定

- 2025-12-29: 10/10³（Gate1重視 + M&A Optionality）追加
  - 100B Gate（ARR/GM/NRR/Trust/Standard）を明文化（= Gate1）
  - Pricing Ladder（Team/Enterprise preview）を追加し、MRR 8,000万円級の道筋を固定
  - Provider Neutral を仕様に格上げ（入口依存を断つ）
  - Standard Flywheel（Compatible/Receipt/Treaty）を配布の主軸へ
  - Data Room Ready（買収・調達に強いログ/指標/契約）を最初から整備
  - Giant’s Perimeter 戦略をGTMに固定（買収も独立も強くなる）
  - Funding Rails（薄めても勝つ/薄めずに勝つ）分岐条件を固定

- 2025-12-29: North Star “Valuation Ladder” を矛盾ゼロで統合（Gate1→Gate2→Gate3）
  - Gate1（100億）を最短で踏み、Gate2（1500億）/Gate3（Notion級）の増やし方を追記
  - phase1のスコープ固定（2本固定）を維持したまま、上振れの道筋を明文化

# =========================================
# END: docs/CHANGELOG.md
# =========================================