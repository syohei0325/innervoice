/**
 * GET /api/provider/status
 * 
 * Memory Providerの状態を取得するAPI
 */

import { NextResponse } from 'next/server';
import { getMemoryProvider, getProviderName } from '@/lib/providers';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const providerName = getProviderName();
    const provider = getMemoryProvider();

    // 健全性チェック
    const health = await provider.health();

    return NextResponse.json({
      current: providerName,
      healthy: health.healthy,
      latency_ms: health.latency_ms,
      last_check: health.last_check?.toISOString(),
      error: health.error,
      provider_info: {
        name: provider.name,
        version: provider.version,
      },
    });
  } catch (error) {
    console.error('[Provider STATUS Error]', error);
    return NextResponse.json(
      {
        current: getProviderName(),
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        last_check: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

