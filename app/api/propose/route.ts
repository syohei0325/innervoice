export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { ProposeRequestSchema, validateEnvironment, checkRateLimit } from '@/lib/validation';
import { detectIntent, getIntentDescription } from '@/lib/intent-detector';
import { generatePlans } from '@/lib/plan-generator';

// OpenAIクライアントは遅延初期化
let openai: OpenAI;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 環境変数検証とOpenAI初期化（ランタイム時）
    if (!openai) {
      const env = validateEnvironment();
      if (env.OPENAI_API_KEY === 'build-time-default') {
        throw new Error('OpenAI API key not configured');
      }
      openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }

    // レート制限チェック
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const requestBody = await request.json();
    
    // 入力値検証
    const validation = ProposeRequestSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { text, context } = validation.data;
    
    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    // ステップ1: 意図検出
    const intent = await detectIntent(text, openai);
    console.log('[/api/propose] Detected intent:', intent);

    // ステップ2: PlanA/B生成
    const plans = await generatePlans(
      {
        intent,
        userInput: text,
        timezone: context?.tz || 'Asia/Tokyo',
        constraints: {
          ngTimes: context?.ng,
          mobility: context?.mobility,
        },
      },
      openai
    );

    const latency = Date.now() - startTime;

    return NextResponse.json({
      intent: {
        type: intent.type,
        description: getIntentDescription(intent.type),
        requiresCall: intent.requiresCall,
        confidence: intent.confidence,
      },
      plans,
      latency_ms: latency,
    });
  } catch (error) {
    console.error('Error in /api/propose:', error);
    
    // フォールバック: シンプルなプラン
    const fallbackPlans = [
      {
        id: `plan_${Date.now()}_a`,
        summary: '予定A（30分）',
        actions: [
          {
            action: 'calendar.create',
            title: '予定',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 30,
          },
        ],
        reasons: [],
      },
      {
        id: `plan_${Date.now()}_b`,
        summary: '予定B（15分・短縮版）',
        actions: [
          {
            action: 'calendar.create',
            title: '予定（短縮版）',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 15,
          },
        ],
        reasons: [],
      },
    ];

    return NextResponse.json({
      intent: {
        type: 'simple_calendar',
        description: 'カレンダー予定',
        requiresCall: false,
        confidence: 0.5,
      },
      plans: fallbackPlans,
      latency_ms: Date.now() - startTime,
      fallback: true,
    });
  }
}
