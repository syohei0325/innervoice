import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/availability
 * ユーザーの空き時間スロットを取得
 * 
 * Query: ?date=2025-10-20
 * Response: {
 *   "date": "2025-10-20",
 *   "slots": ["2025-10-20T19:00/30m", "2025-10-20T19:30/30m", "2025-10-20T20:00/60m"]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    const url = new URL(request.url);
    const dateStr = url.searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json(
        { error: 'date parameter is required (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);

    // Fetch availability
    const availability = await prisma.availability.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    if (!availability) {
      // Return empty slots if not found
      return NextResponse.json({
        date: dateStr,
        slots: [],
        source: null,
      });
    }

    const slots = JSON.parse(availability.slotsJson);

    return NextResponse.json({
      date: dateStr,
      slots,
      source: availability.source,
      updated_at: availability.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in GET /api/availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/availability
 * ユーザーの空き時間スロットを更新
 * 
 * Request: {
 *   "date": "2025-10-20",
 *   "slots": ["2025-10-20T19:00/30m", "2025-10-20T19:30/30m"],
 *   "source": "calendar|manual"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.date || !body.slots || !Array.isArray(body.slots)) {
      return NextResponse.json(
        { error: 'date and slots array are required' },
        { status: 400 }
      );
    }

    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    const date = new Date(body.date);
    const slotsJson = JSON.stringify(body.slots);
    const source = body.source || 'manual';

    // Upsert availability
    await prisma.availability.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        slotsJson,
        source,
      },
      create: {
        userId,
        date,
        slotsJson,
        source,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in POST /api/availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

