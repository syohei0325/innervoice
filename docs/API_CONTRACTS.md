# API コントラクト（MVP）

## POST /api/propose
Req:
{ "text":"明日朝30分ランニング", "context":{"tz":"Asia/Tokyo","ng":["22:00-06:30"],"mobility":"walk"} }
Res:
{ "proposals":[
  {"id":"p1","title":"朝ラン20分","slot":"07:10","duration_min":20},
  {"id":"p2","title":"夜ストレッチ15分","slot":"21:30","duration_min":15}
], "latency_ms": 850 }

## POST /api/confirm
Req: {"proposal_id":"p1"}
Res: { "ics_url":"/download/evt_abc123.ics", "minutes_back":18 }

### .ics 配信仕様（Node.js runtime）
- Content-Type: text/calendar; charset=utf-8
- Content-Disposition: attachment; filename="innervoice-evt_abc123.ics"
