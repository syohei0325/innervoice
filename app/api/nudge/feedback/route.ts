import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Request schema
const FeedbackSchema = z.object({
  id: z.string(),
  action: z.enum(['accept', 'dismiss', 'snooze']),
  reason_key: z.string().optional(),
});

/**
 * POST /api/nudge/feedback
 * Nudgeに対するフィードバック
 * 
 * Request: {
 *   "id": "ndg_123",
 *   "action": "accept|dismiss|snooze",
 *   "reason_key": "too_busy" (optional)
 * }
 * Response: { "ok": true }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = FeedbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { id, action, reason_key } = validation.data;

    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    // Find nudge
    const nudge = await prisma.nudge.findFirst({
      where: { id, userId },
    });

    if (!nudge) {
      return NextResponse.json(
        { error: 'Nudge not found' },
        { status: 404 }
      );
    }

    // Update status
    const statusMap: Record<string, string> = {
      accept: 'accepted',
      dismiss: 'dismissed',
      snooze: 'snoozed',
    };

    await prisma.nudge.update({
      where: { id },
      data: {
        status: statusMap[action],
        resolvedAt: action === 'accept' || action === 'dismiss' ? new Date() : null,
      },
    });

    // Record feedback (if reason provided)
    if (reason_key) {
      await prisma.reasonFeedback.create({
        data: {
          userId,
          planId: id, // Using nudge id as plan_id for now
          reasonKey: reason_key,
          voteBool: action === 'accept',
          tag: action === 'dismiss' ? reason_key : null,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: `nudge_${action}`,
        payloadJson: JSON.stringify({ nudge_id: id, reason_key }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in POST /api/nudge/feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

