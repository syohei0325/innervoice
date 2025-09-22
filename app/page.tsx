'use client';

import { useState } from 'react';
import InputBar from './components/InputBar';
import ProposalList from './components/ProposalList';
import MBMeter from './components/MBMeter';
import ConfirmSheet from './components/ConfirmSheet';
import { Plan } from '@/lib/intent';

export type Proposal = {
  id: string;
  title: string;
  slot: string;
  duration_min: number;
};

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minutesBackToday, setMinutesBackToday] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleInput = async (text: string) => {
    setIsLoading(true);
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

      if (!response.ok) throw new Error('Failed to get proposals');
      
      const data = await response.json();
      setProposals(data.proposals);
      
      // Track event: proposals_shown
      // TODO: Add telemetry
    } catch (error) {
      console.error('Error getting proposals:', error);
      // TODO: Show fallback proposals
    } finally {
      setIsLoading(false);
    }
  };

  const handleProposalClick = async (proposalId: string) => {
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
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId }),
      });

      if (!response.ok) throw new Error('Failed to confirm proposal');
      
      const data = await response.json();
      
      // Download .ics file
      if (data.ics_url) {
        window.open(data.ics_url, '_blank');
      }
      
      // Update minutes back
      if (data.minutes_back) {
        setMinutesBackToday(prev => prev + data.minutes_back);
      }
      
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
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan_id: planId,
          enabled_actions: enabledActions 
        }),
      });

      if (!response.ok) throw new Error('Failed to execute plan');
      
      const data = await response.json();
      
      // Show results
      if (data.execution_status === 'success') {
        alert(`✅ ${enabledActions.length}件のアクションが成功しました！`);
      } else {
        alert(`⚠️ 一部のアクションが失敗しました。詳細をご確認ください。`);
      }
      
      // Download .ics file if available
      if (data.ics_url) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InnerVoice</h1>
          <p className="text-gray-600">7秒で「決めて、置く」</p>
        </div>

        <InputBar onInput={handleInput} isLoading={isLoading} />
        
        {proposals.length > 0 && (
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
    </main>
  );
}
