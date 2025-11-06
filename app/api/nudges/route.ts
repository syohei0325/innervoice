import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/nudges
 * Proactive OSからのNudge一覧を取得
 * 
 * Response: {
 *   "items": [
 *     {
 *       "id": "ndg_123",
 *       "summary": "Aさん、前回から28日。金曜19:00/19:30/20:00、どれ置きますか？",
 *       "plan": { ... },
 *       "reasons": [
 *         { "key": "relationship_gap", "source": "core", "confidence": 0.9 }
 *       ],
 *       "status": "shown",
 *       "created_at": "2025-10-20T07:00:00Z"
 *     }
 *   ],
 *   "count": 1
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    // Query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // shown|accepted|dismissed|snoozed|expired
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Build where clause
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    // Fetch nudges
    const nudges = await prisma.nudge.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const items = nudges.map(nudge => ({
      id: nudge.id,
      summary: nudge.summary,
      plan: JSON.parse(nudge.planJson),
      reasons: nudge.reasonKeys.map(key => ({
        key,
        source: 'core', // TODO: reasonsテーブルから取得
        confidence: 0.8,
      })),
      status: nudge.status,
      created_at: nudge.createdAt.toISOString(),
      resolved_at: nudge.resolvedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error in GET /api/nudges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/nudges
 * 新しいNudgeを作成（Proactive OSから呼ばれる）
 * 
 * Request: {
 *   "summary": "...",
 *   "plan": { ... },
 *   "reason_keys": ["relationship_gap", "free_slot"]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.summary || !body.plan) {
      return NextResponse.json(
        { error: 'summary and plan are required' },
        { status: 400 }
      );
    }

    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    const nudge = await prisma.nudge.create({
      data: {
        userId,
        summary: body.summary,
        planJson: JSON.stringify(body.plan),
        reasonKeys: body.reason_keys || [],
        status: 'shown',
      },
    });

    return NextResponse.json({
      id: nudge.id,
      summary: nudge.summary,
      created_at: nudge.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in POST /api/nudges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

