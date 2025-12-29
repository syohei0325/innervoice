export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateWeeklyMerkleRoot, getWeekNumber } from '@/lib/poex';

/**
 * Transparency Log API
 * 
 * 週次でMerkle Rootを掲示し、実行証明の改ざん検知を可能にする。
 * 第三者が検証可能な透明性ログ。
 */

interface WeeklyMerkleRoot {
  week: string; // YYYY-Wxx形式
  merkle_root: string; // hex
  receipt_count: number;
  first_receipt_ts: string; // ISO 8601
  last_receipt_ts: string; // ISO 8601
  published_at: string; // ISO 8601
}

// モックデータ（本番環境ではDBから取得）
const mockTransparencyLog: WeeklyMerkleRoot[] = [
  {
    week: '2025-W49',
    merkle_root: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd',
    receipt_count: 1247,
    first_receipt_ts: '2025-12-01T00:00:00Z',
    last_receipt_ts: '2025-12-07T23:59:59Z',
    published_at: '2025-12-08T09:00:00Z',
  },
  {
    week: '2025-W48',
    merkle_root: 'b2c3d4e5f6789012345678901234567890123456789012345678901234abcde',
    receipt_count: 1089,
    first_receipt_ts: '2025-11-24T00:00:00Z',
    last_receipt_ts: '2025-11-30T23:59:59Z',
    published_at: '2025-12-01T09:00:00Z',
  },
  {
    week: '2025-W47',
    merkle_root: 'c3d4e5f6789012345678901234567890123456789012345678901234abcdef0',
    receipt_count: 934,
    first_receipt_ts: '2025-11-17T00:00:00Z',
    last_receipt_ts: '2025-11-23T23:59:59Z',
    published_at: '2025-11-24T09:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const week = searchParams.get('week');
    const latest = searchParams.get('latest');
    
    // 最新のMerkle Rootを取得
    if (latest === 'true') {
      const latestRoot = mockTransparencyLog[0];
      return NextResponse.json({
        ...latestRoot,
        verification_url: `https://yohaku.app/transparency/verify?week=${latestRoot.week}`,
      });
    }
    
    // 特定の週のMerkle Rootを取得
    if (week) {
      const root = mockTransparencyLog.find(r => r.week === week);
      if (!root) {
        return NextResponse.json(
          { error: 'Week not found', message: `No Merkle Root found for week ${week}` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        ...root,
        verification_url: `https://yohaku.app/transparency/verify?week=${root.week}`,
      });
    }
    
    // すべてのMerkle Rootを取得
    return NextResponse.json({
      transparency_log: mockTransparencyLog,
      meta: {
        update_frequency: 'weekly',
        next_publication: getNextMonday(),
        current_week: getWeekNumber(),
        total_weeks: mockTransparencyLog.length,
      },
    });
  } catch (error) {
    console.error('[Transparency Log] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Transparency Log',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 週次のMerkle Rootを計算・公開（管理者専用）
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック（本番環境では必須）
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { week } = body;
    
    if (!week) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Week parameter is required (format: YYYY-Wxx)' },
        { status: 400 }
      );
    }
    
    // 指定週のレシートIDを取得（本番環境ではDBから取得）
    // TODO: 実際のレシートIDをDBから取得
    const receiptIds = [
      'rcp_001', 'rcp_002', 'rcp_003', // ... モックデータ
    ];
    
    // Merkle Rootを計算
    const merkleRoot = calculateWeeklyMerkleRoot(receiptIds);
    
    // Transparency Logに保存（本番環境ではDBに保存）
    const weeklyRoot: WeeklyMerkleRoot = {
      week,
      merkle_root: merkleRoot,
      receipt_count: receiptIds.length,
      first_receipt_ts: new Date().toISOString(), // TODO: 実際の最初のレシート時刻
      last_receipt_ts: new Date().toISOString(), // TODO: 実際の最後のレシート時刻
      published_at: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      weekly_root: weeklyRoot,
      message: `Merkle Root published for week ${week}`,
    });
  } catch (error) {
    console.error('[Transparency Log] POST Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to publish Merkle Root',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 次の月曜日の日付を取得（週次公開日）
 */
function getNextMonday(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0); // 月曜日 09:00 JST
  return nextMonday.toISOString();
}























