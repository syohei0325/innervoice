// 通話プロバイダー: Twilio / Bland.ai / Vapi などを抽象化
// CURSOR_SEED.md: Call-first / 代行電話機能

export interface CallRequest {
  phone: string;
  purpose: string; // "病院予約" | "再配達" | "美容室予約" | "役所問い合わせ"
  details: {
    preferredTime?: string;
    patientName?: string;
    trackingNumber?: string;
    address?: string;
    [key: string]: any;
  };
  ethicsPrefix: string; // Call Ethics前置き
}

export interface CallResult {
  status: 'success' | 'failed' | 'busy' | 'no_answer' | 'blocked';
  summary: string;
  transcript?: string;
  appointmentTime?: string; // 予約が取れた場合
  confirmationNumber?: string;
  duration_sec?: number;
  cost_usd?: number;
  provider: string;
}

export interface CallProvider {
  name: string;
  placeCall(request: CallRequest): Promise<CallResult>;
  checkStatus(callId: string): Promise<CallResult>;
}

// Mock Provider（開発用）
export class MockCallProvider implements CallProvider {
  name = 'mock';

  async placeCall(request: CallRequest): Promise<CallResult> {
    console.log('[MockCallProvider] Placing call:', request);
    
    // 開発環境では即座に成功を返す
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機

    return {
      status: 'success',
      summary: `${request.purpose}の電話が完了しました。予約が確定しました。`,
      transcript: `[自動応答] こちらは${request.purpose}の受付です。ご予約を承りました。`,
      appointmentTime: request.details.preferredTime || '明日 10:00',
      confirmationNumber: `MOCK-${Date.now()}`,
      duration_sec: 45,
      cost_usd: 0.0,
      provider: 'mock',
    };
  }

  async checkStatus(callId: string): Promise<CallResult> {
    return {
      status: 'success',
      summary: '通話完了',
      provider: 'mock',
    };
  }
}

// Twilio Provider（本番用）
export class TwilioCallProvider implements CallProvider {
  name = 'twilio';
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  async placeCall(request: CallRequest): Promise<CallResult> {
    // TODO: Twilio API呼び出し実装
    // https://www.twilio.com/docs/voice/api
    throw new Error('Twilio integration not yet implemented');
  }

  async checkStatus(callId: string): Promise<CallResult> {
    throw new Error('Twilio integration not yet implemented');
  }
}

// Bland.ai Provider（AI電話特化）
export class BlandAICallProvider implements CallProvider {
  name = 'bland_ai';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async placeCall(request: CallRequest): Promise<CallResult> {
    // TODO: Bland.ai API呼び出し実装
    // https://docs.bland.ai/
    throw new Error('Bland.ai integration not yet implemented');
  }

  async checkStatus(callId: string): Promise<CallResult> {
    throw new Error('Bland.ai integration not yet implemented');
  }
}

// Provider Factory
export function getCallProvider(): CallProvider {
  const provider = process.env.YOHAKU_CALL_PROVIDER || 'mock';
  
  switch (provider) {
    case 'twilio':
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM_NUMBER) {
        console.warn('[CallProvider] Twilio credentials missing, falling back to mock');
        return new MockCallProvider();
      }
      return new TwilioCallProvider(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
        process.env.TWILIO_FROM_NUMBER
      );
    
    case 'bland_ai':
      if (!process.env.BLAND_AI_API_KEY) {
        console.warn('[CallProvider] Bland.ai API key missing, falling back to mock');
        return new MockCallProvider();
      }
      return new BlandAICallProvider(process.env.BLAND_AI_API_KEY);
    
    case 'mock':
    default:
      return new MockCallProvider();
  }
}

