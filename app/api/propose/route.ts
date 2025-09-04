export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { text, context } = await request.json();
    
    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    // Generate proposals using OpenAI
    const systemPrompt = `あなたは"時間を返す"アシスタント。ユーザーの入力から2つの実行可能な提案を生成します。
出力は必ずJSON形式で、proposals配列に2つの提案を含めてください。
各提案には以下を含める：
- id: ユニークID
- title: 簡潔なタイトル（20文字以内）
- slot: 開始時刻（HH:MM形式）
- duration_min: 所要時間（分）

コンテキスト: ${JSON.stringify(context)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      // Fallback proposals if JSON parsing fails
      parsedResponse = {
        proposals: [
          {
            id: uuidv4(),
            title: "提案A（15分）",
            slot: "09:00",
            duration_min: 15
          },
          {
            id: uuidv4(),
            title: "提案B（30分）", 
            slot: "14:00",
            duration_min: 30
          }
        ]
      };
    }

    // Ensure proposals have required fields
    const proposals = parsedResponse.proposals?.map((p: any) => ({
      id: p.id || uuidv4(),
      title: p.title || 'タスク',
      slot: p.slot || '09:00',
      duration_min: p.duration_min || 15
    })) || [];

    const latency = Date.now() - startTime;

    return NextResponse.json({
      proposals: proposals.slice(0, 2), // Ensure only 2 proposals
      latency_ms: latency
    });
  } catch (error) {
    console.error('Error in /api/propose:', error);
    
    // Fallback proposals
    const proposals = [
      {
        id: uuidv4(),
        title: "提案A（15分）",
        slot: "09:00", 
        duration_min: 15
      },
      {
        id: uuidv4(),
        title: "提案B（30分）",
        slot: "14:00",
        duration_min: 30
      }
    ];

    return NextResponse.json({
      proposals,
      latency_ms: Date.now() - startTime
    });
  }
}
