export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { guardAction, PhaseGuardError, CURRENT_PHASE } from '@/lib/phase-guard';
import crypto from 'crypto';

/**
 * POST /v1/confirm - 実行確定（Action Cloud / phase1）
 * 
 * phase1の動作:
 * - approve_id必須（TTL10分）
 * - idempotency_key必須（24h）
 * - webhook.dispatch / calendar.hold.create のみ許可
 * - call.place は SEALED（403）
 * - ledger に append-only chain で記録
 * - partial success contract（422）
 * - metering（confirm/webhook_job/calendar_hold）
 */
export async function POST(request: NextRequest) {
  console.log('[CONFIRM] === Request started ===');
  
  try {
    const body = await request.json();
    console.log('[CONFIRM] Body received:', JSON.stringify(body));
    
    const { plan_id, approve_id, idempotency_key } = body;
    
    // 必須パラメータチェック
    if (!plan_id) {
      return NextResponse.json(
        { error: '400_PLAN_ID_REQUIRED', message: 'plan_id is required' },
        { status: 400 }
      );
    }
    
    if (!approve_id) {
      return NextResponse.json(
        { error: '400_APPROVAL_REQUIRED', message: 'approve_id is required (ConfirmOS)' },
        { status: 400 }
      );
    }
    
    if (!idempotency_key) {
      return NextResponse.json(
        { error: '400_IDEMPOTENCY_KEY_REQUIRED', message: 'idempotency_key is required (ConfirmOS)' },
        { status: 400 }
      );
    }

    // Approval validation
    const approval = await prisma.approval.findUnique({
      where: { approveId: approve_id },
    });

    if (!approval) {
      return NextResponse.json(
        { error: '400_APPROVAL_NOT_FOUND', message: 'Approval not found' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now > approval.expiresAt) {
      return NextResponse.json(
        { error: '400_APPROVAL_EXPIRED', message: 'Approval has expired (TTL 10min)' },
        { status: 400 }
      );
    }

    if (approval.usedAt) {
      return NextResponse.json(
        { error: '409_APPROVAL_ALREADY_USED', message: 'Approval already used' },
        { status: 409 }
      );
    }

    // Idempotency check
    const existingLog = await prisma.auditLog.findFirst({
      where: {
        tenantId: approval.tenantId,
        action: 'confirm',
        payloadJson: {
          contains: idempotency_key,
        },
      },
    });

    if (existingLog) {
      return NextResponse.json(
        { error: '409_IDEMPOTENCY_CONFLICT', message: 'Request already processed (idempotency)' },
        { status: 409 }
      );
    }

    // Freeze check（Kill/Freeze）
    const activeFreezeRules = await prisma.freezeRule.findMany({
      where: {
        tenantId: approval.tenantId,
        active: true,
        OR: [
          { level: 'global' },
          { level: 'tenant' },
        ],
      },
    });

    if (activeFreezeRules.length > 0) {
      return NextResponse.json(
        { error: '403_FROZEN', message: 'Tenant is frozen', reason: activeFreezeRules[0].reason },
        { status: 403 }
      );
    }

    // Mark approval as used
    await prisma.approval.update({
      where: { approveId: approve_id },
      data: { usedAt: now },
    });

    // Plan取得
    const plan = await prisma.plan.findUnique({
      where: { id: plan_id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: '400_PLAN_NOT_FOUND', message: 'Plan not found' },
        { status: 400 }
      );
    }

    const planPayload = JSON.parse(plan.payloadJson);
    const actions = planPayload.actions || [];

    // アクション実行
    const results: Array<{ action: string; status: string; id?: string; error?: string; mode?: string; ics_url?: string; job_id?: string }> = [];
    let meteringConfirms = 0;
    let meteringWebhookJobs = 0;
    let meteringCalendarHolds = 0;

    for (const action of actions) {
      try {
        // Phase Guard: アクションが phase1 で許可されているかチェック
        guardAction(action.action, CURRENT_PHASE);

        if (action.action === 'webhook.dispatch') {
          // Webhook実行（phase1の主戦場）
          const jobId = `job_${uuidv4()}`;
          const targetUrlHash = crypto.createHash('sha256').update(action.target_url || '').digest('hex');

          // Webhook Job作成（outbox pattern）
          await prisma.webhookJob.create({
            data: {
              tenantId: approval.tenantId,
              jobId,
              targetUrlHash,
              payloadJson: JSON.stringify(action.body || {}),
              signature: 'HMAC_SIGNATURE_HERE', // TODO: 実装
              status: 'queued',
              attempts: 0,
              nextAttemptAt: new Date(),
            },
          });

          results.push({
            action: 'webhook.dispatch',
            status: 'queued',
            job_id: jobId,
          });

          meteringWebhookJobs += 1;

        } else if (action.action === 'calendar.hold.create') {
          // Calendar Hold実行（ICS fallback-first）
          const eventId = uuidv4();
          const icsContent = generateIcsContent(eventId, action);

          results.push({
            action: 'calendar.hold.create',
            status: 'ok',
            mode: 'ics',
            ics_url: `/api/download/${eventId}`,
          });

          meteringCalendarHolds += 1;

        } else {
          // 未知のアクション
          results.push({
            action: action.action,
            status: 'error',
            error: 'Unknown action',
          });
        }

      } catch (error) {
        if (error instanceof PhaseGuardError) {
          // Phase Guard violation
          results.push({
            action: action.action,
            status: 'error',
            error: `SEALED_IN_${CURRENT_PHASE.toUpperCase()}: ${error.message}`,
          });
        } else {
          results.push({
            action: action.action,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    // Metering: confirm は1回だけカウント（idempotencyで重複課金しない）
    meteringConfirms = 1;

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId: approval.tenantId,
        userId: approval.userId,
        approveId: approve_id,
        action: 'confirm',
        payloadJson: JSON.stringify({
          plan_id,
          idempotency_key,
          results,
        }),
      },
    });

    // Ledger event（append-only chain）
    const prevEvent = await prisma.ledgerEvent.findFirst({
      where: { tenantId: approval.tenantId },
      orderBy: { ts: 'desc' },
    });
    
    const currentEventData = {
      plan_id,
      approve_id,
      results,
    };
    
    const prevHash = prevEvent?.prevHash || null;
    const currentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(currentEventData) + (prevHash || ''))
      .digest('hex');
    
    await prisma.ledgerEvent.create({
      data: {
        tenantId: approval.tenantId,
        approveId: approve_id,
        planId: plan_id,
        action: 'confirm',
        actor: 'user',
        status: 'executed',
        beforeJson: null,
        afterJson: JSON.stringify(currentEventData),
        reversible: true,
        prevHash: currentHash,
      },
    });

    // Usage metering（日次集計）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.usageCounterDaily.upsert({
      where: {
        tenantId_day: {
          tenantId: approval.tenantId,
          day: today,
        },
      },
      update: {
        confirms: { increment: meteringConfirms },
        webhookJobs: { increment: meteringWebhookJobs },
        calendarHolds: { increment: meteringCalendarHolds },
      },
      create: {
        tenantId: approval.tenantId,
        day: today,
        confirms: meteringConfirms,
        webhookJobs: meteringWebhookJobs,
        calendarHolds: meteringCalendarHolds,
      },
    });

    // Receipt生成
    const receiptId = `rcp_${uuidv4()}`;
    await prisma.receipt.create({
      data: {
        id: receiptId,
        tenantId: approval.tenantId,
        planId: plan_id,
        status: results.some(r => r.status === 'error') ? 'partial' : 'success',
        summaryText: `Executed ${results.length} actions`,
      },
    });

    const response = {
      success: true,
      results,
      receipt_id: receiptId,
      metering: {
        confirm: meteringConfirms,
        webhook_job: meteringWebhookJobs,
        calendar_hold: meteringCalendarHolds,
      },
    };
    
    console.log('[CONFIRM] Response ready');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[CONFIRM] Error:', error);
    return NextResponse.json(
      { 
        error: 'Confirm failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateIcsContent(eventId: string, action: any): string {
  const now = new Date();
  const startTime = action.start ? new Date(action.start) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const endTime = new Date(startTime.getTime() + (action.duration_min || 30) * 60 * 1000);
  
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hour}${minute}${second}`;
  };

  const title = action.title || 'Calendar Hold';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Yohaku Action Cloud//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${eventId}@yohaku.app
DTSTART:${formatDateTime(startTime)}
DTEND:${formatDateTime(endTime)}
SUMMARY:${title}
DESCRIPTION:Generated by Yohaku Action Cloud (Calendar Hold)
STATUS:TENTATIVE
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/v1/confirm',
    phase: CURRENT_PHASE,
    runtime: 'nodejs',
  });
}

