/**
 * POST /api/memory/put
 * 
 * Memory項目を保存するAPI
 */

import { NextResponse } from 'next/server';
import { getMemoryProvider, recordProviderEvent } from '@/lib/providers';
import type { MemoryItem } from '@/lib/providers/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.kind || !body.key || body.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: kind, key, value' },
        { status: 400 }
      );
    }

    const memoryItem: MemoryItem = {
      kind: body.kind,
      key: body.key,
      value: body.value,
      source: body.source || 'manual',
      confidence: body.confidence ?? 1.0,
      ttl_days: body.ttl_days,
    };

    // Providerを取得して保存
    const provider = getMemoryProvider();
    const startTime = Date.now();
    
    const results = await provider.put([memoryItem]);
    
    const latency = Date.now() - startTime;

    // Provider Eventを記録
    await recordProviderEvent(
      'mock-user-id', // TODO: 実際のユーザーIDに置き換え
      provider.name,
      'put',
      { latency_ms: latency, success: results[0].ok }
    );

    if (!results[0].ok) {
      return NextResponse.json(
        { error: results[0].error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      confidence: memoryItem.confidence,
      key: memoryItem.key,
    });
  } catch (error) {
    console.error('[Memory PUT Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

