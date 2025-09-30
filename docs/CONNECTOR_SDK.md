# Connector SDK（InnerVoice）

## 概要
独自のコネクタを開発してInnerVoice Intent Busに接続するためのSDKです。

## コネクタとは
コネクタは、InnerVoiceのActionを実際のサービス（カレンダー、メッセンジャー等）に接続するアダプターです。

## サポートされるアクション種別

- `calendar.create` - カレンダーイベント作成
- `message.send` - メッセージ送信
- `reminder.create` - リマインダー作成
- `task.create` - タスク作成

## コネクタの実装

### TypeScript SDK

#### インストール
```bash
npm install @innervoice/connector-sdk
```

#### 基本的なコネクタ
```typescript
import { Connector, Action, ExecutionResult } from '@innervoice/connector-sdk';

export class MyCalendarConnector implements Connector {
  name = 'my-calendar';
  actions = ['calendar.create'];
  
  async execute(action: Action): Promise<ExecutionResult> {
    if (action.action === 'calendar.create') {
      // あなたのカレンダーAPIを呼び出し
      const event = await myCalendarAPI.createEvent({
        title: action.title,
        start: action.start,
        duration: action.duration_min,
      });
      
      return {
        status: 'ok',
        id: event.id,
      };
    }
    
    return {
      status: 'error',
      error: 'Unsupported action',
    };
  }
  
  async validate(): Promise<boolean> {
    // 接続テスト
    return await myCalendarAPI.ping();
  }
}
```

#### 登録
```typescript
import { ConnectorRegistry } from '@innervoice/connector-sdk';

const registry = new ConnectorRegistry();
registry.register(new MyCalendarConnector());
```

## コネクタインターフェース

```typescript
interface Connector {
  name: string;                    // コネクタ名（一意）
  actions: ActionType[];           // サポートするアクション
  
  execute(action: Action): Promise<ExecutionResult>;
  validate?(): Promise<boolean>;   // 接続テスト（オプション）
  configure?(config: any): void;   // 設定（オプション）
}

interface Action {
  action: ActionType;
  [key: string]: any;
}

interface ExecutionResult {
  status: 'ok' | 'error';
  id?: string;
  error?: string;
  latency_ms?: number;
}
```

## 組み込みコネクタ

### CalendarConnector
Google Calendar / iCloud / Outlook に対応。

```typescript
import { CalendarConnector } from '@innervoice/connectors';

const calendar = new CalendarConnector({
  provider: 'google',
  credentials: {
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    refreshToken: 'YOUR_REFRESH_TOKEN',
  },
});
```

### MessengerConnector
SMS / Email / Slack に対応。

```typescript
import { MessengerConnector } from '@innervoice/connectors';

const messenger = new MessengerConnector({
  providers: ['sms', 'email'],
  sms: {
    apiKey: 'TWILIO_API_KEY',
  },
  email: {
    apiKey: 'SENDGRID_API_KEY',
  },
});
```

### ReminderConnector
iOS Reminders / Google Tasks に対応。

```typescript
import { ReminderConnector } from '@innervoice/connectors';

const reminder = new ReminderConnector({
  provider: 'ios',
  // iOS Shortcuts URLを使用
});
```

## エラーハンドリング

```typescript
async execute(action: Action): Promise<ExecutionResult> {
  try {
    const result = await this.api.call(action);
    return { status: 'ok', id: result.id };
  } catch (error) {
    console.error('Connector error:', error);
    return {
      status: 'error',
      error: error.message,
    };
  }
}
```

## テスト

```typescript
import { testConnector } from '@innervoice/connector-sdk/testing';

describe('MyCalendarConnector', () => {
  it('should create calendar event', async () => {
    const connector = new MyCalendarConnector();
    
    const result = await connector.execute({
      action: 'calendar.create',
      title: 'Test Event',
      start: '2025-09-19T07:00:00Z',
      duration_min: 30,
    });
    
    expect(result.status).toBe('ok');
    expect(result.id).toBeDefined();
  });
});
```

## 公開

作成したコネクタをInnerVoice Marketplaceで公開できます：

1. `package.json`にメタデータを追加
2. `npm publish`
3. InnerVoice ダッシュボードで申請

## ベストプラクティス

- **冪等性**: 同じアクションを複数回実行しても安全に
- **タイムアウト**: 5秒以内に応答
- **ログ**: エラーは詳細にログ記録
- **バリデーション**: 入力パラメータを必ず検証
- **テスト**: ユニットテスト + 統合テスト

## 実装ステータス
🚧 **開発中** - v0.5.0で実装予定
