# Memory API 使用ガイド

## 🎯 概要

Yohaku の Memory API は、ユーザーの好み・習慣・関係性などを保存・検索・削除するための API です。

**Pluggable Memory** により、Core（自前）と外部 Provider（Supermemory/Zep/Mem0）を環境変数で切り替えられます。

---

## 📚 目次

1. [API エンドポイント](#api-エンドポイント)
2. [使用例](#使用例)
3. [Memory の種類（kind）](#memory-の種類kind)
4. [TTL（自動削除）](#ttl自動削除)
5. [信頼度（Confidence）](#信頼度confidence)
6. [Provider 切替](#provider-切替)

---

## API エンドポイント

### 1. PUT /api/memory/put

Memory を保存します。

**リクエスト:**
```json
POST /api/memory/put
{
  "kind": "preference",
  "key": "coffee.sugar",
  "value": 0,
  "source": "manual",
  "confidence": 1.0,
  "ttl_days": 365
}
```

**レスポンス:**
```json
{
  "ok": true,
  "confidence": 1.0,
  "key": "coffee.sugar"
}
```

---

### 2. POST /api/memory/forget

Memory を削除します。

**リクエスト:**
```json
POST /api/memory/forget
{
  "key": "coffee.sugar"
}
```

または複数削除:
```json
POST /api/memory/forget
{
  "keys": ["coffee.sugar", "person.A"]
}
```

**レスポンス:**
```json
{
  "ok": true,
  "deleted_keys": ["coffee.sugar"],
  "count": 1
}
```

---

### 3. POST /api/memory/query

Memory を検索します。

**リクエスト:**
```json
POST /api/memory/query
{
  "query": "coffee",
  "limit": 10,
  "min_confidence": 0.6,
  "kinds": ["preference", "routine"]
}
```

**レスポンス:**
```json
{
  "items": [
    {
      "key": "coffee.sugar",
      "value": 0,
      "confidence": 1.0,
      "source": "core",
      "evidence": ["memories.preference"],
      "created_at": "2025-10-20T10:00:00Z"
    }
  ],
  "count": 1,
  "latency_ms": 45
}
```

---

### 4. GET /api/memory/export

すべての Memory をエクスポートします（データポータビリティ権の実現）。

**リクエスト:**
```bash
GET /api/memory/export
```

**レスポンス:**
```json
{
  "exported_at": "2025-10-20T10:00:00Z",
  "total_count": 42,
  "items": [
    {
      "kind": "preference",
      "key": "coffee.sugar",
      "value": 0,
      "source": "utterance",
      "confidence": 1.0,
      "created_at": "2025-10-15T08:00:00Z",
      "updated_at": "2025-10-15T08:00:00Z"
    }
    // ... 他の Memory
  ],
  "latency_ms": 120
}
```

---

### 5. DELETE /api/memory/purge

**⚠️ 注意: すべての Memory を削除します！**

確認文字列 `"PURGE_ALL_MEMORIES"` が必須です。

**リクエスト:**
```json
DELETE /api/memory/purge
{
  "confirm": "PURGE_ALL_MEMORIES"
}
```

**レスポンス:**
```json
{
  "ok": true,
  "deleted_count": 42,
  "purged_at": "2025-10-20T10:05:00Z",
  "latency_ms": 85
}
```

---

### 6. GET /api/provider/status

Memory Provider の状態を取得します。

**リクエスト:**
```bash
GET /api/provider/status
```

**レスポンス:**
```json
{
  "current": "core",
  "healthy": true,
  "latency_ms": 12,
  "last_check": "2025-10-20T10:00:00Z",
  "provider_info": {
    "name": "core",
    "version": "1.0.0"
  }
}
```

---

## 使用例

### 例1: ユーザーの好みを保存

```typescript
// コーヒーは砂糖なし
await fetch('/api/memory/put', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    kind: 'preference',
    key: 'coffee.sugar',
    value: 0,
    ttl_days: 365,
  }),
});

// 朝型人間
await fetch('/api/memory/put', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    kind: 'routine',
    key: 'habit.morning_person',
    value: true,
    confidence: 0.84,
    ttl_days: 180,
  }),
});
```

---

### 例2: 別名（alias）を保存

```typescript
// Aさん = 部長
await fetch('/api/memory/put', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    kind: 'alias',
    key: 'person.A',
    value: '部長',
    ttl_days: null, // 無期限
  }),
});
```

---

### 例3: Memory を検索

```typescript
const response = await fetch('/api/memory/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '朝',
    limit: 5,
    min_confidence: 0.6,
  }),
});

const data = await response.json();
console.log(data.items);
// [
//   { key: 'habit.morning_person', value: true, confidence: 0.84, ... },
//   { key: 'routine.morning_run', value: '07:00', confidence: 0.72, ... }
// ]
```

---

### 例4: Memory をエクスポート（データ主権）

```typescript
const response = await fetch('/api/memory/export');
const data = await response.json();

// JSON ファイルとしてダウンロード
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `memory-export-${data.exported_at}.json`;
a.click();
```

---

## Memory の種類（kind）

| kind | 説明 | TTL 推奨 | 例 |
|------|------|----------|-----|
| `preference` | 好み | 365日 | コーヒーは砂糖なし |
| `fact` | 事実 | ∞ | Aさんの誕生日は10月20日 |
| `alias` | 別名 | ∞ | Aさん = 部長 |
| `goal` | 目標 | 90日 | 週1回ジム |
| `routine` | 習慣 | 180日 | 毎朝7時ラン |
| `relationship_note` | 関係メモ | 180日 | Aさんとは月1で会う |
| `autopilot_rule` | 自動実行ルール | 30日 | 雨なら延期 |

---

## TTL（自動削除）

Memory には TTL（Time To Live）を設定できます。

### TTL マトリクス（推奨）

| kind | TTL | 延長条件 |
|------|-----|----------|
| `alias` | ∞（無期限） | 手動 forget で削除可 |
| `preference` | 365日 | 最終使用で延長 |
| `routine` | 180日 | 未使用で自然消滅 |
| `relationship_note` | 180日 | 未使用で自然消滅 |
| `goal` | 90日 | 未使用で自然消滅 |
| `autopilot_rule` | 30日 | 自動失効→再学習 |

### TTL なし（無期限）

```typescript
await fetch('/api/memory/put', {
  method: 'POST',
  body: JSON.stringify({
    kind: 'alias',
    key: 'person.A',
    value: '部長',
    // ttl_days を指定しない = 無期限
  }),
});
```

---

## 信頼度（Confidence）

Memory には信頼度（0.0 〜 1.0）を設定できます。

### 信頼度の目安

| Confidence | 意味 | 例 |
|-----------|------|-----|
| 1.0 | 確定 | ユーザーが手動入力 |
| 0.8 - 0.9 | 高信頼 | 繰り返し観測された習慣 |
| 0.5 - 0.7 | 中信頼 | 数回観測された傾向 |
| 0.3 - 0.4 | 低信頼 | 初回推測 |

### 信頼度でフィルタ

```typescript
const response = await fetch('/api/memory/query', {
  method: 'POST',
  body: JSON.stringify({
    query: 'morning',
    min_confidence: 0.7, // 信頼度 0.7 以上のみ
  }),
});
```

---

## Provider 切替

### 環境変数で Provider を選択

`.env.local` に以下を設定:

```env
# Core（自前 Memory OS）
YOHAKU_MEMORY_PROVIDER=core

# または Supermemory
YOHAKU_MEMORY_PROVIDER=supermemory
SUPERMEMORY_API_KEY=your-api-key-here

# または Zep
YOHAKU_MEMORY_PROVIDER=zep
ZEP_API_KEY=your-api-key-here
ZEP_PROJECT_ID=your-project-id

# または Mem0
YOHAKU_MEMORY_PROVIDER=mem0
MEM0_API_KEY=your-api-key-here
```

### Provider 状態を確認

```typescript
const response = await fetch('/api/provider/status');
const data = await response.json();

console.log(`Current Provider: ${data.current}`);
console.log(`Healthy: ${data.healthy}`);
console.log(`Latency: ${data.latency_ms}ms`);
```

---

## セキュリティ & プライバシー

### データ最小化
- 本文は保存せず、**要約+メタのみ**を保存
- TTL で自動削除

### 透明性
- 出典（source: core|doc）を必ず表示
- Provider 名を表示
- 証拠（evidence）を表示

### ユーザー主権
- **エクスポート**: `GET /api/memory/export`
- **削除**: `DELETE /api/memory/purge`
- **乗換自由**: 環境変数で簡単に切替

---

## トラブルシューティング

### Q: Memory が保存されない

**A:** 以下を確認してください:
1. 必須フィールド（kind, key, value）が揃っているか
2. DATABASE_URL が正しく設定されているか
3. Prisma Client が生成されているか（`npm run db:generate`）

### Q: 検索結果が返ってこない

**A:** 以下を確認してください:
1. `min_confidence` が高すぎないか
2. `query` が Memory の key または value に含まれているか
3. TTL が切れていないか

### Q: Provider が unhealthy

**A:** 以下を確認してください:
1. データベース接続ができているか
2. 外部 Provider の API キーが正しいか
3. ネットワーク接続が正常か

---

**Memory API で、ユーザーに記憶の主権を返す。** 🧠✨

