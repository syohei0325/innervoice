/**
 * POST /api/memory/forget
 * 
 * Memory項目を削除するAPI
 */

import { NextResponse } from 'next/server';
import { getMemoryProvider, recordProviderEvent } from '@/lib/providers';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.key && !body.keys) {
      return NextResponse.json(
        { error: 'Missing required field: key or keys' },
        { status: 400 }
      );
    }

    const keys = body.keys || [body.key];

    // Providerを取得して削除
    const provider = getMemoryProvider();
    const startTime = Date.now();
    
    await provider.forget(keys);
    
    const latency = Date.now() - startTime;

    // Provider Eventを記録
    await recordProviderEvent(
      'mock-user-id', // TODO: 実際のユーザーIDに置き換え
      provider.name,
      'forget',
      { latency_ms: latency, count: keys.length }
    );

    return NextResponse.json({
      ok: true,
      deleted_keys: keys,
      count: keys.length,
    });
  } catch (error) {
    console.error('[Memory FORGET Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

