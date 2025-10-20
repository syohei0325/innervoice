/**
 * Memory API E2E Tests
 * 
 * Memory API の動作を確認するテスト
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Memory API', () => {
  test('PUT /api/memory/put - Memory を保存できる', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'preference',
        key: 'test.coffee.sugar',
        value: 0,
        source: 'manual',
        confidence: 1.0,
        ttl_days: 365,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.key).toBe('test.coffee.sugar');
    expect(data.confidence).toBe(1.0);
  });

  test('QUERY /api/memory/query - Memory を検索できる', async ({ request }) => {
    // まず Memory を保存
    await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'preference',
        key: 'test.query.example',
        value: 'test value',
        source: 'manual',
      },
    });

    // 検索
    const response = await request.post(`${BASE_URL}/api/memory/query`, {
      data: {
        query: 'test.query',
        limit: 10,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.count).toBeGreaterThan(0);
  });

  test('FORGET /api/memory/forget - Memory を削除できる', async ({ request }) => {
    // まず Memory を保存
    await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'preference',
        key: 'test.forget.example',
        value: 'will be deleted',
      },
    });

    // 削除
    const response = await request.post(`${BASE_URL}/api/memory/forget`, {
      data: {
        key: 'test.forget.example',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.deleted_keys).toContain('test.forget.example');
  });

  test('EXPORT /api/memory/export - すべての Memory をエクスポートできる', async ({ request }) => {
    // いくつか Memory を保存
    await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'preference',
        key: 'test.export.1',
        value: 'value1',
      },
    });

    await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'alias',
        key: 'test.export.2',
        value: 'value2',
      },
    });

    // エクスポート
    const response = await request.get(`${BASE_URL}/api/memory/export`);

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.exported_at).toBeDefined();
    expect(data.total_count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.items)).toBe(true);
  });

  test('PURGE /api/memory/purge - 確認文字列なしではエラー', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/memory/purge`, {
      data: {
        confirm: 'WRONG_STRING',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.required_confirm).toBe('PURGE_ALL_MEMORIES');
  });

  test('PURGE /api/memory/purge - 正しい確認文字列で削除成功', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/memory/purge`, {
      data: {
        confirm: 'PURGE_ALL_MEMORIES',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.deleted_count).toBeGreaterThanOrEqual(0);
    expect(data.purged_at).toBeDefined();
  });

  test('Provider Status /api/provider/status - プロバイダ状態を取得できる', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/provider/status`);

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.current).toBeDefined();
    expect(data.healthy).toBeDefined();
    expect(data.provider_info).toBeDefined();
    expect(data.provider_info.name).toBe('core');
  });
});

test.describe('Memory API - エラーハンドリング', () => {
  test('PUT - 必須フィールドがない場合はエラー', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        // kind, key, value が欠けている
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing required fields');
  });

  test('FORGET - キーがない場合はエラー', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/memory/forget`, {
      data: {
        // key が欠けている
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing required field');
  });

  test('QUERY - クエリがない場合はエラー', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/memory/query`, {
      data: {
        // query が欠けている
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing required field');
  });
});

test.describe('Memory API - TTL & Confidence', () => {
  test('TTL を設定した Memory を保存できる', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'routine',
        key: 'test.ttl.example',
        value: 'expires in 30 days',
        ttl_days: 30,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  test('Confidence でフィルタして検索できる', async ({ request }) => {
    // 高信頼度の Memory を保存
    await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'fact',
        key: 'test.confidence.high',
        value: 'high confidence',
        confidence: 0.9,
      },
    });

    // 低信頼度の Memory を保存
    await request.post(`${BASE_URL}/api/memory/put`, {
      data: {
        kind: 'fact',
        key: 'test.confidence.low',
        value: 'low confidence',
        confidence: 0.3,
      },
    });

    // min_confidence = 0.5 で検索
    const response = await request.post(`${BASE_URL}/api/memory/query`, {
      data: {
        query: 'test.confidence',
        min_confidence: 0.5,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // 高信頼度のみヒットするはず
    const highConfidenceHit = data.items.find((item: any) => item.key === 'test.confidence.high');
    expect(highConfidenceHit).toBeDefined();
    
    const lowConfidenceHit = data.items.find((item: any) => item.key === 'test.confidence.low');
    expect(lowConfidenceHit).toBeUndefined();
  });
});

