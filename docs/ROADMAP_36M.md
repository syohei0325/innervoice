# ROADMAP – 36ヶ月ロードマップ

## 🎯 目標

**36ヶ月で、声で完了する横断OS（Super-App by Voice）を実現する。**

---

## 📅 Phase 0: 0–6ヶ月（**Yohaku Wedge：通話→予定化テンプレ3本に集中**）

### 戦略：Phase 2-first + Focus Rules

**方針**：リソースを「通話→予定化テンプレ3本（病院/飲食/再配達）」のPMF達成に集中する。

### コア機能（実装する）
- [x] **MVP**（Phase 2-first：通話→予定化）
  - Call Consent（/api/approve）
  - call.place / call.status / call.summary
  - PlanA/B提示
  - Confirm once（並列実行）
  - .icsフォールバック（常時有効）
- [ ] **AXI & Security KPI 外部公開**
  - 週次で `ttc_p50 / misexec / cancel / rollback / call_success / screen_off` を掲示
  - `vuln_open / mttr_security_hours` 等も公開
- [ ] **Execution Ledger v0**（席課金の設計）
- [ ] **Provider PoC**（Twilio/Telnyxのどちらか1社）

### Design Partner プログラム（最優先）
- [ ] **3 vertical × 各5–10社**（病院/飲食/再配達）とクローズドβ
  - 各社で週あたり確定≥30件
  - 月1のAXIレビュー
  - テンプレ・スクリプト・コネクタを共創
- [ ] **Go基準**：Design Partner 15-30社獲得（6ヶ月時点）

### 非コア機能の凍結（実装しない）

**以下は0–6mでは実装しない**（データモデルとロギングだけ先に用意）：

- ❌ **Doraemonモード**（Proactive OS / Nudge / Relationship Graph / Partnerモード / Taste）
  - 実行パスは封印
  - ログとデータモデルだけ用意
- ❌ **Pluggable Memory本番運用**
  - PoCレベルに留める
  - 本番導入はAction Cloud β以降
- ❌ **OS Deep Integration / Browser Extension**（Confirm Bar α）
  - Yohaku WedgeのAXIがGo基準を超えるまで後ろ倒し
- ❌ **Public API / MCP一般公開**
  - Design Partner向けPrivate βのみ
- ❌ **新verticalや新テンプレ**
  - 3本（病院/飲食/再配達）のAXIが基準値を超えるまでは増やさない

### 理由
1. **リソースの集中**：分散させず、3本の品質とAXI改善に全力
2. **早期PMF検証**：機能を増やす前に、3本で十分な頻度が出るか確認
3. **失敗の早期検出**：6ヶ月でダメなら早期ピボット（Action Cloud単体SaaSへ）

### Go基準（6ヶ月時点）
- ✅ 通話成功率 ≥ 90%
- ✅ D30リテンション ≥ 25%
- ✅ 日あたり確定 ≥ 3
- ✅ vMB中央値 ≥ 6分
- ✅ NPS ≥ 50
- ✅ Design Partner 15-30社獲得

**これらを達成したら、次の機能開発に進む。達成できなければピボット。**

---

## 📅 Phase 1: 6–12ヶ月（学習強化＆Provider冗長化）

### Memory強化
- [ ] **Memory OS v1**（routine/relationship_note/TTL）
- [ ] Memory自動削除（TTLマトリクス）
- [ ] confidence自動更新

### Proactive強化
- [ ] Relationship Gaps→Meet提案（候補3スロット）
- [ ] deadline_near / habit_window 信号
- [ ] Nudge窓のパーソナライズ

### 連携拡大
- [ ] LINE/WhatsApp/Emailコネクタ（TOS順守）
- [ ] Google Calendar / Apple Calendar 双方向同期

### Provider冗長化
- [ ] **Provider二社冗長**（Supermemory + Zep）
- [ ] 自動降格/ヘルスチェック
- [ ] 週次での自動切替判断

### KPI
- [ ] vMB ≥ 20分/日
- [ ] FEA ≥ 15件/週
- [ ] Nudge採択率 ≥ 30%

---

## 📅 Phase 2: 12–24ヶ月（Autopilot & 協調エージェント）

### Autopilot
- [ ] **Autopilot budgets**（週Nインパクト上限）
- [ ] ユーザー調整可能な上限設定
- [ ] Autopilot規則の学習

### パーソナライズ
- [ ] パーソナライズNudge窓（朝型/夜型）
- [ ] Vibe Profile v2（より細かいトーン調整）
- [ ] Taste Embedding v1（好みベクトル）

### 協調エージェント
- [ ] Why-this品質の協調エージェント最適化
- [ ] 複数Providerの統合推論
- [ ] コンテキスト連鎖（前回の決定を次の提案に活用）

### Pack拡張
- [ ] **Money Pack v1**（交渉/解約/乗換）
- [ ] **Civic Pack v1**（書類生成＋枠取り）
- [ ] **Family Pack β**
- [ ] **Care Pack β**

### MCP拡張
- [ ] places.search / reservations.book（署名/審査/スコープ）
- [ ] parking.reserve / ride.order
- [ ] call.place（SIP統合）

### KPI
- [ ] vMB ≥ 25分/日
- [ ] Taste命中率 ≥ 40%
- [ ] Autopilot採択率 ≥ 30%

---

## 📅 Phase 3: 24–36ヶ月（Super-App by Voice）

### 決済
- [ ] **pay.authorize**（二重承認必須）
- [ ] Money-Back可視化
- [ ] 成功報酬/アフィリエイト対応

### 事業者連携
- [ ] レストラン予約API連携
- [ ] ホテル予約API連携
- [ ] 交通機関API連携
- [ ] 行政サービスAPI連携

### テンプレ市場
- [ ] MCP Connector Marketplace
- [ ] 外部開発者がConnectorを追加可能
- [ ] 署名/審査/スコープ管理

### 協調エージェント v2
- [ ] 複数エージェント間の協調
- [ ] ユーザーの長期目標達成支援
- [ ] Partnerモード（同意ベース共有）

### グローバル展開
- [ ] EU対応（GDPR完全準拠）
- [ ] 多言語対応（英語/日本語/中国語/韓国語）
- [ ] SOC 2 Type II 取得

### KPI
- [ ] vMB ≥ 30分/日
- [ ] Screen-off完了率 ≥ 80%
- [ ] NPS ≥ 60
- [ ] D30継続率 ≥ 30%
- [ ] 月間アクティブユーザー ≥ 10万人

---

## 🌟 将来像（3年後）

```yaml
目標:
  「Yohakuを開いて話すだけで、
   アプリ横断の用事が全部終わる」

カバレッジ:
  - 80/20で"毎日の用事"をカバー
  - 残りは通話/人に委譲

実行手段:
  - MCP: calendar/message/reminder/call/places/
         reservations/parking/ride/pay/notify
  - OS深統合: Shortcuts/Intents/通知1タップ
  - Voice Calls (SIP): API未対応は電話で完了

学習:
  - Taste Embedding（好みベクトル）
  - Memory OS（記憶・習慣）
  - Relationship Graph（関係性管理）
  - Partnerモード（同意ベース共有）

Pack拡張:
  - Money Pack（交渉/解約/乗換）
  - Civic Pack（行政手続き/書類生成）
  - Family Pack（学校/送迎/連絡）
  - Care Pack（通院/服薬/家族連絡）
```

---

**36ヶ月で、スクリーンから人を解放する。** 🚀✨

