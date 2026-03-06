/**
 * Color Contrast Tests
 * Verifies WCAG AA compliance for dark theme colors
 */

import { describe, it, expect } from 'vitest';

/**
 * Calculate relative luminance for a color
 * @param {string} hex - Hex color (e.g., "#1a1a1a")
 * @returns {number} Relative luminance (0-1)
 */
function getRelativeLuminance(hex) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio
 */
function getContrastRatio(color1, color2) {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color Contrast - Dark Theme', () => {
  const PAGE_BG = '#1a1a1a'; // Very dark grey background
  const CLOCK_FACE = '#2d2d2d'; // Slightly lighter clock face
  const WHITE_TEXT = '#ffffff'; // White text/numerals/hands

  describe('Page Background Color', () => {
    it('should have luminance below 15% (very dark grey)', () => {
      const luminance = getRelativeLuminance(PAGE_BG);
      const percentage = luminance * 100;

      expect(percentage).toBeLessThan(15);
      expect(PAGE_BG.toLowerCase()).toBe('#1a1a1a');
    });
  });

  describe('Clock Face Color', () => {
    it('should be visibly lighter than page background', () => {
      const pageLuminance = getRelativeLuminance(PAGE_BG);
      const clockLuminance = getRelativeLuminance(CLOCK_FACE);

      // Clock face should be lighter
      expect(clockLuminance).toBeGreaterThan(pageLuminance);

      // Verify exact colors from research
      expect(CLOCK_FACE.toLowerCase()).toBe('#2d2d2d');

      // Page background should have low luminance (very dark grey)
      expect(pageLuminance * 100).toBeLessThan(15);

      // Clock face should be about 50-100% more luminance than page background
      // (research.md shows ~8 percentage point difference in RGB percentages)
      const relativeIncrease = (clockLuminance - pageLuminance) / pageLuminance;
      expect(relativeIncrease).toBeGreaterThan(0.4); // At least 40% more luminant
    });
  });

  describe('WCAG AA Contrast Requirements', () => {
    it('white text on page background should have ≥4.5:1 contrast', () => {
      const ratio = getContrastRatio(WHITE_TEXT, PAGE_BG);

      expect(ratio).toBeGreaterThanOrEqual(4.5);
      // Should actually meet AAA standard (≥7:1)
      expect(ratio).toBeGreaterThan(7);
    });

    it('white text on clock face should have ≥4.5:1 contrast', () => {
      const ratio = getContrastRatio(WHITE_TEXT, CLOCK_FACE);

      expect(ratio).toBeGreaterThanOrEqual(4.5);
      // Should also meet AAA standard
      expect(ratio).toBeGreaterThan(7);
    });
  });

  describe('Color Values', () => {
    it('should use exact specified hex colors', () => {
      expect(PAGE_BG).toBe('#1a1a1a');
      expect(CLOCK_FACE).toBe('#2d2d2d');
      expect(WHITE_TEXT).toBe('#ffffff');
    });
  });
});
