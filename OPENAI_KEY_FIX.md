# OpenAI APIキー問題の修正方法

## 🔍 問題の原因

**OS環境変数に古いAPIキーが残っている**ため、`.env.local`のキーが無視されています。

```bash
# 確認コマンド
$ printenv OPENAI_API_KEY
sk-proj-I72YX4Xjuj-...（古いキー）

$ grep OPENAI_API_KEY .env.local
OPENAI_API_KEY=sk-proj-LqwNo5E8zaH_...（新しいキー）
```

Next.jsは起動時に環境変数を読み込みますが、**OS環境変数が優先**されます。

---

## ✅ 解決方法（2つの選択肢）

### 方法1: Mock モードで5つのチェックを先に通す（推奨）

APIキーの準備に時間がかかる場合、mockモードで先に進められます。

#### 手順

1. `.env.local` を開く
2. 以下を追加：
   ```env
   YOHAKU_PLANNER_MODE=mock
   ```
3. サーバーを再起動：
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

#### Mockモードの動作
- `/v1/plan` がOpenAI呼ばずに固定Planを返す
- Webhook dispatch + Calendar hold の組み合わせ
- チェック2-5（Receiver / Ledger / Metering / Freeze）が全部通る

---

### 方法2: OpenAI APIキーを完全に修正する

#### 手順

1. **新しいAPIキーを取得**
   - https://platform.openai.com/api-keys
   - 古いキーは使わない（削除推奨）

2. **OS環境変数をクリア**
   ```bash
   # 現在のシェルから削除
   unset OPENAI_API_KEY
   
   # ~/.zshrc や ~/.bashrc に export があれば削除
   grep OPENAI_API_KEY ~/.zshrc ~/.bashrc
   ```

3. **`.env.local` を更新**
   ```env
   OPENAI_API_KEY=sk-your-new-valid-key-here
   ```

4. **単体テスト**（サーバー起動前に確認）
   ```bash
   export OPENAI_API_KEY=$(grep OPENAI_API_KEY .env.local | cut -d'=' -f2)
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```
   
   ✅ 200 OK → キー有効  
   ❌ 401 Unauthorized → キー無効

5. **サーバー再起動**
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

---

## 🧪 動作確認

### Plan生成テスト

```bash
curl -X POST http://localhost:3000/api/v1/plan \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Send webhook to https://example.com/webhook when order is created",
    "context": {
      "tenant_id": "tenant_demo_001",
      "user_id": "user_demo_001",
      "tz": "Asia/Tokyo"
    }
  }'
```

#### 期待される結果

**Mockモード**:
```json
{
  "plans": [
    {
      "id": "pl_...",
      "summary": "Webhook dispatch + Calendar hold",
      "actions": [
        {
          "action": "webhook.dispatch",
          "connector_id": "conn_webhook_demo",
          "payload": {...}
        },
        {
          "action": "calendar.hold.create",
          "payload": {...}
        }
      ],
      "confirm_sheet": {...}
    }
  ],
  "latency_ms": 50,
  "phase": "phase1"
}
```

**OpenAIモード**:
```json
{
  "plans": [
    {
      "id": "pl_...",
      "summary": "...",
      "actions": [...],
      "confirm_sheet": {...}
    }
  ],
  "latency_ms": 1200,
  "phase": "phase1"
}
```

---

## 📋 次のステップ

### Mockモードを選んだ場合
1. ✅ チェック1: Plan生成（mock）
2. ✅ チェック2: Receiver Kitで Webhook受信
3. ✅ チェック3: ledger_events が増える
4. ✅ チェック4: usage_counters_daily が冪等
5. ✅ チェック5: Freeze が効く
6. → **"30分導入"を録画** → **設計パートナー3社にアプローチ**

### OpenAIモードを選んだ場合
- 同じ流れだが、Plan生成がLLMベースになる
- latency_ms が 1000-2000ms になる（正常）

---

## 🎯 推奨

**今すぐ**: Mockモードで5つのチェックを通す  
**並行作業**: OpenAI APIキーを整理（時間がある時に）

理由:
- 5つのチェックの本質は「Webhook / Ledger / Metering / Freeze」
- Plan生成の中身（LLM vs Mock）は本質じゃない
- 設計パートナーに見せるのは「Receiver Kitの30分導入」

---

## ⚠️ 注意事項

### APIキーは絶対に公開しない
- GitHub にコミットしない（`.gitignore` で除外済み）
- ログに全文を出さない（マスクする）
- スクショに写り込まない

### 環境変数の優先順位
1. OS環境変数（`export OPENAI_API_KEY=...`）← **最優先**
2. `.env.local`（Next.jsが読む）
3. `.env`（フォールバック）

Next.jsは起動時に読み込むため、**変更後は必ず再起動**。

---

**結論**: Mockモードで先に進めば、今すぐ5つのチェックが通ります！

