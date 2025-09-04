// Telemetry events for InnerVoice MVP
export type TelemetryEvent = 
  | 'input_started'
  | 'proposals_shown' 
  | 'confirmed'
  | 'ics_downloaded'
  | 'minutes_back_added'
  | 'error'
  | 'nps_submitted';

export interface TelemetryData {
  event: TelemetryEvent;
  properties?: Record<string, any>;
  userId?: string;
}

export class Telemetry {
  private static instance: Telemetry;
  private writeKey: string;
  
  constructor() {
    this.writeKey = process.env.TELEMETRY_WRITE_KEY || '';
  }
  
  static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }
  
  track(data: TelemetryData): void {
    if (!this.writeKey) {
      console.warn('Telemetry: No write key configured');
      return;
    }
    
    // For MVP, just log events
    // TODO: Integrate with PostHog or GA4
    console.log('Telemetry Event:', {
      timestamp: new Date().toISOString(),
      ...data
    });
    
    // Future: Send to actual telemetry service
    // await fetch('https://api.posthog.com/capture/', { ... });
  }
}

export const telemetry = Telemetry.getInstance();
