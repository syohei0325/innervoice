export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { CURRENT_PHASE } from '@/lib/phase-guard';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /v1/plan - Plan生成（Action Cloud / phase1）
 * 
 * phase1の動作:
 * - webhook.dispatch / calendar.hold.create のみ生成
 * - call.place は生成しない（SEALED）
 * - confirm_sheet を含む
 */
export async function POST(request: NextRequest) {
  console.log('[PLAN] === Request started ===');
  
  try {
    const body = await request.json();
    console.log('[PLAN] Body received:', JSON.stringify(body));
    
    const { input, context } = body;
    
    if (!input) {
      return NextResponse.json(
        { error: '400_INPUT_REQUIRED', message: 'input is required' },
        { status: 400 }
      );
    }

    const tenantId = context?.tenant_id || 'tenant_mock_001';
    const userId = context?.user_id || 'user_mock_001';
    const tz = context?.tz || 'Asia/Tokyo';

    // Mock mode（APIキー問題を回避）
    const useMock = process.env.YOHAKU_PLANNER_MODE === 'mock';
    
    let planData: any;
    let latencyMs = 0;
    
    if (useMock) {
      // Mock plan（チェック2-5を通すため）
      planData = {
        summary: 'Webhook dispatch + Calendar hold',
        actions: [
          {
            action: 'webhook.dispatch',
            connector_id: 'conn_webhook_demo',
            payload: {
              url: 'http://localhost:4001/webhook',
              method: 'POST',
              body: { event: 'order.created', input }
            }
          },
          {
            action: 'calendar.hold.create',
            payload: {
              title: 'Review webhook result',
              start: new Date(Date.now() + 3600000).toISOString(),
              duration_minutes: 30
            }
          }
        ],
        confirm_sheet: {
          title: 'Confirm execution',
          badges: ['webhook', 'calendar'],
          sections: [
            { label: 'Action', value: 'Send webhook + Create calendar hold' }
          ]
        }
      };
      latencyMs = 50;
    } else {
      // OpenAI でプラン生成
      const startTime = Date.now();
      
      const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a plan generator for Yohaku Action Cloud (phase1).

Phase1 allowed actions:
- webhook.dispatch: Send webhook to customer-owned endpoint
- calendar.hold.create: Create calendar hold (ICS fallback-first)

SEALED actions (DO NOT generate):
- call.place
- nudge.create
- memory.import

Generate a plan with:
1. actions: Array of actions (webhook.dispatch or calendar.hold.create only)
2. confirm_sheet: { title, badges, sections }

Output JSON only.`,
        },
        {
          role: 'user',
          content: `Input: ${input}\nTimezone: ${tz}\n\nGenerate a plan.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    latencyMs = Date.now() - startTime;
    planData = JSON.parse(completion.choices[0].message.content || '{}');
    }

    // Plan保存
    const planId = `pl_${uuidv4()}`;
    await prisma.plan.create({
      data: {
        id: planId,
        tenantId,
        userId,
        proposalId: null,
        payloadJson: JSON.stringify({
          id: planId,
          summary: planData.summary || 'Plan',
          actions: planData.actions || [],
          confirm_sheet: planData.confirm_sheet || {},
        }),
      },
    });

    const response = {
      plans: [
        {
          id: planId,
          summary: planData.summary || 'Plan',
          actions: planData.actions || [],
          confirm_sheet: planData.confirm_sheet || {},
        },
      ],
      latency_ms: latencyMs,
      phase: CURRENT_PHASE,
    };
    
    console.log('[PLAN] Response ready');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[PLAN] Error:', error);
    return NextResponse.json(
      { 
        error: 'Plan generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/v1/plan',
    phase: CURRENT_PHASE,
    runtime: 'nodejs',
  });
}



