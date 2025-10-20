/**
 * GET /api/memory/export
 * 
 * すべてのCore Memoryをエクスポートする API（データポータビリティ権の実現）
 */

import { NextResponse } from 'next/server';
import { coreMemoryProvider } from '@/lib/providers';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    // TODO: 実際のユーザーIDに置き換え
    const userId = 'mock-user-id';

    const startTime = Date.now();
    
    // すべてのMemoryをエクスポート
    const memories = await coreMemoryProvider.exportAll(userId);
    
    const latency = Date.now() - startTime;

    return NextResponse.json({
      exported_at: new Date().toISOString(),
      total_count: memories.length,
      items: memories,
      latency_ms: latency,
    });
  } catch (error) {
    console.error('[Memory EXPORT Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

