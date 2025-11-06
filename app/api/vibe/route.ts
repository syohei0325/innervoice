import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Vibe schema
const VibeSchema = z.object({
  tone: z.enum(['friendly', 'coach', 'concise', 'warm']).optional(),
  decisiveness: z.enum(['quick', 'balanced', 'cautious']).optional(),
  frugality: z.enum(['low', 'mid', 'high']).optional(),
  notification_style: z.enum(['push', 'silent', 'scheduled']).optional(),
  language: z.string().optional(),
});

/**
 * GET /api/vibe
 * ユーザーのVibe Profileを取得
 * 
 * Response: {
 *   "tone": "friendly",
 *   "decisiveness": "quick",
 *   "frugality": "mid",
 *   "notification_style": "push",
 *   "language": "ja-JP"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    let vibeProfile = await prisma.vibeProfile.findUnique({
      where: { userId },
    });

    // 存在しない場合はデフォルトを作成
    if (!vibeProfile) {
      vibeProfile = await prisma.vibeProfile.create({
        data: {
          userId,
          tone: 'friendly',
          decisiveness: 'balanced',
          frugality: 'mid',
          notificationStyle: 'push',
          language: 'ja-JP',
        },
      });
    }

    return NextResponse.json({
      tone: vibeProfile.tone,
      decisiveness: vibeProfile.decisiveness,
      frugality: vibeProfile.frugality,
      notification_style: vibeProfile.notificationStyle,
      language: vibeProfile.language,
      updated_at: vibeProfile.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in GET /api/vibe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vibe
 * ユーザーのVibe Profileを更新
 * 
 * Request: {
 *   "patch": {
 *     "tone": "coach",
 *     "decisiveness": "quick"
 *   }
 * }
 * Response: { "ok": true }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.patch || typeof body.patch !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request: patch object required' },
        { status: 400 }
      );
    }

    const validation = VibeSchema.safeParse(body.patch);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid vibe data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const patch = validation.data;

    // Mock user ID (実際の認証実装時に置き換え)
    const userId = 'mock-user-id';

    // Update data (undefined fields are excluded)
    const updateData: any = {};
    if (patch.tone !== undefined) updateData.tone = patch.tone;
    if (patch.decisiveness !== undefined) updateData.decisiveness = patch.decisiveness;
    if (patch.frugality !== undefined) updateData.frugality = patch.frugality;
    if (patch.notification_style !== undefined) updateData.notificationStyle = patch.notification_style;
    if (patch.language !== undefined) updateData.language = patch.language;

    // Upsert
    await prisma.vibeProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        tone: patch.tone || 'friendly',
        decisiveness: patch.decisiveness || 'balanced',
        frugality: patch.frugality || 'mid',
        notificationStyle: patch.notification_style || 'push',
        language: patch.language || 'ja-JP',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in POST /api/vibe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

