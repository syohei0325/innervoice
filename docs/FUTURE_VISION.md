# 3年像 – Super‑App by Voice

## 目標
**「Yohakuを開いて話すだけで、アプリ横断の用事が全部終わる」**。80/20で"毎日の用事"をカバーし、残りは通話/人に委譲。

## タイムライン

### Now–6m
- Cal/Message/Reminders/通話テンプレ（病院/飲食/再配達）
- Car KPI本番（Screen‑off完了率 / 読み上げ中心UX）
- AXI週次公開（ttc_p50 / misexec / cancel / rollback / call_success / screen_off）

### 6–12m
- **Taste v1**：好みベクトル学習（系統/価格/雰囲気/距離）
- **Partner β**：同意ベース共有（最小・期限付き・撤回自由）
- **MCP拡張**：places / reservations / parking / ride（署名/審査/スコープ）

### 12–36m
- **pay.authorize**：二重承認＋監査ログ
- **事業者連携**：飲食/美容/医療/行政の認定コネクタ
- **テンプレ市場拡大**：ユーザー/事業者が独自テンプレを公開
- **協調エージェント**：Why‑this品質の連携最適化

## コア技術
- **7→2→1（Confirm once）**：One‑shot UX
- **MCP**：places / reservations / parking / ride / pay / call / notify
- **OS深統合**：Shortcuts / Intents / 通知1タップ
- **Taste Embedding**：好みベクトル（系統/価格/雰囲気/照度/席/駐車/距離/混雑/時間帯）
- **Partnerモード**：同意ベース共有（NG食材/価格帯/雰囲気/移動手段/当日位置）

## 安全原則
- **要約の強制表示** / **取消/ロールバック** / **監査ログ**
- **金額は二重承認**
- **車内は読み上げ中心**（視線ゼロ）
- **データ最小化**：要約＋操作メタのみ長期保存

## KPI（3年後）
- vMB ≥ 15分/日（D30継続ユーザー）
- Screen‑off完了率 ≥ 70%（Carモード含む）
- Confirm中央値 ≥ 2.2アクション/日
- 提案表示 p50 ≤ 1.5s
- 通話成功 ≥ 90%
- 誤実行 < 0.5%
- Taste命中 ≥ 40%（Top‑1採択率）

## 詳細ドキュメント
- **docs/TASTE_MODEL.md**：好み学習の仕組み
- **docs/PARTNER_MODE.md**：同意ベース共有
- **docs/CONFIRM_OS.md**：承認/取消/監査の規格
- **docs/PACKS_OVERVIEW.md**：縦機能パック

