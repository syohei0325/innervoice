# API Reference - Yohaku

## 概要

Yohakuが提供するすべてのAPIエンドポイントのリファレンスです。

---

## Core APIs

### POST /api/propose

**説明**: ユーザー入力から2つの提案を生成します。

**リクエスト**:
```json
{
  "text": "明日朝30分ランニング",
  "context": {
    "tz": "Asia/Tokyo",
    "ng": ["22:00-06:30"],
    "mobility": "walk"
  }
}
```

**レスポンス**:
```json
{
  "proposals": [
    {
      "id": "p1",
      "title": "朝ラン20分",
      "slot": "07:10",
      "duration_min": 20
    },
    {
      "id": "p2",
      "title": "夜ストレッチ15分",
      "slot": "21:30",
      "duration_min": 15
    }
  ],
  "latency_ms": 850
}
```

---

### POST /api/plan

**説明**: Proposalから2つの実行プラン（PlanA/PlanB）を生成します。

**リクエスト**:
```json
{
  "proposal_id": "p1",
  "context": {
    "tz": "Asia/Tokyo"
  }
}
```

**レスポンス**:
```json
{
  "plans": [
    {
      "id": "pl1",
      "summary": "07:00-07:30 朝ラン + 妻にメッセ + 06:45リマインド",
      "actions": [
        {
          "action": "calendar.create",
          "title": "朝ラン",
          "start": "2025-10-19T07:00:00+09:00",
          "duration_min": 30
        },
        {
          "action": "message.send",
          "to": "妻",
          "text": "7時に走ってくるね"
        },
        {
          "action": "reminder.create",
          "time": "2025-10-19T06:45:00+09:00",
          "note": "ストレッチ"
        }
      ],
      "reasons": [
        {
          "key": "morning_person",
          "source": "core",
          "confidence": 0.84,
          "evidence": ["memories.habit_window"]
        }
      ],
      "confirm_sheet": {
        "title": "朝ラン 07:00",
        "badges": ["費用¥0", "所要30分"],
        "sections": [
          {
            "type": "summary",
            "text": "明日07:00から30分のランニングを予定に追加します。"
          }
        ]
      }
    }
  ],
  "latency_ms": 950
}
```

---

### POST /api/approve

**説明**: Planの実行を承認し、approve_idを発行します（ConfirmOS）。

**リクエスト**:
```json
{
  "plan_id": "pl1"
}
```

**レスポンス**:
```json
{
  "approve_id": "aprv_abc123",
  "expires_in_sec": 600
}
```

---

### POST /api/confirm

**説明**: 承認されたPlanを実行します。

**リクエスト**:
```json
{
  "plan_id": "pl1",
  "approve_id": "aprv_abc123",
  "idempotency_key": "k_123"
}
```

**レスポンス**:
```json
{
  "results": [
    {
      "action": "calendar.create",
      "status": "ok",
      "id": "evt_123"
    },
    {
      "action": "message.send",
      "status": "ok",
      "id": "msg_456"
    }
  ],
  "minutes_back": 18,
  "minutes_back_confidence": 1.0,
  "friction_saved": [
    {
      "type": "copy_paste_avoided",
      "qty": 1,
      "evidence": "measured"
    }
  ]
}
```

---

## Memory APIs

### POST /api/memory/put

**説明**: Memoryを保存します。

**リクエスト**:
```json
{
  "kind": "preference",
  "key": "coffee.sugar",
  "value": 0,
  "ttl_days": 365
}
```

**レスポンス**:
```json
{
  "ok": true,
  "confidence": 1.0
}
```

---

### POST /api/memory/query

**説明**: Memoryを検索します。

**リクエスト**:
```json
{
  "keys": ["coffee.*", "alias.*"]
}
```

**レスポンス**:
```json
{
  "items": [
    {
      "key": "coffee.sugar",
      "value": 0,
      "kind": "preference",
      "confidence": 1.0
    }
  ]
}
```

---

### POST /api/memory/forget

**説明**: Memoryを削除します。

**リクエスト**:
```json
{
  "key": "coffee.sugar"
}
```

**レスポンス**:
```json
{
  "ok": true
}
```

---

### GET /api/memory/export

**説明**: すべてのCore Memoryをエクスポートします（データポータビリティ権）。

**レスポンス**:
```json
{
  "memories": [
    {
      "key": "coffee.sugar",
      "value": 0,
      "kind": "preference",
      "created_at": "2025-12-03T10:00:00Z"
    }
  ],
  "exported_at": "2025-12-03T10:00:00Z"
}
```

---

### DELETE /api/memory/purge

**説明**: すべてのCore Memoryを削除します（確認ダイアログ必須）。

**レスポンス**:
```json
{
  "ok": true,
  "deleted_count": 42
}
```

---

## Proactive APIs

### GET /api/nudges

**説明**: ユーザーへのNudge（先読み提案）を取得します。

**レスポンス**:
```json
{
  "items": [
    {
      "id": "ndg_123",
      "summary": "Aさん、前回から28日。金曜の19:00/19:30/20:00、どれ置きますか？",
      "plan": {
        "id": "pl_ndg_123",
        "actions": [...]
      },
      "reasons": [
        {
          "key": "relationship_gap",
          "source": "core",
          "confidence": 0.92
        }
      ],
      "created_at": "2025-12-03T06:30:00Z"
    }
  ]
}
```

---

### POST /api/nudge/feedback

**説明**: Nudgeに対するフィードバックを送信します。

**リクエスト**:
```json
{
  "id": "ndg_123",
  "action": "accept",
  "reason_key": "relationship_gap"
}
```

**レスポンス**:
```json
{
  "ok": true
}
```

---

### GET /api/availability

**説明**: ユーザーの空き時間を取得します。

**レスポンス**:
```json
{
  "date": "2025-10-20",
  "slots": [
    "2025-10-20T19:00/30m",
    "2025-10-20T19:30/30m",
    "2025-10-20T20:00/30m"
  ]
}
```

---

### GET /api/relationship/gaps

**説明**: 最近連絡していない人を検出します。

**レスポンス**:
```json
{
  "contacts": [
    {
      "name": "Aさん",
      "days_since_last_meet": 28,
      "cadence_days": 14
    }
  ]
}
```

---

## Provider APIs

### GET /api/provider/status

**説明**: アクティブなMemory Providerの状態を確認します。

**レスポンス**:
```json
{
  "current": "supermemory",
  "healthy": true
}
```

---

### POST /api/provider/switch

**説明**: Memory Providerを切り替えます（管理者専用）。

**リクエスト**:
```json
{
  "to": "zep"
}
```

**レスポンス**:
```json
{
  "ok": true,
  "switched_to": "zep"
}
```

---

## AXI & Security KPI APIs

### GET /api/axi

**説明**: AXI（Action eXecution Index）を取得します。週次で更新される実行品質指標。

**パラメータ**:
- `weeks`: 取得する週数（デフォルト: 12）

**レスポンス**:
```json
{
  "current": {
    "week": "2025-W49",
    "ttcP50Ms": 680,
    "misexecPct": 0.32,
    "cancelSuccessPct": 97.8,
    "rollbackSuccessPct": 96.4,
    "callSuccessPct": 91.2,
    "screenOffCompletionPct": 72.1
  },
  "history": [
    {
      "week": "2025-W48",
      "ttcP50Ms": 720,
      "misexecPct": 0.35,
      ...
    }
  ],
  "updated_at": "2025-12-03T10:00:00Z"
}
```

---

### GET /api/security-kpi

**説明**: Security KPIを取得します。週次で更新されるセキュリティ指標。

**パラメータ**:
- `weeks`: 取得する週数（デフォルト: 12）

**レスポンス**:
```json
{
  "current": {
    "week": "2025-W49",
    "vulnOpen": 1,
    "depsOutdatedAvgDays": 12,
    "secretsIncidents7d": 0,
    "mttrSecurityHours": 18,
    "sbomCoveragePct": 96,
    "subprocNotificationLagHours": 12,
    "referrerBlockRatePct": 100
  },
  "history": [...],
  "updated_at": "2025-12-03T10:00:00Z"
}
```

---

### GET /api/supply-chain

**説明**: Supply-Chain Trust Panel - サブプロセッサー一覧と使用履歴。

**パラメータ**:
- `user_id`: ユーザーID（オプション）
- `limit`: 取得件数（デフォルト: 50）

**レスポンス**:
```json
{
  "subprocessors": [
    {
      "name": "OpenAI",
      "purpose": "AI推論・自然言語処理",
      "dataTypes": ["user_input_summary", "intent_json"],
      "region": "US",
      "dpaUrl": "https://openai.com/policies/data-processing-addendum"
    }
  ],
  "recent_events": [
    {
      "id": "sc_1234567890_abc",
      "timestamp": "2025-12-03T10:00:00Z",
      "action": "calendar.create",
      "subprocessors": [
        {
          "name": "Google Calendar API",
          "purpose": "カレンダーイベント作成",
          "dataTypes": ["event_title", "start_time", "duration"],
          "region": "US",
          "signatureVerified": true,
          "crossBorder": true
        }
      ],
      "warnings": ["⚠️ 越境データ転送: Google Calendar API"]
    }
  ],
  "updated_at": "2025-12-03T10:00:00Z"
}
```

---

## Vibe APIs

### GET /api/vibe

**説明**: ユーザーのVibe Profile（パーソナライゼーション設定）を取得します。

**レスポンス**:
```json
{
  "tone": "friendly",
  "decisiveness": "quick",
  "frugality": "mid",
  "notification_style": "push",
  "language": "ja-JP"
}
```

---

### POST /api/vibe

**説明**: Vibe Profileを更新します。

**リクエスト**:
```json
{
  "patch": {
    "tone": "coach",
    "decisiveness": "quick"
  }
}
```

**レスポンス**:
```json
{
  "ok": true
}
```

---

## エラーコード

| コード | 説明 |
|--------|------|
| `400_APPROVAL_NOT_FOUND` | 承認が見つかりません |
| `400_APPROVAL_EXPIRED` | 承認の有効期限が切れています |
| `409_APPROVAL_ALREADY_USED` | 承認は既に使用されています |
| `409_IDEMPOTENCY_CONFLICT` | 同じIdempotency-Keyで異なるリクエストが送信されました |
| `400_CALL_CONSENT_REQUIRED` | 通話には事前承認が必要です |
| `422_PARTIAL_SUCCESS` | 一部のアクションが失敗しました |
| `424_PROVIDER_DOWN` | 外部プロバイダーが利用できません |

---

## 認証

現在のバージョン（v0.1.0-alpha）では認証は実装されていません。モックユーザーID（`user_mock_001`）を使用しています。

将来のバージョンでは、以下の認証方式をサポート予定：

- **API Key**: `Authorization: Bearer <API_KEY>`
- **OAuth 2.0**: Google / Apple / Microsoft
- **WebAuthn**: パスキー認証

---

## レート制限

現在のバージョンではレート制限は実装されていません。

将来のバージョンでは、以下のレート制限を適用予定：

- **無料プラン**: 60 req/min
- **Pro プラン**: 600 req/min
- **Enterprise プラン**: カスタム

---

## Webhooks

Webhooksは将来のバージョンでサポート予定です。詳細は **docs/WEBHOOKS.md** を参照してください。

---

## 変更履歴

- **2025-12-03**: AXI/Security KPI/Supply-Chain APIs追加、DSPL対応、Irreversibility Gate追加
- **2025-11-25**: Memory APIs追加、Pluggable Memory対応
- **2025-11-06**: MVP+ APIs追加（Intent Bus / Confirm once）
- **2025-10-16**: 初版リリース（MVP APIs）



