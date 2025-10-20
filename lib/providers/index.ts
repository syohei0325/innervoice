/**
 * Memory Provider Factory
 * 
 * 環境変数に基づいて適切なMemory Providerを返します。
 */

import type { MemoryProvider } from './types';
import { coreMemoryProvider } from './core';

// 将来的にSupermemory/Zep/Mem0を追加
// import { supermemoryProvider } from './supermemory';
// import { zepProvider } from './zep';
// import { mem0Provider } from './mem0';

/**
 * 環境変数からProvider名を取得
 */
export function getProviderName(): string {
  return process.env.YOHAKU_MEMORY_PROVIDER || 'core';
}

/**
 * Memory Providerを取得
 */
export function getMemoryProvider(): MemoryProvider {
  const providerName = getProviderName();

  switch (providerName) {
    case 'core':
      return coreMemoryProvider;

    // 将来実装
    // case 'supermemory':
    //   return supermemoryProvider;
    
    // case 'zep':
    //   return zepProvider;
    
    // case 'mem0':
    //   return mem0Provider;

    case 'none':
      // Providerなし（Coreのみ）
      return coreMemoryProvider;

    default:
      console.warn(
        `Unknown memory provider: ${providerName}. Falling back to 'core'.`
      );
      return coreMemoryProvider;
  }
}

/**
 * Provider Eventを記録（A/B運用・監視用）
 */
export async function recordProviderEvent(
  userId: string,
  provider: string,
  event: string,
  payload: Record<string, any>
): Promise<void> {
  // TODO: provider_eventsテーブルに記録
  // 現時点ではコンソールログのみ
  console.log('[Provider Event]', {
    userId,
    provider,
    event,
    payload,
    at: new Date().toISOString(),
  });
}

// 型とProviderをまとめてエクスポート
export * from './types';
export { coreMemoryProvider } from './core';

