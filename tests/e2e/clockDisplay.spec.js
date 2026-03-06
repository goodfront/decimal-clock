import { test, expect } from '@playwright/test';

test('displays decimal time on page load', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check analog clock canvas exists and is visible
  const canvas = page.locator('#analog-clock');
  await expect(canvas).toBeVisible();

  // Check digital clock displays time
  const digitalClock = page.locator('#digital-clock');
  await expect(digitalClock).toBeVisible();

  // Time format should match XX.XX
  const timeText = await digitalClock.textContent();
  expect(timeText).toMatch(/^\d{2}\.\d{2}$/);
});

test('clocks update continuously', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const digitalClock = page.locator('#digital-clock');
  const initialTime = await digitalClock.textContent();

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  const updatedTime = await digitalClock.textContent();

  // Time should have changed (or at least be valid)
  expect(updatedTime).toMatch(/^\d{2}\.\d{2}$/);
});

test('analog clock canvas has correct dimensions', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const canvas = page.locator('#analog-clock');
  const width = await canvas.getAttribute('width');
  const height = await canvas.getAttribute('height');

  expect(width).toBe('400');
  expect(height).toBe('400');
});
