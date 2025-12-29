-- Migration: KYA (Know Your Agent) + Webhook Timestamp Replay Protection
-- Date: 2025-12-29
-- Description: 
--   1. LedgerEventにKYA関連フィールド追加（executor/principal）
--   2. ApprovalsにKYA principal情報追加
--   3. ReceiptsにKYA情報追加
--   4. WebhookJobsにtimestamp追加（replay protection）

-- =========================================
-- 1. LedgerEvent: KYA追加
-- =========================================

-- KYA (Know Your Agent) - phase1必須
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS executor_api_key_id TEXT;
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS executor_agent_id_hash TEXT;
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS executor_agent_label TEXT;
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS principal_user_id TEXT;
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS principal_email_hash TEXT;
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS policy_ref TEXT;
ALTER TABLE ledger_events ADD COLUMN IF NOT EXISTS risk_tier TEXT;

-- actor列を削除（KYAに統合）
ALTER TABLE ledger_events DROP COLUMN IF EXISTS actor;

-- Index追加
CREATE INDEX IF NOT EXISTS idx_ledger_events_executor_api_key_id ON ledger_events(executor_api_key_id, ts);

-- =========================================
-- 2. Approvals: KYA Principal追加
-- =========================================

ALTER TABLE approvals ADD COLUMN IF NOT EXISTS approved_by_user_id TEXT;
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS approved_by_email_hash TEXT;
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS approved_via TEXT;
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- =========================================
-- 3. Receipts: KYA追加
-- =========================================

ALTER TABLE receipts ADD COLUMN IF NOT EXISTS executor_api_key_id TEXT;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS executor_agent_label TEXT;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS principal_user_id TEXT;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS policy_ref TEXT;

-- Index追加
CREATE INDEX IF NOT EXISTS idx_receipts_executor_api_key_id ON receipts(executor_api_key_id);

-- =========================================
-- 4. WebhookJobs: Timestamp追加（replay protection）
-- =========================================

ALTER TABLE webhook_jobs ADD COLUMN IF NOT EXISTS timestamp BIGINT DEFAULT 0;

-- =========================================
-- 完了
-- =========================================

-- この migration は Prisma schema と同期しています
-- 次回の migrate dev で自動的に適用されます

