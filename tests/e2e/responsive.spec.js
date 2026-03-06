/**
 * Responsive Sizing Tests
 * Verifies clock sizes at different viewport breakpoints
 */

import { test, expect } from '@playwright/test';

test.describe('Responsive Clock Sizing', () => {
  test('desktop sizing at 1440px viewport - analog 650px, digital 4rem', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');

    // Verify analog clock size
    const analogWidth = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetWidth;
    });
    const analogHeight = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetHeight;
    });

    expect(analogWidth).toBe(650);
    expect(analogHeight).toBe(650);

    // Verify digital clock font size (4rem = 64px at default browser settings)
    const digitalFontSize = await page
      .locator('#digital-clock')
      .evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

    expect(digitalFontSize).toBe('64px');

    // Visual regression snapshot
    await expect(page).toHaveScreenshot('responsive-1440px.png', {
      fullPage: true,
    });
  });

  test('laptop sizing at 1025px viewport - analog 550px, digital 4rem', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1025, height: 768 });
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');

    // Verify analog clock size
    const analogWidth = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetWidth;
    });
    const analogHeight = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetHeight;
    });

    expect(analogWidth).toBe(550);
    expect(analogHeight).toBe(550);

    // Verify digital clock font size (4rem = 64px)
    const digitalFontSize = await page
      .locator('#digital-clock')
      .evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

    expect(digitalFontSize).toBe('64px');

    // Visual regression snapshot
    await expect(page).toHaveScreenshot('responsive-1025px.png', {
      fullPage: true,
    });
  });

  test('tablet sizing at 1024px viewport - analog 450px, digital 3rem', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');

    // Verify analog clock size
    const analogWidth = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetWidth;
    });
    const analogHeight = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetHeight;
    });

    expect(analogWidth).toBe(450);
    expect(analogHeight).toBe(450);

    // Verify digital clock font size (3rem = 48px)
    const digitalFontSize = await page
      .locator('#digital-clock')
      .evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

    expect(digitalFontSize).toBe('48px');

    // Visual regression snapshot
    await expect(page).toHaveScreenshot('responsive-1024px.png', {
      fullPage: true,
    });
  });

  test('mobile sizing at 768px viewport - analog 350px, digital 2rem', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');

    // Verify analog clock size
    const analogWidth = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetWidth;
    });
    const analogHeight = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetHeight;
    });

    expect(analogWidth).toBe(350);
    expect(analogHeight).toBe(350);

    // Verify digital clock font size (2rem = 32px)
    const digitalFontSize = await page
      .locator('#digital-clock')
      .evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

    expect(digitalFontSize).toBe('32px');

    // Visual regression snapshot
    await expect(page).toHaveScreenshot('responsive-768px.png', {
      fullPage: true,
    });
  });

  test('small mobile sizing at 480px viewport - analog 280px, digital 1.5rem', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto('http://localhost:5173');
    await page.waitForSelector('#analog-clock');
    await page.waitForSelector('#digital-clock');

    // Verify analog clock size
    const analogWidth = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetWidth;
    });
    const analogHeight = await page.locator('#analog-clock').evaluate((el) => {
      return el.offsetHeight;
    });

    expect(analogWidth).toBe(280);
    expect(analogHeight).toBe(280);

    // Verify digital clock font size (1.5rem = 24px)
    const digitalFontSize = await page
      .locator('#digital-clock')
      .evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

    expect(digitalFontSize).toBe('24px');

    // Visual regression snapshot
    await expect(page).toHaveScreenshot('responsive-480px.png', {
      fullPage: true,
    });
  });
});
