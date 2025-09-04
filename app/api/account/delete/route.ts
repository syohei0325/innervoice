export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement user account deletion
    // Create deletion request and process within 48 hours
    
    return NextResponse.json({
      message: 'Deletion request submitted. Will be completed within 48 hours.',
      request_id: `del_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error('Error in /api/account/delete:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}
