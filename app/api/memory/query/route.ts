/**
 * POST /api/memory/query
 * 
 * Memory項目を検索するAPI
 */

import { NextResponse } from 'next/server';
import { getMemoryProvider, recordProviderEvent } from '@/lib/providers';
import type { SearchOpts } from '@/lib/providers/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.query && !body.keys) {
      return NextResponse.json(
        { error: 'Missing required field: query or keys' },
        { status: 400 }
      );
    }

    const query = body.query || body.keys?.join(' ') || '';
    const opts: SearchOpts = {
      limit: body.limit ?? 10,
      min_confidence: body.min_confidence ?? 0.0,
      kinds: body.kinds,
    };

    // Providerを取得して検索
    const provider = getMemoryProvider();
    const startTime = Date.now();
    
    const hits = await provider.search(query, opts);
    
    const latency = Date.now() - startTime;

    // Provider Eventを記録
    await recordProviderEvent(
      'mock-user-id', // TODO: 実際のユーザーIDに置き換え
      provider.name,
      'search',
      { latency_ms: latency, hits: hits.length }
    );

    return NextResponse.json({
      items: hits,
      count: hits.length,
      latency_ms: latency,
    });
  } catch (error) {
    console.error('[Memory QUERY Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

