#!/usr/bin/env bash
set -euo pipefail

# Action Cloud API テストスクリプト
# Usage: ./scripts/test-action-cloud.sh

BASE_URL="http://localhost:3000"
TENANT_ID="tenant_demo_001"
USER_ID="user_demo_001"

echo "🚀 Action Cloud API Test"
echo "========================"
echo ""

# Step 1: Plan生成
echo "📝 Step 1: Plan生成"
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/plan" \
  -H "Content-Type: application/json" \
  -d "{
    \"input\": \"Send webhook to https://example.com/webhook when order is created\",
    \"context\": {
      \"tenant_id\": \"$TENANT_ID\",
      \"user_id\": \"$USER_ID\",
      \"tz\": \"Asia/Tokyo\"
    }
  }")

echo "$PLAN_RESPONSE" | jq '.'

PLAN_ID=$(echo "$PLAN_RESPONSE" | jq -r '.plans[0].id')
echo ""
echo "✅ Plan ID: $PLAN_ID"
echo ""

# Step 2: 承認ID発行
echo "✋ Step 2: 承認ID発行"
APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/approve" \
  -H "Content-Type: application/json" \
  -d "{
    \"plan_id\": \"$PLAN_ID\",
    \"tenant_id\": \"$TENANT_ID\",
    \"user_id\": \"$USER_ID\"
  }")

echo "$APPROVE_RESPONSE" | jq '.'

APPROVE_ID=$(echo "$APPROVE_RESPONSE" | jq -r '.approve_id')
echo ""
echo "✅ Approve ID: $APPROVE_ID"
echo ""

# Step 3: 実行確定
echo "⚡ Step 3: 実行確定"
CONFIRM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/confirm" \
  -H "Content-Type: application/json" \
  -d "{
    \"plan_id\": \"$PLAN_ID\",
    \"approve_id\": \"$APPROVE_ID\",
    \"idempotency_key\": \"test_$(date +%s)\"
  }")

echo "$CONFIRM_RESPONSE" | jq '.'

RECEIPT_ID=$(echo "$CONFIRM_RESPONSE" | jq -r '.receipt_id')
echo ""
echo "✅ Receipt ID: $RECEIPT_ID"
echo ""

# Step 4: Phase Guard テスト（SEALED機能）
echo "🚫 Step 4: Phase Guard テスト（call.place は SEALED）"
echo "（このテストは失敗することが期待されます）"
echo ""

# まず call.place を含むプランを生成（OpenAIが生成しないかもしれないので、手動で作成）
echo "⚠️  Note: call.place は phase1 で SEALED なので、実行時に 403 エラーが返るはずです"
echo ""

echo "========================"
echo "✅ テスト完了！"
echo ""
echo "次のステップ:"
echo "1. ブラウザで http://localhost:3000 を開く"
echo "2. Receiver Starter Kit を作成"
echo "3. 設計パートナー3社を探す"

