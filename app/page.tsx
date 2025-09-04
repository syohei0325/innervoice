'use client';

import { useState } from 'react';
import InputBar from './components/InputBar';
import ProposalList from './components/ProposalList';
import MBMeter from './components/MBMeter';

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

  const handleConfirm = async (proposalId: string) => {
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

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InnerVoice</h1>
          <p className="text-gray-600">7秒で「決めて、置く」</p>
        </div>

        <InputBar onInput={handleInput} isLoading={isLoading} />
        
        {proposals.length > 0 && (
          <ProposalList proposals={proposals} onConfirm={handleConfirm} />
        )}
        
        <MBMeter minutesBack={minutesBackToday} />
      </div>
    </main>
  );
}
