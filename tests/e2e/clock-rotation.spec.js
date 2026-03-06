/**
 * Clock Rotation Visual Regression Tests
 * Verifies analog clock has 5 at top, 0 at bottom
 */

import { test, expect } from '@playwright/test';

test.describe('Analog Clock Rotation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
  });

  test('should have numeral 5 at top position', async ({ page }) => {
    // Take screenshot of analog clock
    const canvas = page.locator('#analog-clock');
    await expect(canvas).toHaveScreenshot('clock-rotation-5-at-top.png');

    // Visual verification: In the screenshot, numeral 5 should be
    // at the top center (12 o'clock position)
  });

  test('should have numeral 0 at bottom position', async ({ page }) => {
    // The screenshot should show 0 at bottom center (6 o'clock position)
    const canvas = page.locator('#analog-clock');
    await expect(canvas).toHaveScreenshot('clock-rotation-0-at-bottom.png');
  });

  test('should show sequential clockwise order from 0', async ({ page }) => {
    // Full analog clock screenshot
    // Numbers should read: 0 (bottom) → 1 → 2 → 3 → 4 → 5 (top) → 6 → 7 → 8 → 9 → back to 0
    // Going clockwise
    const canvas = page.locator('#analog-clock');
    await expect(canvas).toHaveScreenshot('clock-rotation-full-face.png');
  });

  test('clock hands should point to correct positions with new rotation', async ({
    page,
  }) => {
    // Wait a moment to ensure clock is rendered and animating
    await page.waitForTimeout(1000);

    // Take snapshot - hands should be pointing correctly relative to rotated numerals
    const canvas = page.locator('#analog-clock');
    await expect(canvas).toHaveScreenshot('clock-rotation-with-hands.png');

    // Note: Actual hand positions will vary based on current time
    // This test primarily ensures hands render and rotate correctly
    // with the new numeral orientation
  });
});
