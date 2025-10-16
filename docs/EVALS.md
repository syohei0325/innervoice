# EVALS – 自動評価スイート

## 🎯 目的

プロダクトの品質を**継続的に測定**し、**データで意思決定**する。

---

## 📊 評価指標（KPI）

### 1. Top‑1採択率

**定義**: ユーザーが提案A/Bのうち、最初の提案（Top-1）を選択した割合

**目標**: ≥ 55%

**計測方法**:
```sql
SELECT
  COUNT(CASE WHEN decision.proposal_id = proposals.first_proposal_id THEN 1 END) * 100.0 / COUNT(*) AS top1_rate
FROM decisions
JOIN proposals ON decisions.proposal_id = proposals.id;
```

**改善アクション**:
- Top-1の当たり率が低い → Memory/Tasteの学習精度を上げる
- 理由タグ収集 → Why-thisの質を改善

---

### 2. 編集距離

**定義**: ユーザーが提案を編集した際の、元の提案との差分（文字数ベース）

**目標**: 中央値 ≤ 20%

**計測方法**:
```typescript
const editDistance = levenshtein(original, edited);
const editDistancePct = (editDistance / original.length) * 100;
```

**改善アクション**:
- 編集距離が大きい → 提案の精度が低い
- 頻繁に編集される箇所を特定 → プロンプト改善

---

### 3. Time‑to‑Confirm（TTC）

**定義**: ユーザーが提案を見てから確定するまでの時間

**目標**: p50 ≤ 3秒

**計測方法**:
```sql
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (decided_at - created_at)) AS ttc_p50
FROM decisions;
```

**改善アクション**:
- TTCが長い → 提案が分かりにくい / 信頼されていない
- Why-thisの明確化 / 出典表示

---

### 4. Nudge採択率

**定義**: Proactive OSが生成したNudgeのうち、ユーザーが受け入れた割合

**目標**: ≥ 25%（週）

**計測方法**:
```sql
SELECT
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) * 100.0 / COUNT(*) AS nudge_acceptance_rate
FROM nudges
WHERE created_at >= NOW() - INTERVAL '7 days';
```

**改善アクション**:
- 採択率が低い → タイミング/内容の改善
- 理由タグ収集 → Why-thisの質を改善

---

### 5. Nudge誤提案率

**定義**: Nudgeが「dismissedかつ理由タグ付き」で拒否された割合

**目標**: ≤ 10%

**計測方法**:
```sql
SELECT
  COUNT(CASE WHEN status = 'dismissed' AND reason_tag IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) AS nudge_error_rate
FROM nudges
WHERE created_at >= NOW() - INTERVAL '7 days';
```

**改善アクション**:
- 誤提案率が高い → 信号スキャンの閾値を調整
- Relationship Graphの精度を上げる

---

### 6. vMB（Verified Minutes-Back）

**定義**: 保守的に推定された時間節約（分）

**目標**: ≥ 15分/日（D30継続ユーザー）

**計測方法**:
```sql
SELECT
  AVG(minutes_back) AS avg_vmb
FROM events
WHERE user_id IN (SELECT user_id FROM users WHERE created_at >= NOW() - INTERVAL '30 days')
  AND created_at >= NOW() - INTERVAL '1 day';
```

**改善アクション**:
- vMBが低い → アクション数を増やす / Baseline_p10を見直す

---

### 7. FEA（Friction Events Avoided）

**定義**: 避けられた面倒な作業の件数

**目標**: ≥ 10件/週（p50）

**計測方法**:
```sql
SELECT
  user_id,
  SUM(qty) AS total_fea
FROM friction_events
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY user_id;
```

**改善アクション**:
- FEAが低い → アクション数を増やす / 連携アプリを追加

---

## 🔬 失敗例の収集

### 理由タグ

ユーザーが提案を却下した際、**理由タグ**を1タップで収集。

#### タグ例（提案却下時）

```yaml
時間:
  - 時間が合わない
  - 所要時間が長すぎる
  - 所要時間が短すぎる

場所:
  - 遠すぎる
  - 駐車場がない
  - 騒がしい

価格:
  - 高すぎる
  - 予算オーバー

好み:
  - 好みじゃない
  - 雰囲気が合わない

その他:
  - 混雑している
  - 今じゃない
```

#### タグ例（Nudge却下時）

```yaml
タイミング:
  - 忙しい
  - 今じゃない
  - 静音時間だった

内容:
  - 必要ない
  - すでにやった
  - 優先度が低い

関係性:
  - 距離感が違う
  - 関係性を誤解している
```

### 活用方法

```sql
-- 頻出理由タグを集計
SELECT
  reason_tag,
  COUNT(*) AS count
FROM reason_feedbacks
WHERE vote_bool = false  -- 却下
GROUP BY reason_tag
ORDER BY count DESC;
```

→ **Taste/Memory閾値に反映**

---

## 🔄 Provider A/B比較

### 目的
複数のMemory Providerを比較し、最適なものを選定する。

### 比較指標

| Provider | 採択率 | レイテンシ(p50) | 誤提案率 | エラー率 |
|----------|--------|----------------|----------|----------|
| Supermemory | ? | ? | ? | ? |
| Zep | ? | ? | ? | ? |
| Mem0 | ? | ? | ? | ? |

### データ収集

```sql
SELECT
  provider,
  AVG(CASE WHEN event = 'search' THEN (payload_json->>'latency_ms')::INT END) AS avg_latency,
  COUNT(CASE WHEN event = 'error' THEN 1 END) * 100.0 / COUNT(*) AS error_rate
FROM provider_events
WHERE at >= NOW() - INTERVAL '7 days'
GROUP BY provider;
```

### 切替判断

**週次で自動判断**:
```
IF (Provider A の採択率 > Provider B の採択率 + 5%)
  AND (Provider A のエラー率 < 2%)
THEN
  Provider A に切替
```

---

## 🧪 自動評価スイート

### テストケース例

#### 1. 基本提案（MVP）

```yaml
入力:
  text: "明日朝30分ランニング"
  context: { tz: "Asia/Tokyo", ng: ["22:00-06:30"], mobility: "walk" }

期待出力:
  proposals:
    - title: "朝ラン20分"
      slot: "07:00-07:30"
      duration_min: 20
    - title: "夜ストレッチ15分"
      slot: "21:30-22:00"
      duration_min: 15

評価:
  - Top-1採択率 ≥ 55%
  - TTC p50 ≤ 3秒
```

#### 2. Memory活用

```yaml
入力:
  text: "明日ランチ"
  context: { tz: "Asia/Tokyo" }
  memories:
    - { key: "lunch_preference", value: "イタリアン", confidence: 0.8 }
    - { key: "parking_required", value: true, confidence: 0.9 }

期待出力:
  plans:
    - summary: "イタリアン 駐車場あり 12:00-13:00"
      actions: [...]
      reasons:
        - { key: "likes_italian", source: "core", confidence: 0.8 }
        - { key: "parking_required", source: "core", confidence: 0.9 }

評価:
  - Top-1採択率 ≥ 60%（Memory活用時）
  - Why-thisの出典が正しく表示されているか
```

#### 3. Nudge品質

```yaml
入力:
  observations:
    - { signal: "relationship_gap", payload: { contact: "Aさん", days: 28, cadence: 20 } }

期待出力:
  nudge:
    summary: "Aさん、前回から28日。連絡しますか？"
    plan: [...]
    reasons:
      - { key: "relationship_gap", source: "core", confidence: 0.9 }

評価:
  - Nudge採択率 ≥ 25%
  - Nudge誤提案率 ≤ 10%
```

---

## 📈 継続的改善フロー

```
1. 評価指標を測定（日次/週次）
   ↓
2. 閾値を下回った指標を特定
   ↓
3. 失敗例の理由タグを集計
   ↓
4. Taste/Memory/Nudge閾値を調整
   ↓
5. A/Bテストで効果を検証
   ↓
6. 全ユーザーにロールアウト
   ↓
7. 1に戻る
```

---

## 🎯 目標ダッシュボード

```yaml
MVP:
  - Top-1採択率: 55% → 60%
  - TTC p50: 3s → 2s
  - 提案表示 p50: 1.5s → 1.0s

MVP+:
  - 複数アクション成功率: 90% → 95%
  - vMB: 15分/日 → 20分/日
  - FEA: 10件/週 → 15件/週

Doraemonモード:
  - Nudge採択率: 25% → 30%
  - Nudge誤提案率: 10% → 5%
  - Screen-off完了率: 70% → 80%

Provider:
  - レイテンシ p50: 900ms → 700ms
  - エラー率: 2% → 1%
```

---

**データで意思決定し、継続的に改善する。** 📊✨

