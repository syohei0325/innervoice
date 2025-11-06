import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/relationship/gaps
 * 最近会っていない・連絡していない人を検出
 * 
 * Response: {
 *   "contacts": [
 *     {
 *       "contact_id": "c1",
 *       "name": "Aさん",
 *       "days_since_last_meet": 28,
 *       "days_since_last_msg": 14,
 *       "cadence_days": 21,
 *       "gap_score": 0.8
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    // Query parameters
    const url = new URL(request.url);
    const minGapDays = parseInt(url.searchParams.get('min_gap_days') || '14');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Fetch contact graph
    const contacts = await prisma.contactGraph.findMany({
      where: { userId },
      orderBy: { lastMetAt: 'asc' },
      take: limit * 2, // Fetch more to filter
    });

    const now = new Date();

    // Calculate gaps
    const gaps = contacts
      .map(contact => {
        const daysSinceLastMeet = contact.lastMetAt
          ? Math.floor((now.getTime() - contact.lastMetAt.getTime()) / (1000 * 60 * 60 * 24))
          : 9999;

        const daysSinceLastMsg = contact.lastMsgAt
          ? Math.floor((now.getTime() - contact.lastMsgAt.getTime()) / (1000 * 60 * 60 * 24))
          : 9999;

        const cadenceDays = contact.cadenceDays || 30;

        // Gap score: how much over the cadence
        const gapScore = Math.max(
          daysSinceLastMeet / cadenceDays,
          daysSinceLastMsg / (cadenceDays * 0.5) // Messages have shorter expected cadence
        );

        return {
          contact_id: contact.contactId,
          name: contact.contactId, // TODO: Resolve from contacts table
          days_since_last_meet: daysSinceLastMeet,
          days_since_last_msg: daysSinceLastMsg,
          cadence_days: cadenceDays,
          gap_score: Math.round(gapScore * 100) / 100,
          tie_strength: contact.tieStrength || 0.5,
        };
      })
      .filter(gap => gap.days_since_last_meet >= minGapDays || gap.days_since_last_msg >= minGapDays)
      .sort((a, b) => b.gap_score - a.gap_score)
      .slice(0, limit);

    return NextResponse.json({
      contacts: gaps,
      count: gaps.length,
    });
  } catch (error) {
    console.error('Error in GET /api/relationship/gaps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

