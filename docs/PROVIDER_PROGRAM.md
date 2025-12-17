# Provider 認定プログラム（Call/Connector）

## 目的

品質/規制/透明性を満たす外部プロバイダのみを**Yohaku-Compatible**として掲載し、**AXI Leaderboard**で比較可能にする。

---

## 対象プロバイダ

### 1. Call Provider（通話プロバイダ）
- **例**：Twilio、Telnyx、Vonage、Plivo、Bandwidth、SignalWire
- **役割**：`call.place` / `call.status` / `call.summary` の実装
- **要件**：CALL PROVIDER SPEC準拠

### 2. Connector Provider（アクション実装）
- **例**：Google Calendar API、Microsoft Graph、Slack API、LINE Messaging API
- **役割**：`calendar.create` / `message.send` / `reminder.create` 等の実装
- **要件**：CONNECTOR SDK準拠

### 3. Memory Provider（外部記憶）
- **例**：Supermemory、Zep、Mem0、Pinecone、Weaviate
- **役割**：`memory.put` / `memory.query` / `memory.forget` の実装
- **要件**：MEMORY PROVIDERS準拠

---

## 審査観点（共通）

### 1. セキュリティ
- ✓ **署名検証（HMAC）**：Webhookに`X-Provider-Signature`を付与
- ✓ **冪等性（24h）**：`X-Idempotency-Key`で重複除外
- ✓ **データ地域固定**：ユーザーデータを契約外の地域に搬出しない
- ✓ **暗号化**：転送中（TLS 1.3+）・保存時（AES-256+）

### 2. 信頼性
- ✓ **SLA**：稼働率≥99.5%（Silver）/ ≥99.9%（Gold）/ ≥99.95%（Platinum）
- ✓ **レイテンシ**：p50≤1.5s（Call Provider）/ p50≤500ms（Connector）
- ✓ **エラーハンドリング**：リトライ・フォールバック・エラーコード標準化

### 3. 規制対応
- ✓ **インシデント通知**：72h以内に報告（GDPR/CCPA準拠）
- ✓ **録音・同意**：地域差対応（JP/US/EU）
- ✓ **発信者番号ポリシー**（Call Provider）：非通知回避・同一番号・冒頭明示

### 4. ConfirmOS準拠
- ✓ **取消/ロールバック**：可否の明示（`reversible: true/false`）
- ✓ **監査ログ**：実行前後の状態を記録
- ✓ **Idempotency-Key**：24h重複除外

### 5. 透明性
- ✓ **ログ公開**：成功率・遅延・エラー率を週次公開
- ✓ **原価掲示**（Gold以上）：1アクションあたりの原価を公開
- ✓ **ステータスページ**：障害・メンテナンス情報を掲示

---

## 認定等級

### Silver（基本準拠）

**要件**：
- ✓ セキュリティ：署名・冪等・暗号化
- ✓ SLA：≥99.5%
- ✓ 規制対応：インシデント通知72h
- ✓ ConfirmOS準拠：取消可否明示

**特典**：
- Yohaku-Compatible バッジ
- AXI Leaderboard掲載
- ドキュメント掲載

**審査期間**：2-4週間

**年会費**：無料

---

### Gold（高品質）

**要件**：
- ✓ Silverの全要件
- ✓ SLA：≥99.9%
- ✓ 原価掲示：1アクションあたりの原価を公開
- ✓ レイテンシ：p50≤1.0s（Call）/ p50≤300ms（Connector）

**特典**：
- Yohaku-Compatible (Gold) バッジ
- AXI Leaderboard上位表示
- 優先サポート
- 共同マーケティング

**審査期間**：4-6週間

**年会費**：$5,000

---

### Platinum（エンタープライズ）

**要件**：
- ✓ Goldの全要件
- ✓ SLA：≥99.95%
- ✓ PoEx連携：実行証明（Merkle Root）に参加
- ✓ 台帳統合：Execution Ledgerに直接書き込み
- ✓ SOC2 Type II / ISO 27001取得済

**特典**：
- Yohaku-Compatible (Platinum) バッジ
- AXI Leaderboard最上位表示
- 専任サポート
- 共同開発・ロードマップ共有
- エンタープライズ顧客への優先紹介

**審査期間**：6-8週間

**年会費**：$25,000

---

## 審査プロセス

### Step 1：申請（1週間）
1. **申請フォーム提出**：https://yohaku.app/provider-program/apply
2. **技術仕様提出**：API仕様書・セキュリティ文書・SLA契約
3. **初期審査**：Yohakuチームが要件充足を確認

### Step 2：技術審査（2-4週間）
1. **Conformance Test実行**：自動テストスイートで仕様準拠を検証
   ```bash
   $ yohaku-test-suite --provider <provider-name>
   ```
2. **セキュリティ審査**：署名・暗号化・データ地域固定を確認
3. **負荷テスト**：SLA・レイテンシを検証

### Step 3：本番統合（1-2週間）
1. **Sandbox環境**：Yohaku Sandboxで統合テスト
2. **本番環境**：段階的ロールアウト（1% → 10% → 100%）
3. **監視開始**：AXI計測開始

### Step 4：認定・公開（1週間）
1. **認定証発行**：Yohaku-Compatible バッジ付与
2. **AXI Leaderboard掲載**：成功率・遅延・原価を公開
3. **ドキュメント公開**：yohaku.app/providers に掲載

---

## Conformance Test Suite

### 概要
Providerの仕様準拠を**自動テスト**で検証するツール。

### テスト項目（Call Provider）

```yaml
# Conformance Test: Call Provider
tests:
  - name: 署名検証（HMAC）
    description: Webhookに正しい署名が付与されているか
    method: POST /webhooks/call.status
    expected: X-Provider-Signature: sha256=<hex>
    
  - name: 冪等性（24h）
    description: 同一Idempotency-Keyで重複実行されないか
    method: POST /call.place (同じキーで2回)
    expected: 2回目は409 Conflict
    
  - name: 発信者番号ポリシー
    description: 非通知を避け、同一番号を使用しているか
    method: POST /call.place → 発信者番号確認
    expected: 0ABJ or 050番号、再発信時も同一
    
  - name: 録音同意（地域差）
    description: JP/US/EUで録音同意の案内文言が異なるか
    method: POST /call.place (locale: ja-JP/en-US/en-GB)
    expected: 各地域の文言を確認
    
  - name: インシデント通知（72h）
    description: 障害時に72h以内に通知されるか
    method: 障害シミュレーション
    expected: 72h以内にメール/Webhook通知
    
  - name: データ地域固定
    description: ユーザーデータが契約外の地域に搬出されないか
    method: ネットワーク監視
    expected: 契約地域内のIPアドレスのみ
    
  - name: ConfirmOS準拠
    description: 取消/ロールバック可否が明示されているか
    method: POST /call.place → reversible フラグ確認
    expected: reversible: false（通話は不可逆）
```

### テスト項目（Connector Provider）

```yaml
# Conformance Test: Connector Provider
tests:
  - name: 署名検証（HMAC）
    description: Webhookに正しい署名が付与されているか
    
  - name: 冪等性（24h）
    description: 同一Idempotency-Keyで重複実行されないか
    
  - name: 取消/ロールバック
    description: 実行後に取り消せるか
    method: POST /action.execute → POST /action.rollback
    expected: 元の状態に戻る（reversible: true の場合）
    
  - name: エラーハンドリング
    description: エラー時に適切なエラーコードを返すか
    method: POST /action.execute (無効なパラメータ)
    expected: 400 Bad Request / 422 Unprocessable Entity
    
  - name: レイテンシ
    description: p50≤500ms を満たすか
    method: POST /action.execute (100回実行)
    expected: p50≤500ms
```

### 実行方法

```bash
# Conformance Test Suite のインストール
$ npm install -g @yohaku/test-suite

# Call Provider のテスト
$ yohaku-test-suite --provider twilio --type call
✓ 署名検証（HMAC）
✓ 冪等性（24h）
✓ 発信者番号ポリシー
✓ 録音同意（地域差）
✓ インシデント通知（72h）
✓ データ地域固定
✓ ConfirmOS準拠

Result: PASS (7/7)
Badge: Yohaku-Compatible (Silver)

# Connector Provider のテスト
$ yohaku-test-suite --provider google-calendar --type connector
✓ 署名検証（HMAC）
✓ 冪等性（24h）
✓ 取消/ロールバック
✓ エラーハンドリング
✓ レイテンシ

Result: PASS (5/5)
Badge: Yohaku-Compatible (Silver)
```

---

## AXI Leaderboard

### 概要
認定Providerの品質を**公開比較**するダッシュボード。

### 表示項目

| Provider | 等級 | 成功率 | 遅延（p50） | 原価 | SLA | 更新日 |
|---------|------|--------|------------|------|-----|--------|
| Twilio | Gold | 92.3% | 1.2s | $0.025 | 99.92% | 2025-12-05 |
| Telnyx | Gold | 89.7% | 0.9s | $0.031 | 99.88% | 2025-12-05 |
| Vonage | Silver | 87.1% | 1.5s | - | 99.54% | 2025-12-05 |

### URL
https://yohaku.app/axi/leaderboard

### 更新頻度
週次（毎週月曜日 09:00 JST）

### データソース
- **成功率**：`call_success_pct`（AXI）
- **遅延**：`ttc_p50_ms`（AXI）
- **原価**：Provider自己申告（Gold以上）
- **SLA**：過去30日の稼働率

---

## Provider向けサポート

### ドキュメント
- **Call Provider Spec**：https://yohaku.app/docs/call-provider-spec
- **Connector SDK**：https://yohaku.app/docs/connector-sdk
- **Memory Providers**：https://yohaku.app/docs/memory-providers

### サンプルコード
- **GitHub**：https://github.com/yohaku/provider-examples
- **言語**：Node.js、Python、Go、Ruby

### サポートチャンネル
- **Slack**：yohaku-providers.slack.com
- **Email**：providers@yohaku.app
- **営業時間**：平日 10:00-18:00 JST

---

## FAQ

### Q1: 認定にかかる費用は？
**A**: Silver等級は無料です。Gold等級は年会費$5,000、Platinum等級は年会費$25,000です。

### Q2: 審査期間はどのくらい？
**A**: Silver等級は2-4週間、Gold等級は4-6週間、Platinum等級は6-8週間です。

### Q3: AXI Leaderboardに掲載されるメリットは？
**A**: Yohakuユーザー（個人・企業）がProviderを選ぶ際の参考になります。品質が高いProviderは優先的に選ばれます。

### Q4: 原価を公開したくない場合は？
**A**: Silver等級では原価公開は不要です。Gold以上は原価公開が必須です。

### Q5: SLA違反時のペナルティは？
**A**: SLA違反が3ヶ月連続で発生した場合、等級が降格されます（Gold → Silver）。

### Q6: 認定を取り消されることはある？
**A**: 重大なセキュリティインシデント・規制違反・SLA違反が発生した場合、認定を取り消すことがあります。

### Q7: 複数の等級に同時に申請できる？
**A**: いいえ、まずSilver等級を取得してから、Gold/Platinumにアップグレードする流れです。

### Q8: 日本国外のProviderも申請できる？
**A**: はい、ただしデータ地域固定の要件を満たす必要があります（例：JP顧客のデータはJP地域内で処理）。

---

## ロードマップ

### Phase 1（0-3m）：Silver等級のみ
- Provider 2社（Twilio/Telnyx）で開始
- Conformance Test Suite v0.1リリース
- AXI Leaderboard β公開

### Phase 2（3-6m）：Gold等級追加
- Provider認定プログラム正式開始
- Provider 15社獲得
- 原価掲示開始

### Phase 3（6-12m）：Platinum等級追加
- PoEx連携開始
- Provider 30社獲得
- エンタープライズ顧客への優先紹介

### Phase 4（12-18m）：グローバル展開
- Provider 50社獲得
- EU/US地域でのProvider認定開始
- 多言語対応（英語・日本語）

---

## まとめ

**Provider 認定プログラムは「生態系の品質保証」**

1. **Conformance Test**：自動テストで仕様準拠を検証
2. **AXI Leaderboard**：品質を公開比較
3. **3等級制**：Silver（無料）→ Gold（$5K）→ Platinum（$25K）
4. **透明性**：成功率・遅延・原価を週次公開

**目標：12-18ヶ月でProvider 50社認定**

これが「生態系の堀」を作る。














