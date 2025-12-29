'use client';

import { useState } from 'react';

/**
 * Action Cloud Dashboard（phase1）
 * 
 * シンプルなテスト用ダッシュボード
 */
export default function DashboardPage() {
  const [input, setInput] = useState('');
  const [planResponse, setPlanResponse] = useState<any>(null);
  const [approveResponse, setApproveResponse] = useState<any>(null);
  const [confirmResponse, setConfirmResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    setPlanResponse(null);
    setApproveResponse(null);
    setConfirmResponse(null);

    try {
      const res = await fetch('/api/v1/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          context: {
            tenant_id: 'tenant_demo_001',
            user_id: 'user_demo_001',
            tz: 'Asia/Tokyo',
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Plan generation failed: ${res.status}`);
      }

      const data = await res.json();
      setPlanResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!planResponse?.plans?.[0]?.id) {
      setError('No plan to approve');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planResponse.plans[0].id,
          tenant_id: 'tenant_demo_001',
          user_id: 'user_demo_001',
        }),
      });

      if (!res.ok) {
        throw new Error(`Approval failed: ${res.status}`);
      }

      const data = await res.json();
      setApproveResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!planResponse?.plans?.[0]?.id || !approveResponse?.approve_id) {
      setError('No plan or approval to confirm');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planResponse.plans[0].id,
          approve_id: approveResponse.approve_id,
          idempotency_key: `demo_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        throw new Error(`Confirm failed: ${res.status}`);
      }

      const data = await res.json();
      setConfirmResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Yohaku Action Cloud
          </h1>
          <p className="text-gray-600">
            phase1 / Exit-first / Private β
          </p>
        </div>

        {/* Input */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Step 1: Plan生成</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: Send webhook to https://example.com/webhook when order is created"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={handleGeneratePlan}
            disabled={isLoading || !input.trim()}
            className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Plan Response */}
        {planResponse && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Plan Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(planResponse, null, 2)}
            </pre>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="mt-4 w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Step 2: Approve
            </button>
          </div>
        )}

        {/* Approve Response */}
        {approveResponse && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Approval Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(approveResponse, null, 2)}
            </pre>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Step 3: Confirm
            </button>
          </div>
        )}

        {/* Confirm Response */}
        {confirmResponse && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Confirm Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(confirmResponse, null, 2)}
            </pre>
            {confirmResponse.success && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                ✅ Execution completed successfully!
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Docs:{' '}
            <a href="/docs" className="text-blue-600 hover:underline">
              docs.yohaku.app
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}










