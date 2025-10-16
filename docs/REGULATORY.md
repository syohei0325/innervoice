# REGULATORY – リージョン/同意/データ移転

## 🌍 リージョンゲート

### 提供地域

#### Phase 1: US/JP先行（0-6ヶ月）
- アメリカ合衆国（US）
- 日本（JP）

#### Phase 2: EU対応（6-12ヶ月）
- GDPR完全準拠
- データ移転の適法化（Standard Contractual Clauses等）
- EU域内データセンター検討

### 機能制限

| 機能 | US/JP | EU（初期） |
|------|-------|-----------|
| 基本機能（MVP） | ✅ | ✅ |
| MVP+（Multi-Action） | ✅ | ✅ |
| Doraemonモード | ✅ | ⚠️ 限定的 |
| 通話（SIP） | ✅ | ❌ 別審査 |
| 外部連携（MCP） | ✅ | ⚠️ 審査中 |
| 支払い（pay.authorize） | ⚠️ 開発中 | ❌ 未定 |

---

## 📋 同意管理

### 同意が必要な機能

#### Tier 1: 基本機能（包括同意）
- カレンダー読み書き
- メッセージ送信（既存連絡先）
- リマインダー作成

#### Tier 2: 録音/本文解析（明示同意）
- **録音**：音声データの24時間保存
- **本文解析**：メール/メッセージ本文の解析（既定OFF）
- 明示的なオプトイン必須

#### Tier 3: 支払い/通話（二重承認）
- **支払い**：金額を伴う操作
- **通話**：電話による予約/キャンセル
- Confirm Sheetで内容確認 + 二重承認

### 同意の記録

```sql
CREATE TABLE consents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  scope_json JSONB NOT NULL,  -- { "recording": true, "payment": false }
  expires_at TIMESTAMP,       -- 期限付き同意
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 同意の撤回

```
POST /api/consent/revoke
{
  "scope": "recording"
}
```

→ 該当データは即時削除

---

## 🔄 データ移転

### 原則
外部プロバイダに預けるデータは**最小化**し、出典のみCoreに保持。

### 移転フロー

```
ユーザー入力（US/JP）
  ↓
Core Memory（US/JP サーバ）
  ↓（要約/参照URIのみ）
外部Provider（Supermemory/Zep/Mem0）
  ↓（検索結果）
Core Memory（US/JP サーバ）
  ↓
提案生成 & 表示
```

### 出典明示

Why‑thisに**出典と信頼度**を表示することで、ユーザーはどのデータがどこから来たかを把握できる。

```json
{
  "key": "<=15min_walk",
  "source": "doc",
  "provider": "supermemory",
  "confidence": 0.72,
  "evidence": ["drive:doc_123"]
}
```

---

## 🇪🇺 GDPR準拠（EU対応時）

### 必須対応項目

#### 1. データ主体の権利

| 権利 | 実装方法 |
|------|----------|
| アクセス権 | `GET /api/account/export` |
| 訂正権 | `PUT /api/memory.put` |
| 削除権（忘れられる権利） | `DELETE /api/memory.purge` / `POST /api/account/delete` |
| データポータビリティ権 | `GET /api/memory.export` (JSON) |
| 処理の制限 | `POST /api/consent/revoke` |
| 異議権 | Provider切替 / オプトアウト |

#### 2. データ保護影響評価（DPIA）
- Doraemonモード（先読み提案）
- Relationship Graph（関係性管理）
- 通話（SIP）

→ 別途DPIAを実施

#### 3. データ保護責任者（DPO）
- EU対応時に任命

#### 4. データ侵害通知
- 72時間以内に監督機関へ通知
- 必要に応じてユーザーへ通知

---

## 🇺🇸 CCPA準拠（カリフォルニア州）

### 必須対応項目

#### 1. 通知義務
- プライバシーポリシーで収集データを明示

#### 2. 消費者の権利

| 権利 | 実装方法 |
|------|----------|
| 知る権利 | プライバシーポリシー + `GET /api/account/export` |
| 削除権 | `POST /api/account/delete` |
| オプトアウト権（販売） | **該当なし**（販売しない） |
| 差別されない権利 | オプトアウトによる機能制限なし |

---

## 🇯🇵 個人情報保護法準拠（日本）

### 必須対応項目

#### 1. 利用目的の明示
- プライバシーポリシーで明示

#### 2. 本人の権利

| 権利 | 実装方法 |
|------|----------|
| 開示請求権 | `GET /api/account/export` |
| 訂正請求権 | `PUT /api/memory.put` |
| 利用停止請求権 | `POST /api/consent/revoke` |
| 削除請求権 | `POST /api/account/delete` |

#### 3. 第三者提供の制限
- 外部プロバイダへのデータ提供は**最小化**
- 出典のみCoreに保持

---

## 🔒 セキュリティ基準

### SOC 2 Type II（将来目標）
- セキュリティ
- 可用性
- 処理の整合性
- 機密性
- プライバシー

### ISO 27001（将来目標）
- 情報セキュリティマネジメントシステム（ISMS）

---

## 📊 透明性レポート（月次）

毎月、以下の情報を公開：

```yaml
削除リクエスト:
  - 件数
  - 平均処理時間
  - 完了率

データ保持:
  - TTL遵守率
  - 期限切れデータ削除率

セキュリティ:
  - インシデント件数
  - 対応時間

プロバイダ:
  - 変更回数
  - ヘルスチェック失敗率
```

---

## 🚀 ロードマップ

### Phase 1: US/JP対応（0-6ヶ月）
- プライバシーポリシー策定
- 利用規約策定
- データエクスポート/削除API実装
- 透明性レポート開始

### Phase 2: EU対応（6-12ヶ月）
- GDPR完全準拠
- DPIA実施
- DPO任命
- EU域内データセンター検討

### Phase 3: SOC 2取得（12-24ヶ月）
- SOC 2 Type II 準備
- セキュリティ監査
- 認証取得

---

**法令遵守と透明性で、ユーザーの信頼を得る。** ⚖️✨

