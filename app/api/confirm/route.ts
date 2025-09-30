export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[CONFIRM] === Request started ===');
  
  try {
    // Step 1: Parse request body
    console.log('[CONFIRM] Step 1: Parsing body...');
    const body = await request.json();
    console.log('[CONFIRM] Body received:', JSON.stringify(body));
    
    const { proposal_id, plan_id, enabled_actions } = body;
    
    // Step 2: Validate input
    console.log('[CONFIRM] Step 2: Validating input...');
    if (!proposal_id && !plan_id) {
      console.log('[CONFIRM] ERROR: Missing both proposal_id and plan_id');
      return NextResponse.json(
        { error: 'Either proposal_id or plan_id is required' },
        { status: 400 }
      );
    }
    
    console.log('[CONFIRM] Validation OK');
    console.log('[CONFIRM] proposal_id:', proposal_id);
    console.log('[CONFIRM] plan_id:', plan_id);
    console.log('[CONFIRM] enabled_actions:', enabled_actions);
    
    // Step 3: Generate simple response
    console.log('[CONFIRM] Step 3: Generating response...');
    
    const response = {
      success: true,
      ics_url: `/api/download/mock_${Date.now()}.ics`,
      minutes_back: 15,
      message: 'Confirm endpoint working (simplified)',
      debug: {
        proposal_id,
        plan_id,
        enabled_actions,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('[CONFIRM] Response ready:', JSON.stringify(response));
    console.log('[CONFIRM] === Request completed successfully ===');
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[CONFIRM] !!! ERROR !!!');
    console.error('[CONFIRM] Error type:', error?.constructor?.name);
    console.error('[CONFIRM] Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('[CONFIRM] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Confirm endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name || 'UnknownError',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/confirm',
    runtime: 'nodejs',
    timestamp: new Date().toISOString()
  });
}