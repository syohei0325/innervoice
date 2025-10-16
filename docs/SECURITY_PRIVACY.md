# SECURITY & PRIVACY – 最小化/保持/監査

## 🎯 基本原則

> **データはユーザーのもの。最小化・透明性・主権尊重。**

---

## 🔒 データ最小化

### 音声データ
- **即時テキスト化**：音声入力は即座にテキストに変換
- **音声データは保持しない**：デフォルトで音声データは保存しない
- **録音ON時のみ**：ユーザーが明示的に録音を有効化した場合のみ、24時間保持後に破棄

### テキストデータ
- **要約＋操作メタのみ長期保存**：本文そのものは保存せず、要約と操作メタデータのみを保存
- **PII（個人識別情報）は保存しない**：氏名、住所、電話番号などのPIIは最小化

### 外部Doc
- **要約/参照URIのみ**をCoreに保存
- 本体は外部プロバイダ側で管理（Drive/Notion等）

---

## ⏰ 保持期間（推奨）

| データ種別 | 保持期間 | 備考 |
|----------|----------|------|
| **transcript**（音声文字起こし） | 24時間 | 録音ON時のみ。その後、要約のみ長期保存 |
| **audit_logs**（監査ログ） | 90日 | 法令遵守のため |
| **decisions/approvals** | 1年 | ユーザー削除で即時消去 |
| **memories** | TTLマトリクスに従う | alias=∞, preference=365d, routine=180d, goal=90d, autopilot_rule=30d |
| **proposals** | 30日 | 提案履歴 |
| **events** | 90日 | イベント履歴 |

### TTLマトリクス（Memory OS）

| kind | TTL | 延長条件 |
|------|-----|----------|
| alias | ∞（無期限） | 手動forget可 |
| preference | 365日 | 最終使用で延長 |
| routine | 180日 | 未使用で自然消滅 |
| relationship_note | 180日 | 未使用で自然消滅 |
| goal | 90日 | 未使用で自然消滅 |
| autopilot_rule | 30日 | 自動失効→再学習 |

---

## 🔍 透明性

### Why‑thisに出典と信頼度を表示

ユーザーに提案理由を示す際、必ず**出典（core|doc）**、**provider名**、**信頼度（confidence）**を表示する。

#### 例1: Core Memory由来

```json
{
  "key": "morning_person",
  "source": "core",
  "confidence": 0.84,
  "evidence": ["memories.habit_window"]
}
```

→ UIでの表示: 「朝型（Core, 84%）」

#### 例2: 外部Doc由来

```json
{
  "key": "<=15min_walk",
  "source": "doc",
  "provider": "supermemory",
  "confidence": 0.72,
  "evidence": ["drive:doc_123"]
}
```

→ UIでの表示: 「徒歩15分以内（Supermemory, 72%）」

### エクスポート/削除API

#### エクスポート
```
GET /api/memory.export
```
→ すべてのCore Memoryを JSON でダウンロード

#### 削除
```
DELETE /api/memory.purge
```
→ Core Memory全削除（確認ダイアログ必須）

#### アカウント削除
```
POST /api/account/delete
```
→ 48時間以内に全データを削除

---

## 🛡️ 暗号化

### At‑Rest（保存時）
- データベース: **AES-256** 暗号化
- PDV（Personal Data Vault）: 端末側で暗号化

### In‑Transit（通信時）
- **TLS 1.2+** 必須
- API通信は HTTPS のみ

---

## 🔐 アクセス制御

### 認証
- Next.js Middleware による認証チェック
- セッション管理（httpOnly cookie）

### 認可
- ユーザーは**自分のデータのみ**アクセス可能
- 管理者権限は最小限（監査ログ閲覧のみ）

### API Key管理
- Public API用のAPI Keyは **SHA-256** ハッシュで保存
- Key Rotation: 90日ごとに推奨

---

## 📝 監査ログ

### 記録内容

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  approve_id VARCHAR(50),  -- ConfirmOS承認ID
  action VARCHAR(100) NOT NULL,  -- "plan.confirm", "memory.put", "memory.forget"
  payload_json JSONB NOT NULL,   -- アクションの詳細
  at TIMESTAMP DEFAULT NOW()
);
```

### 記録対象
- Plan確定（plan.confirm）
- Memory追加/削除（memory.put / memory.forget）
- アカウント削除（account.delete）
- Provider切替（provider.switch）

### 保持期間
- 90日間保持
- ユーザーはいつでも閲覧可能

---

## 🌍 リージョン & 法令遵守

### リージョンゲート
- **US/JP先行**、EUは後追い
- 提供範囲と機能を制御（通話/外部連携は別審査）

### 同意管理

#### 明示同意が必要な機能
1. **録音**：音声データの保存
2. **本文解析**：メール/メッセージ本文の解析
3. **支払い**：金額を伴う操作

#### 同意の撤回
- いつでも撤回可能
- 撤回後、該当データは即時削除

### データ移転
- 外部プロバイダに預けるデータは**最小化**
- 出典のみCoreに保持（例: `"drive:doc_123"`, `"notion:page_456"`）

---

## 🚨 セキュリティ対策

### Rate Limiting
- API: **60 req/min / key**（初期）
- 認証失敗: 5回で一時ロック（15分）

### Input Validation
- Zod による型安全なバリデーション
- SQL Injection 対策（Prisma ORM使用）
- XSS 対策（React/Next.js のデフォルト対策）

### CSRF 対策
- Next.js の CSRF Token
- SameSite cookie

### Idempotency
- `/api/confirm` は **Idempotency-Key** 必須
- 重複実行を防止

---

## 📊 透明性レポート（月次）

毎月、以下の情報を公開：

- 削除リクエスト件数
- データ保持期間遵守率
- セキュリティインシデント件数
- プロバイダ変更回数

---

## 🔧 ユーザーコントロール

### データ主権

```yaml
エクスポート:
  - GET /api/memory.export
  - GET /api/account/export

削除:
  - DELETE /api/memory.purge (Core Memory全削除)
  - POST /api/account/delete (アカウント削除)

撤回:
  - POST /api/consent/revoke (同意撤回)

乗換:
  - POST /api/provider.switch (Provider切替)
```

---

**ユーザーに、データの主権を返す。** 🔐✨
