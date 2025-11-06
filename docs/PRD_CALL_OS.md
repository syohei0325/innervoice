# PRD – MVP++「通話（SIP）& 端末深統合」

## 目的
予約/キャンセル/再配達などを**電話**で完了。MCP `call.place` を用い、transcript→summary→Planの後続実行。

## 機能
- **Confirm Sheet**：通話スクリプト要約・録音ON/OFF（既定OFF）
- **call.place**：ステータス（ringing/answered/voicemail/busy/failed）
- **結果要約**：1タップ確定→`calendar.create` / `message.send` / `reminder.create`
- **録音ON時**：両者アナウンス / transcriptは24h保持→要約のみ長期
- **緊急通話/医療判断**：対象外

## Call Consent（必須）
通話開始前に **/api/approve** で承認を取得（**approve_id** / TTL 10分）。承認なしの通話は送出しない。

### エラーコード
- **400_CALL_CONSENT_REQUIRED**：承認が不足

## Warm Transfer（人間オペレーターへ引き継ぎ）
高リスク（支払い/本人確認/規約変更）時は **transfer.requested → transfer.connected → transfer.canceled** の状態遷移をサポート。ConfirmOSの**二重承認**を必須化。

## リージョン別同意
録音・要約の扱いは **REGULATORY** に従い、JP/US/EU でアナウンス文言を切替（録音既定OFF、要約のみ長期）。

### アナウンス例
- **JP**：「通話内容を要約のために一時的に記録します。よろしいですか？」
- **US**：「This call may be recorded and summarized for quality purposes. Do you consent?」
- **EU**：データ最小化・目的限定・保存期間明示

## フロー（Outbound）
1. ユーザー意図 → **Call Consent**（承認）  
2. `call.place` 実行 → `call.status` 受領 → `call.summary`（要約・エンティティ抽出）  
3. 要約から **Plan** 提案 → **Confirm once** で `calendar.create / message.send / reminder.create` を実行（**.icsは常時フォールバック**）  
4. **Undo 10秒** / 監査台帳（Execution Ledger）へ記録

## KPI
- **通話成功** ≥ 90%
- **Screen‑off完了率** ≥ 70%
- **提案表示** p50 ≤ 1.5s
- **vMB中央値** ≥ 6分/実行

## 詳細
- **docs/API_CONTRACTS.md**：CALL PROVIDER SPEC
- **docs/CALL_TEMPLATES.md**：テンプレート例
- **docs/CONFIRM_OS.md**：承認/取消/監査の規格

