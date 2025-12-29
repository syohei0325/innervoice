// Intent Detector: ユーザーの入力から意図を検出
// CURSOR_SEED.md: 病院予約 / 再配達 / 美容室 / 役所 などを検出

import OpenAI from 'openai';

export type IntentType = 
  | 'hospital_appointment'    // 病院予約
  | 'redelivery'              // 再配達
  | 'salon_appointment'       // 美容室・サロン予約
  | 'government_inquiry'      // 役所問い合わせ
  | 'restaurant_reservation'  // レストラン予約
  | 'simple_calendar'         // 単純なカレンダー予定
  | 'unknown';                // 不明

export interface DetectedIntent {
  type: IntentType;
  confidence: number;
  requiresCall: boolean;
  extractedInfo: {
    facilityName?: string;
    phone?: string;
    preferredTime?: string;
    trackingNumber?: string;
    address?: string;
    [key: string]: any;
  };
}

export async function detectIntent(text: string, openai: OpenAI): Promise<DetectedIntent> {
  const systemPrompt = `あなたは意図検出AI。ユーザーの入力から以下を判定：
1. type: 意図のタイプ（hospital_appointment, redelivery, salon_appointment, government_inquiry, restaurant_reservation, simple_calendar, unknown）
2. confidence: 確信度（0-1）
3. requiresCall: 電話が必要か（true/false）
4. extractedInfo: 抽出した情報（施設名、電話番号、希望時間など）

出力は必ずJSON形式で。

例：
入力: "明日の午前中で田中クリニック予約して"
出力: {
  "type": "hospital_appointment",
  "confidence": 0.95,
  "requiresCall": true,
  "extractedInfo": {
    "facilityName": "田中クリニック",
    "preferredTime": "明日午前中"
  }
}

入力: "不在票の再配達お願い"
出力: {
  "type": "redelivery",
  "confidence": 0.9,
  "requiresCall": true,
  "extractedInfo": {}
}

入力: "明日朝30分ランニング"
出力: {
  "type": "simple_calendar",
  "confidence": 0.85,
  "requiresCall": false,
  "extractedInfo": {
    "activity": "ランニング",
    "duration": 30,
    "time": "明日朝"
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.2,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(responseText);
    return {
      type: parsed.type || 'unknown',
      confidence: parsed.confidence || 0.5,
      requiresCall: parsed.requiresCall || false,
      extractedInfo: parsed.extractedInfo || {},
    };
  } catch (error) {
    console.error('[IntentDetector] Error:', error);
    
    // フォールバック: 単純なカレンダー予定として扱う
    return {
      type: 'simple_calendar',
      confidence: 0.3,
      requiresCall: false,
      extractedInfo: {},
    };
  }
}

// 意図タイプから日本語説明を取得
export function getIntentDescription(type: IntentType): string {
  const descriptions: Record<IntentType, string> = {
    hospital_appointment: '病院予約',
    redelivery: '再配達依頼',
    salon_appointment: '美容室・サロン予約',
    government_inquiry: '役所問い合わせ',
    restaurant_reservation: 'レストラン予約',
    simple_calendar: 'カレンダー予定',
    unknown: '不明',
  };
  return descriptions[type];
}











