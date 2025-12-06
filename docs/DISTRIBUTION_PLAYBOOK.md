# 配布の型（B2C / PLG 優先）

## 目的
Yohakuを**オーガニックに広める**ための配布チャネル。

---

## 0. B2C / PLG ループ（電話嫌いユーザー起点）

**概要**：「電話が嫌いな個人」をターゲットに、PLG（Product-Led Growth）で自然流入を狙う。

### SNS共有機能
- アプリ内で「今週、電話を◯件やらずに済みました 📞→✅」カードを出し、SNS共有を誘発
- 予定やメッセージに `Scheduled with Yohaku` フッター（opt-out可）を付与し、自然流入を狙う

### Founder Story / Buildログ
- YouTube/Xで「電話筋肉ゼロ化への挑戦」を継続共有
- 開発の裏側、失敗談、ユーザーの声を定期的に発信
- 「電話が嫌いな人の味方」というポジショニングを強化

### リファラルプログラム
- クリック→有効化→初回確定を可視化
- 紹介者と被紹介者の両方にインセンティブ（vMBボーナス等）

### KPI
- 紹介率：ユーザーあたりの紹介数
- CVR：紹介→登録の転換率
- NPS ≥ 50

**重要**：0–6mはB2C / PLGループに全力投球。事業者向け営業は後回し。

---

## 0.5. Design Partner / Aggregator プログラム（6m以降）

**概要**：B2Cで一定のトラフィックとAXI実績が出た後、一次診療クリニックverticalや予約SaaS/BPOと組み、**Action Cloud連携**（`/confirm`）を標準機能として組み込んでもらう。

### 対象
- **一次診療クリニックvertical**：予約システムベンダー
- **予約SaaS**：TableCheck / Retty / OpenTable等
- **BPO**：コールセンター業務委託先

### 提供内容
- `/plan→/approve→/confirm` を実業務に埋め込み
- 週ごとにテンプレ/スクリプト/コネクタを改善
- 月1のAXIレビュー（通話成功率/誤実行率/vMB等）

### 期待値
- 各社で週あたり確定≥30件
- 通話成功率≥85%（Year 1）
- NPS≥60（Design Partner限定）

### Go基準
- B2Cで一定のトラフィックとAXI実績が出た後（6m以降）
- Design Partner 15-30社獲得（12ヶ月時点）
- 各社の継続率≥80%

**重要**：0–6mでは準備＆対話レベルに留め、営業/導入は急がない。

---

## 1. .icsフッター
`Scheduled with Yohaku` → 受信側が即体験。

## 2. 週次カード共有
FEA件数＋保守的vMBをSNS/職場共有。

### 例
```
今週のYohaku
📊 FEA: 12件
⏱️ vMB: 18分（保守的推定）
```

## 3. テンプレ/コネクタ市場（MCP）
署名/審査/スコープで安全運用。

## 4. OSディープリンク
ショートカット/インテント起動。

### iOS
```
yohaku://propose?text=明日朝30分ランニング
```

### Android
```
intent://propose?text=明日朝30分ランニング#Intent;scheme=yohaku;end
```

## 5. Trustパネル共有
誤実行/取消成功/承認時間/証拠係数を公開。

## 6. ChatGPT Appsディレクトリ
Lite→本体Proへ導線。

## 7. リージョンゲート
EUは後追い・データ最小化厳守。

## 8. AXIダッシュボード共有
yohaku.app/axi を共有して品質を"数字で"伝播。

### AXI（Action eXecution Index）
- **TTC p50**：Time‑to‑Confirm（提案表示速度）
- **誤実行率**
- **取消成功率**
- **ロールバック成功率**
- **通話成功率**
- **Screen‑off完了率**

## 9. ステータスページ
status.yohaku.app を掲示（稼働/障害/SLA進捗）。

## 10. Action Cloud Early Access
yohaku.app/action-cloud でβ申請（SLA/料金/AXIを明記）。

## KPI
- **紹介率**：ユーザーあたりの紹介数
- **CVR**：紹介→登録の転換率
- **NPS** ≥ 50

