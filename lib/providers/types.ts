/**
 * Memory Provider Interface
 * 
 * Yohakuの記憶システムは、Core（自前）とDoc/Graph（外部Provider）に分離されています。
 * このインターフェースは、外部Providerを差し替え可能にするための標準仕様です。
 */

// ============================================
// Memory Item Types
// ============================================

export type MemoryKind = 
  | 'preference'        // 好み（例: コーヒーは砂糖なし）
  | 'fact'              // 事実（例: Aさんの誕生日は10月20日）
  | 'alias'             // 別名（例: Aさん = 部長）
  | 'goal'              // 目標（例: 週1回ジム）
  | 'routine'           // 習慣（例: 毎朝7時ラン）
  | 'relationship_note' // 関係メモ（例: Aさんとは月1で会う）
  | 'autopilot_rule';   // 自動実行ルール（例: 雨なら延期）

export type MemorySource = 
  | 'utterance'         // 発話から抽出
  | 'action'            // 操作から学習
  | 'calendar'          // カレンダーから推測
  | 'message_meta'      // メッセージメタデータ
  | 'import'            // インポート
  | 'manual';           // 手動入力

export interface MemoryItem {
  kind: MemoryKind;
  key: string;                    // 一意なキー（例: "coffee.sugar"）
  value: any;                     // 値（JSON化可能な任意の型）
  source?: MemorySource;          // 出所
  confidence?: number;            // 信頼度（0.0-1.0）
  ttl_days?: number;              // TTL（日数）
  created_at?: Date;
  updated_at?: Date;
}

// ============================================
// Search & Result Types
// ============================================

export interface SearchOpts {
  limit?: number;                 // 最大件数（デフォルト: 10）
  min_confidence?: number;        // 最小信頼度（デフォルト: 0.0）
  kinds?: MemoryKind[];          // フィルタ対象のkind
}

export interface MemoryHit {
  key: string;
  value: any;
  confidence: number;
  source: 'core' | 'doc';        // core（自前）またはdoc（外部）
  provider?: string;             // 外部Providerの場合、プロバイダ名
  evidence?: string[];           // 証拠（例: ["memories.habit_window", "drive:doc_123"]）
  created_at?: Date;
}

export interface PutResult {
  key: string;
  ok: boolean;
  error?: string;
}

export interface ProviderHealth {
  healthy: boolean;
  latency_ms?: number;
  error?: string;
  last_check?: Date;
}

// ============================================
// Embedding Type (将来対応)
// ============================================

export interface Embedding {
  vector: number[];              // 埋め込みベクトル
  model?: string;                // モデル名（例: "text-embedding-ada-002"）
}

// ============================================
// Memory Provider Interface
// ============================================

export interface MemoryProvider {
  /**
   * Providerの名前
   */
  readonly name: string;

  /**
   * Providerのバージョン
   */
  readonly version: string;

  /**
   * Memory項目を保存
   * @param items 保存するMemoryアイテム配列
   * @param container オプション：コンテナ名（例: "google-drive", "notion"）
   */
  put(items: MemoryItem[], container?: string): Promise<PutResult[]>;

  /**
   * Memoryを検索
   * @param query 検索クエリ（文字列または埋め込みベクトル）
   * @param opts 検索オプション
   */
  search(query: string | Embedding, opts?: SearchOpts): Promise<MemoryHit[]>;

  /**
   * Memoryを削除
   * @param keys 削除するMemoryのキー配列
   */
  forget(keys: string[]): Promise<void>;

  /**
   * 外部サービスと同期（オプション）
   * @param provider 同期先プロバイダ（"google-drive", "notion"など）
   */
  sync?(provider: string): Promise<void>;

  /**
   * Providerの健全性チェック
   */
  health(): Promise<ProviderHealth>;
}

// ============================================
// Provider Event (A/B運用・監視用)
// ============================================

export interface ProviderEvent {
  provider: string;              // "supermemory" | "zep" | "mem0" | "core"
  event: 'search' | 'health' | 'error' | 'put' | 'forget';
  payload: {
    latency_ms?: number;
    hits?: number;
    error?: string;
    [key: string]: any;
  };
  at: Date;
}

