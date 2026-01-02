#!/usr/bin/env ts-node
/**
 * Webhook Worker - Phase1 簡易配送ワーカー
 * 
 * 役割:
 * - webhook_jobs テーブルをポーリング
 * - queued/failed ジョブを配送
 * - リトライ処理（exponential backoff）
 * - status を succeeded/failed に更新
 * 
 * 起動:
 * npm run webhook-worker
 */

import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

const POLL_INTERVAL_MS = parseInt(process.env.WEBHOOK_POLL_INTERVAL_MS || '5000', 10);
const MAX_ATTEMPTS = parseInt(process.env.WEBHOOK_MAX_ATTEMPTS || '3', 10);
const BATCH_SIZE = parseInt(process.env.WEBHOOK_BATCH_SIZE || '10', 10);

async function processWebhookJobs() {
  const now = new Date();
  
  // queued または failed（次回試行時刻が過ぎている）ジョブを取得
  const jobs = await prisma.webhookJob.findMany({
    where: {
      OR: [
        { status: 'queued' },
        {
          status: 'failed',
          attempts: { lt: MAX_ATTEMPTS },
          nextAttemptAt: { lte: now },
        },
      ],
    },
    take: BATCH_SIZE,
    orderBy: { createdAt: 'asc' },
  });

  if (jobs.length === 0) {
    return;
  }

  console.log(`[WEBHOOK_WORKER] Processing ${jobs.length} jobs...`);

  for (const job of jobs) {
    try {
      // ジョブをdelivering状態に更新
      await prisma.webhookJob.update({
        where: { id: job.id },
        data: {
          status: 'delivering',
          attempts: { increment: 1 },
        },
      });

      // Webhook配送
      const payload = JSON.parse(job.payloadJson);
      
      // target_url_hash から実際のURLを取得（connector_configsから）
      const connectorConfig = await prisma.connectorConfig.findFirst({
        where: {
          tenantId: job.tenantId,
          connector: 'webhook',
        },
      });

      if (!connectorConfig) {
        throw new Error('Connector config not found');
      }

      const configJson = JSON.parse(connectorConfig.configJson);
      const registeredUrls = configJson.registered_urls || [];
      const targetUrlObj = registeredUrls.find((u: any) => {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(u.url).digest('hex');
        return hash === job.targetUrlHash;
      });

      if (!targetUrlObj) {
        throw new Error('Target URL not found in registered_urls');
      }

      const targetUrl = targetUrlObj.url;

      // HTTP POST送信（10秒タイムアウト）
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      try {
        var response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Yohaku-Signature': job.signature,
            'X-Yohaku-Job-Id': job.jobId,
            'X-Yohaku-Timestamp': job.timestamp.toString(),
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 成功
      await prisma.webhookJob.update({
        where: { id: job.id },
        data: {
          status: 'succeeded',
          lastError: null,
          succeededAt: new Date(),
        },
      });

      console.log(`[WEBHOOK_WORKER] ✅ Job ${job.jobId} succeeded`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const attempts = job.attempts + 1;
      
      if (attempts >= MAX_ATTEMPTS) {
        // 最大試行回数に達したら failed
        await prisma.webhookJob.update({
          where: { id: job.id },
          data: {
            status: 'failed',
            lastError: errorMessage,
          },
        });
        console.error(`[WEBHOOK_WORKER] ❌ Job ${job.jobId} failed permanently: ${errorMessage}`);
      } else {
        // リトライ（exponential backoff）
        const backoffMs = Math.pow(2, attempts) * 1000; // 2秒, 4秒, 8秒...
        const nextAttemptAt = new Date(Date.now() + backoffMs);
        
        await prisma.webhookJob.update({
          where: { id: job.id },
          data: {
            status: 'failed',
            lastError: errorMessage,
            nextAttemptAt,
          },
        });
        console.warn(`[WEBHOOK_WORKER] ⚠️  Job ${job.jobId} failed (attempt ${attempts}/${MAX_ATTEMPTS}), retry at ${nextAttemptAt.toISOString()}: ${errorMessage}`);
      }
    }
  }
}

async function main() {
  console.log('[WEBHOOK_WORKER] Starting...');
  console.log(`[WEBHOOK_WORKER] Poll interval: ${POLL_INTERVAL_MS}ms`);
  console.log(`[WEBHOOK_WORKER] Max attempts: ${MAX_ATTEMPTS}`);
  console.log(`[WEBHOOK_WORKER] Batch size: ${BATCH_SIZE}`);

  // ポーリングループ
  while (true) {
    try {
      await processWebhookJobs();
    } catch (error) {
      console.error('[WEBHOOK_WORKER] Error in processing loop:', error);
    }
    
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('[WEBHOOK_WORKER] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[WEBHOOK_WORKER] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch(async (error) => {
  console.error('[WEBHOOK_WORKER] Fatal error:', error);
  await prisma.$disconnect();
  process.exit(1);
});

