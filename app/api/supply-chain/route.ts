export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supplyChainTracker, KNOWN_SUBPROCESSORS } from '@/lib/supply-chain';

/**
 * GET /api/supply-chain
 * Supply-Chain Trust Panel - サブプロセッサー一覧と使用履歴
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'user_mock_001';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // ユーザーのサプライチェーンイベント履歴を取得
    const history = await supplyChainTracker.getUserSupplyChainHistory(userId, limit);

    return NextResponse.json({
      subprocessors: KNOWN_SUBPROCESSORS,
      recent_events: history,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/supply-chain:', error);
    return NextResponse.json(
      { error: 'Failed to get supply chain data' },
      { status: 500 }
    );
  }
}















