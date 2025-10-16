# ROADMAP – 36ヶ月ロードマップ

## 🎯 目標

**36ヶ月で、声で完了する横断OS（Super-App by Voice）を実現する。**

---

## 📅 Phase 0: 0–6ヶ月（MVP→MVP+→Doraemonモード基礎）

### コア機能
- [x] **MVP**（7秒→2提案→1確定 .ics）
- [ ] **MVP+**（Intent Bus & Confirm once Multi-Action）
- [ ] **Memory OS v0**（preference/alias/goal）
- [ ] **Nudge v0**（free_slot/relationship_gap）

### インフラ
- [ ] **Provider PoC**（Supermemory **or** Zep）
- [ ] **A/B装置**（provider_events記録）
- [ ] health監視とフォールバック
- [ ] Why-thisに出典表示

### 縦機能
- [ ] **Social Pack v0**（contact_graphをメタで構築）

### KPI運用
- [ ] Nudge採択率/誤提案率/苦情率を計測
- [ ] vMB / FEA の可視化
- [ ] Top-1採択率 / TTC の計測

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

