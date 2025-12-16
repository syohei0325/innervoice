'use client';

import { useState } from 'react';
import InputBar from './components/InputBar';
import ProposalList from './components/ProposalList';
import MBMeter from './components/MBMeter';
import ConfirmSheet from './components/ConfirmSheet';
import Footer from './components/Footer';
import ValueReceipt from './components/ValueReceipt';
import LoadingSpinner from './components/LoadingSpinner';
import { Plan } from '@/lib/intent';

export type Proposal = {
  id: string;
  title: string;
  slot: string;
  duration_min: number;
};

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [intentInfo, setIntentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [minutesBackToday, setMinutesBackToday] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Value Receipt state
  const [showValueReceipt, setShowValueReceipt] = useState(false);
  const [lastMinutesBack, setLastMinutesBack] = useState(0);
  const [lastFrictionSaved, setLastFrictionSaved] = useState<Array<{ type: string; qty: number; evidence: string }>>([]);

  const handleInput = async (text: string) => {
    setIsLoading(true);
    setProposals([]);
    setPlans([]);
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
        throw new Error('Failed to get proposals');
      }
      
      const data = await response.json();
      console.log('[Home] Received data:', data);
      
      // 新しいAPI形式（intent + plans）
      if (data.intent && data.plans) {
        setIntentInfo(data.intent);
        setPlans(data.plans);
        
        // 後方互換性のため、proposalsも生成
        const legacyProposals = data.plans.map((plan: Plan) => ({
          id: plan.id,
          title: plan.summary,
          slot: '09:00', // デフォルト値
          duration_min: 30,
        }));
        setProposals(legacyProposals);
      } 
      // 古いAPI形式（proposals）
      else if (data.proposals && data.proposals.length > 0) {
        setProposals(data.proposals);
      } 
      // フォールバック
      else {
        setProposals([
          {
            id: 'fallback-1',
            title: text.substring(0, 30),
            slot: '09:00',
            duration_min: 30,
          },
          {
            id: 'fallback-2',
            title: text.substring(0, 30),
            slot: '14:00',
            duration_min: 30,
          },
        ]);
        alert('⚠️ AI提案の生成に失敗しました。フォールバック提案を表示しています。');
      }
      
      // Track event: proposals_shown
      // TODO: Add telemetry
    } catch (error) {
      console.error('Error getting proposals:', error);
      
      // Show fallback proposals
      setProposals([
        {
          id: 'fallback-1',
          title: text.substring(0, 30),
          slot: '09:00',
          duration_min: 30,
        },
        {
          id: 'fallback-2',
          title: text.substring(0, 30),
          slot: '14:00',
          duration_min: 30,
        },
      ]);
      alert('⚠️ 提案の取得に失敗しました。フォールバック提案を表示しています。\n\n環境変数（OPENAI_API_KEY）が正しく設定されているか確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProposalClick = async (proposalId: string) => {
    // 新しいAPI形式: plansが既にある場合
    if (plans.length > 0) {
      const plan = plans.find(p => p.id === proposalId);
      if (plan) {
        setSelectedPlan(plan);
        return;
      }
    }
    
    // MVP+: Generate plans from proposal
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          proposal_id: proposalId,
          context: { tz: 'Asia/Tokyo' }
        }),
      });

      if (!response.ok) throw new Error('Failed to generate plans');
      
      const data = await response.json();
      
      if (data.plans && data.plans.length > 0) {
        // Show first plan in ConfirmSheet
        setSelectedPlan(data.plans[0]);
      }
    } catch (error) {
      console.error('Error generating plans:', error);
      // Fallback to MVP behavior
      handleConfirmMVP(proposalId);
    }
  };

  const handleConfirmMVP = async (proposalId: string) => {
    // Original MVP behavior (fallback)
    try {
      // 提案データを取得
      const proposal = proposals.find(p => p.id === proposalId);
      
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          proposal_id: proposalId,
          proposal: proposal // 提案データも送信
        }),
      });

      if (!response.ok) throw new Error('Failed to confirm proposal');
      
      const data = await response.json();
      
      // Download .ics file
      if (data.ics_content) {
        // 直接.icsファイルをダウンロード
        const blob = new Blob([data.ics_content], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `innervoice-${data.event_id}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (data.ics_url) {
        window.open(data.ics_url, '_blank');
      }
      
      // Update minutes back
      if (data.minutes_back) {
        setMinutesBackToday(prev => prev + data.minutes_back);
        setLastMinutesBack(data.minutes_back);
      }
      
      // Update FEA (Friction Events Avoided)
      if (data.friction_saved) {
        setLastFrictionSaved(data.friction_saved);
      }
      
      // Show Value Receipt
      setShowValueReceipt(true);
      
      // Reset proposals
      setProposals([]);
      
      // Track events: confirmed, ics_downloaded, minutes_back_added
      // TODO: Add telemetry
    } catch (error) {
      console.error('Error confirming proposal:', error);
    }
  };

  const handlePlanConfirm = async (planId: string, enabledActions: string[]) => {
    setIsExecuting(true);
    try {
      // Planを取得
      const plan = plans.find(p => p.id === planId) || selectedPlan;
      
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan_id: planId,
          plan: plan, // Planデータも送信
          enabled_actions: enabledActions 
        }),
      });

      if (!response.ok) throw new Error('Failed to execute plan');
      
      const data = await response.json();
      
      // 通話結果を表示
      if (data.call_summary) {
        alert(`📞 通話完了\n\n${data.call_summary}`);
      }
      
      // Update minutes back
      if (data.minutes_back) {
        setMinutesBackToday(prev => prev + data.minutes_back);
        setLastMinutesBack(data.minutes_back);
      }
      
      // Update FEA (Friction Events Avoided)
      if (data.friction_saved) {
        setLastFrictionSaved(data.friction_saved);
      }
      
      // Show Value Receipt
      setShowValueReceipt(true);
      
      // Show results (only for errors)
      if (data.execution_status !== 'success' && !data.ics_url) {
        alert(`⚠️ 一部のアクションが失敗しました。詳細をご確認ください。`);
      }
      
      // Download .ics file if available
      if (data.ics_content) {
        // 直接.icsファイルをダウンロード
        const blob = new Blob([data.ics_content], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `innervoice-${data.event_id || Date.now()}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (data.ics_url) {
        window.open(data.ics_url, '_blank');
      }
      
      // Update minutes back
      if (data.minutes_back) {
        setMinutesBackToday(prev => prev + data.minutes_back);
      }
      
      // Reset states
      setSelectedPlan(null);
      setProposals([]);
      
    } catch (error) {
      console.error('Error executing plan:', error);
      alert('❌ プランの実行に失敗しました。');
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePlanCancel = () => {
    setSelectedPlan(null);
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

        <InputBar onInput={handleInput} isLoading={isLoading} />
        
        {isLoading && (
          <LoadingSpinner text="AI が提案を生成中..." />
        )}
        
        {!isLoading && proposals.length > 0 && (
          <ProposalList proposals={proposals} onConfirm={handleProposalClick} />
        )}
        
        {selectedPlan && (
          <ConfirmSheet
            plan={selectedPlan}
            onConfirm={handlePlanConfirm}
            onCancel={handlePlanCancel}
            isExecuting={isExecuting}
          />
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
