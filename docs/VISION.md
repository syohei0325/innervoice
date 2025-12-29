# VISION – AI時代の"責任ある実行"を標準化する（Gate2/3は標準化で取る）
エージェントが普及すると「実行」の総量が増える。  
事故の総量も増える。  
だから世界は **Exit（確定/責任/監査/停止）** を必要とする。

## Valuation Ladderのコア仮説（Gate1→Gate2→Gate3）
- "システムを作った人"ではなく、"業界標準を作った人"が勝つ。
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
5. phase1は"低リスク"だけ（Webhook/CalendarHold）
6. 仕様はConformanceで縛る（互換性をテストで保証）
7. 信頼はTreatyで売る（定義と補償を数字で固定）
8. 開発者体験（DX）で10xを作る（自前実装の地獄から救う）
9. 入口（LLM/UI）は中立（どの入口でも使える）
10. 拡張は後（phase1は増やさない）
11. KYA：すべての実行は"誰が/誰の代理で"を追跡可能にする（責任がない実行は禁止）
12. 検証は止めない：Plannerはmock/rulesで落ちても回る
13. Gate2/3は "流量×規格" で取る（売上は結果）

## Riskiest Assumptions（phase1）
1) "安全な実行" を欲しがる設計パートナーを3社取れるか
2) /confirm が週次で増えるか（volumeが出るか）
3) Conformance/Treatyが導入の摩擦を下げるか（逆に上げないか）
4) Webhook/CalendarHoldだけで "10x価値" を感じてもらえるか
5) 30分導入（Receiver Kit）が本当に実現できるか
6) KYA（executor/principal）が"導入理由"になるか（監査・責任）
7) Provider Neutral が本当に効くか（買収・独立の両方で重要）

## なぜ "Exit-first" なのか

### 問題：エージェントの実行は危ない
- LLMが増えると、実行の総量が増える
- 実行の総量が増えると、事故の総量も増える
- 「勝手に実行される」は、最大のリスク

### 解決：出口（Exit）を握る
- 入口（LLM/UI）は競争が激しい
- 出口（確定/責任/監査）は空いている
- 出口を標準化すれば、どの入口からも使える

### なぜ phase1 で Phone を封印するのか
- Phone は「ブランド/規制/炎上コスト」が重い
- phase1 は「速度と信頼」を最大化する
- Webhook/CalendarHold は「低リスク」で「確実に価値」を届けられる
- Phone は phase1_5 以降で限定解禁を検討（主戦場にはしない）

## phase1 の成功条件

### 設計パートナー 3社
- Webhookを受けられる（Receiver Kitで30分導入できる）
- 承認/監査が必要な業務がある（実行が怖い）
- 2週間でPoCを回せる（週次で改善）

### confirm が週次で増える
- 合計 confirm >= 500 / week（3社合算）
- 最低でも週次で増加傾向

### 品質指標
- webhook_delivery_success >= 99%（当社起因）
- ledger_integrity >= 99.9%
- misexec_pct < 0.5%（理想は0）
- KYAの欠損なし（executor/principal 追跡可能）

### 導入摩擦
- Receiver Starter Kit で '30分導入' の実証 3社中2社以上

### 有料意志
- Day45までに「有料意志」1社（LOI/paid pilot）

## phase1 → phase2 の道筋

### phase1（0-6m）：Exit-first / Private β
- コネクタ2本固定：Webhook + Calendar Hold
- 設計パートナー 3社
- KYA（executor/principal）をledger/receiptに必ず刻む
- Provider Neutral / Planner resilience（mock/rules）で検証を止めない
- Conformance + Treaty v0.3 を"実装物"として完成
- Phone/Proactive/Memory import/Marketplace は SEALED

### phase1_5（6-12m）：Private β拡張
- 10〜20社に拡大
- 追加コネクタ検証（Slack draft / Email draft / Ticket create など）
- Phoneは "デモ用に限定解禁" は可（Clinic Liteだけ等）※主戦場ではない

### phase2（12-24m）：β / 招待制
- SLA 99.5%
- Conformance公開、Yohaku-Compatible開始
- Treaty強化、AXI外部公開（慎重に）

### phase3（24-36m）：GA / Enterprise
- SLA 99.9%
- Connector Marketplace解禁
- Proactive実行 解禁（条件付き）

## ピボット条件

### Fail Fast（即止めて直す）
- Day14で設計パートナーが1社以下
- misexec発生（即freeze + 原因解明まで拡販停止）
- 当社起因で webhook_success < 98% が継続
- TTC p95 > 5s が悪化傾向

### ピボット先
- 対象（ICP）と導入摩擦（Receiver）と信頼（Freeze/品質）を直すだけ
- コネクタを増やして誤魔化さない（phase1は増やさない）

## 10/10 Moat（競争優位の堀）

### 規格化
- Conformance + Treaty が"互換の中心"になっている

### 埋め込み
- /confirm が複数入口から流入し、監査がYohaku前提になっている

### 透明性
- AXI/Treatyが52週継続で改善されている

### COGS
- 粗利≥70%、SLA 99.9%（phase3）

### 生態系
- Compatibleバッジ + Provider/Connector 認定が回っている

## 決定打（Moatをロック）
1) Conformance Test + Yohaku-Compatible
2) Treaty（定義/補償）で"信頼の価格"を作る
3) Ledger/PoEx（実行証明）で監査の中心になる
4) Freeze（止められる）を標準の一部にする
5) KYA（誰が実行したか）を標準の一部にする
6) Receiver Starter Kit（導入摩擦ゼロ）で勝手に広がる入口を作る
7) Standard Flywheel（Compatible→採用→監査→さらに採用）
