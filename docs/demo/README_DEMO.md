# デモ用説明

## mvp-flow.gif 作成手順

1. **準備**
   ```bash
   npm run dev
   # http://localhost:3000 を開く
   ```

2. **録画内容（10-20秒）**
   - InnerVoice トップページ表示
   - テキスト入力：「明日朝30分ランニング」
   - 「2つの提案を取得」ボタンクリック
   - 2つの提案カード表示
   - 片方の「これに決定」ボタンクリック
   - .icsダウンロード開始
   - Minutes-Back メーター更新

3. **録画ツール例**
   - macOS: QuickTime Player（⌘+Option+5）
   - Windows: Xbox Game Bar (Win+G)
   - Cross-platform: OBS Studio

4. **保存**
   - ファイル名: `mvp-flow.gif`
   - 解像度: 1280x720 以下
   - フレームレート: 10-15fps
   - ファイルサイズ: 5MB以下推奨

## 注意事項
- .env.local に OPENAI_API_KEY を設定済みであること
- DATABASE_URL が設定済み（または SQLite fallback）
- 音声は不要（サイレント録画でOK）
