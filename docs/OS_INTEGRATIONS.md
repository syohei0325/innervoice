# OS Deep Integrations（iOS/Android/Windows）

## 目的
OSレベルで統合し、**通知1タップ承認**や**Carモード**を実現。

## Background Scouts
OS許容範囲でカレンダー変化・位置・接続イベントを購読→**observations**に記録（端末先行、PDV優先）。

### 監視対象
- **カレンダー変化**：予定の追加/削除/変更
- **位置**：移動開始/到着
- **接続**：Wi-Fi/Bluetooth接続（自宅/車/オフィス判定）

## 通知アクション
Nudgeは**2件まで**・**Undo 10秒**・**礼節モード**・**クールダウン**。

### iOS
- **App Intents**：Shortcuts統合
- **通知アクション**：Confirm/Cancel ボタン
- **ウィジェット**：Today View / Lock Screen

### Android
- **Intents**：他アプリから起動
- **通知アクション**：Confirm/Cancel ボタン
- **クイック設定タイル**：1タップ起動

### Windows
- **Graph API**：カレンダー/連絡先統合
- **Notifications**：Action Center統合

## Carモード
候補2件を読み上げ→「AでOK？」で実行（視線ゼロ）。

### 要件
- **読み上げ中心**：画面を見ない
- **操作最小**：音声のみ
- **安全優先**：運転中は承認のみ、詳細設定は停車後

### KPI
- **Screen‑off完了率** ≥ 70%
- **TTC（Time‑to‑Confirm）** p50 ≤ 5秒（音声）

## 設計
1. **一次推論は端末**：プライバシー優先
2. **サーバで再ランク**：精緻化
3. **実行は Plan→Confirm→MCP/ネイティブ**
4. **.icsフォールバック**：常備

## プロバイダ分離
- **Google系**：Googleマップ
- **Apple系**：Appleマップ
- **TOS遵守**：各プラットフォームの規約に従う

## 詳細
- **docs/CAR_MODE.md**：Carモードの詳細
- **docs/CONFIRM_OS.md**：承認/取消/監査の規格

