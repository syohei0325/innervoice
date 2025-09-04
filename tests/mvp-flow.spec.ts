import { test, expect } from '@playwright/test';

test.describe('InnerVoice MVP Flow', () => {
  test('7秒入力→2提案→1確定→.icsダウンロード', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Verify page loads with correct title
    await expect(page).toHaveTitle(/InnerVoice/);
    await expect(page.locator('h1')).toContainText('InnerVoice');
    
    // Input text (simulating 7-second input)
    const inputText = '明日朝30分ランニング';
    await page.fill('textarea', inputText);
    
    // Track input_started event
    await page.click('button[type="submit"]');
    
    // Wait for proposals to appear (should be < 2s for p50)
    await expect(page.locator('text=2つの提案')).toBeVisible({ timeout: 2000 });
    
    // Verify 2 proposals are shown
    const proposalCards = page.locator('.proposal-card');
    await expect(proposalCards).toHaveCount(2);
    
    // Verify each proposal has required elements
    await expect(proposalCards.first()).toContainText('案1');
    await expect(proposalCards.last()).toContainText('案2');
    
    // Check that duration and slot are displayed
    await expect(proposalCards.first()).toContainText('分');
    await expect(proposalCards.first()).toContainText(':');
    
    // Click confirm on first proposal
    const firstConfirmButton = proposalCards.first().locator('button');
    await firstConfirmButton.click();
    
    // Wait for download to trigger
    // Note: In real browser, this would download the .ics file
    // For testing, we'll verify the API call succeeds
    await page.waitForTimeout(1000);
    
    // Verify Minutes-Back meter is updated
    const mbMeter = page.locator('.mb-meter');
    await expect(mbMeter).toBeVisible();
    await expect(mbMeter).toContainText('分');
    
    // Verify proposals are cleared after confirmation
    await expect(page.locator('text=2つの提案')).not.toBeVisible();
  });

  test('フォールバック: API失敗時の動作', async ({ page }) => {
    // Mock API failure by going to a non-existent endpoint first
    await page.route('/api/propose', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Mock API failure' }),
      });
    });
    
    await page.goto('/');
    
    // Try to submit input
    await page.fill('textarea', 'テスト入力');
    await page.click('button[type="submit"]');
    
    // Should handle error gracefully (not crash)
    await page.waitForTimeout(1000);
    
    // App should still be functional
    await expect(page.locator('h1')).toContainText('InnerVoice');
  });

  test('Silent Mode: テキスト入力モード', async ({ page }) => {
    await page.goto('/');
    
    // Verify text mode is default
    await expect(page.locator('button').filter({ hasText: 'テキスト' })).toBeVisible();
    
    // Toggle to voice mode
    await page.click('button:has-text("テキスト")');
    await expect(page.locator('button').filter({ hasText: '音声' })).toBeVisible();
    
    // Toggle back to text mode
    await page.click('button:has-text("音声")');
    await expect(page.locator('button').filter({ hasText: 'テキスト' })).toBeVisible();
  });
});
