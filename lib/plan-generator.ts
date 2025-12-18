// Plan Generator: PlanA/B を生成
// CURSOR_SEED.md: 日時/場所/連絡手段の異なる2案を生成

import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { DetectedIntent } from './intent-detector';
import { Plan, Action } from './intent';

export interface PlanGenerationContext {
  intent: DetectedIntent;
  userInput: string;
  timezone: string;
  constraints?: {
    ngTimes?: string[]; // 避けたい時間帯
    mobility?: string;  // 移動手段
  };
}

export async function generatePlans(
  context: PlanGenerationContext,
  openai: OpenAI
): Promise<Plan[]> {
  const { intent, userInput, timezone, constraints } = context;

  const systemPrompt = `あなたはYohakuのプラン生成AI。ユーザーの意図から2つの実行プラン（PlanA/PlanB）を生成します。

意図タイプ: ${intent.type}
電話が必要: ${intent.requiresCall}
抽出情報: ${JSON.stringify(intent.extractedInfo)}
制約: ${JSON.stringify(constraints)}

出力は必ずJSON形式で、plans配列に2つのプランを含めてください。

各プランの構造:
{
  "id": "plan_xxx_a",
  "summary": "簡潔な要約（30文字以内）",
  "actions": [
    {
      "action": "call.place" | "calendar.create" | "message.send" | "reminder.create",
      "title": "タイトル",
      "phone": "電話番号（call.placeの場合）",
      "purpose": "目的（call.placeの場合）",
      "details": {},
      "start": "ISO 8601 datetime",
      "duration_min": 30
    }
  ],
  "reasons": [
    {
      "key": "なぜこのプランか",
      "source": "core",
      "confidence": 0.8
    }
  ]
}

PlanAとPlanBは以下の点で異なる必要があります：
- 日時が異なる（例：午前 vs 午後）
- アプローチが異なる（例：電話 vs オンライン予約）
- 所要時間が異なる

電話が必要な場合は、call.place アクションを含めてください。`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.4,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(responseText);
    const plans = parsed.plans || [];

    // IDを確実に設定
    return plans.slice(0, 2).map((plan: any, index: number) => ({
      id: plan.id || `plan_${Date.now()}_${index === 0 ? 'a' : 'b'}`,
      summary: plan.summary || `プラン${index === 0 ? 'A' : 'B'}`,
      actions: plan.actions || [],
      reasons: plan.reasons || [],
    }));
  } catch (error) {
    console.error('[PlanGenerator] Error:', error);
    
    // フォールバック: シンプルなプランを生成
    return generateFallbackPlans(intent, userInput);
  }
}

// フォールバックプラン生成
function generateFallbackPlans(intent: DetectedIntent, userInput: string): Plan[] {
  const baseId = Date.now();
  
  if (intent.requiresCall) {
    // 電話が必要な場合
    return [
      {
        id: `plan_${baseId}_a`,
        summary: `電話予約（午前中）`,
        actions: [
          {
            action: 'call.place' as const,
            phone: intent.extractedInfo.phone || '未設定',
            purpose: userInput,
            details: intent.extractedInfo,
          },
          {
            action: 'calendar.create' as const,
            title: intent.extractedInfo.facilityName || '予約',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 明日
            duration_min: 30,
          },
        ],
        reasons: [
          {
            key: '電話での予約が確実',
            source: 'core' as const,
            confidence: 0.8,
          },
        ],
      },
      {
        id: `plan_${baseId}_b`,
        summary: `電話予約（午後）`,
        actions: [
          {
            action: 'call.place' as const,
            phone: intent.extractedInfo.phone || '未設定',
            purpose: userInput,
            details: intent.extractedInfo,
          },
          {
            action: 'calendar.create' as const,
            title: intent.extractedInfo.facilityName || '予約',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 明日午後
            duration_min: 30,
          },
        ],
        reasons: [
          {
            key: '午後の方が電話が繋がりやすい',
            source: 'core' as const,
            confidence: 0.7,
          },
        ],
      },
    ];
  } else {
    // 単純なカレンダー予定
    return [
      {
        id: `plan_${baseId}_a`,
        summary: `予定A（30分）`,
        actions: [
          {
            action: 'calendar.create' as const,
            title: userInput,
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 30,
          },
        ],
        reasons: [
          {
            key: '標準的な所要時間',
            source: 'core' as const,
            confidence: 0.8,
          },
        ],
      },
      {
        id: `plan_${baseId}_b`,
        summary: `予定B（15分・短縮版）`,
        actions: [
          {
            action: 'calendar.create' as const,
            title: userInput + '（短縮版）',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 15,
          },
        ],
        reasons: [
          {
            key: '時間を節約',
            source: 'core' as const,
            confidence: 0.7,
          },
        ],
      },
    ];
  }
}




