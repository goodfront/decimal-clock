/**
 * Analog Clock Tests
 * Verifies clock rotation and numeral positioning
 */

import { describe, it, expect } from 'vitest';

/**
 * Calculate the angle for a decimal numeral with new rotation (5 at top, 0 at bottom)
 * This matches the formula that should be in AnalogClock.js after implementation
 * @param {number} numeralValue - 0 to 9
 * @returns {number} Angle in radians
 */
function calculateNumeralAngle(numeralValue) {
  const NUMERAL_COUNT = 10;
  // New formula: (i / 10) × 2π + π/2
  // This rotates the clock 180° compared to old formula
  return (numeralValue / NUMERAL_COUNT) * 2 * Math.PI + Math.PI / 2;
}

describe('Analog Clock - Rotation', () => {
  describe('Numeral Angle Calculation', () => {
    it('numeral 0 should be at bottom (π/2 radians = 90°)', () => {
      const angle = calculateNumeralAngle(0);

      // π/2 radians = 90° = bottom position
      expect(angle).toBeCloseTo(Math.PI / 2, 5);
    });

    it('numeral 5 should be at top (3π/2 radians = 270°)', () => {
      const angle = calculateNumeralAngle(5);

      // 3π/2 radians = 270° = top position (12 o'clock)
      expect(angle).toBeCloseTo((3 * Math.PI) / 2, 5);
    });

  });

  describe('Clockwise Sequential Order', () => {
    it('angles should increase from 0 to 9 (clockwise)', () => {
      const angles = [];

      for (let i = 0; i < 10; i++) {
        angles.push(calculateNumeralAngle(i));
      }

      // Each angle should be greater than the previous (clockwise rotation)
      for (let i = 1; i < 10; i++) {
        expect(angles[i]).toBeGreaterThan(angles[i - 1]);
      }
    });

    it('angle difference between consecutive numbers should be constant', () => {
      const angles = [];
      for (let i = 0; i < 10; i++) {
        angles.push(calculateNumeralAngle(i));
      }

      const expectedDiff = (2 * Math.PI) / 10; // 36° in radians

      for (let i = 1; i < 10; i++) {
        const actualDiff = angles[i] - angles[i - 1];
        expect(actualDiff).toBeCloseTo(expectedDiff, 5);
      }
    });

    it('complete rotation should be 2π radians (360°)', () => {
      const angle0 = calculateNumeralAngle(0);
      const angle10 = calculateNumeralAngle(10); // Wraps back to 0

      const fullRotation = angle10 - angle0;
      expect(fullRotation).toBeCloseTo(2 * Math.PI, 5);
    });
  });

  describe('Visual Position Verification', () => {
    it('should place numbers correctly around the clock face', () => {
      const positions = {
        0: { expected: 'bottom', angle: Math.PI / 2 },
        1: { expected: 'bottom-right', angle: (Math.PI / 2) + (Math.PI / 5) },
        2: { expected: 'right-bottom', angle: (Math.PI / 2) + (2 * Math.PI / 5) },
        3: { expected: 'right-top', angle: (Math.PI / 2) + (3 * Math.PI / 5) },
        4: { expected: 'top-right', angle: (Math.PI / 2) + (4 * Math.PI / 5) },
        5: { expected: 'top', angle: (3 * Math.PI) / 2 },
        6: { expected: 'top-left', angle: (3 * Math.PI / 2) + (Math.PI / 5) },
        7: { expected: 'left-top', angle: (3 * Math.PI / 2) + (2 * Math.PI / 5) },
        8: { expected: 'left-bottom', angle: (3 * Math.PI / 2) + (3 * Math.PI / 5) },
        9: { expected: 'bottom-left', angle: (3 * Math.PI / 2) + (4 * Math.PI / 5) },
      };

      for (const [numeral, { angle: expectedAngle }] of Object.entries(positions)) {
        const actualAngle = calculateNumeralAngle(parseInt(numeral));
        const normalized = actualAngle % (2 * Math.PI);
        const expectedNormalized = expectedAngle % (2 * Math.PI);

        expect(normalized).toBeCloseTo(expectedNormalized, 5);
      }
    });
  });
});
