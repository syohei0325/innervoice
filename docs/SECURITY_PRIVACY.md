# セキュリティ / プライバシー

- **データ最小化**：音声は即テキスト化→**要約のみ保存**（原音は既定保存しない/任意ONでも90日ローテ）
- 暗号化：At‑Rest AES‑256 / In‑Transit TLS1.2+
- 削除API：/api/account/delete（48h以内完了）
- エクスポート：/api/account/export（JSON）
- ログ：PII無し・ハッシュ化
- 透明性：月次 Transparency Report（削除件数/保持期間/障害）
