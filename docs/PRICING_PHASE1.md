# Pricing – phase1（料金・課金単位・Gate1への道筋）

## 概要
phase1の料金体系は、**Exit-first / Action Cloud** の価値を反映し、Gate1（ARR 7〜10億円）への道筋を明確にします。

## 基本方針
- **Usage課金は '/confirm' に寄せる**（出口＝確定が主商品）
- **retry/attempt課金しない**（信頼の毀損を避ける）
- **Platform Fee は '信頼（監査/停止/KYA/Treaty/Conformance）' で正当化する**
- **単価を上げる前に 'SLO/監査/責任' を固める**（Treatyが裏付け）

---

## 課金単位の定義

### confirm
`/v1/confirm` が accept され ledger に CONFIRMED が1回書かれたもの（idempotencyで重複課金しない）

### webhook_job
`webhook.dispatch` action 1つ = 1 job（retry回数は課金しない）

### calendar_hold
`calendar.hold.create` action 1つ（ICS生成）

---

## 料金プラン（phase1）

### 設計パートナー（Design Partner）
```yaml
price_jpy_per_month: 0
duration_days: 60
eligibility: "設計パートナー（週次で使う。改善に協力。ロゴ/事例は任意）"

limits:
  included_confirms_per_month: 50,000
  included_webhook_jobs_per_month: 50,000
  included_calendar_holds_per_month: 50,000

terms:
  overage_confirm_jpy: 0
  overage_webhook_job_jpy: 0
  overage_calendar_hold_jpy: 0
```

**対象**: 最初の3社（設計パートナー）

---

### Private Beta Starter
```yaml
price_jpy_per_month: 50,000
included_confirms_per_month: 100,000
included_webhook_jobs_per_month: 100,000
included_calendar_holds_per_month: 100,000

overage:
  overage_confirm_jpy: 1.0
  overage_webhook_job_jpy: 0.5
  overage_calendar_hold_jpy: 0.2

support: "community + 48h response"
sla: "none (phase1)"
```

**対象**: 小規模チーム（月間confirm数 < 10万）

**想定顧客数**: 10〜30社

---

### Private Beta Pro
```yaml
price_jpy_per_month: 200,000
included_confirms_per_month: 500,000
included_webhook_jobs_per_month: 500,000
included_calendar_holds_per_month: 500,000

overage:
  overage_confirm_jpy: 0.8
  overage_webhook_job_jpy: 0.4
  overage_calendar_hold_jpy: 0.15

support: "private channel + 24h response"
sla: "none (phase1)"
```

**対象**: 中規模チーム（月間confirm数 10万〜50万）

**想定顧客数**: 20〜50社

---

### Private Beta Team（Gate1 Ladder / 中単価）
```yaml
price_jpy_per_month: 500,000
included_confirms_per_month: 2,000,000
included_webhook_jobs_per_month: 2,000,000
included_calendar_holds_per_month: 2,000,000

overage:
  overage_confirm_jpy: 0.6
  overage_webhook_job_jpy: 0.3
  overage_calendar_hold_jpy: 0.10

support: "private channel + 12h response"
sla: "none (phase1)"
```

**対象**: 大規模チーム（月間confirm数 50万〜200万）

**想定顧客数**: 10〜30社

**Gate1への貢献**: 
- 30社 × ¥500,000/月 = MRR ¥15,000,000（ARR ¥180,000,000）

---

### Enterprise Preview（Gate1 Ladder / 高単価）
```yaml
price_jpy_per_month: 2,000,000
included_confirms_per_month: 10,000,000
included_webhook_jobs_per_month: 10,000,000
included_calendar_holds_per_month: 10,000,000

overage:
  overage_confirm_jpy: 0.4
  overage_webhook_job_jpy: 0.2
  overage_calendar_hold_jpy: 0.06

support: "private channel + 4h response"
sla: "none (phase1)"

note: "Enterprise機能（SAML/SCIM等）はphase2で解禁。phase1は'Exit品質+監査+Treaty'で売る。"
```

**対象**: Enterprise（月間confirm数 200万〜1000万）

**想定顧客数**: 5〜15社

**Gate1への貢献**: 
- 10社 × ¥2,000,000/月 = MRR ¥20,000,000（ARR ¥240,000,000）

---

## Monetization Goals（Gate1逆算の目標）

### Month 3
**MRR**: ¥1,000,000〜¥3,000,000

**内訳例**:
- 設計パートナー 3社（無料）
- Starter 2社 × ¥50,000 = ¥100,000
- Pro 5社 × ¥200,000 = ¥1,000,000

**目標**: 有料意志を2社以上

---

### Month 6
**MRR**: ¥3,000,000〜¥10,000,000

**内訳例**:
- Starter 10社 × ¥50,000 = ¥500,000
- Pro 20社 × ¥200,000 = ¥4,000,000
- Team 5社 × ¥500,000 = ¥2,500,000

**目標**: Starter/Pro/Teamが混ざる

---

### Month 12
**MRR**: ¥15,000,000〜¥30,000,000

**内訳例**:
- Starter 20社 × ¥50,000 = ¥1,000,000
- Pro 40社 × ¥200,000 = ¥8,000,000
- Team 20社 × ¥500,000 = ¥10,000,000
- Enterprise 2社 × ¥2,000,000 = ¥4,000,000

**目標**: Team/Enterpriseが入り始める

---

### Month 18
**MRR**: ¥40,000,000〜¥60,000,000
**ARR**: ¥480,000,000〜¥720,000,000

**内訳例**:
- Starter 30社 × ¥50,000 = ¥1,500,000
- Pro 60社 × ¥200,000 = ¥12,000,000
- Team 40社 × ¥500,000 = ¥20,000,000
- Enterprise 10社 × ¥2,000,000 = ¥20,000,000

**目標**: Gate1圏内に入る

---

### Month 24（Gate1達成）
**MRR**: ¥70,000,000〜¥90,000,000
**ARR**: ¥840,000,000〜¥1,080,000,000

**内訳例**:
- Starter 40社 × ¥50,000 = ¥2,000,000
- Pro 80社 × ¥200,000 = ¥16,000,000
- Team 60社 × ¥500,000 = ¥30,000,000
- Enterprise 15社 × ¥2,000,000 = ¥30,000,000

**目標**: Gate1達成（ARR 7〜10億円）

---

## Gate1到達の典型パターン

### Pattern A: Enterprise少数×高単価
```
30社 × ¥2,000,000/月（Platform）= MRR ¥60,000,000（ARR ¥720,000,000）
+ Usage overage + Expansion で ARR ¥1.0B+ を狙う
```

### Pattern B: Mid-market多数×中単価
```
150社 × ¥500,000/月 = MRR ¥75,000,000（ARR ¥900,000,000）
```

### Pattern C: PLG長尾×Usage爆発
```
1,000社 × ¥80,000/月（平均）= MRR ¥80,000,000（ARR ¥960,000,000）
```

---

## 課金方式

### phase1
**BILLING_MODE_PHASE1**: `contract_then_invoice`

- 手動請求でもOK
- 必ず"計測"は自動でやる（usage_counters_daily）

### phase2以降
- Stripe連携
- 自動請求
- クレジットカード決済

---

## Unit Economics（phase1）

### コスト構造
```yaml
avg_confirm_latency_ms_p50: 1200
avg_confirm_latency_ms_p95: 2500
avg_llm_cost_per_confirm_yen: 1.2
avg_infra_cost_per_confirm_yen: 0.8
target_gross_margin_phase1: 75%
```

### 粗利目標
- **Gate1**: >= 70%（理想80%+）
- **Gate2**: >= 80%（COGS最適化：plannerコスト/配信/運用を圧縮）

---

## NRR（Net Revenue Retention）

### 目標
- **Gate1**: >= 130%（同一tenant内で agent数・confirm数が増える設計＝Expansion）
- **Gate2**: >= 135%（Expansionが"当たり前"）
- **Gate3**: >= 140%（"同一社内で増える"が極まる）

### Expansion Engine
- 同一tenant内でagent数が増える
- confirm数が増える
- usage overageが発生する

---

## Treaty（補償）との関係

### Treaty v0（初期案）
- **misexec_pct > 0.5%（週）**: 当該週 Platform Fee の 25% クレジット
- **misexec_pct > 1.0%（週）**: 当該週 Platform Fee の 100% クレジット
- **ledger_integrity < 99.9%（週）**: 当該週請求を無効（0円）＋原因レポート
- **webhook_delivery_success < 99.0%（週）**: 当該週 usage の 25% クレジット（当社起因のみ）

### 価格との関係
- Platform Feeは「信頼（監査/停止/KYA/Treaty/Conformance）」で正当化
- Treatyが裏付けとなり、単価を上げられる

---

## 通貨

### phase1
**BILLING_CURRENCY**: JPY

### phase2以降
- USD対応
- グローバル展開

---

## まとめ

### phase1の料金戦略
1. **Exit品質+監査+Treaty** で売る
2. **Usage課金は '/confirm' に寄せる**
3. **retry/attempt課金しない**（信頼の毀損を避ける）
4. **Platform Fee は '信頼' で正当化する**
5. **単価を上げる前に 'SLO/監査/責任' を固める**

### Gate1への道筋
- Month 3: MRR ¥1〜3M（有料意志2社以上）
- Month 6: MRR ¥3〜10M（Starter/Pro/Team混在）
- Month 12: MRR ¥15〜30M（Team/Enterprise入り始め）
- Month 18: MRR ¥40〜60M（ARR ¥480〜720M）
- Month 24: MRR ¥70〜90M（ARR ¥840〜1,080M = Gate1達成）

### 成功の鍵
- **NRR >= 130%**（Expansion Engineが回る）
- **Gross Margin >= 70%**（健全な経済性）
- **Treaty指標達成**（misexec < 0.5%, ledger_integrity >= 99.9%）
- **Team Viral**（approveリンク経由の社内拡散）
- **Standard Flywheel**（Compatible badge → 採用 → 監査 → さらに採用）

