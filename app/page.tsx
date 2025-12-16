'use client';

import { useState } from 'react';
import InputBar from './components/InputBar';
import ValueReceipt from './components/ValueReceipt';
import { Plan } from '@/lib/intent';

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [intentInfo, setIntentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Value Receipt state
  const [showValueReceipt, setShowValueReceipt] = useState(false);
  const [lastMinutesBack, setLastMinutesBack] = useState(0);
  const [lastFrictionSaved, setLastFrictionSaved] = useState<Array<{ type: string; qty: number; evidence: string }>>([]);

  const handleInput = async (text: string) => {
    setIsLoading(true);
    setCurrentPlan(null);
    setIntentInfo(null);
    
    try {
      const response = await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          context: {
            tz: 'Asia/Tokyo',
            ng: ['22:00-06:30'],
            mobility: 'walk',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get plan');
      }
      
      const data = await response.json();
      console.log('[Home] Received data:', data);
      
      // 新しいAPI形式（intent + plan）
      if (data.intent && data.plan) {
        setIntentInfo(data.intent);
        setCurrentPlan(data.plan);
        
        // 電話が必要な場合は、すぐに確認画面を表示
        if (data.intent.requiresCall) {
          // 確認画面に進む（自動的に表示される）
        } else {
          // 単純なカレンダー予定の場合は、即座に実行
          await executeSimplePlan(data.plan);
        }
      } 
      // フォールバック
      else {
        const fallbackPlan: Plan = {
          id: `plan_${Date.now()}`,
          summary: text.substring(0, 30),
          actions: [
            {
              action: 'calendar.create',
              title: text.substring(0, 50),
              start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              duration_min: 30,
            },
          ],
          reasons: [],
        };
        setCurrentPlan(fallbackPlan);
        alert('⚠️ AI提案の生成に失敗しました。フォールバックプランを表示しています。');
      }
      
      // Track event: plan_shown
      // TODO: Add telemetry
    } catch (error) {
      console.error('Error getting plan:', error);
      
      // Show fallback plan
      const fallbackPlan: Plan = {
        id: `plan_${Date.now()}`,
        summary: text.substring(0, 30),
        actions: [
          {
            action: 'calendar.create',
            title: text.substring(0, 50),
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration_min: 30,
          },
        ],
        reasons: [],
      };
      setCurrentPlan(fallbackPlan);
      alert('⚠️ プランの取得に失敗しました。\n\n環境変数（OPENAI_API_KEY）が正しく設定されているか確認してください。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 単純なプランを即座に実行
  const executeSimplePlan = async (plan: Plan) => {
    setIsExecuting(true);
    try {
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan_id: plan.id,
          plan: plan,
          enabled_actions: plan.actions.map(a => a.action)
        }),
      });

      if (!response.ok) throw new Error('Failed to execute plan');
      
      const data = await response.json();
      
      // Download .ics file
      if (data.ics_content) {
        const blob = new Blob([data.ics_content], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yohaku-${data.event_id || Date.now()}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      // Update minutes back
      if (data.minutes_back) {
        setLastMinutesBack(data.minutes_back);
      }
      
      // Update FEA
      if (data.friction_saved) {
        setLastFrictionSaved(data.friction_saved);
      }
      
      // Show Value Receipt
      setShowValueReceipt(true);
      
      // Reset
      setCurrentPlan(null);
      
    } catch (error) {
      console.error('Error executing plan:', error);
      alert('❌ プランの実行に失敗しました。');
    } finally {
      setIsExecuting(false);
    }
  };

  // 電話が必要なプランを確定
  const handleConfirmCall = async () => {
    if (!currentPlan) return;
    
    setIsExecuting(true);
    try {
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan_id: currentPlan.id,
          plan: currentPlan,
          enabled_actions: currentPlan.actions.map(a => a.action)
        }),
      });

      if (!response.ok) throw new Error('Failed to execute plan');
      
      const data = await response.json();
      
      // 通話結果を表示
      if (data.call_summary) {
        alert(`📞 通話完了\n\n${data.call_summary}`);
      }
      
      // Download .ics file
      if (data.ics_content) {
        const blob = new Blob([data.ics_content], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yohaku-${data.event_id || Date.now()}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      // Update minutes back
      if (data.minutes_back) {
        setLastMinutesBack(data.minutes_back);
      }
      
      // Update FEA
      if (data.friction_saved) {
        setLastFrictionSaved(data.friction_saved);
      }
      
      // Show Value Receipt
      setShowValueReceipt(true);
      
      // Reset
      setCurrentPlan(null);
      
    } catch (error) {
      console.error('Error executing plan:', error);
      alert('❌ プランの実行に失敗しました。');
    } finally {
      setIsExecuting(false);
    }
  };


  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">Yohaku</h1>
        </div>

        <InputBar onInput={handleInput} isLoading={isLoading || isExecuting} />
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-4xl animate-pulse">⏳</div>
          </div>
        )}
        
        {isExecuting && (
          <div className="text-center py-12">
            <div className="text-4xl animate-pulse">📞</div>
          </div>
        )}
        
        {!isLoading && !isExecuting && currentPlan && intentInfo?.requiresCall && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-4 mb-6">
              {currentPlan.actions.map((action, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {action.action === 'call.place' && '📞'}
                    {action.action === 'calendar.create' && '📅'}
                    {action.action === 'message.send' && '💬'}
                    {action.action === 'reminder.create' && '⏰'}
                  </span>
                  <div>
                    <p className="text-gray-900">
                      {action.action === 'call.place' && `${(action as any).purpose || '予約'}`}
                      {action.action === 'calendar.create' && `${action.title}`}
                      {action.action === 'message.send' && `${action.to}へメッセージ`}
                      {action.action === 'reminder.create' && `${action.note}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmCall}
                disabled={isExecuting}
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isExecuting ? '...' : '実行'}
              </button>
              <button
                onClick={() => setCurrentPlan(null)}
                disabled={isExecuting}
                className="px-8 py-4 rounded-2xl font-medium text-gray-700 hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Value Receipt - 軽量トースト */}
      <ValueReceipt
        minutesBack={lastMinutesBack}
        frictionSaved={lastFrictionSaved}
        show={showValueReceipt}
        onClose={() => setShowValueReceipt(false)}
      />
    </main>
  );
}
