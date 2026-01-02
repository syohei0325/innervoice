#!/usr/bin/env bash
# Webhook Jobs確認スクリプト

echo "=== Webhook Jobs Status ==="
/opt/homebrew/opt/postgresql@16/bin/psql -d yohaku -c "
SELECT 
  job_id, 
  status, 
  attempts, 
  CASE 
    WHEN last_error IS NULL THEN '(none)'
    WHEN length(last_error) > 50 THEN substring(last_error, 1, 50) || '...'
    ELSE last_error
  END as last_error,
  to_char(updated_at, 'HH24:MI:SS') as updated_at
FROM webhook_jobs 
ORDER BY created_at DESC 
LIMIT 10;
"

echo ""
echo "=== Status Summary ==="
/opt/homebrew/opt/postgresql@16/bin/psql -d yohaku -c "
SELECT status, count(*) 
FROM webhook_jobs 
GROUP BY status 
ORDER BY status;
"

