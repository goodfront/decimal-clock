import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getDecimalTime,
  standardToDecimal,
  decimalToStandard,
} from '../../src/utils/timeConversion.js';

describe('getDecimalTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns 0.00 at midnight', () => {
    const midnight = new Date('2026-03-06T00:00:00');
    vi.setSystemTime(midnight);
    const result = getDecimalTime(midnight);
    expect(result.value).toBe(0);
    expect(result.tens).toBe(0);
    expect(result.ones).toBe(0);
    expect(result.formatted).toBe('00.00');
  });

  test('returns 25.00 at 6 AM', () => {
    const sixAM = new Date('2026-03-06T06:00:00');
    vi.setSystemTime(sixAM);
    const result = getDecimalTime(sixAM);
    expect(result.value).toBe(25);
    expect(result.tens).toBe(2);
    expect(result.ones).toBe(5);
    expect(result.formatted).toBe('25.00');
  });

  test('returns 50.00 at noon', () => {
    const noon = new Date('2026-03-06T12:00:00');
    vi.setSystemTime(noon);
    const result = getDecimalTime(noon);
    expect(result.value).toBe(50);
    expect(result.tens).toBe(5);
    expect(result.ones).toBe(0);
    expect(result.formatted).toBe('50.00');
  });

  test('returns decimal time near 99.99 at 11:59:59 PM', () => {
    const nearMidnight = new Date('2026-03-06T23:59:59.000');
    vi.setSystemTime(nearMidnight);
    const result = getDecimalTime(nearMidnight);
    expect(result.value).toBeGreaterThan(99.98);
    expect(result.value).toBeLessThan(100);
    expect(result.tens).toBe(9);
    // 23:59:59.000 = 86399000ms / 86400000ms * 100 = 99.9988...
    // When rounded to 2 decimal places, this becomes 100.00
    expect(result.formatted).toBe('100.00');
  });

  test('uses current time when no argument provided', () => {
    const now = new Date('2026-03-06T15:00:00');
    vi.setSystemTime(now);
    const result = getDecimalTime();
    expect(result.value).toBe(62.5);
  });

  test('edge case: one millisecond after midnight', () => {
    const justAfterMidnight = new Date('2026-03-06T00:00:00.001');
    const result = getDecimalTime(justAfterMidnight);
    expect(result.value).toBeGreaterThan(0);
    expect(result.value).toBeLessThan(0.01);
  });

  test('edge case: exact 10.00 decimal unit rollover', () => {
    // 10.00 decimal time = 0.1 * 24 hours = 2.4 hours = 2 hours 24 minutes
    const rollover = new Date('2026-03-06T02:24:00');
    const result = getDecimalTime(rollover);
    expect(result.value).toBe(10);
    expect(result.tens).toBe(1);
    expect(result.ones).toBe(0);
  });
});

describe('standardToDecimal', () => {
  test('converts midnight (0:0:0) to 0.00', () => {
    expect(standardToDecimal(0, 0, 0)).toBe(0);
  });

  test('converts 6 AM (6:0:0) to 25.00', () => {
    expect(standardToDecimal(6, 0, 0)).toBe(25);
  });

  test('converts noon (12:0:0) to 50.00', () => {
    expect(standardToDecimal(12, 0, 0)).toBe(50);
  });

  test('converts 6 PM (18:0:0) to 75.00', () => {
    expect(standardToDecimal(18, 0, 0)).toBe(75);
  });

  test('converts 12:30 PM to ~52.08', () => {
    const result = standardToDecimal(12, 30, 0);
    expect(result).toBeCloseTo(52.083333, 2);
  });
});

describe('decimalToStandard', () => {
  test('converts 0.00 to midnight', () => {
    const result = decimalToStandard(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.milliseconds).toBe(0);
  });

  test('converts 25.00 to 6 AM', () => {
    const result = decimalToStandard(25);
    expect(result.hours).toBe(6);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.milliseconds).toBe(0);
  });

  test('converts 50.00 to noon', () => {
    const result = decimalToStandard(50);
    expect(result.hours).toBe(12);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.milliseconds).toBe(0);
  });

  test('converts 75.00 to 6 PM', () => {
    const result = decimalToStandard(75);
    expect(result.hours).toBe(18);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.milliseconds).toBe(0);
  });
});
