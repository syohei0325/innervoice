export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement user data export
    // Return JSON with summaries, operation metadata, and MB history
    
    const exportData = {
      user: {
        created_at: "2024-01-01T00:00:00Z",
        total_decisions: 42,
        total_minutes_back: 630
      },
      decisions_summary: [],
      events_summary: [],
      minutes_back_history: []
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error in /api/account/export:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
