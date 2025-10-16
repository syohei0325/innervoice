# MEMORY PROVIDERS – 外部記憶の差し替え

## 🎯 目的

Drive/Notion/メールなど**広い情報源**の検索/参照を**プロバイダ切替**で取り込む。

---

## 🔌 Provider Interface（擬似コード）

```typescript
export interface MemoryProvider {
  /**
   * Memory項目を保存
   * @param items 保存するMemoryアイテム配列
   * @param container オプション：コンテナ名（例: "google-drive", "notion"）
   */
  put(items: MemoryItem[], container?: string): Promise<PutResult[]>;

  /**
   * Memoryを検索
   * @param query 検索クエリ（文字列または埋め込みベクトル）
   * @param opts 検索オプション（フィルタ、上限数など）
   */
  search(query: string | Embedding, opts: SearchOpts): Promise<MemoryHit[]>;

  /**
   * Memoryを削除
   * @param keys 削除するMemoryのキー配列
   */
  forget(keys: string[]): Promise<void>;

  /**
   * 外部サービスと同期（オプション）
   * @param provider 同期先プロバイダ（"google-drive", "notion"など）
   */
  sync?(provider: "google-drive" | "notion" | string): Promise<void>;

  /**
   * プロバイダの健全性チェック
   */
  health(): Promise<ProviderHealth>;
}

export interface MemoryItem {
  kind: "preference" | "fact" | "alias" | "goal" | "routine" | "relationship_note" | "autopilot_rule";
  key: string;
  value: any;
  source?: string;
  confidence?: number;
  ttl_days?: number;
}

export interface MemoryHit {
  key: string;
  value: any;
  confidence: number;
  source: "core" | "doc";
  provider?: string; // "supermemory", "zep", "mem0"
  evidence?: string[]; // ["memories.habit_window", "drive:doc_123"]
}

export interface ProviderHealth {
  healthy: boolean;
  latency_ms?: number;
  error?: string;
}

export interface SearchOpts {
  limit?: number;
  min_confidence?: number;
  kinds?: string[];
}

export interface PutResult {
  key: string;
  ok: boolean;
  error?: string;
}
```

---

## 🏗️ 実装方法

### ディレクトリ構造

```
lib/
  providers/
    supermemory.ts   # Supermemory実装
    zep.ts           # Zep実装
    mem0.ts          # Mem0実装
    core.ts          # 自前Memory OS（フォールバック用）
    index.ts         # Provider Factory
```

### 環境変数による切替

```env
# Memory Provider設定
YOHAKU_MEMORY_PROVIDER=supermemory  # supermemory | zep | mem0 | none

# A/Bテスト（オプション）
YOHAKU_MEMORY_PROVIDER_AB=A  # A | B

# Supermemory設定（例）
SUPERMEMORY_API_KEY=your-api-key-here
SUPERMEMORY_API_URL=https://api.supermemory.ai

# Zep設定（例）
ZEP_API_KEY=your-api-key-here
ZEP_PROJECT_ID=your-project-id

# Mem0設定（例）
MEM0_API_KEY=your-api-key-here
```

---

## 🔄 フォールバック戦略

### 原則
- 外部プロバイダが落ちたら**Coreのみ**で推論
- **.icsフォールバック**は常時有効（権限未連携/遅延時でも即価値）

### フォールバックフロー

```
1. ユーザー入力
   ↓
2. Memory検索（Core + 外部Provider並列）
   ↓
3-a. Provider成功 → Core + Doc の統合結果を返す
   ↓
3-b. Provider失敗 → Core のみで推論（Docなし）
   ↓
4. 提案生成（Coreのみでも可能）
   ↓
5. Confirm once
   ↓
6. .ics生成（常時有効）
```

---

## 📊 A/B運用

### 目的
複数のプロバイダを比較し、最適なものを選定する。

### データ収集（provider_eventsテーブル）

```sql
CREATE TABLE provider_events (
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,  -- "supermemory" | "zep" | "mem0"
  event VARCHAR(50) NOT NULL,     -- "search" | "health" | "error"
  payload_json JSONB NOT NULL,    -- { "latency_ms": 850, "hits": 3 }
  at TIMESTAMP DEFAULT NOW()
);
```

### KPI比較

| Provider | 採択率 | レイテンシ(p50) | 誤提案率 | エラー率 |
|----------|--------|----------------|----------|----------|
| Supermemory | ? | ? | ? | ? |
| Zep | ? | ? | ? | ? |
| Mem0 | ? | ? | ? | ? |

→ 週次で切替判断

---

## 🛡️ セキュリティ & プライバシー

### データ最小化
- 外部プロバイダに預けるデータは**最小化**
- Core Memoryには**出典のみ**を保持（例: `"drive:doc_123"`, `"notion:page_456"`）
- 本文は外部プロバイダ側で管理

### 透明性
- Why‑thisに**出典と信頼度**を表示
  ```json
  {
    "key": "morning_person",
    "source": "core",
    "confidence": 0.84,
    "evidence": ["memories.habit_window"]
  }
  ```
  ```json
  {
    "key": "<=15min_walk",
    "source": "doc",
    "provider": "supermemory",
    "confidence": 0.72,
    "evidence": ["drive:doc_123"]
  }
  ```

### ユーザー主権
- **乗換自由**：環境変数で簡単に切替
- **エクスポート**：`GET /api/memory.export`で全Core Memoryをエクスポート
- **削除**：`DELETE /api/memory.purge`でCore Memory全削除

---

## 🚀 実装ロードマップ

### Phase 0: Core Memory OS（0-3ヶ月）✅
- preference / alias / goal のみ
- PUT / FORGET / QUERY API
- 端末優先PDV同期

### Phase 1: Provider PoC（3-6ヶ月）
- [ ] Supermemory **or** Zep 実装
- [ ] A/B装置の構築（provider_events記録）
- [ ] health監視とフォールバック
- [ ] Why‑thisに出典表示

### Phase 2: Provider二社冗長（6-12ヶ月）
- [ ] 二社並列運用（自動降格/ヘルスチェック）
- [ ] 週次での自動切替判断
- [ ] Drive/Notionとの同期機能

### Phase 3: Provider Marketplace（12-24ヶ月）
- [ ] 外部開発者がProviderを追加可能に
- [ ] 署名/審査/スコープ管理
- [ ] ユーザーが自由に選択可能

---

## 📝 使用例

### Core Memory検索

```typescript
import { getMemoryProvider } from '@/lib/providers';

const provider = getMemoryProvider(); // 環境変数で自動選択

// Memory検索
const hits = await provider.search("朝 ランニング", {
  limit: 5,
  min_confidence: 0.6,
  kinds: ["preference", "routine"]
});

// 結果例
[
  {
    key: "morning_routine",
    value: { time: "07:00", activity: "running" },
    confidence: 0.84,
    source: "core",
    evidence: ["memories.habit_window"]
  },
  {
    key: "park_location",
    value: "代々木公園",
    confidence: 0.72,
    source: "doc",
    provider: "supermemory",
    evidence: ["drive:doc_123"]
  }
]
```

### Provider健康監視

```typescript
const health = await provider.health();

if (!health.healthy) {
  console.warn(`Provider unhealthy: ${health.error}`);
  // → Coreのみで推論
}
```

---

**Pluggable Memoryで、ユーザーに記憶の主権を返す。** 🧠✨

