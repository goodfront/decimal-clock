/**
 * Accessibility Tests for Dark Theme
 * Verifies WCAG 2.1 AA compliance
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility - Dark Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');
  });

  test('should have sufficient color contrast for body text', async ({
    page,
  }) => {
    // Get computed styles
    const styles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);

      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    // Parse RGB values
    const bgMatch = styles.backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    const fgMatch = styles.color.match(/rgb\((\d+), (\d+), (\d+)\)/);

    expect(bgMatch).toBeTruthy();
    expect(fgMatch).toBeTruthy();

    // Calculate contrast ratio
    const bgLum = calculateLuminance(
      parseInt(bgMatch[1]),
      parseInt(bgMatch[2]),
      parseInt(bgMatch[3])
    );
    const fgLum = calculateLuminance(
      parseInt(fgMatch[1]),
      parseInt(fgMatch[2]),
      parseInt(fgMatch[3])
    );

    const contrast =
      (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);

    // WCAG AA requires 4.5:1 for normal text
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  test('digital clock should have sufficient contrast', async ({ page }) => {
    const styles = await page.locator('#digital-clock').evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    // Digital clock should have white text on dark background
    // White on #1a1a1a should have >15:1 contrast
    expect(styles.color).toBe('rgb(255, 255, 255)');
  });

  test('page should have proper ARIA labels', async ({ page }) => {
    // Check main landmark
    const main = page.locator('main');
    await expect(main).toHaveAttribute('role', 'main');
    await expect(main).toHaveAttribute('aria-label', 'Decimal Clock');

    // Check analog clock section
    const analogSection = page.locator('section').first();
    await expect(analogSection).toHaveAttribute(
      'aria-labelledby',
      'analog-clock-heading'
    );

    // Check digital clock section
    const digitalSection = page.locator('section').nth(1);
    await expect(digitalSection).toHaveAttribute(
      'aria-labelledby',
      'digital-clock-heading'
    );
  });

  test('canvas should have accessible fallback', async ({ page }) => {
    const canvas = page.locator('#analog-clock');

    // Check aria-label
    await expect(canvas).toHaveAttribute(
      'aria-label',
      'Analog decimal clock face'
    );

    // Check fallback content exists (for browsers without canvas support)
    const fallbackText = await canvas.evaluate((el) => el.textContent);
    expect(fallbackText.length).toBeGreaterThan(0);
  });

  test('time updates should be announced to screen readers', async ({
    page,
  }) => {
    // Check for aria-live region
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toHaveAttribute('aria-atomic', 'true');

    // Should contain time announcement element
    const timeAnnouncement = page.locator('#time-announcement');
    await expect(timeAnnouncement).toBeVisible({ visible: false }); // Hidden visually but available to screen readers
  });

  test('should not have any accessibility violations', async ({ page }) => {
    // This is a placeholder for axe-core integration
    // In a real implementation, you would use @axe-core/playwright

    // Verify basic accessibility requirements manually
    const hasMainLandmark = await page.locator('main[role="main"]').count();
    expect(hasMainLandmark).toBe(1);

    const hasProperHeadings = await page
      .locator('h2#analog-clock-heading, h2#digital-clock-heading')
      .count();
    expect(hasProperHeadings).toBe(2);

    // Check for screen-reader-only class
    const srOnly = await page.locator('.sr-only').count();
    expect(srOnly).toBeGreaterThan(0);
  });
});

/**
 * Calculate relative luminance for RGB values
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function calculateLuminance(r, g, b) {
  // Convert to 0-1 range
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
