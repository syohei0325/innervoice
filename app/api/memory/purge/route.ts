/**
 * DELETE /api/memory/purge
 * 
 * Core Memory全削除（ユーザー主権）
 * 
 * ⚠️ 注意: このAPIは全Memoryを削除します。
 * UI側で確認ダイアログを必ず表示してください。
 */

import { NextResponse } from 'next/server';
import { coreMemoryProvider } from '@/lib/providers';

export const runtime = 'nodejs';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    
    // 確認文字列のチェック（安全装置）
    if (body.confirm !== 'PURGE_ALL_MEMORIES') {
      return NextResponse.json(
        { 
          error: 'Confirmation required. Please provide { "confirm": "PURGE_ALL_MEMORIES" }',
          required_confirm: 'PURGE_ALL_MEMORIES'
        },
        { status: 400 }
      );
    }

    // TODO: 実際のユーザーIDに置き換え
    const userId = 'mock-user-id';

    const startTime = Date.now();
    
    // すべてのMemoryを削除
    const deletedCount = await coreMemoryProvider.purgeAll(userId);
    
    const latency = Date.now() - startTime;

    return NextResponse.json({
      ok: true,
      deleted_count: deletedCount,
      purged_at: new Date().toISOString(),
      latency_ms: latency,
    });
  } catch (error) {
    console.error('[Memory PURGE Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

