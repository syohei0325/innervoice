# 配布の型

## 目的
Yohakuを**オーガニックに広める**ための配布チャネル。

---

## 0. Design Partner プログラム（0–6m優先）

**概要**：病院/飲食/再配達verticalで各5–10社とクローズドβを組み、AXIと失敗パターンを共に見る。

### 対象
- **病院vertical**：5–10社（クリニック/診療所）
- **飲食vertical**：5–10社（レストラン/居酒屋）
- **再配達vertical**：5–10社（配送業者/EC事業者）

### 提供内容
- `/plan→/approve→/confirm` を実業務に埋め込み
- 週ごとにテンプレ/スクリプト/コネクタを改善
- 月1のAXIレビュー（通話成功率/誤実行率/vMB等）

### 期待値
- 各社で週あたり確定≥30件
- 通話成功率≥85%（Year 1）
- NPS≥60（Design Partner限定）

### 成果物
- テンプレ3本の品質向上
- 失敗パターンの蓄積
- 台帳SaaSの初期顧客（有償化の布石）

### Go基準
- Design Partner 15-30社獲得（6ヶ月時点）
- 各社の継続率≥80%
- 「これなしでは業務が回らない」という声≥10社

**重要**：0–6mはDesign Partnerプログラムに全力投球。一般公開は後回し。

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

