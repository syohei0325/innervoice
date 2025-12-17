#!/usr/bin/env bash

# Action Cloud API テスト
set -e

echo "🚀 Action Cloud API Test"
echo "========================"
echo ""

BASE_URL="http://localhost:3000"

# Step 1: Plan生成
echo "📝 Step 1: Plan生成"
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Send webhook to https://example.com/webhook when order is created",
    "context": {
      "tenant_id": "tenant_demo_001",
      "user_id": "user_demo_001",
      "tz": "Asia/Tokyo"
    }
  }')

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
    \"tenant_id\": \"tenant_demo_001\",
    \"user_id\": \"user_demo_001\"
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
echo ""

echo "========================"
echo "✅ テスト完了！"
echo ""
echo "次のステップ:"
echo "1. ブラウザで http://localhost:3000/dashboard を開く"
echo "2. 同じフローをUIでテスト"
echo "3. Receiver Starter Kit をセットアップ"

