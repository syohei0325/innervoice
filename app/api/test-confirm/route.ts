export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[TEST-CONFIRM] Request received');
    
    const body = await request.json();
    console.log('[TEST-CONFIRM] Body:', JSON.stringify(body));
    
    // 最小限のレスポンス
    return NextResponse.json({
      success: true,
      message: 'Test confirm endpoint working',
      received: body,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[TEST-CONFIRM] Error:', error);
    return NextResponse.json(
      { 
        error: 'Test confirm failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Test confirm endpoint is running',
    timestamp: new Date().toISOString()
  });
}
