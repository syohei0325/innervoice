export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { intentBus } from '@/lib/intent';
import { prisma } from '@/lib/prisma';
import { detectIrreversibility, generateFallbackConfirmSheet } from '@/lib/dspl';
import { modelRouter, DataClassification, recordProviderEvent } from '@/lib/model-routing';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { proposal_id, context } = await request.json();
    
    if (!proposal_id) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      );
    }

    // For MVP+, we'll use mock user ID (same as other APIs)
    const mockUserId = 'user_mock_001';
    
    // Mock: proposalから意図を推測してIntent化
    // TODO: 実際にはproposals テーブルから取得
    const mockText = "明日朝30分ランニング";
    
    // Intent 抽出
    const intent = await intentBus.processIntent(mockText, context);
    
    // Intent をDBに保存
    let savedIntent;
    try {
      savedIntent = await prisma.intent.create({
        data: {
          userId: mockUserId,
          text: mockText,
          json: JSON.stringify(intent),
        },
      });
    } catch (dbError) {
      console.error('Intent save failed:', dbError);
      // Continue without DB save for MVP+
    }
    
    // 2つの実行プラン生成
    const plans = await intentBus.generatePlans(intent);
    
    // Plans をDBに保存 + DSPL生成 + Irreversibility検出
    const savedPlans = [];
    for (const plan of plans) {
      // Irreversibility Gate: 不可逆操作の検出
      const irreversibilityCheck = detectIrreversibility(plan.actions);
      
      // DSPL: Confirm Sheet生成（フォールバック）
      const confirmSheet = generateFallbackConfirmSheet(plan, irreversibilityCheck);
      
      // Model Routing: データ分類
      const dataClass = modelRouter.classifyData(plan);
      const region = modelRouter.getRegion();
      const modelRoute = modelRouter.route({ dataClass, region });
      
      // Provider Event記録
      await recordProviderEvent(mockUserId, modelRoute.provider, 'plan_generation', {
        plan_id: plan.id,
        data_class: dataClass,
        reason: modelRoute.reason,
      });
      
      try {
        const savedPlan = await prisma.plan.create({
          data: {
            userId: mockUserId,
            intentId: savedIntent?.id || 'mock_intent_id',
            actionsJson: JSON.stringify(plan.actions),
          },
        });
        savedPlans.push({
          ...plan,
          id: savedPlan.id,
          confirm_sheet: confirmSheet, // DSPL追加
          reasons: [
            {
              key: 'morning_person',
              source: 'core' as const,
              confidence: 0.84,
              evidence: ['memories.habit_window'],
            },
          ],
        });
      } catch (dbError) {
        console.error('Plan save failed:', dbError);
        savedPlans.push({
          ...plan,
          confirm_sheet: confirmSheet,
        }); // Use original plan if DB save fails
      }
    }
    
    const latency = Date.now() - startTime;
    
    return NextResponse.json({
      plans: savedPlans,
      latency_ms: latency
    });
  } catch (error) {
    console.error('Error in /api/plan:', error);
    
    // Fallback: 基本的な2つのプラン
    const fallbackPlans = [
      {
        id: `fallback_${Date.now()}_a`,
        summary: "基本プラン: カレンダー追加",
        actions: [
          {
            action: "calendar.create",
            title: "タスク",
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 30
          }
        ]
      },
      {
        id: `fallback_${Date.now()}_b`,
        summary: "代替プラン: 時間短縮版",
        actions: [
          {
            action: "calendar.create", 
            title: "タスク（短縮）",
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 15
          }
        ]
      }
    ];
    
    return NextResponse.json({
      plans: fallbackPlans,
      latency_ms: Date.now() - startTime
    });
  }
}
