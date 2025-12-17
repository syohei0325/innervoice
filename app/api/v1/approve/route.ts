export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { CURRENT_PHASE } from '@/lib/phase-guard';

/**
 * POST /v1/approve - 承認ID発行（Action Cloud / phase1）
 * 
 * phase1の動作:
 * - TTL 10分
 * - approve_id を発行
 * - /v1/confirm で使用
 */
export async function POST(request: NextRequest) {
  console.log('[APPROVE] === Request started ===');
  
  try {
    const body = await request.json();
    console.log('[APPROVE] Body received:', JSON.stringify(body));
    
    const { plan_id, tenant_id, user_id } = body;
    
    if (!plan_id) {
      return NextResponse.json(
        { error: '400_PLAN_ID_REQUIRED', message: 'plan_id is required' },
        { status: 400 }
      );
    }

    const tenantId = tenant_id || 'tenant_mock_001';
    const userId = user_id || 'user_mock_001';

    // Plan取得
    const plan = await prisma.plan.findUnique({
      where: { id: plan_id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: '400_PLAN_NOT_FOUND', message: 'Plan not found' },
        { status: 400 }
      );
    }

    // Freeze check（Kill/Freeze）
    const activeFreezeRules = await prisma.freezeRule.findMany({
      where: {
        tenantId,
        active: true,
        OR: [
          { level: 'global' },
          { level: 'tenant' },
        ],
      },
    });

    if (activeFreezeRules.length > 0) {
      return NextResponse.json(
        { error: '403_FROZEN', message: 'Tenant is frozen', reason: activeFreezeRules[0].reason },
        { status: 403 }
      );
    }

    // Approval作成（TTL 10分）
    const approveId = `aprv_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分後

    const planPayload = JSON.parse(plan.payloadJson);
    const actions = planPayload.actions || [];

    await prisma.approval.create({
      data: {
        tenantId,
        userId,
        approveId,
        planId: plan_id,
        scopeJson: JSON.stringify({
          actions: actions.map((a: any) => a.action),
          risk_level: 'low', // phase1は低リスクのみ
        }),
        expiresAt,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        approveId,
        action: 'approve',
        payloadJson: JSON.stringify({
          plan_id,
        }),
      },
    });

    const response = {
      approve_id: approveId,
      expires_in_sec: 600,
      expires_at: expiresAt.toISOString(),
      phase: CURRENT_PHASE,
    };
    
    console.log('[APPROVE] Response ready');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[APPROVE] Error:', error);
    return NextResponse.json(
      { 
        error: 'Approve failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/v1/approve',
    phase: CURRENT_PHASE,
    runtime: 'nodejs',
  });
}

