// Google Analytics 4 設定
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// ページビュー追跡
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// カスタムイベント追跡
export const event = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      ...parameters,
      app_name: 'InnerVoice',
      app_version: '0.2.0-alpha.1',
    });
  }
};

// InnerVoice 専用イベント
export const trackInnerVoiceEvent = (
  eventType: 'input_started' | 'proposals_shown' | 'plan_generated' | 'confirmed' | 'ics_downloaded' | 'minutes_back_added',
  metadata?: Record<string, any>
) => {
  event(`iv_${eventType}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
  });
  
  // コンソールログ（開発環境）
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Analytics: iv_${eventType}`, metadata);
  }
};
