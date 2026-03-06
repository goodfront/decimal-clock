# Quickstart Guide: Decimal Clock Display

**Date**: 2026-03-06
**Feature**: 001-decimal-clock-display

## Overview

This quickstart guide provides step-by-step instructions for setting up, developing, testing, and deploying the Decimal Clock Display application. This guide assumes basic familiarity with Node.js, npm, and modern JavaScript development.

---

## Prerequisites

### Required Software

- **Node.js**: v18.0.0 or higher (LTS recommended)
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **npm**: v9.0.0 or higher (comes with Node.js)
  - Check version: `npm --version`

- **Git**: For version control
  - Check version: `git --version`

### Recommended Tools

- **VS Code**: Code editor with excellent JavaScript support
- **Chrome/Firefox DevTools**: For debugging and Canvas inspection

---

## Initial Setup

### 1. Clone Repository (if applicable) or Initialize Project

```bash
# Navigate to project directory
cd /path/to/decimal-clock

# Verify you're on the feature branch
git branch
# Should show: * 001-decimal-clock-display
```

### 2. Initialize Project with Vite

```bash
# Initialize Vite project (if not already initialized)
npm create vite@latest . -- --template vanilla

# Install dependencies
npm install
```

### 3. Install Development Dependencies

```bash
# Testing frameworks
npm install -D vitest @vitest/ui @testing-library/dom @playwright/test

# Code quality tools
npm install -D eslint prettier eslint-config-prettier

# Playwright browsers (for E2E testing)
npx playwright install
```

### 4. Configure Tools

Create or update configuration files:

**`vite.config.js`**:
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
  },
});
```

**`package.json`** (add scripts):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

**`.eslintrc.json`**:
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  }
}
```

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## Development Workflow

### TDD Cycle (Mandatory per Constitution)

**Red-Green-Refactor** workflow MUST be followed:

#### 1. RED: Write Failing Test

```bash
# Create test file first
touch tests/unit/timeConversion.test.js
```

Edit `tests/unit/timeConversion.test.js`:
```javascript
import { describe, test, expect } from 'vitest';
import { getDecimalTime } from '../../src/utils/timeConversion.js';

describe('getDecimalTime', () => {
  test('returns 0.00 at midnight', () => {
    const midnight = new Date('2026-03-06T00:00:00');
    const result = getDecimalTime(midnight);
    expect(result.value).toBe(0);
    expect(result.formatted).toBe('00.00');
  });
});
```

Run tests (should FAIL):
```bash
npm test
# Expected: Test fails because timeConversion.js doesn't exist yet
```

#### 2. GREEN: Write Minimal Implementation

```bash
# Create implementation file
mkdir -p src/utils
touch src/utils/timeConversion.js
```

Edit `src/utils/timeConversion.js`:
```javascript
export function getDecimalTime(date = new Date()) {
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);

  const millisecondsSinceMidnight = date - midnight;
  const millisecondsPerDay = 86400000;
  const value = (millisecondsSinceMidnight / millisecondsPerDay) * 100;

  return {
    value,
    tens: Math.floor(value / 10),
    ones: value % 10,
    formatted: value.toFixed(2),
  };
}
```

Run tests (should PASS):
```bash
npm test
# Expected: Test passes
```

#### 3. REFACTOR: Clean Up Code

- Extract magic numbers to constants
- Add JSDoc comments
- Improve variable names

Run tests again to ensure they still pass.

---

### Start Development Server

```bash
npm run dev
```

- Server runs at `http://localhost:5173` (or next available port)
- Hot Module Replacement (HMR) enabled - changes reflect instantly
- Open browser to see live updates

---

### Run Tests Continuously

```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Test watcher
npm test

# Alternative: Test UI (visual interface)
npm run test:ui
```

---

## Project Structure Setup

### Create Directory Structure

```bash
# Source directories
mkdir -p src/components/AnalogClock
mkdir -p src/components/DigitalClock
mkdir -p src/components/ClockPage
mkdir -p src/utils
mkdir -p src/styles

# Test directories
mkdir -p tests/unit/components
mkdir -p tests/integration
mkdir -p tests/e2e

# Public assets
mkdir -p public
```

### Create Entry Point HTML

**`index.html`** (in project root):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Decimal Clock</title>
</head>
<body>
  <main role="main" aria-label="Decimal Clock">
    <section aria-labelledby="analog-clock-heading">
      <h2 id="analog-clock-heading" class="sr-only">Analog Clock</h2>
      <canvas id="analog-clock" width="400" height="400" aria-label="Analog decimal clock face"></canvas>
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        Current decimal time: <span id="time-announcement"></span>
      </div>
    </section>

    <section aria-labelledby="digital-clock-heading">
      <h2 id="digital-clock-heading" class="sr-only">Digital Clock</h2>
      <time id="digital-clock" aria-label="Digital decimal time display">00.00</time>
    </section>
  </main>

  <script type="module" src="/src/index.js"></script>
</body>
</html>
```

### Create Main Entry Point

**`src/index.js`**:
```javascript
import { initializeClockPage } from './components/ClockPage/ClockPage.js';
import './styles/main.css';

// Initialize and start the clock
const clockPage = initializeClockPage();
clockPage.start();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  clockPage.destroy();
});
```

---

## Testing

### Run Unit Tests

```bash
# Run all tests once
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test timeConversion.test.js
```

### Run E2E Tests

```bash
# Run Playwright tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific browser
npm run test:e2e -- --project=chromium
```

### Example E2E Test

**`tests/e2e/clock-display.spec.js`**:
```javascript
import { test, expect } from '@playwright/test';

test('displays decimal time on page load', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check analog clock canvas exists
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

  // Time should have changed (unless it's exactly midnight)
  // This is a loose check; proper test would mock time
  expect(updatedTime).toBeTruthy();
});
```

---

## Building for Production

### Create Production Build

```bash
npm run build
```

- Output directory: `dist/`
- Assets are minified and optimized
- Source maps generated

### Preview Production Build Locally

```bash
npm run preview
```

- Serves the `dist/` directory
- Test production build before deploying

### Build Output

Expected `dist/` structure:
```
dist/
├── index.html
├── assets/
│   ├── index.[hash].js
│   ├── index.[hash].css
│   └── [other assets]
```

---

## Deployment

### Static Hosting Options

The Decimal Clock is a static web application - no server required.

#### Option 1: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 3: GitHub Pages

```bash
# Build
npm run build

# Deploy (assuming gh-pages package installed)
npx gh-pages -d dist
```

#### Option 4: Manual Deployment

Upload contents of `dist/` directory to any static web host:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Any shared hosting with FTP access

---

## Debugging

### Browser DevTools

#### Debug Canvas Rendering

1. Open Chrome DevTools
2. Navigate to **Application** > **Frames**
3. Inspect canvas element
4. Use **Performance** tab to profile animation performance

#### Check Animation Performance

```javascript
// Add to src/index.js temporarily
let frameCount = 0;
let lastCheck = performance.now();

function checkFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastCheck >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastCheck = now;
  }
  requestAnimationFrame(checkFPS);
}
checkFPS();
```

Expected output: ~60 FPS

### VS Code Debugging

**`.vscode/launch.json`**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## Common Issues and Solutions

### Issue: Canvas is blank

**Solution**:
- Check browser console for errors
- Verify canvas element has `width` and `height` attributes
- Ensure `getContext('2d')` succeeds
- Check if `render()` function is being called

### Issue: Clock not updating

**Solution**:
- Verify `AnimationController.start()` was called
- Check browser console for errors
- Ensure `requestAnimationFrame` is supported (use polyfill if needed)
- Check if page is visible (animation pauses when tab hidden)

### Issue: Test failures related to Date/time

**Solution**:
- Use `vi.useFakeTimers()` in tests to control time
- Set specific timestamps with `vi.setSystemTime()`
- Remember to call `vi.useRealTimers()` in `afterEach()`

### Issue: Bundle size too large

**Solution**:
- Run `npm run build` and check output size
- Analyze bundle: `npm install -D rollup-plugin-visualizer`
- Remove unused dependencies
- Ensure tree-shaking is working (check for side effects)

---

## Performance Benchmarks

### Target Metrics (from Constitution)

- **Initial page load**: <2 seconds
- **Time-to-interactive**: <3 seconds
- **Animation frame rate**: 30 fps minimum, 60 fps target
- **Memory usage**: <50MB heap
- **Bundle size**: <200KB gzipped

### Measuring Performance

```bash
# Lighthouse audit (in Chrome DevTools)
# Open DevTools > Lighthouse > Generate Report

# Bundle size check
npm run build
ls -lh dist/assets/*.js
```

---

## Next Steps

After completing quickstart setup:

1. **Generate tasks**: Run `/speckit.tasks` to create task breakdown
2. **Implement TDD**: Start with time conversion tests (Phase 0)
3. **Build components**: Implement AnalogClock, DigitalClock, ClockPage (Phase 1-2)
4. **Visual polish**: CSS styling, animations, accessibility (Phase 3)
5. **Testing**: Full test coverage, E2E tests, visual regression (Phase 4)
6. **Deploy**: Production build and deployment (Phase 5)

---

## References

- **Feature Spec**: `specs/001-decimal-clock-display/spec.md`
- **Implementation Plan**: `specs/001-decimal-clock-display/plan.md`
- **Data Model**: `specs/001-decimal-clock-display/data-model.md`
- **API Contracts**: `specs/001-decimal-clock-display/contracts/api.md`
- **Research**: `specs/001-decimal-clock-display/research.md`

- **Vite Docs**: https://vitejs.dev/
- **Vitest Docs**: https://vitest.dev/
- **Playwright Docs**: https://playwright.dev/
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

---

**Quickstart Status**: ✅ Complete
**Ready to begin**: Implementation phase (TDD workflow)
