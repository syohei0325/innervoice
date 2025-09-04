# データモデル

## テーブル
- users(id, email_hash, created_at)
- profiles(user_id, tz, display_name, commute_minutes, sleep_window, ng_hours_json, mobility_pref)
- proposals(id, user_id, payload_json, created_at)       # 2案の内容・所要時間
- decisions(id, user_id, proposal_id, ics_blob, minutes_back, decided_at)
- events(id, user_id, source, minutes_back, meta_json, created_at)
- deletion_requests(id, user_id, status, requested_at)

## インデックス
- decisions(user_id, decided_at)
- events(user_id, created_at)

## Minutes‑Back 概算（初期）
- ルール：**提案所要時間短縮分** or **自己申告**の小さい方
- 将来：移動/画面/完了ログと突合し実測化
