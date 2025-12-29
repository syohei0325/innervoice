export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

/**
 * AXI Leaderboard API
 * 
 * 認定Providerの品質を公開比較するダッシュボード。
 * テンプレ×Providerの成功率・遅延・原価を週次更新。
 */

// Provider情報の型定義
interface ProviderMetrics {
  provider: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  call_success_rate: number; // 0.0-1.0
  latency_p50_ms: number;
  cost_per_action?: number; // USD（Gold以上のみ）
  sla_uptime: number; // 0.0-1.0
  last_updated: string; // ISO 8601
}

// テンプレ別のProvider比較
interface TemplateLeaderboard {
  template: string;
  description: string;
  providers: ProviderMetrics[];
}

// モックデータ（本番環境では実際のAXIデータから取得）
const mockLeaderboardData: TemplateLeaderboard[] = [
  {
    template: 'hospital_reservation',
    description: '病院予約（一次診療）',
    providers: [
      {
        provider: 'Twilio',
        tier: 'Gold',
        call_success_rate: 0.923,
        latency_p50_ms: 1200,
        cost_per_action: 0.025,
        sla_uptime: 0.9992,
        last_updated: new Date().toISOString(),
      },
      {
        provider: 'Telnyx',
        tier: 'Gold',
        call_success_rate: 0.897,
        latency_p50_ms: 900,
        cost_per_action: 0.031,
        sla_uptime: 0.9988,
        last_updated: new Date().toISOString(),
      },
      {
        provider: 'Vonage',
        tier: 'Silver',
        call_success_rate: 0.871,
        latency_p50_ms: 1500,
        cost_per_action: undefined, // Silverは原価非公開
        sla_uptime: 0.9954,
        last_updated: new Date().toISOString(),
      },
    ],
  },
  {
    template: 'restaurant_cancel_reschedule',
    description: '飲食キャンセル/リスケ',
    providers: [
      {
        provider: 'Twilio',
        tier: 'Gold',
        call_success_rate: 0.945,
        latency_p50_ms: 1100,
        cost_per_action: 0.023,
        sla_uptime: 0.9992,
        last_updated: new Date().toISOString(),
      },
      {
        provider: 'Telnyx',
        tier: 'Gold',
        call_success_rate: 0.912,
        latency_p50_ms: 850,
        cost_per_action: 0.029,
        sla_uptime: 0.9988,
        last_updated: new Date().toISOString(),
      },
    ],
  },
  {
    template: 'redelivery',
    description: '再配達/配送業者対応',
    providers: [
      {
        provider: 'Twilio',
        tier: 'Gold',
        call_success_rate: 0.889,
        latency_p50_ms: 1300,
        cost_per_action: 0.027,
        sla_uptime: 0.9992,
        last_updated: new Date().toISOString(),
      },
      {
        provider: 'Telnyx',
        tier: 'Gold',
        call_success_rate: 0.901,
        latency_p50_ms: 950,
        cost_per_action: 0.032,
        sla_uptime: 0.9988,
        last_updated: new Date().toISOString(),
      },
      {
        provider: 'Vonage',
        tier: 'Silver',
        call_success_rate: 0.856,
        latency_p50_ms: 1600,
        cost_per_action: undefined,
        sla_uptime: 0.9954,
        last_updated: new Date().toISOString(),
      },
    ],
  },
];

// 全体サマリー
interface OverallSummary {
  total_templates: number;
  total_providers: number;
  avg_call_success_rate: number;
  avg_latency_p50_ms: number;
  last_updated: string;
}

function calculateOverallSummary(data: TemplateLeaderboard[]): OverallSummary {
  const allProviders = data.flatMap(t => t.providers);
  const uniqueProviders = new Set(allProviders.map(p => p.provider));
  
  const avgCallSuccessRate = allProviders.reduce((sum, p) => sum + p.call_success_rate, 0) / allProviders.length;
  const avgLatency = allProviders.reduce((sum, p) => sum + p.latency_p50_ms, 0) / allProviders.length;
  
  return {
    total_templates: data.length,
    total_providers: uniqueProviders.size,
    avg_call_success_rate: avgCallSuccessRate,
    avg_latency_p50_ms: Math.round(avgLatency),
    last_updated: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template');
    const provider = searchParams.get('provider');
    
    // 特定のテンプレートでフィルタ
    let filteredData = mockLeaderboardData;
    if (template) {
      filteredData = filteredData.filter(t => t.template === template);
    }
    
    // 特定のProviderでフィルタ
    if (provider) {
      filteredData = filteredData.map(t => ({
        ...t,
        providers: t.providers.filter(p => p.provider === provider),
      })).filter(t => t.providers.length > 0);
    }
    
    // レスポンス
    const response = {
      summary: calculateOverallSummary(mockLeaderboardData),
      leaderboard: filteredData,
      meta: {
        update_frequency: 'weekly',
        next_update: getNextMonday(),
        data_source: 'AXI (Action eXecution Index)',
        note: 'Cost per action is only available for Gold and Platinum tier providers',
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('[AXI Leaderboard] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch AXI Leaderboard',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 次の月曜日の日付を取得（週次更新日）
 */
function getNextMonday(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0); // 月曜日 09:00 JST
  return nextMonday.toISOString();
}























