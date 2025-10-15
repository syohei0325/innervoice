# Doraemonモード – Proactive / 先読み相棒

## 🎯 コンセプト

> **Ask → Anticipate**: 人が言う前に"そっと提案"。ナッジは最小で、騒がない。

Doraemonモードは、ユーザーの**記憶**と**観察**から、必要なタイミングで**控えめに提案**する先読みアシスタントです。

---

## 🧩 3つのコアシステム

### 1. Memory OS（覚える）
```
発話・操作・決定 → 要約 → Memory
├─ kind: preference | fact | alias | goal | routine | relationship_note
├─ confidence: 出所×回数で更新
└─ TTL: 自動削除、いつでも撤回可能
```

**例**:
- 「コーヒーは砂糖なし」→ `{kind:"preference", key:"coffee.sugar", value:0, confidence:1.0}`
- 「Aさんは部長」→ `{kind:"alias", key:"person.A", value:"部長", confidence:0.8}`

### 2. Proactive OS（見張る + 気を利かせる）
```
信号スキャン（静かに、No Feed）:
├─ free_slot: 時間の隙間
├─ relationship_gap: 人との空白（最近会っていない）
├─ deadline_near: 期限接近
├─ habit_window: ルーティンの窓
└─ location: 地理的トリガー

↓

Nudge生成:
├─ A/Bの2択（2行以内）
├─ Why-this-for-you（最大2理由）
├─ 朝/移動前/就寝前のみ（Pulse）
└─ クールダウン厳守
```

### 3. Relationship Graph（気を遣う）
```
入力:
├─ カレンダー参加者
├─ メール/メッセージのメタ（本文は既定不使用）
└─ Memoryのrelationship_note

↓

指標:
├─ tie_strength: 関係の強さ
├─ days_since_last_meet: 前回から何日
├─ cadence_days: 通常の連絡間隔
└─ last_msg_at: 最終メッセージ日時

↓

提案:
「Aさん、前回から28日。金曜の19:00/19:30/20:00、どれ置きますか？」
```

---

## 📊 データモデル

### memories テーブル
```sql
CREATE TABLE memories (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  kind VARCHAR(50) NOT NULL, -- preference|fact|alias|goal|routine|relationship_note|autopilot_rule
  key VARCHAR(200) NOT NULL,
  value_json JSONB NOT NULL,
  source VARCHAR(50), -- utterance|action|calendar|message_meta|import|manual
  confidence DECIMAL(3,2), -- 0.00-1.00
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, key)
);
```

### observations テーブル
```sql
CREATE TABLE observations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  signal VARCHAR(50) NOT NULL, -- free_slot|relationship_gap|deadline_near|habit_window|location|open_loop
  payload_json JSONB NOT NULL,
  observed_at TIMESTAMP DEFAULT NOW()
);
```

### nudges テーブル
```sql
CREATE TABLE nudges (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  summary VARCHAR(200) NOT NULL,
  plan_json JSONB NOT NULL,
  reason_keys TEXT[], -- ['morning_person', 'past_acceptance']
  status VARCHAR(20) DEFAULT 'shown', -- shown|accepted|dismissed|snoozed|expired
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);
```

### contact_graph テーブル
```sql
CREATE TABLE contact_graph (
  user_id UUID NOT NULL,
  contact_id VARCHAR(200) NOT NULL, -- email or phone hash
  tie_strength DECIMAL(3,2), -- 0.00-1.00
  last_met_at TIMESTAMP,
  last_msg_at TIMESTAMP,
  cadence_days INTEGER, -- 通常の連絡間隔
  channels_json JSONB, -- ['email', 'sms', 'line']
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, contact_id)
);
```

### availability テーブル
```sql
CREATE TABLE availability (
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  slots_json JSONB NOT NULL, -- ["2025-10-20T19:00/30m", ...]
  source VARCHAR(50), -- calendar|manual
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, date)
);
```

---

## 🔌 API設計

### Memory API

#### PUT /api/memory.put
```json
Request:
{
  "kind": "preference",
  "key": "coffee.sugar",
  "value": 0,
  "ttl_days": 365
}

Response:
{
  "ok": true,
  "confidence": 1.0
}
```

#### POST /api/memory.forget
```json
Request:
{
  "key": "coffee.sugar"
}

Response:
{
  "ok": true
}
```

#### POST /api/memory.query
```json
Request:
{
  "keys": ["coffee.*", "alias.*"]
}

Response:
{
  "items": [
    { "key": "coffee.sugar", "value": 0, "confidence": 1.0 },
    { "key": "alias.A", "value": "部長", "confidence": 0.8 }
  ]
}
```

### Nudge API

#### GET /api/nudges
```json
Response:
{
  "items": [
    {
      "id": "nudge_123",
      "summary": "Aさん、前回から28日。連絡しますか？",
      "plan": {
        "actions": [
          { "action": "message.send", "to": "A", "text": "お久しぶりです" },
          { "action": "calendar.create", "title": "Aさんと会う", "start": "2025-10-20T19:00", "duration_min": 60 }
        ]
      },
      "reasons": ["28日経過", "通常は20日間隔"],
      "created_at": "2025-10-15T08:00:00Z"
    }
  ]
}
```

#### POST /api/nudge.feedback
```json
Request:
{
  "id": "nudge_123",
  "action": "accept", // accept|dismiss|snooze
  "reason_key": "too_busy" // optional
}

Response:
{
  "ok": true
}
```

#### GET /api/availability
```json
Request:
{
  "date": "2025-10-20"
}

Response:
{
  "date": "2025-10-20",
  "slots": [
    "2025-10-20T19:00/30m",
    "2025-10-20T19:30/30m",
    "2025-10-20T20:00/30m"
  ]
}
```

#### GET /api/relationship.gaps
```json
Response:
{
  "contacts": [
    {
      "name": "Aさん",
      "days_since_last_meet": 28,
      "cadence_days": 20,
      "tie_strength": 0.8
    }
  ]
}
```

---

## 🎯 KPI

### Nudge品質
- **採択率 ≥ 25%**（週）
- **誤提案率 ≤ 10%**
- **苦情率 ≤ 0.5%**

### Memory品質
- **命中率**（Memoryが実際に役立った割合）
- **誤記憶率**（間違ったMemoryの割合）
- **手動修正率**（ユーザーが修正した割合）

### Relationship品質
- **Gap検出精度**（実際に連絡が必要だった割合）
- **Cadence推定誤差**（±7日以内）

---

## 🛡️ セーフティ & プライバシー

### データ最小化
- **本文は保存しない**（要約+メタのみ）
- **TTL自動削除**（期限付きMemory）
- **いつでも撤回可能**（memory.forget）

### 透明性
- **証拠係数**（confidence）を明示
- **Why-this-for-you**で理由を説明
- **監査ログ**（すべてのNudge/Accept/Dismiss）

### 過剰通知抑制
- **Pulse時間のみ**（朝/移動前/就寝前）
- **クールダウン厳守**（最低3時間）
- **静音時間厳守**（22:00-06:30）
- **週間上限**（最大10 Nudges/週）

---

## 🚀 実装フェーズ

### Phase 0: Memory OS v0（0-3ヶ月）
- [x] preference / alias / goal のみ
- [ ] PUT / FORGET / QUERY API
- [ ] 端末優先PDV同期

### Phase 1: Nudge v0（3-6ヶ月）
- [ ] free_slot / relationship_gap 信号
- [ ] contact_graph構築（カレンダー/メッセージメタ）
- [ ] Nudge生成 + A/B提案
- [ ] KPI計測（採択率/誤提案率）

### Phase 2: Memory OS v1（6-12ヶ月）
- [ ] routine / relationship_note / autopilot_rule
- [ ] TTL自動削除
- [ ] confidence自動更新

### Phase 3: 高度化（12-24ヶ月）
- [ ] Autopilot budgets（週Nインパクト上限）
- [ ] パーソナライズNudge窓
- [ ] Why-this品質の協調エージェント最適化

---

## 💡 Nudge例

### 1. 時間の隙間（free_slot）
```
信号: カレンダーに金曜19:00-20:00の空き
     + Goalに「週1回ジム」
     
Nudge:
「金曜19:00、ジム行きますか？」
A: 予定に追加 + ジム通知
B: 次回に回す
```

### 2. 関係の空白（relationship_gap）
```
信号: Aさんとの最終接触から28日
     + 通常は20日間隔
     + tie_strength = 0.8（強い関係）
     
Nudge:
「Aさん、前回から28日。金曜19:00/19:30/20:00、どれ置きますか？」
A: メッセ1通 + カレンダー候補
B: 来週に回す
```

### 3. 期限接近（deadline_near）
```
信号: プロジェクトの期限が3日後
     + まだタスクが未完了
     
Nudge:
「プロジェクトXの期限が3日後。今日2時間確保しますか？」
A: 今日18:00-20:00に予定追加
B: 明日に回す
```

---

**Doraemonモードは、ユーザーの代わりに考え、必要なときに、控えめに、そっと提案します。** 🤖✨

