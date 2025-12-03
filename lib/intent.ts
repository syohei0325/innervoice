import { z } from 'zod';

// Intent スキーマ定義
export const ActionSchema = z.object({
  action: z.enum(['calendar.create', 'message.send', 'reminder.create']),
  title: z.string().optional(),
  start: z.string().optional(), // ISO 8601 datetime
  duration_min: z.number().optional(),
  to: z.string().optional(), // メッセージ送信先
  text: z.string().optional(), // メッセージ内容
  time: z.string().optional(), // リマインダー時刻
  note: z.string().optional(), // リマインダー内容
});

export const IntentSchema = z.object({
  action: z.string(),
  title: z.string(),
  start: z.string().optional(),
  duration_min: z.number(),
  followups: z.array(ActionSchema).optional(),
});

export const PlanSchema = z.object({
  id: z.string(),
  summary: z.string(),
  actions: z.array(ActionSchema),
  reasons: z.array(z.object({
    key: z.string(),
    source: z.enum(['core', 'doc']),
    provider: z.string().optional(),
    confidence: z.number(),
    evidence: z.array(z.string()).optional(),
  })).optional(),
  confirm_sheet: z.any().optional(), // DSPL ConfirmSheet
});

export const ExecutionResultSchema = z.object({
  action: z.string(),
  status: z.enum(['ok', 'error', 'pending']),
  id: z.string().optional(),
  error: z.string().optional(),
});

// TypeScript 型定義
export type Action = z.infer<typeof ActionSchema>;
export type Intent = z.infer<typeof IntentSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;

// Intent Bus - メッセージ配車システム
export class IntentBus {
  private static instance: IntentBus;
  
  static getInstance(): IntentBus {
    if (!IntentBus.instance) {
      IntentBus.instance = new IntentBus();
    }
    return IntentBus.instance;
  }

  async processIntent(text: string, context: any): Promise<Intent> {
    // Intent化: テキスト → JSON構造
    // TODO: LLM呼び出しでIntent抽出
    const mockIntent: Intent = {
      action: 'schedule',
      title: '朝ラン',
      start: '2024-12-02T07:00:00Z',
      duration_min: 30,
      followups: [
        {
          action: 'message.send',
          to: '妻',
          text: '7時に走ってくるね'
        },
        {
          action: 'reminder.create',
          time: '2024-12-02T06:45:00Z',
          note: 'ストレッチ'
        }
      ]
    };
    
    return IntentSchema.parse(mockIntent);
  }

  async generatePlans(intent: Intent): Promise<Plan[]> {
    // Intent → 2つの実行プラン（PlanA/PlanB）生成
    const planA: Plan = {
      id: `plan_${Date.now()}_a`,
      summary: `${intent.start?.split('T')[1]?.slice(0,5)} ${intent.title} + 連絡 + リマインド`,
      actions: [
        {
          action: 'calendar.create',
          title: intent.title,
          start: intent.start,
          duration_min: intent.duration_min,
        },
        ...(intent.followups || [])
      ]
    };

    const planB: Plan = {
      id: `plan_${Date.now()}_b`,
      summary: `代替案: ${intent.title}（時間調整）`,
      actions: [
        {
          action: 'calendar.create',
          title: intent.title + '（短縮版）',
          start: intent.start,
          duration_min: Math.floor(intent.duration_min * 0.7), // 30%短縮
        },
        {
          action: 'message.send',
          to: '妻',
          text: '時間短縮してやるね'
        }
      ]
    };

    return [PlanSchema.parse(planA), PlanSchema.parse(planB)];
  }
}

export const intentBus = IntentBus.getInstance();
