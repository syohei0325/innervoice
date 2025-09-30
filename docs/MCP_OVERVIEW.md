# MCP Overview（InnerVoice）

## 目的
- InnerVoiceのPlan/Actionを **MCPツール** として公開し、**複数LLM/音声クライアント**から安全に実行できるようにする。

## ツール一覧（v1）
- `calendar.create` — 予定を作成
- `message.send` — メッセージ送信
- `reminder.create` — リマインド登録

## Plan→MCP ツールのマッピング
- `calendar.create` ⇔ Plan.actions[].action = "calendar.create"
- `message.send`   ⇔ "message.send"
- `reminder.create`⇔ "reminder.create"

## 接続方法（例）
- **OpenAI Realtime** / **Anthropic Claude** に **MCPサーバURL** を渡すと、上記ツールがそのまま見える。
- 認証は `Authorization: Bearer <API_KEY>`（必要に応じて）を使用。

```json
{
  "mcpServers": [
    { "name": "innervoice-mcp", "url": "wss://mcp.innervoice.app" }
    // ,
    { "name": "innervoice-mcp-local", "url": "ws://127.0.0.1:7777" }
  ]
}
```

## セキュリティ
- すべてのMCP通信はTLS/WSS暗号化
- API Key認証 + Rate Limiting
- ツール実行前に**ユーザー承認**（Confirm once UI）
- 監査ログ記録（executions テーブル）

## 実装ステータス
- 🚧 **v0.2.0-alpha.1**: Intent/Plan/Execution の基礎実装（DB schema + API）
- 🔜 **v0.3.0**: MCP Server 実装（remote/local）
- 🔜 **v0.4.0**: OpenAI Realtime / Claude 統合
