'use client';

import { useEffect, useState } from 'react';

/**
 * Status Page - システム状態確認
 */
export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    const checks: any = {
      timestamp: new Date().toISOString(),
      checks: {},
    };

    // Check /v1/plan
    try {
      const res = await fetch('/api/v1/plan');
      checks.checks.plan_api = {
        status: res.ok ? 'ok' : 'error',
        response: await res.json(),
      };
    } catch (err) {
      checks.checks.plan_api = {
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }

    // Check /v1/approve
    try {
      const res = await fetch('/api/v1/approve');
      checks.checks.approve_api = {
        status: res.ok ? 'ok' : 'error',
        response: await res.json(),
      };
    } catch (err) {
      checks.checks.approve_api = {
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }

    // Check /v1/confirm
    try {
      const res = await fetch('/api/v1/confirm');
      checks.checks.confirm_api = {
        status: res.ok ? 'ok' : 'error',
        response: await res.json(),
      };
    } catch (err) {
      checks.checks.confirm_api = {
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }

    // Environment checks
    checks.environment = {
      phase: process.env.NEXT_PUBLIC_YOHAKU_PHASE || 'unknown',
      node_env: process.env.NODE_ENV,
    };

    setStatus(checks);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            System Status
          </h1>
          <p className="text-gray-600">
            Yohaku Action Cloud - phase1
          </p>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>

        {/* Status Display */}
        {status && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Status Report</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a
              href="/dashboard"
              className="block text-blue-600 hover:underline"
            >
              → Dashboard (テスト用UI)
            </a>
            <a
              href="/"
              className="block text-blue-600 hover:underline"
            >
              → Home (旧B2C UI)
            </a>
            <a
              href="/api/v1/plan"
              className="block text-blue-600 hover:underline"
              target="_blank"
            >
              → /api/v1/plan (API)
            </a>
            <a
              href="/api/v1/approve"
              className="block text-blue-600 hover:underline"
              target="_blank"
            >
              → /api/v1/approve (API)
            </a>
            <a
              href="/api/v1/confirm"
              className="block text-blue-600 hover:underline"
              target="_blank"
            >
              → /api/v1/confirm (API)
            </a>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">
            ⚠️ セットアップが必要
          </h2>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>
              <strong>1. 環境変数を設定してください:</strong>
            </p>
            <pre className="bg-yellow-100 p-2 rounded text-xs overflow-x-auto">
{`# .env.local に以下を追加:
YOHAKU_PHASE=phase1
OPENAI_API_KEY=sk-your-valid-key-here
WEBHOOK_SIGNING_SECRET=$(openssl rand -hex 32)
YOHAKU_SERVER_SECRET=$(openssl rand -hex 32)
YOHAKU_REGION=JP`}
            </pre>
            <p className="mt-4">
              <strong>2. サーバーを再起動してください:</strong>
            </p>
            <pre className="bg-yellow-100 p-2 rounded text-xs">
{`npm run dev`}
            </pre>
            <p className="mt-4">
              <strong>3. このページをリフレッシュしてください</strong>
            </p>
          </div>
        </div>

        {/* Documentation */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Docs:{' '}
            <a href="/QUICKSTART.md" className="text-blue-600 hover:underline">
              QUICKSTART.md
            </a>
            {' | '}
            <a href="/SETUP_CHECKLIST.md" className="text-blue-600 hover:underline">
              SETUP_CHECKLIST.md
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}










