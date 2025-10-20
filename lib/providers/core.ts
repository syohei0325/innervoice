/**
 * Core Memory Provider
 * 
 * 自前のMemory OS実装。Prismaを使ってPostgreSQLに保存します。
 * これがフォールバック用の基本実装となります。
 */

import { PrismaClient } from '@prisma/client';
import type {
  MemoryProvider,
  MemoryItem,
  MemoryHit,
  PutResult,
  SearchOpts,
  ProviderHealth,
  Embedding,
} from './types';

const prisma = new PrismaClient();

export class CoreMemoryProvider implements MemoryProvider {
  readonly name = 'core';
  readonly version = '1.0.0';

  /**
   * Memory項目を保存
   */
  async put(items: MemoryItem[], container?: string): Promise<PutResult[]> {
    const results: PutResult[] = [];

    for (const item of items) {
      try {
        // TTLの計算
        const expiresAt = item.ttl_days
          ? new Date(Date.now() + item.ttl_days * 24 * 60 * 60 * 1000)
          : null;

        // Upsert（存在すれば更新、なければ挿入）
        await prisma.memory.upsert({
          where: {
            userId_key: {
              userId: 'mock-user-id', // TODO: 実際のユーザーIDに置き換え
              key: item.key,
            },
          },
          update: {
            valueJson: JSON.stringify(item.value),
            source: item.source,
            confidence: item.confidence ?? 1.0,
            expiresAt,
            updatedAt: new Date(),
          },
          create: {
            userId: 'mock-user-id', // TODO: 実際のユーザーIDに置き換え
            kind: item.kind,
            key: item.key,
            valueJson: JSON.stringify(item.value),
            source: item.source,
            confidence: item.confidence ?? 1.0,
            expiresAt,
          },
        });

        results.push({ key: item.key, ok: true });
      } catch (error) {
        results.push({
          key: item.key,
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Memoryを検索
   */
  async search(
    query: string | Embedding,
    opts?: SearchOpts
  ): Promise<MemoryHit[]> {
    // 文字列検索のみ対応（Embedding検索は将来実装）
    if (typeof query !== 'string') {
      throw new Error('Embedding search not yet supported in Core provider');
    }

    const limit = opts?.limit ?? 10;
    const minConfidence = opts?.min_confidence ?? 0.0;
    const kinds = opts?.kinds;

    // キーまたは値に部分一致するMemoryを検索
    const memories = await prisma.memory.findMany({
      where: {
        userId: 'mock-user-id', // TODO: 実際のユーザーIDに置き換え
        AND: [
          {
            OR: [
              { key: { contains: query, mode: 'insensitive' } },
              { valueJson: { contains: query, mode: 'insensitive' } },
            ],
          },
          kinds ? { kind: { in: kinds } } : {},
          { confidence: { gte: minConfidence } },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } },
            ],
          },
        ],
      },
      take: limit,
      orderBy: [
        { confidence: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    // MemoryHit形式に変換
    return memories.map((memory) => ({
      key: memory.key,
      value: JSON.parse(memory.valueJson),
      confidence: memory.confidence ?? 0.0,
      source: 'core' as const,
      evidence: [`memories.${memory.kind}`],
      created_at: memory.createdAt,
    }));
  }

  /**
   * Memoryを削除
   */
  async forget(keys: string[]): Promise<void> {
    await prisma.memory.deleteMany({
      where: {
        userId: 'mock-user-id', // TODO: 実際のユーザーIDに置き換え
        key: { in: keys },
      },
    });
  }

  /**
   * Providerの健全性チェック
   */
  async health(): Promise<ProviderHealth> {
    try {
      const startTime = Date.now();
      
      // データベース接続テスト
      await prisma.$queryRaw`SELECT 1`;
      
      const latency = Date.now() - startTime;

      return {
        healthy: true,
        latency_ms: latency,
        last_check: new Date(),
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        last_check: new Date(),
      };
    }
  }

  /**
   * すべてのMemoryをエクスポート（ユーザー主権）
   */
  async exportAll(userId: string = 'mock-user-id'): Promise<MemoryItem[]> {
    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return memories.map((memory) => ({
      kind: memory.kind as any,
      key: memory.key,
      value: JSON.parse(memory.valueJson),
      source: memory.source as any,
      confidence: memory.confidence ?? undefined,
      ttl_days: memory.expiresAt
        ? Math.ceil((memory.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        : undefined,
      created_at: memory.createdAt,
      updated_at: memory.updatedAt,
    }));
  }

  /**
   * すべてのMemoryを削除（ユーザー主権）
   */
  async purgeAll(userId: string = 'mock-user-id'): Promise<number> {
    const result = await prisma.memory.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * 期限切れMemoryの自動削除（バックグラウンドジョブ用）
   */
  async cleanupExpired(): Promise<number> {
    const result = await prisma.memory.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}

// シングルトンインスタンス
export const coreMemoryProvider = new CoreMemoryProvider();

