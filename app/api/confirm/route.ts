export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Proposal型定義（page.tsxと一致）
type Proposal = {
  id: string;
  title: string;
  slot: string; // HH:MM形式
  duration_min: number;
};

// インメモリストア（本番環境でDBがない場合のフォールバック）
const proposalStore = new Map<string, Proposal>();

export async function POST(request: NextRequest) {
  console.log('[CONFIRM] === Request started ===');
  
  try {
    const body = await request.json();
    console.log('[CONFIRM] Body received:', JSON.stringify(body));
    
    const { proposal_id, plan_id, enabled_actions, approve_id, idempotency_key } = body;
    
    if (!proposal_id && !plan_id) {
      return NextResponse.json(
        { error: 'Either proposal_id or plan_id is required' },
        { status: 400 }
      );
    }

    const mockUserId = 'user_mock_001';
    const eventId = uuidv4();

    // ConfirmOS: approve_id validation (optional for MVP, required for MVP+)
    if (approve_id) {
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
          { error: '400_APPROVAL_EXPIRED', message: 'Approval has expired' },
          { status: 400 }
        );
      }

      if (approval.usedAt) {
        return NextResponse.json(
          { error: '409_APPROVAL_ALREADY_USED', message: 'Approval already used' },
          { status: 409 }
        );
      }

      // Mark approval as used
      await prisma.approval.update({
        where: { approveId: approve_id },
        data: { usedAt: now },
      });
    }

    // ConfirmOS: Idempotency check (optional for MVP, recommended for production)
    if (idempotency_key) {
      // Check if this idempotency key was already processed
      const existingLog = await prisma.auditLog.findFirst({
        where: {
          userId: mockUserId,
          action: 'confirm',
          payloadJson: {
            contains: idempotency_key,
          },
        },
      });

      if (existingLog) {
        return NextResponse.json(
          { error: '409_IDEMPOTENCY_CONFLICT', message: 'Request already processed' },
          { status: 409 }
        );
      }
    }
    
    // 提案情報を取得（リクエストに含まれているか、ストアから取得）
    let proposal: Proposal | null = null;
    
    if (proposal_id) {
      // インメモリストアから取得（フロントエンドで保存が必要）
      proposal = proposalStore.get(proposal_id) || null;
      
      // なければbodyから取得
      if (!proposal && body.proposal) {
        proposal = body.proposal;
      }
      
      // それでもなければデフォルト値
      if (!proposal) {
        console.warn('[CONFIRM] Proposal not found, using default values');
        proposal = {
          id: proposal_id,
          title: 'InnerVoice タスク',
          slot: '09:00',
          duration_min: 20
        };
      }
    }

    // .ics生成
    const icsContent = generateIcsContent(eventId, proposal);
    
    // データベース保存を試みる（失敗しても続行）
    try {
      await prisma.decision.create({
        data: {
          id: uuidv4(),
          userId: mockUserId,
          proposalId: proposal_id || 'plan_' + plan_id,
          icsBlob: icsContent,
          minutesBack: proposal?.duration_min || 15,
          decidedAt: new Date(),
        },
      });
      
      await prisma.event.create({
        data: {
          id: uuidv4(),
          userId: mockUserId,
          source: 'confirm',
          minutesBack: proposal?.duration_min || 15,
          metaJson: JSON.stringify({ proposal_id, plan_id }),
          createdAt: new Date(),
        },
      });

      // ConfirmOS: Audit log
      await prisma.auditLog.create({
        data: {
          userId: mockUserId,
          approveId: approve_id || null,
          action: 'confirm',
          payloadJson: JSON.stringify({
            proposal_id,
            plan_id,
            idempotency_key,
            event_id: eventId,
          }),
        },
      });

      // ConfirmOS: Ledger event
      await prisma.ledgerEvent.create({
        data: {
          approveId: approve_id || null,
          planId: plan_id || null,
          action: 'calendar.create',
          actor: 'user',
          status: 'executed',
          beforeJson: null,
          afterJson: JSON.stringify({
            event_id: eventId,
            title: proposal?.title,
            start_time: proposal?.slot,
          }),
          reversible: true,
        },
      });

      // Record FEA (Friction Events Avoided)
      await prisma.frictionEvent.create({
        data: {
          userId: mockUserId,
          type: 'app_switch_avoided',
          qty: 1,
          evidence: 'measured',
          action: eventId,
        },
      });
      
      console.log('[CONFIRM] Database save successful');
    } catch (dbError) {
      console.warn('[CONFIRM] Database save failed (continuing anyway):', dbError);
    }

    const response = {
      success: true,
      ics_url: `/api/download/${eventId}`,
      ics_content: icsContent, // クライアント側で直接ダウンロードできるように
      minutes_back: proposal?.duration_min || 15,
      execution_status: 'success',
      event_id: eventId,
      // ConfirmOS fields
      approve_id: approve_id || null,
      idempotency_key: idempotency_key || null,
      // FEA (Friction Events Avoided)
      friction_saved: [
        { type: 'app_switch_avoided', qty: 1, evidence: 'measured' },
      ],
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

function generateIcsContent(eventId: string, proposal: Proposal | null): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // slotから時刻を解析（HH:MM形式）
  let hours = 9;
  let minutes = 0;
  
  if (proposal?.slot) {
    const [h, m] = proposal.slot.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      hours = h;
      minutes = m;
    }
  }
  
  // 開始時刻を設定（明日の指定時刻）
  const startTime = new Date(tomorrow);
  startTime.setHours(hours, minutes, 0, 0);
  
  // 終了時刻を設定
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + (proposal?.duration_min || 20));
  
  // YYYYMMDDTHHMMSS形式に変換（UTCではなくローカルタイム）
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hour}${minute}${second}`;
  };

  const title = proposal?.title || 'InnerVoice タスク';
  const durationText = proposal?.duration_min || 20;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//InnerVoice//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${eventId}@innervoice.app
DTSTART:${formatDateTime(startTime)}
DTEND:${formatDateTime(endTime)}
SUMMARY:${title}
DESCRIPTION:Generated by InnerVoice (${durationText}分)
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

// 提案を保存するためのエンドポイント（フロントエンドから呼び出し）
export async function PUT(request: NextRequest) {
  try {
    const { proposals }: { proposals: Proposal[] } = await request.json();
    proposals.forEach(p => {
      proposalStore.set(p.id, p);
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store proposals' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/confirm',
    runtime: 'nodejs',
  });
}