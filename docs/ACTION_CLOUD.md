# ACTION CLOUD – 実行のUSB‑C（/plan → /approve → /confirm）

## これは何か
どの音声/LLMクライアントからでも**安全に"結果を確定"**できる**中立API**。  
**ConfirmOS**（承認/取消/監査/二重承認）と**Execution Ledger**（台帳）を前提に、**Open‑box**でSLAと品質指標（**AXI**）を外部公開する。

## 誰のためか
- 音声アシスタント / エージェント / エージェント化するアプリ（検索・地図・予約・メッセ・OS通知）
- B2Bの業務自動化（医療/飲食/再配達/美容/不動産/教育/行政など）

## コアAPI（再掲）
- `POST /v1/plan` → 2案の実行プラン（各1–3アクション）  
- `POST /v1/approve` → **approve_id**（10分）  
- `POST /v1/confirm` → 並列実行＋**Idempotency-Key（24h）**＋**.icsフォールバック**  
※ エラー/バージョニング/署名/SLAは **PUBLIC_API** を準拠

## Call Provider Spec（音声通話の外部挿し）
- `call.place` / `call.status` / `call.summary`（HMAC署名、冪等24h、指数バックオフ）  
- **Call Consent**：`approve_id`必須（未同意は**400_CALL_CONSENT_REQUIRED**）  
- SLA目標：`call.status`初回≤5s、`call.summary`終話から≤10s、月間稼働**99.5%+**

## 価格（初期）
- **従量**：**$0.03 / アクション**（例：`calendar.create` を1アクション換算）  
- **台帳SaaS**：**$20 / 席 / 月**（eDiscovery/監査エクスポート）  
- 参考：月1,000万通話（=3,000万アクション）で **$10.8M ARR** + 席課金

## SLA / SLO（暫定）
- 稼働率：**99.5%+（β） / 99.9%（Enterprise）**  
- レイテンシ：`/v1/plan p50 ≤ 700ms`、`/v1/approve p50 ≤ 100ms`、`/v1/confirm p50 ≤ 300ms`  
- **AXI外部公開**：`ttc_p50` / `misexec_pct` / `cancel_success_pct` / `rollback_success_pct` / `call_success_pct` / `screen_off_completion_pct`（7日移動平均）

## 移行ロードマップ（Yohaku → Action Cloud）
1) **Yohaku実運用**：通話→予定化テンプレ3本、**AXIを週次公開**、台帳席課金  
2) **β（招待制）**：デザインパートナー20社／**SLA 99.5%**／**プロバイダ中立**（Twilio/Telnyx他）  
3) **GA**：**ConfirmOS v1**公開／**AXIリーダーボード**／EU DPA対応／監査証跡標準

## Go / No‑Go 基準
- **Go to β**：通話成功≥90% / 誤実行<0.5% / vMB中央値≥6分 / 有償≥30社  
- **Go to GA**：AXI安定（3ヶ月連続で基準達成） / β顧客NPS≥40 / 月アクション≥3,000万

## 安全と規制
- **同意**：通話はCall Consent必須、録音は既定OFF・明示同意のみ  
- **取消/ロールバック**：ConfirmOSで標準実装（10秒Undo＋可逆性フラグ）  
- **データ最小化**：本文は保持せず要約＋操作メタのみ長期、台帳は90日既定

## 競合優位（Why us）
- **Open‑box**：AXI/台帳を外部公開 → **黒箱ではない**実行  
- **プロバイダ中立**：ベンダ差し替え＋自動ルーティング（遅延/勝率最適化）  
- **規制整合**：TCPA等の同意要件を**仕様**で担保（400エラーとSLAの双方で強制）

## 実装スニペット（疑似）
```bash
curl -H "Authorization: Bearer $KEY" https://api.yohaku.app/v1/plan -d '{ "text":"明日10:30に◯◯クリニック予約" }'
# → plans[2] から pl1 を選択
curl -H "Authorization: Bearer $KEY" https://api.yohaku.app/v1/approve -d '{ "plan_id":"pl1" }'
# → { "approve_id":"aprv_abc123" }
curl -H "Authorization: Bearer $KEY" -H "Idempotency-Key: k_123" https://api.yohaku.app/v1/confirm -d '{ "plan_id":"pl1","approve_id":"aprv_abc123" }'
```

