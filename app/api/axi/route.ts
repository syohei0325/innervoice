export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { axiTracker } from '@/lib/security-kpi';

/**
 * GET /api/axi
 * AXI（Action eXecution Index）の取得
 * 週次で更新される実行品質指標を公開
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weeks = parseInt(searchParams.get('weeks') || '12', 10);

    // 過去N週間のAXI履歴を取得
    const history = await axiTracker.getKPIHistory(weeks);

    // 最新のAXIを計算（キャッシュがない場合）
    let currentAXI = history[0];
    if (!currentAXI || !isCurrentWeek(currentAXI.week)) {
      currentAXI = await axiTracker.calculateCurrentAXI();
      await axiTracker.saveAXI(currentAXI);
    }

    return NextResponse.json({
      current: currentAXI,
      history: history.slice(0, weeks),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/axi:', error);
    return NextResponse.json(
      { error: 'Failed to get AXI data' },
      { status: 500 }
    );
  }
}

function isCurrentWeek(week: string): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const currentWeek = getWeekNumber(now);
  const currentWeekStr = `${year}-W${currentWeek.toString().padStart(2, '0')}`;
  return week === currentWeekStr;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
















