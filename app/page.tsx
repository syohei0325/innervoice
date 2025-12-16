'use client';

import { useState } from 'react';
import InputBar from './components/InputBar';
import MBMeter from './components/MBMeter';
import Footer from './components/Footer';
import ValueReceipt from './components/ValueReceipt';
import LoadingSpinner from './components/LoadingSpinner';
import { Plan } from '@/lib/intent';

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [intentInfo, setIntentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [minutesBackToday, setMinutesBackToday] = useState(0);
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
        setMinutesBackToday(prev => prev + data.minutes_back);
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
        setMinutesBackToday(prev => prev + data.minutes_back);
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
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-5xl">🗓️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Yohaku</h1>
          <p className="text-xl text-gray-700 mb-2">7秒で「決めて、置く」</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            AIがあなたの代わりに必要な電話を行い、その結果を予定・連絡・リマインドへ1タップで落とし込む
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              🎤 音声入力
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              ⚡ 1タップ確定
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              📅 .ics自動生成
            </span>
          </div>
        </div>

        <InputBar onInput={handleInput} isLoading={isLoading || isExecuting} />
        
        {isLoading && (
          <LoadingSpinner text="AI が分析中..." />
        )}
        
        {isExecuting && (
          <LoadingSpinner text="電話中..." />
        )}
        
        {!isLoading && !isExecuting && currentPlan && intentInfo?.requiresCall && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 実行内容の確認</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-gray-900">{intentInfo.description}</p>
                  <p className="text-sm text-gray-600">{currentPlan.summary}</p>
                </div>
              </div>
              
              {currentPlan.actions.map((action, idx) => (
                <div key={idx} className="flex items-start space-x-3 pl-8">
                  <span className="text-lg">
                    {action.action === 'call.place' && '☎️'}
                    {action.action === 'calendar.create' && '📅'}
                    {action.action === 'message.send' && '💬'}
                    {action.action === 'reminder.create' && '⏰'}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">
                      {action.action === 'call.place' && `電話: ${(action as any).purpose || '予約'}`}
                      {action.action === 'calendar.create' && `カレンダー: ${action.title}`}
                      {action.action === 'message.send' && `メッセージ: ${action.to}へ`}
                      {action.action === 'reminder.create' && `リマインダー: ${action.note}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmCall}
                disabled={isExecuting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isExecuting ? '実行中...' : '電話して予約'}
              </button>
              <button
                onClick={() => setCurrentPlan(null)}
                disabled={isExecuting}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
        
        <MBMeter minutesBack={minutesBackToday} />
      </div>
      <Footer />
      
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
