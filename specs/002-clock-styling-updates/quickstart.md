# Quickstart Guide: Clock Styling Updates

**Feature**: 002-clock-styling-updates
**Date**: 2026-03-06
**Target Audience**: Developers implementing this feature

## Overview

This guide provides a step-by-step walkthrough for implementing the dark theme, analog clock rotation, and responsive sizing updates to the decimal clock.

## Prerequisites

- Node.js 18+ installed
- Repository cloned locally
- Branch `002-clock-styling-updates` checked out
- Dependencies installed (`npm install`)

## Development Setup

```bash
# Ensure you're on the feature branch
git checkout 002-clock-styling-updates

# Start dev server (if not already running)
npm run dev

# In a separate terminal, run tests in watch mode
npm run test

# For visual testing during development
# Open browser to http://localhost:5173
```

## Implementation Steps

### Step 1: Write Tests First (TDD - Red Phase)

**Constitution Reminder**: Principle II requires test-first development. All tests must be written and verified to fail before implementing changes.

#### 1.1 Unit Tests for Rotation

**File**: `tests/unit/AnalogClock.test.js`

Add tests for numeral angle calculations:

```javascript
describe('Analog Clock Rotation', () => {
  test('numeral 5 should be at top (270 degrees)', () => {
    const angle = calculateNumeralAngle(5);
    expect(angle).toBeCloseTo(3 * Math.PI / 2); // 270° in radians
  });

  test('numeral 0 should be at bottom (90 degrees)', () => {
    const angle = calculateNumeralAngle(0);
    expect(angle).toBeCloseTo(Math.PI / 2); // 90° in radians
  });

  test('numerals should be in clockwise order from 0', () => {
    const angles = Array.from({ length: 10 }, (_, i) =>
      calculateNumeralAngle(i)
    );
    // Verify each subsequent angle is greater (clockwise)
    for (let i = 1; i < 10; i++) {
      expect(angles[i]).toBeGreaterThan(angles[i - 1]);
    }
  });
});
```

#### 1.2 Visual Regression Tests

**File**: `tests/e2e/visual-regression.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test('dark theme colors are applied', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check page background
  const pageBg = await page.locator('body').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  expect(pageBg).toBe('rgb(26, 26, 26)');

  // Visual snapshot
  await expect(page).toHaveScreenshot('dark-theme.png');
});

test('analog clock shows 5 at top, 0 at bottom', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for clock to render
  await page.waitForSelector('#analog-clock');

  // Take snapshot of analog clock
  await expect(page.locator('#analog-clock')).toHaveScreenshot(
    'clock-rotation.png'
  );
});
```

#### 1.3 Responsive Size Tests

**File**: `tests/e2e/responsive.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test('desktop size (1440px)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173');

  const canvas = await page.locator('#analog-clock');
  const width = await canvas.evaluate(el => el.offsetWidth);

  expect(width).toBe(650); // Max size cap
  await expect(page).toHaveScreenshot('desktop-1440.png');
});

test('tablet size (1024px)', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('http://localhost:5173');

  const canvas = await page.locator('#analog-clock');
  const width = await canvas.evaluate(el => el.offsetWidth);

  expect(width).toBe(450);
  await expect(page).toHaveScreenshot('tablet-1024.png');
});

// Add tests for 768px, 480px breakpoints...
```

#### 1.4 Verify Tests Fail

```bash
npm run test        # Unit tests should fail
npm run test:e2e    # E2E tests should fail
```

**Expected**: All new tests fail because implementation doesn't exist yet.

**Commit checkpoint**: `git add tests/ && git commit -m "test: Add tests for dark theme, rotation, and responsive sizing"`

---

### Step 2: Implement Dark Theme (Green Phase)

**File**: `src/styles/main.css`

#### 2.1 Update Page Background

```css
/* Replace existing body/main styles */
body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #1a1a1a; /* NEW: Very dark grey */
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #1a1a1a; /* NEW: Replace gradient with solid dark grey */
}
```

#### 2.2 Update Clock Face Styling

```css
#analog-clock {
  background: #2d2d2d; /* NEW: Slightly lighter grey */
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* Adjust shadow for dark theme */
  display: block;
}
```

#### 2.3 Update Digital Clock Styling

```css
#digital-clock {
  font-size: 4rem; /* CHANGED: Increased from 3rem */
  font-weight: 700;
  color: white; /* Kept white */
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Adjust shadow */
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.1em;
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}
```

**Test**: Run visual regression tests, should now pass for dark theme colors.

---

### Step 3: Implement Clock Rotation (Green Phase)

**File**: `src/components/AnalogClock/AnalogClock.js`

#### 3.1 Update Numeral Angle Calculation

Locate the numeral positioning loop (around line 29-38):

```javascript
// BEFORE:
const angle = (i / NUMERAL_COUNT) * 2 * Math.PI - Math.PI / 2;

// AFTER:
const angle = (i / NUMERAL_COUNT) * 2 * Math.PI + Math.PI / 2;
// This shifts by +π radians (180°), moving 5 to top and 0 to bottom
```

#### 3.2 Update Drawing Colors

Locate the `drawClockFace()` function and update colors:

```javascript
function drawClockFace() {
  const { centerX, centerY, radius, numerals } = clockFace;

  // Draw circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#ffffff'; // CHANGED: from '#333' to white
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw numerals
  ctx.fillStyle = '#ffffff'; // CHANGED: from '#333' to white
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  numerals.forEach((numeral) => {
    ctx.fillText(numeral.value.toString(), numeral.x, numeral.y);
  });

  // Draw center dot
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff'; // CHANGED: from '#333' to white
  ctx.fill();
}
```

#### 3.3 Update Hand Colors

Locate the `drawHand()` function:

```javascript
function drawHand(length, angle, width, color = '#ffffff') { // CHANGED default color
  // ... existing code ...
}

// Update render() calls:
drawHand(
  clockFace.radius * TENS_HAND_RADIUS,
  tensAngle,
  TENS_HAND_WIDTH,
  '#ffffff' // CHANGED: from '#666' to white
);
drawHand(
  clockFace.radius * ONES_HAND_RADIUS,
  onesAngle,
  ONES_HAND_WIDTH,
  '#ffffff' // CHANGED: from '#333' to white
);
```

**Test**: Run unit tests for angle calculations and visual tests for rotation.

---

### Step 4: Implement Responsive Sizing (Green Phase)

**File**: `src/styles/main.css`

#### 4.1 Update Base Size (Desktop)

```css
/* Default desktop size */
#analog-clock {
  width: 550px !important;  /* CHANGED: from 400px */
  height: 550px !important;
  /* other styles... */
}

#digital-clock {
  font-size: 4rem; /* Already updated in Step 2.3 */
  /* other styles... */
}
```

#### 4.2 Update Media Queries

```css
/* Large desktop - add new breakpoint */
@media (min-width: 1440px) {
  #analog-clock {
    width: 650px !important;  /* NEW: Max size cap */
    height: 650px !important;
  }

  #digital-clock {
    font-size: 4rem; /* No increase beyond desktop */
  }
}

/* Tablet - update existing */
@media (max-width: 1024px) {
  #analog-clock {
    width: 450px !important;  /* CHANGED: from 300px */
    height: 450px !important;
  }

  #digital-clock {
    font-size: 3rem;
  }
}

/* Mobile - update existing */
@media (max-width: 768px) {
  #analog-clock {
    width: 350px !important;  /* CHANGED: from 300px */
    height: 350px !important;
  }

  #digital-clock {
    font-size: 2rem;
  }
}

/* Small mobile - update existing */
@media (max-width: 480px) {
  #analog-clock {
    width: 280px !important;  /* CHANGED: from 250px */
    height: 280px !important;
  }

  #digital-clock {
    font-size: 1.5rem;
  }
}
```

**Test**: Run responsive tests for all breakpoints.

---

### Step 5: Refactor (Refactor Phase)

Now that all tests pass, clean up the code:

#### 5.1 Extract Color Constants (Optional Enhancement)

**File**: `src/styles/main.css`

```css
:root {
  --color-page-bg: #1a1a1a;
  --color-clock-face-bg: #2d2d2d;
  --color-text: #ffffff;
  --color-shadow: rgba(0, 0, 0, 0.5);
}

body {
  background: var(--color-page-bg);
}

main {
  background: var(--color-page-bg);
}

#analog-clock {
  background: var(--color-clock-face-bg);
  box-shadow: 0 10px 30px var(--color-shadow);
}

#digital-clock {
  color: var(--color-text);
  text-shadow: 0 2px 10px var(--color-shadow);
}
```

#### 5.2 Extract Angle Calculation (Optional)

**File**: `src/components/AnalogClock/AnalogClock.js`

```javascript
/**
 * Calculate the angle for a decimal numeral (0-9) with 5 at top, 0 at bottom
 * @param {number} numeralValue - 0 to 9
 * @returns {number} Angle in radians
 */
function calculateNumeralAngle(numeralValue) {
  return (numeralValue / NUMERAL_COUNT) * 2 * Math.PI + Math.PI / 2;
}

// Use in calculateClockFace():
const angle = calculateNumeralAngle(i);
```

#### 5.3 Re-run All Tests

```bash
npm run test        # All unit tests should pass
npm run test:e2e    # All e2e tests should pass
npm run lint        # No linting errors
```

---

### Step 6: Manual Testing & Verification

#### 6.1 Visual Inspection Checklist

- [ ] Page background is very dark grey (not black)
- [ ] Clock face is slightly lighter than page background
- [ ] All text, numerals, and hands are white
- [ ] Numeral 5 is at the top (12 o'clock position)
- [ ] Numeral 0 is at the bottom (6 o'clock position)
- [ ] Numerals read 0→1→2→...→9 clockwise from bottom
- [ ] Clock hands move smoothly without stuttering
- [ ] Digital clock is larger than before
- [ ] Analog clock is larger than before

#### 6.2 Responsive Testing

Test each breakpoint manually:

```bash
# Dev server should be running
npm run dev
```

Open browser and test:
1. Desktop (1920px): Clock should be 650px (max cap)
2. Laptop (1440px): Clock should be 650px
3. Tablet (1024px): Clock should be 450px
4. Mobile (768px): Clock should be 350px
5. Small mobile (480px): Clock should be 280px

#### 6.3 Accessibility Testing

Using browser DevTools:
1. Open Lighthouse
2. Run accessibility audit
3. Verify 100% score (or document any issues)
4. Check contrast ratios in DevTools color picker

#### 6.4 Performance Testing

1. Open DevTools Performance tab
2. Record for 10 seconds while clock animates
3. Verify frame rate stays at 60fps (no drops below 50fps)
4. Check memory usage stays under 50MB

---

### Step 7: Commit Changes

Follow TDD commit structure:

```bash
# Tests were already committed in Step 1.4
git add src/styles/main.css
git commit -m "feat: Implement dark theme styling"

git add src/components/AnalogClock/AnalogClock.js
git commit -m "feat: Rotate analog clock (5 at top, 0 at bottom)"

# If refactored in Step 5
git add .
git commit -m "refactor: Extract color constants to CSS variables"

# Update tests if needed
git add tests/
git commit -m "test: Update visual regression baselines"
```

---

## Verification

### All Tests Pass

```bash
npm run test        # ✓ All unit/integration tests pass
npm run test:e2e    # ✓ All e2e tests pass
npm run lint        # ✓ No linting errors
npm run build       # ✓ Production build succeeds
```

### Constitution Compliance

- [x] **Simplicity**: No new dependencies added
- [x] **TDD**: Tests written first, verified to fail, then implemented
- [x] **UX Excellence**: Dark theme, larger sizes, WCAG AA compliance
- [x] **Modularity**: Changes isolated to specific components
- [x] **Accuracy**: 60fps maintained, rotation mathematically correct

---

## Troubleshooting

### Tests Fail After Implementation

**Problem**: Visual regression tests fail even though manual inspection looks correct.

**Solution**:
1. Update baseline images: `npm run test:e2e -- --update-snapshots`
2. Verify changes are intentional before committing new baselines

### Clock Numbers Appear in Wrong Positions

**Problem**: Numerals not at expected positions after rotation change.

**Solution**:
1. Check angle calculation: `(i / 10) * 2 * Math.PI + Math.PI / 2`
2. Verify loop starts at `i = 0`
3. Check canvas coordinate system (0° is at 3 o'clock, rotates clockwise)

### Colors Don't Match Spec

**Problem**: Colors appear different than specified hex values.

**Solution**:
1. Check browser DevTools computed styles
2. Verify no CSS overrides or specificity conflicts
3. Check for color profile differences (use sRGB)
4. Disable any browser extensions that modify colors

### Clock Appears Blurry

**Problem**: Canvas rendering looks pixelated or blurry.

**Solution**:
1. Ensure `canvas.width` and `canvas.height` match CSS `offsetWidth` and `offsetHeight`
2. Check devicePixelRatio handling (should be in ClockPage.js)
3. Verify no CSS `transform: scale()` is applied

### Responsive Sizes Wrong

**Problem**: Clock doesn't resize at breakpoints.

**Solution**:
1. Check media query order (most specific last)
2. Verify `!important` flags if specificity issues
3. Test with browser DevTools device emulation
4. Check for conflicting inline styles

---

## Next Steps

After implementation is complete and all tests pass:

1. Run `/speckit.tasks` to generate the task breakdown
2. Review tasks for any missed implementation details
3. Proceed with `/speckit.implement` to execute tasks
4. Create pull request when feature is complete

---

## Resources

- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Vitest Documentation](https://vitest.dev/)
- [MDN: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN: CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)

---

**Remember**: Follow TDD strictly. Tests first, implementation second, refactor third. No exceptions per Constitution Principle II.
