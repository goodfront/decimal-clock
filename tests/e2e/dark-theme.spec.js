/**
 * Dark Theme Visual Regression Tests
 * Verifies dark theme colors are applied correctly
 */

import { test, expect } from '@playwright/test';

test.describe('Dark Theme Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for clock to render
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');
  });

  test('page background should be very dark grey (#1a1a1a)', async ({
    page,
  }) => {
    const bodyBg = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // RGB(26, 26, 26) = #1a1a1a
    expect(bodyBg).toBe('rgb(26, 26, 26)');
  });

  test('main element background should be very dark grey', async ({ page }) => {
    const mainBg = await page.locator('main').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should match body background
    expect(mainBg).toBe('rgb(26, 26, 26)');
  });

  test('analog clock face should be slightly lighter grey (#2d2d2d)', async ({
    page,
  }) => {
    const canvasBg = await page.locator('#analog-clock').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // RGB(45, 45, 45) = #2d2d2d
    expect(canvasBg).toBe('rgb(45, 45, 45)');
  });

  test('digital clock text should be white', async ({ page }) => {
    const digitalColor = await page.locator('#digital-clock').evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // RGB(255, 255, 255) = #ffffff
    expect(digitalColor).toBe('rgb(255, 255, 255)');
  });

  test('should match dark theme screenshot', async ({ page }) => {
    // Take full-page screenshot for visual regression
    await expect(page).toHaveScreenshot('dark-theme-full.png', {
      fullPage: true,
    });
  });

  test('analog clock should match dark theme screenshot', async ({ page }) => {
    // Focused screenshot of analog clock
    const canvas = page.locator('#analog-clock');
    await expect(canvas).toHaveScreenshot('dark-theme-analog.png');
  });

  test('digital clock should match dark theme screenshot', async ({ page }) => {
    // Focused screenshot of digital clock
    const digital = page.locator('#digital-clock');
    await expect(digital).toHaveScreenshot('dark-theme-digital.png');
  });
});
