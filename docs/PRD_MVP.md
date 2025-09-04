# PRD – MVP「7秒→2提案→1確定（.ics）」

## ペルソナ（初期）
- 25–40歳、忙しくて「決め切れない/先送り」が日常的課題

## ユースケース（3本柱）
1) 朝の段取り：空き45分→A/B/C どれかに置く  
2) 移動前：今出る/配車/延期の小決断  
3) 就寝前：明日の自分へ1タスク置き土産

## 受け入れ基準
- 7秒入力（音声/無音）→**2提案**表示→**.ics生成DL**まで **p50<2s**
- 各提案に **duration_min** と開始時刻候補（slot）
- エラー時は**静音テキストへ自動フォールバック**
- **Minutes‑Back** が今日分に加算・表示
- PIIは保存せず、**要約+操作メタ**のみサーバ保存

## 計測イベント（必須）
- iv.input_started / iv.proposals_shown / iv.confirmed / iv.ics_downloaded  
- iv.minutes_back_added{minutes,source} / iv.error{type} / iv.nps_submitted
