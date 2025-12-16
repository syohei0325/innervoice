import { z } from 'zod';

// Supply-Chain Trust Panel - 供給網信頼パネル
// 実行ごとにどのベンダに何を渡したかを可視化

export const SubprocessorSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  dataTypes: z.array(z.string()),
  region: z.string(),
  signatureVerified: z.boolean().optional(),
  crossBorder: z.boolean().optional(),
});

export const SupplyChainEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  action: z.string(),
  subprocessors: z.array(SubprocessorSchema),
  warnings: z.array(z.string()).optional(),
});

export type Subprocessor = z.infer<typeof SubprocessorSchema>;
export type SupplyChainEvent = z.infer<typeof SupplyChainEventSchema>;

// Supply Chain Tracker
export class SupplyChainTracker {
  private static instance: SupplyChainTracker;

  static getInstance(): SupplyChainTracker {
    if (!SupplyChainTracker.instance) {
      SupplyChainTracker.instance = new SupplyChainTracker();
    }
    return SupplyChainTracker.instance;
  }

  /**
   * アクション実行時のサブプロセッサー使用を記録
   */
  async trackExecution(
    userId: string,
    action: string,
    subprocessors: Subprocessor[]
  ): Promise<SupplyChainEvent> {
    const warnings: string[] = [];

    // 署名エラーチェック
    for (const sub of subprocessors) {
      if (sub.signatureVerified === false) {
        warnings.push(`⚠️ 署名エラー: ${sub.name}`);
      }
    }

    // 越境チェック
    const crossBorderSubs = subprocessors.filter(sub => sub.crossBorder);
    if (crossBorderSubs.length > 0) {
      warnings.push(
        `⚠️ 越境データ転送: ${crossBorderSubs.map(s => s.name).join(', ')}`
      );
    }

    const event: SupplyChainEvent = {
      id: `sc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      subprocessors,
      warnings,
    };

    // DBに記録（audit_logsに保存）
    try {
      const { prisma } = await import('@/lib/prisma');
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'supply_chain_event',
          payloadJson: JSON.stringify(event),
        },
      });
    } catch (error) {
      console.error('Failed to record supply chain event:', error);
    }

    return event;
  }

  /**
   * アクションに対するサブプロセッサーを特定
   */
  identifySubprocessors(action: any): Subprocessor[] {
    const subprocessors: Subprocessor[] = [];

    switch (action.action) {
      case 'calendar.create':
        // Google Calendar API使用
        subprocessors.push({
          name: 'Google Calendar API',
          purpose: 'カレンダーイベント作成',
          dataTypes: ['event_title', 'start_time', 'duration'],
          region: 'US',
          signatureVerified: true,
          crossBorder: true,
        });
        break;

      case 'message.send':
        // メッセージング API使用
        subprocessors.push({
          name: 'Messaging Provider',
          purpose: 'メッセージ送信',
          dataTypes: ['recipient', 'message_text'],
          region: 'JP',
          signatureVerified: true,
          crossBorder: false,
        });
        break;

      case 'call.place':
        // 通話プロバイダー使用
        subprocessors.push({
          name: 'Twilio Voice API',
          purpose: '通話実行',
          dataTypes: ['phone_number', 'script_summary'],
          region: 'US',
          signatureVerified: true,
          crossBorder: true,
        });
        break;

      case 'pay.authorize':
        // 決済プロバイダー使用
        subprocessors.push({
          name: 'Stripe Payment API',
          purpose: '決済処理',
          dataTypes: ['amount', 'payment_method'],
          region: 'US',
          signatureVerified: true,
          crossBorder: true,
        });
        break;

      default:
        // OpenAI API（推論）
        subprocessors.push({
          name: 'OpenAI API',
          purpose: 'AI推論',
          dataTypes: ['user_input_summary'],
          region: 'US',
          signatureVerified: true,
          crossBorder: true,
        });
    }

    return subprocessors;
  }

  /**
   * ユーザーのサプライチェーンイベント履歴を取得
   */
  async getUserSupplyChainHistory(
    userId: string,
    limit: number = 50
  ): Promise<SupplyChainEvent[]> {
    try {
      const { prisma } = await import('@/lib/prisma');
      const logs = await prisma.auditLog.findMany({
        where: {
          userId,
          action: 'supply_chain_event',
        },
        orderBy: {
          at: 'desc',
        },
        take: limit,
      });

      return logs.map(log => JSON.parse(log.payloadJson) as SupplyChainEvent);
    } catch (error) {
      console.error('Failed to get supply chain history:', error);
      return [];
    }
  }
}

export const supplyChainTracker = SupplyChainTracker.getInstance();

// Subprocessors一覧（公開用）
export const KNOWN_SUBPROCESSORS = [
  {
    name: 'OpenAI',
    purpose: 'AI推論・自然言語処理',
    dataTypes: ['user_input_summary', 'intent_json'],
    region: 'US',
    dpaUrl: 'https://openai.com/policies/data-processing-addendum',
  },
  {
    name: 'Google Calendar API',
    purpose: 'カレンダーイベント作成・管理',
    dataTypes: ['event_title', 'start_time', 'duration', 'attendees'],
    region: 'US',
    dpaUrl: 'https://cloud.google.com/terms/data-processing-addendum',
  },
  {
    name: 'Twilio',
    purpose: '通話実行・SMS送信',
    dataTypes: ['phone_number', 'call_summary', 'sms_text'],
    region: 'US',
    dpaUrl: 'https://www.twilio.com/legal/data-protection-addendum',
  },
  {
    name: 'Stripe',
    purpose: '決済処理',
    dataTypes: ['amount', 'payment_method', 'transaction_id'],
    region: 'US',
    dpaUrl: 'https://stripe.com/legal/dpa',
  },
  {
    name: 'Vercel',
    purpose: 'ホスティング・インフラ',
    dataTypes: ['request_logs', 'error_logs'],
    region: 'US',
    dpaUrl: 'https://vercel.com/legal/dpa',
  },
  {
    name: 'Supabase',
    purpose: 'データベース・ストレージ',
    dataTypes: ['all_user_data'],
    region: 'US',
    dpaUrl: 'https://supabase.com/legal/dpa',
  },
];















