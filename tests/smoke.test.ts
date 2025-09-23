// スモークテスト - 基本機能の動作確認
import { test, expect } from '@playwright/test';

test.describe('InnerVoice スモークテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページ基本読み込み', async ({ page }) => {
    // タイトル確認
    await expect(page).toHaveTitle(/InnerVoice/);
    
    // 主要コンポーネント表示確認
    await expect(page.locator('h1')).toContainText('InnerVoice');
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('text=今日の Minutes-Back')).toBeVisible();
  });

  test('MVP フロー: 7秒→2提案→.ics', async ({ page }) => {
    // 入力
    await page.fill('textarea', 'テストタスク 30分');
    await page.click('button[type="submit"]');
    
    // 提案表示待機（タイムアウト対策）
    await expect(page.locator('text=2つの提案')).toBeVisible({ timeout: 5000 });
    
    // 提案カード確認
    const proposalCards = page.locator('.proposal-card');
    await expect(proposalCards).toHaveCount(2);
    
    // 提案クリック（MVP+ フロー）
    await proposalCards.first().locator('button').click();
    
    // ConfirmSheet 表示確認
    await expect(page.locator('text=実行プランの確認')).toBeVisible();
    
    // Confirm once ボタン確認
    const confirmButton = page.locator('text=Confirm once');
    await expect(confirmButton).toBeVisible();
  });

  test('エラーハンドリング: API失敗時', async ({ page }) => {
    // API をモック失敗させる
    await page.route('/api/propose', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Mock API failure' })
      });
    });
    
    await page.fill('textarea', 'エラーテスト');
    await page.click('button[type="submit"]');
    
    // エラー後もアプリが動作することを確認
    await expect(page.locator('h1')).toContainText('InnerVoice');
    
    // 入力フィールドが再度使用可能
    await expect(page.locator('textarea')).toBeEnabled();
  });

  test('プライバシーポリシー・利用規約', async ({ page }) => {
    // フッターリンク確認
    await expect(page.locator('text=プライバシーポリシー')).toBeVisible();
    await expect(page.locator('text=利用規約')).toBeVisible();
    
    // プライバシーポリシーページ
    await page.click('text=プライバシーポリシー');
    await expect(page.locator('h1')).toContainText('プライバシーポリシー');
    
    // 戻って利用規約ページ
    await page.goBack();
    await page.click('text=利用規約');
    await expect(page.locator('h1')).toContainText('利用規約');
  });

  test('レスポンス時間（パフォーマンス）', async ({ page }) => {
    const startTime = Date.now();
    
    await page.fill('textarea', 'パフォーマンステスト');
    await page.click('button[type="submit"]');
    
    // 2秒以内に提案表示（SLA確認）
    await expect(page.locator('text=2つの提案')).toBeVisible({ timeout: 2000 });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`提案生成時間: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(3000); // 3秒以内
  });
});
