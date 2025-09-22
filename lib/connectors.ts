import { Action, ExecutionResult } from './intent';

export interface Connector {
  name: string;
  execute(action: Action): Promise<ExecutionResult>;
}

// Calendar Connector（Google Calendar API 統合予定）
export class CalendarConnector implements Connector {
  name = 'calendar';

  async execute(action: Action): Promise<ExecutionResult> {
    try {
      if (action.action !== 'calendar.create') {
        throw new Error(`Unsupported action: ${action.action}`);
      }

      // TODO: 実際のGoogle Calendar API統合
      // 現在はモック実装
      
      // Calendar event 作成のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 500)); // API遅延模擬
      
      const eventId = `cal_evt_${Date.now()}`;
      
      // 成功ケース（95%の確率）
      if (Math.random() < 0.95) {
        return {
          action: action.action,
          status: 'ok',
          id: eventId,
        };
      } else {
        // 失敗ケース（5%の確率）
        throw new Error('Calendar API rate limit exceeded');
      }
    } catch (error) {
      return {
        action: action.action,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Messenger Connector（LINE/Slack 等統合予定）
export class MessengerConnector implements Connector {
  name = 'messenger';

  async execute(action: Action): Promise<ExecutionResult> {
    try {
      if (action.action !== 'message.send') {
        throw new Error(`Unsupported action: ${action.action}`);
      }

      // TODO: 実際のメッセージング API統合
      // 現在はモック実装
      
      // メッセージ送信のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 300)); // API遅延模擬
      
      const messageId = `msg_${Date.now()}`;
      
      // 成功ケース（90%の確率）
      if (Math.random() < 0.90) {
        return {
          action: action.action,
          status: 'ok',
          id: messageId,
        };
      } else {
        // 失敗ケース（10%の確率）
        throw new Error('Message delivery failed');
      }
    } catch (error) {
      return {
        action: action.action,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Reminder Connector（iOS Reminders/Google Tasks 等統合予定）
export class ReminderConnector implements Connector {
  name = 'reminder';

  async execute(action: Action): Promise<ExecutionResult> {
    try {
      if (action.action !== 'reminder.create') {
        throw new Error(`Unsupported action: ${action.action}`);
      }

      // リマインダー作成のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const reminderId = `rmd_${Date.now()}`;
      
      // 成功ケース（98%の確率）
      if (Math.random() < 0.98) {
        return {
          action: action.action,
          status: 'ok',
          id: reminderId,
        };
      } else {
        throw new Error('Reminder service unavailable');
      }
    } catch (error) {
      return {
        action: action.action,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Connector Factory
export class ConnectorManager {
  private connectors: Map<string, Connector> = new Map();

  constructor() {
    this.connectors.set('calendar.create', new CalendarConnector());
    this.connectors.set('message.send', new MessengerConnector());
    this.connectors.set('reminder.create', new ReminderConnector());
  }

  async executeAction(action: Action): Promise<ExecutionResult> {
    const connector = this.connectors.get(action.action);
    
    if (!connector) {
      return {
        action: action.action,
        status: 'error',
        error: `No connector found for action: ${action.action}`,
      };
    }

    return connector.execute(action);
  }

  async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    // 並列実行
    const promises = actions.map(action => this.executeAction(action));
    return Promise.all(promises);
  }
}

export const connectorManager = new ConnectorManager();
