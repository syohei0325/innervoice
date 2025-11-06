import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Request schema
const ApproveRequestSchema = z.object({
  plan_id: z.string(),
  risk_level: z.enum(['low', 'medium', 'high']).optional().default('low'),
});

/**
 * POST /api/approve
 * ConfirmOS: 事前承認を発行
 * 
 * Request: { "plan_id": "pl1", "risk_level": "low" }
 * Response: { "approve_id": "aprv_abc123", "expires_in_sec": 600 }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ApproveRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { plan_id, risk_level } = validation.data;

    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    // Generate approve_id
    const approveId = `aprv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 有効期限: 10分後
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Scope JSON (将来的にはplanから取得)
    const scopeJson = JSON.stringify({
      plan_id,
      risk_level,
      actions: [], // TODO: planから取得
    });

    // Save approval
    await prisma.approval.create({
      data: {
        userId,
        approveId,
        planId: plan_id,
        scopeJson,
        expiresAt,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        approveId,
        action: 'approve',
        payloadJson: JSON.stringify({ plan_id, risk_level }),
      },
    });

    return NextResponse.json({
      approve_id: approveId,
      expires_in_sec: 600,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/approve:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/approve/:approve_id
 * 承認の状態を確認
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const approveId = url.searchParams.get('approve_id');

    if (!approveId) {
      return NextResponse.json(
        { error: 'approve_id is required' },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.findUnique({
      where: { approveId },
    });

    if (!approval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const isExpired = now > approval.expiresAt;
    const isUsed = approval.usedAt !== null;

    return NextResponse.json({
      approve_id: approval.approveId,
      plan_id: approval.planId,
      expires_at: approval.expiresAt.toISOString(),
      is_expired: isExpired,
      is_used: isUsed,
      status: isUsed ? 'used' : isExpired ? 'expired' : 'valid',
    });
  } catch (error) {
    console.error('Error in GET /api/approve:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

