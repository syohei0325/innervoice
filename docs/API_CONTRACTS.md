# API コントラクト（MVP + MVP+）

## POST /api/propose
Req:
{ "text":"明日朝30分ランニング", "context":{"tz":"Asia/Tokyo","ng":["22:00-06:30"],"mobility":"walk"} }
Res:
{ "proposals":[
  {"id":"p1","title":"朝ラン20分","slot":"07:10","duration_min":20},
  {"id":"p2","title":"夜ストレッチ15分","slot":"21:30","duration_min":15}
], "latency_ms": 850 }

## POST /api/confirm（MVP）
Req: {"proposal_id":"p1"}
Res: { "ics_url":"/download/evt_abc123.ics", "minutes_back":18 }

## POST /api/plan（MVP+）
Req:
{ "proposal_id":"p1", "context":{"tz":"Asia/Tokyo"} }
Res:
{ "plans":[
  {"id":"pl1","summary":"07:00-07:30 朝ラン + 妻にメッセ + 06:45リマインド","actions":[
     {"action":"calendar.create","title":"朝ラン","start":"2025-09-19T07:00","duration_min":30},
     {"action":"message.send","to":"妻","text":"7時に走ってくるね"},
     {"action":"reminder.create","time":"2025-09-19T06:45","note":"ストレッチ"}
  ]},
  {"id":"pl2","summary":"雨なら夜ストレッチ15分 + 連絡","actions":[
     {"action":"calendar.create","title":"夜ストレッチ","start":"2025-09-19T21:30","duration_min":15},
     {"action":"message.send","to":"妻","text":"夜にするね"}
  ]}
], "latency_ms": 950 }

## POST /api/confirm（MVP+拡張）
Req: { "plan_id":"pl1", "enabled_actions":[0,1,2] }
Res: { "results":[
  {"action":"calendar.create","status":"ok","id":"evt_123"},
  {"action":"message.send","status":"ok","id":"msg_456"},
  {"action":"reminder.create","status":"ok","id":"rmd_789"}
], "minutes_back":18 }

### .ics 配信仕様（Node.js runtime）
- Content-Type: text/calendar; charset=utf-8
- Content-Disposition: attachment; filename="innervoice-evt_abc123.ics"