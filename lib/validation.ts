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

// 環境変数検証（ビルド時安全）
export function validateEnvironment() {
  // ビルド時は環境変数がない場合があるのでランタイム時のみ検証
  if (typeof window !== 'undefined') {
    // クライアントサイドでは検証しない
    return {
      OPENAI_API_KEY: 'client-side',
      DATABASE_URL: 'client-side',
    };
  }

  const requiredVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  // ビルド時（Vercel）はスキップ
  if (!process.env.OPENAI_API_KEY && !process.env.DATABASE_URL) {
    console.warn('Environment variables not set - using build-time defaults');
    return {
      OPENAI_API_KEY: 'build-time-default',
      DATABASE_URL: 'build-time-default',
    };
  }

  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) {
      throw new Error(`Environment variable ${name} is not configured`);
    }
  }

  // OpenAI API Key の形式確認（ランタイム時のみ）
  if (requiredVars.OPENAI_API_KEY && requiredVars.OPENAI_API_KEY !== 'build-time-default' && !requiredVars.OPENAI_API_KEY.startsWith('sk-')) {
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