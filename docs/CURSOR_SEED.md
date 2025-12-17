# =========================================
# Cursor Pack – Yohaku (FULL INTEGRATED MASTER / EXIT-FIRST / vNext + Legacy Chapters)  ✅10/10
# Action Cloud (Exit Layer) FIRST : /plan → /approve → /confirm → ledger
# Phase1（0–6m）: Webhook + Calendar Hold（低リスクなデジタルアクション2本に固定）
# Conformance + Treaty（標準化）を前倒し（“設計”じゃなく“実装物”として）
# Phone / Proactive / Memory imports / OS deep / Marketplace / Public API一般公開は SEALED
#
# 追加（10/10化のための5点）
# 1) Monetization（課金設計）を確定
# 2) ICP（最初の設計パートナー像）を確定
# 3) Receiver Starter Kit（導入摩擦を潰す）を必須化
# 4) Kill/Freeze（事故停止の仕組みと運用）を確定
# 5) 30日スコアカード（合格/失格条件）を確定
# =========================================


# =========================================
# 目的：
# - 「AIエージェントの出口（ConfirmOS）」を握る：安全に“確定”できる実行レイヤーを標準化する
# - 0–6mは “電話でPMF” ではなく “ExitレイヤーでPMF” を最短で取る
# - phase1は “低リスクなデジタルアクション2本（Webhook + Calendar Hold）” に絞り、速度と信頼を最大化する
# - “勝手に広がる” を作る：Team Viral（承認リンク）と Receiver Starter Kit（導入テンプレ）でPLGを回す
#
# このファイルの読み方（最重要）
# 1) Phase1 Focus Rules と SEALED を守る（ここに違反する実装は禁止）
# 2) PRD_PHASE1（Exit-first）の受け入れ基準（DoD）に沿って作る
# 3) ConfirmOS（approve/confirm/idempotency/ledger/undo/gate）を最優先で堅くする
# 4) Conformance Suite + Treaty v0 を “実装物” として完成させる（椅子取り開始）
# 5) 30日スコアカードを毎週見て、勝ち筋だけに集中する（増やさない）
#
# 用語
# - “Exit” = 実行の責任・監査・可逆性を提供する層（ConfirmOS）
# - “SEALED” = phase1で「DB/ログ/スタブはOK」だが「本番で実行されるパスは禁止」な機能群
# - “Phase Switch” = YOHAKU_PHASE で実行可能機能を強制（文章ではなくガードで縛る）
#
# Phase Switch（実装で必ず使う）
# - YOHAKU_PHASE = phase1 | phase1_5 | phase2 | phase3
#   - phase1   : 0–6m（Exit-first / Webhook+CalendarHold固定 / Private β / Conformance+Treaty v0 / 低リスクのみ）
#   - phase1_5 : 6–12m（Private β拡張 / 追加コネクタ検証 / Phone=限定解禁“可” だが主戦場ではない）
#   - phase2   : 12–24m（β / 招待制 / SLA 99.5% / Conformance公開 / Yohaku-Compatible開始）
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
# 10/10 FINALIZATION ADDENDUM（phase1で必ず守る：未確定のまま実装しない）
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
- WEBHOOK_RETRY_POLICY=
  - max_attempts: 8
  - backoff_seconds: [5, 15, 45, 120, 300, 600, 1200, 2400]
  - giveup_after_seconds: 7200
- WEBHOOK_REGION_POLICY=
  - allowed_regions: ["JP", "US"]
  - default_region: "JP"
- WEBHOOK_ALLOWED_TARGETS=
  - customer_owned_only: true
  - https_only: true
  - disallow_public_internet_without_allowlist: true
  - allowlist_domains: []  # phase1は“顧客側が所有”前提。必要ならここに入れる（空=許可しない、ではない。設定で評価）

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

## F) Conformance（ConfirmOS準拠テスト）v0：Yohaku-Compatibleを“実物”にする
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
- CONFIRMOS_VERSION= 0.1
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

## I) Monetization（phase1：料金・課金単位・請求定義を確定）
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
      terms:
        overage_confirm_jpy: 0
        overage_webhook_job_jpy: 0
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
- MONETIZATION_GOALS_PHASE1=
  - by_day_45: "有料意志（LOI or paid pilot）を最低1社から取る"
  - by_month_3: "MRR 50万円（=スターター10社 or プロ2〜3社）"
  - by_month_6: "MRR 300万円（=スターター60社 or プロ15社目安）"

## J) ICP（phase1：最初の3社を“取りにいく相手”として確定）
- ICP_PRIMARY= "Webhookを受けられる（受け口を作れる）チーム"
- ICP_PERSONA=
  - title: "Agent / Automation Engineer (Owner)"
  - pain: "実行が怖い（承認/監査/冪等/ロールバックを自前で作りたくない）"
  - success: "安全に本番実行でき、監査で怒られない"
- ICP_FIT_CHECKLIST（全部YESなら設計パートナー適格）=
  - "社内に業務API or ワークフローがある（Webhookで受けたい）"
  - "Slack/Email/Calendarが業務で必須"
  - "承認が必要な作業がある（例：顧客通知、チケット作成、更新作業）"
  - "監査/可視化の要求がある（ログが必要）"
  - "PoCに2週間コミットできる（週1で改善サイクル）"
- ICP_EXCLUDE_PHASE1（NO GO）=
  - "支払い/解約/不可逆アクションが最初から必須（phase1は避ける）"
  - "Webhook受け口を作れない（Receiver Starter Kitでも無理）"
  - "法務/稟議が重すぎて3ヶ月以内に動かない"

## K) Receiver Starter Kit（phase1：導入摩擦を潰す“必須成果物”）
- GOAL= "相手がWebhook受け口を30分で作れる状態"
- SHIP_IN_PHASE1=
  - "@yohaku/signature (HMAC verify) ライブラリ"
  - "receiver-starter (Cloudflare Worker) サンプル"
  - "receiver-starter (Node/Express) サンプル"
  - "Webhook Playground（署名/冪等/リトライを確認できる簡易UI）"
- NON_GOALS_PHASE1=
  - "大量のコネクタテンプレを増やす（2本固定）"
  - "Marketplace（phase3）"

## L) Kill/Freeze（phase1：事故った瞬間に止められる“仕組み＋運用”を確定）
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
  - "signature key mismatch の異常多発 → target freeze"
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
  - "Receiver Starter Kit で ‘30分導入’ の実証 3社中2社以上"
- FAIL_FAST_TRIGGERS=
  - "Day14時点で設計パートナー0〜1社 → ICP/導線/Receiver kitを最優先で修正"
  - "misexecが発生 → 即Freeze + 原因解明が終わるまで拡販停止"
  - "webhook_successが当社起因で98%未満が継続 → 信頼改善まで新規導入停止"
  - "TTC（Time-to-Confirm）p95が5秒を超えて悪化 → 性能改善まで拡張禁止"


# =========================================
# BEGIN: README.md
# =========================================
# Yohaku Action Cloud – エージェントの“出口（確定）”を安全にする実行レイヤー
> We don’t sell “agents”. We sell “safe confirmation”.

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
5) “Value Receipt（実行レシート）”で社内共有（Team Viral）

## “出口を握る”の核（ここが本体）
- 実行の責任（同意/監査/可逆性/冪等）を **ConfirmOS** として標準化
- **Conformance（準拠テスト）+ Treaty（公開契約）** で互換の中心と信頼の価格を作る
- コネクタは後から増やせる。出口の仕様を先に固定するのが勝ち筋。

## phase1 Focus Rules（非交渉）
- ✅ Exit-first：ConfirmOS + Action Cloud（Private β）
- ✅ コネクタ2本固定：Webhook + Calendar Hold（増やさない）
- ✅ Conformance + Treaty v0 を“実装物”として完成
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
- docs/30_DAY_SCORECARD.md を参照（PASS/FAILが固定）

# =========================================
# END: README.md
# =========================================


# =========================================
# BEGIN: docs/VISION.md
# =========================================
# VISION – AI時代の“責任ある実行”を標準化する
エージェントが普及すると「実行」の総量が増える。  
事故の総量も増える。  
だから世界は **Exit（確定/責任/監査）** を必要とする。

## プロダクト憲法
1. 実行は必ず approve を通す（例外なし）
2. すべての confirm は ledger に残る（監査可能）
3. 取り消し可能なものは取り消せる（Undo/rollback）
4. 不可逆は Gate（二重承認＋人）を必須にする
5. phase1は“低リスク”だけ（Webhook/CalendarHold）
6. 仕様はConformanceで縛る（互換性をテストで保証）
7. 信頼はTreatyで売る（定義と補償を数字で固定）
8. 開発者体験（DX）で10xを作る（自前実装の地獄から救う）
9. 入口（LLM/UI）は中立（どの入口でも使える）
10. 拡張は後（phase1は増やさない）

## Riskiest Assumptions（phase1）
1) “安全な実行” を欲しがる設計パートナーを3社取れるか
2) /confirm が週次で増えるか（volumeが出るか）
3) Conformance/Treatyが導入の摩擦を下げるか（逆に上げないか）
4) Webhook/CalendarHoldだけで “10x価値” を感じてもらえるか
5) 30分導入（Receiver Kit）が本当に実現できるか

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

# =========================================
# END: docs/PRD_PHASE1.md
# =========================================


# =========================================
# BEGIN: docs/CONFIRM_OS.md
# =========================================
# ConfirmOS – 承認/取消/監査/二重承認の標準（出口＝確定の規格）

## 要件（v0）
- Confirm Sheet（誰が/何を/いつ/影響）
- /approve（TTL10分）→ /confirm（idempotency必須）
- Undo 10秒（可逆のみ）
- ledger（append-only chain）
- Partial success contract（422/shapeを固定）

## DSPL – Display‑Specific Language
- LLMは confirm_sheet スキーマに沿った DSPL JSON を返す
- Viewerは1画面にレンダリング（承認を迷わせない）

## Irreversibility Gate（不可逆ゲート）
- 支払い / 個人情報提出 / 取り消し不可 など
- phase1は Gate 命中＝実行禁止（必ず人へ）
- phase2以降：二重承認＋Warm Transfer（人間）で段階解禁

## Proof‑of‑Execution（PoEx）
- confirmごとに receipt 発行（server_sig）
- 将来：Merkle Root / 透明性ログ

## Execution Ledger（台帳）
- すべての実行を追跡できる（誰が何を承認し、何が起きたか）
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
# Action Cloud – phase1（Private β / Exit-first）

## 目的
- エージェントが “安全に実行” できる最小基盤を提供する
- コネクタは2本固定（Webhook + CalendarHold）
- Conformance/Treatyを実装物として出す（椅子取り開始）
- 課金のためのメータリングを同時に仕上げる（将来の企業価値に直結）

## phase1 Offer（設計パートナー向け）
- /v1/plan
- /v1/approve
- /v1/confirm
- /v1/ledger/export
- Conformance Suite（CIで回せる）
- Treaty v0（定義と補償）
- Receiver Starter Kit（30分導入）
- Usage Metering（請求の根拠データ）

## Non-goals（phase1でやらない）
- Phone実行
- Marketplace
- External memory import/sync
- Proactive execution
- Public API一般公開

## Go基準（phase1 → phase1_5）
- 設計パートナー3社が週次で使っている（/confirmが増える）
- webhook_delivery_success ≥ 99%
- misexec_pct < 0.5%
- ledger_integrity ≥ 99.9%
- Receiver Kitで導入が“短い”実証がある
- 有料意志（LOI or paid pilot）を最低1社から取る

# =========================================
# END: docs/ACTION_CLOUD_PHASE1.md
# =========================================


# =========================================
# BEGIN: docs/MONETIZATION.md
# =========================================
# Monetization（phase1確定版）— “Platform + Usage” の2階建て
目的：Exitレイヤーの価値（安全な確定）に対して、継続的に課金できる形を最初から作る。

## なぜこの形か
- Platform Fee：信頼（監査/運用/停止/基盤）に対する固定収益
- Usage：/confirm という“確定”の量に比例する（上限が伸びる）

## phase1の請求方式（実務）
- phase1は “contract_then_invoice”
  - 契約（プラン/上限/補償）→ 月末に usage export を元に請求（手動でもOK）
  - 重要：請求は手動でも、メータリングは自動で正確に出す

## 課金単位（固定）
- confirm：/v1/confirm が accept され ledger に CONFIRMED が1回書かれたもの（冪等で二重課金しない）
- webhook_job：webhook.dispatch action 1つ（retryは含む/別課金しない）
- calendar_hold：calendar.hold.create 1つ（ICS生成）

## プラン（phase1のデフォ）
- Design Partner（0円/60日）：設計パートナー。週次利用・改善協力。上限は実運用で調整
- Private β Starter：¥50,000/月 + overage（confirm/webhook/hold）
- Private β Pro：¥200,000/月 + overage（confirm/webhook/hold）

## Treaty（補償）との関係
- 当社起因の misexec / ledger_integrity 低下 / delivery成功率低下に対してクレジット
- “顧客側endpointの不具合”は対象外（ただし運用支援はする）

## phase1での目標
- Day45までに「有料意志」1社（LOI/paid pilot）
- Month3で MRR 50万円
- Month6で MRR 300万円

# =========================================
# END: docs/MONETIZATION.md
# =========================================


# =========================================
# BEGIN: docs/ICP.md
# =========================================
# ICP（phase1確定版）— 最初の3社を取りにいく
目的：phase1で “誰に刺すか” を固定して、ぶれずにPMFを取りにいく。

## Primary ICP（絶対条件）
- Webhookを受けられる（Receiver Kitで30分導入できる）
- 承認/監査が必要な業務がある（実行が怖い）
- 2週間でPoCを回せる（週次で改善）

## Persona
- Agent/Automation Engineer（Owner）
- Ops/RevOps/CS Automation（Stakeholder）
- Security/Compliance（Approver）

## 典型ユースケース（phase1に最適）
- “承認が必要な通知” をWebhookで社内システムに反映（例：顧客への連絡、ステータス更新）
- “仮予定” をCalendar Holdで置いて、Slackに承認ログを残す
- “チケット作成” は phase1_5 で追加（いきなり増やさない）

## 断るべき案件（phase1）
- 支払い・解約・不可逆が最初から必須（phase2以降）
- PoCが3ヶ月以上動かない（稟議重い）
- 受け口を作れない（Receiver kitでも無理）

# =========================================
# END: docs/ICP.md
# =========================================


# =========================================
# BEGIN: docs/RECEIVER_STARTER_KIT.md
# =========================================
# Receiver Starter Kit（phase1必須）— “30分でWebhook受け口”
目的：Exit-first最大の摩擦（相手がWebhookを受けるのが面倒）を潰し、PLGの初速を出す。

## 何を出すか（phase1）
1) @yohaku/signature（HMAC検証ライブラリ）
2) receiver-starter-cloudflare（Worker）
3) receiver-starter-node（Express）
4) Webhook Playground（署名/冪等/リトライを確認できる簡易UI）

## 受け口が満たすべき最低要件
- X-Yohaku-Signature を検証（HMAC-SHA256）
- X-Idempotency-Key を保存して重複処理しない（24h）
- 2xxでack（成功）、5xx/timeoutはリトライされる

## 30分導入の定義（KPI）
- “署名検証OK + 2xx応答 + payloadが保存される” までの時間

# =========================================
# END: docs/RECEIVER_STARTER_KIT.md
# =========================================


# =========================================
# BEGIN: docs/INCIDENTS_KILL_SWITCH.md
# =========================================
# Kill/Freeze（phase1確定版）— 信頼を守る最短の武器
Exitレイヤーは “止められない” 時点で負ける。  
だから最初から Kill/Freeze を仕組みで持つ。

## Freezeレベル
- global / tenant / connector / target

## 仕組み（実装要件）
- middlewareで freeze を毎回評価（cacheしてもいいが1分以内反映）
- freeze中は confirm を 403（FROZEN）で拒否
- ledger に freeze理由と解除理由を残す（監査）

## 自動Freeze（保守的）
- misexec suspected → tenant freeze
- delivery異常多発 → connector freeze
- signature異常多発 → target freeze

## 運用（必須）
- incident ticket 作成
- postmortem（原因/対策/再発防止）を残す
- “拡販停止”ルール：信頼が戻るまで新規導入を止める

# =========================================
# END: docs/INCIDENTS_KILL_SWITCH.md
# =========================================


# =========================================
# BEGIN: docs/30_DAY_SCORECARD.md
# =========================================
# 30日スコアカード（phase1確定版）— 合格/失格で迷わない

## PASS（Day30で合格）
- 設計パートナー 3社（週次利用）
- confirm >= 500 / week（合算）で増加傾向
- approve→confirm conversion >= 60%
- webhook_delivery_success >= 99%（当社起因）
- ledger_integrity >= 99.9%
- misexec_pct < 0.5%（理想は0）
- Receiver Kit導入が “30分” 実証（2社以上）

## FAIL FAST（即止めて直す）
- Day14で設計パートナーが1社以下
- misexec発生（即freeze + 原因解明まで拡販停止）
- 当社起因で webhook_success < 98% が継続
- TTC p95 > 5s が悪化傾向

## 失格＝ピボットではない
- “対象（ICP）” と “導入摩擦（Receiver）” と “信頼（Freeze/品質）” を直すだけ
- コネクタを増やして誤魔化さない（phase1は増やさない）

# =========================================
# END: docs/30_DAY_SCORECARD.md
# =========================================


# =========================================
# BEGIN: docs/DISTRIBUTION_PLAYBOOK.md
# =========================================
# Distribution（phase1：PLGで回す。Sales “ゼロ”ではなく “最小”）

## 基本方針
- 最初の3社は Founder-led（=設計パートナー獲得）
- その後は PLG（勝手に広がる導線）で増えるように設計する
- “配布ループを1本に絞る”：phase1は Team Viral を最優先
- 導入摩擦は Receiver Starter Kit で潰す（PLGの初速）

## ループ1（主戦場）：Team Viral（承認リンクで社内拡散）
- approve通知（Slack/Email）→ 承認者が増える → 同じ会社内で席数が増える
KPI:
- approver_count_per_tenant
- approve_link_open_rate
- approve_to_confirm_conversion

## ループ2：Dev Viral（Conformance Badge）
- “Yohaku-Compatible” を貼れる → 導入の説得が楽 → 次のチームへ
KPI:
- conformance_runs_per_week
- badge_usage_count

## ループ3：Template Viral（Workflow共有）
- 安全な実行テンプレ（plan JSON）を共有 → 導入導線になる
KPI:
- template_exports
- template_imports

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
- Webhook: HMAC署名 + 再送 + 2h収束（job課金、attempt課金しない）
- CalendarHold: ICS生成（server）
- Freeze: middlewareで強制（global/tenant/connector/target）

## SLO（phase1）
- /plan p50 ≤ 1.0s（軽い）
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

- proposals(id, tenant_id, user_id, payload_json, created_at)
- plans(id, tenant_id, user_id, proposal_id, payload_json, created_at)

- approvals(id, tenant_id, user_id, approve_id, plan_id, scope_json, expires_at, created_at)
- audit_logs(id, tenant_id, user_id, approve_id, action, payload_json, at)

- ledger_events(
    id, tenant_id, approve_id, plan_id, action, actor, status,
    before_json, after_json, reversible, rollback_id,
    ts, prev_hash
  )

- freeze_rules(
    id, tenant_id, level, connector, target_url_hash,
    active, reason, created_at, updated_at
  )
  level: global|tenant|connector|target

- connector_configs(id, tenant_id, connector, config_json, created_at, updated_at)

- webhook_jobs(
    id, tenant_id, job_id, target_url_hash,
    payload_json, signature, status,
    attempts, next_attempt_at, last_error,
    created_at, updated_at
  )
  status: queued|delivering|succeeded|failed

- receipts(id, tenant_id, plan_id, status, summary_text, created_at)
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

# =========================================
# END: docs/DATA_MODEL.md
# =========================================


# =========================================
# BEGIN: docs/API_CONTRACTS.md
# =========================================
# API コントラクト（phase1：Private β）

## Auth（phase1）
- API Key（tenant単位）
- scope: plan:write, approve:write, confirm:write, ledger:read, billing:read

## POST /v1/plan
Req:
{
  "input": "If the user asks to schedule a follow-up, propose a calendar hold.",
  "context": {"tenant_id":"t1","user_id":"u1","tz":"Asia/Tokyo"}
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
  "latency_ms": 900
}

## POST /v1/approve
Req: { "plan_id":"pl1" }
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
  "metering": {"confirm": 1, "webhook_job": 1, "calendar_hold": 1}
}

## GET /v1/ledger/export?since=...
- 監査・検証用（CSV/JSON）

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
- X-Yohaku-Signature: sha256=<hex>（HMAC）
- X-Idempotency-Key: <string>
- X-Yohaku-Job-Id: <uuid>
Body:
{
  "event":"hold.created",
  "tenant_id":"t1",
  "confirm_id":"c_123",
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
# Cursor Implementation Rails（phase1：Exit-first / 10/10版）
# “コネクタを増やす” ではなく “Exitを標準化し、導入摩擦を潰し、止められる” が仕事。

## Epic 0：土台（Day 1–2）
- Prisma schema（tenant/users/api_keys/plans/approvals/ledger/webhook_jobs/freeze/billing）
- Security headers
- OpenTelemetry（server only）
- Idempotency middleware（24h）

DoD:
- migrations OK
- /health OK

## Epic 1：/plan /approve /confirm（Day 3–7）
- /v1/plan（actions+confirm_sheet）
- /v1/approve（TTL10m）
- /v1/confirm（idempotency必須）
- ledger_events append-only chain
- undo 10秒（可逆のみ）

DoD:
- approveなしconfirm不可
- 409 idempotency
- ledger_integrity OK

## Epic 2：Webhook connector（Day 8–14）
- connector_configs（webhook）
- webhook_jobs（outbox + retry/backoff）
- signer（HMAC）
- delivery結果を ledger に反映

DoD:
- T07/T10 pass
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

DoD:
- share_url発行
- open計測

## Epic 5：Receiver Starter Kit（Day 23–26）
- @yohaku/signature（検証）
- receiver-starter（Cloudflare Worker）
- receiver-starter（Node/Express）
- Webhook Playground（署名/冪等/再送確認）

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
- tests（T01〜T14）
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

# =========================================
# END: docs/IMPLEMENTATION_RAILS_CURSOR.md
# =========================================


# =========================================
# BEGIN: docs/MOAT_10_OF_10.md
# =========================================
# 10/10 Moat スコアカード（Exit-first版）

## 10/10 到達条件（要約）
- 規格化：Conformance + Treaty が“互換の中心”になっている
- 埋め込み：/confirm が複数入口から流入し、監査がYohaku前提になっている
- 透明性：AXI/Treatyが52週継続で改善されている
- COGS：粗利≥70%、SLA 99.9%（phase3）
- 生態系：Compatibleバッジ + Provider/Connector 認定が回っている

## 決定打（Moatをロック）
1) Conformance Test + Yohaku-Compatible
2) Treaty（定義/補償）で“信頼の価格”を作る
3) Ledger/PoEx（実行証明）で監査の中心になる
4) Freeze（止められる）を標準の一部にする
5) Receiver Starter Kit（導入摩擦ゼロ）で勝手に広がる入口を作る

# =========================================
# END: docs/MOAT_10_OF_10.md
# =========================================


# =========================================
# BEGIN: docs/ROADMAP_36M.md
# =========================================
## 0–6m（phase1：Exit-first / Private β）
- Action Cloud（/plan /approve /confirm /ledger）
- コネクタ2本固定：Webhook + CalendarHold（ICS）
- Conformance + Treaty v0 を“実装物”として完成
- PLG：Team Viral（承認リンク）を主戦場
- 導入摩擦：Receiver Starter Kit（30分導入）
- 信頼：Kill/Freeze（事故停止）を最初から仕組み化
- Phone/Proactive/Memory import/Marketplace はSEALED

## 6–12m（phase1_5）
- Private β拡張（10〜20社）
- 追加コネクタ検証（Slack draft / Email draft / Ticket create など）
- Phoneは “デモ用に限定解禁” は可（Clinic Liteだけ等）※主戦場ではない

## 12–24m（phase2）
- Action Cloud β（招待制、SLA 99.5%）
- Conformance公開、Yohaku-Compatible開始
- Treaty強化、AXI外部公開（慎重に）

## 24–36m（phase3）
- GA（Enterprise、SLA 99.9%、リージョン固定）
- Connector Marketplace解禁
- Proactive実行 解禁（条件付き）

# =========================================
# END: docs/ROADMAP_36M.md
# =========================================


# =========================================
# BEGIN: docs/PUBLIC_API.md
# =========================================
# PUBLIC API（phase1：一般公開しない）
- phase1：設計パートナーのみ（Private β）
- phase2：招待制β
- 一般公開（Public）はphase3以降

# =========================================
# END: docs/PUBLIC_API.md
# =========================================


# =========================================
# BEGIN: docs/CONNECTOR_SDK.md
# =========================================
# CONNECTOR SDK（SEALED：phase1は設計のみ）
- ConfirmOS準拠（可逆性/冪等/署名/監査/Freeze）
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

## 保持（推奨）
- audit_logs：90d
- ledger_events：90d
- idempotency keys：24h
- receipt_links：7d（revocable）
- billing usage counters：必要最小（集計値）

## Transparency Policy
- 必ず開示：実行と責任（ledger/receipt/AXI定義）
- ブラックボックス：内部プロンプト/ルーティング/重み

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
- phase1は contact_graph のスキーマ/ログのみ

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
# EVALS – phase1（Exit品質の生存指標）

## AXI（週次）
- confirm_count
- ttc_p50 / ttc_p95
- misexec_pct
- ledger_integrity
- webhook_delivery_success（2h以内）

## Funnel
- approve_to_confirm_conversion

## PLG
- approver_count_per_tenant
- approve_link_open_rate
- receipt_share_rate
- template_exports/imports

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
  - 10/10化（5点追加）
    1) Monetization（Platform+Usage / JPYデフォ）
    2) ICP（最初の3社の条件固定）
    3) Receiver Starter Kit（30分導入）必須化
    4) Kill/Freeze（事故停止の仕組み＋運用）確定
    5) 30日スコアカード（PASS/FAIL）確定
  - Legacy章（Memory/Proactive/MOAT等）は保持しつつ、phase1は封印強化

# =========================================
# END: docs/CHANGELOG.md
# =========================================