import { z } from 'zod';

// 入力値検証スキーマ
export const ProposeRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be less than 1000 characters')
    .refine(text => text.trim().length > 0, 'Text cannot be empty'),
  context: z.object({
    tz: z.string().optional(),
    ng: z.array(z.string()).optional(),
    mobility: z.string().optional(),
  }).optional(),
});

export const ConfirmRequestSchema = z.object({
  proposal_id: z.string().optional(),
  plan_id: z.string().optional(),
  enabled_actions: z.array(z.string()).optional(),
}).refine(data => data.proposal_id || data.plan_id, 'Either proposal_id or plan_id is required');

// 環境変数検証
export function validateEnvironment() {
  const requiredVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) {
      throw new Error(`Environment variable ${name} is not configured`);
    }
  }

  // OpenAI API Key の形式確認
  if (!requiredVars.OPENAI_API_KEY?.startsWith('sk-')) {
    throw new Error('Invalid OPENAI_API_KEY format');
  }

  return requiredVars;
}

// レート制限（簡易版）
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const current = requestCounts.get(clientId);
  
  if (!current || now > current.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}

// エラーレスポンス（本番では詳細情報を隠す）
export function createErrorResponse(error: any, isDevelopment = process.env.NODE_ENV === 'development') {
  if (isDevelopment) {
    return {
      error: error.message || 'An error occurred',
      details: error.stack,
    };
  }
  
  return {
    error: 'An internal error occurred. Please try again.',
  };
}
