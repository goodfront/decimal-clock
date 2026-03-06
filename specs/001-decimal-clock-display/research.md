# Research: Decimal Clock Display

**Date**: 2026-03-06
**Feature**: 001-decimal-clock-display

## Overview

This document consolidates research findings for technology choices and implementation patterns for the Decimal Clock Display feature.

## Technology Stack Decision

### Language/Framework Choice

**Decision**: Vanilla JavaScript (ES6+) with modern browser APIs

**Rationale**:
- **Simplicity First (Constitution Principle I)**: No framework overhead aligns with YAGNI and minimal dependencies
- **Performance**: Zero framework bundle size → smaller total payload (<200KB target easily achievable)
- **Browser API maturity**: Canvas API, requestAnimationFrame, Date API are well-established and performant
- **TDD compatibility**: Easy to test pure functions and DOM manipulation with modern test runners
- **Learning curve**: Straightforward for maintenance and contributions

**Alternatives considered**:
1. **React**: Rejected - adds ~40KB gzipped minimum, overkill for single-page clock with no complex state management
2. **Svelte**: Rejected - while compiled (no runtime), adds tooling complexity and build step without clear benefit for this use case
3. **Vue**: Rejected - similar to React, unnecessary framework weight and abstraction
4. **TypeScript**: Deferred - can add later if type safety becomes priority, but JSDoc comments + vanilla JS sufficient for small codebase

### Testing Framework

**Decision**: Vitest + Testing Library + Playwright

**Rationale**:
- **Vitest**: Modern, fast, ESM-native test runner with excellent DX
  - Built-in code coverage
  - Compatible with Jest API (familiar)
  - Faster execution than Jest
- **Testing Library**: Provides DOM testing utilities without framework coupling
  - Encourages accessibility-focused testing (aligns with Constitution Principle III)
  - Query by ARIA roles and labels
- **Playwright**: End-to-end visual testing
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Visual regression testing capabilities
  - Performance measurement APIs

**Alternatives considered**:
1. **Jest**: Rejected - slower than Vitest, ESM support less mature
2. **Cypress**: Rejected - heavier than Playwright, less modern API
3. **Mocha/Chai**: Rejected - requires more configuration, less batteries-included

### Build Tooling

**Decision**: Vite

**Rationale**:
- **Fast dev server**: ESM-based, instant HMR
- **Simple config**: Minimal setup for vanilla JS projects
- **Optimized production builds**: Rollup-based bundling with tree-shaking
- **Built-in features**: CSS preprocessing, asset handling, minification
- **Vitest integration**: Same config file for dev and test

**Alternatives considered**:
1. **Webpack**: Rejected - more complex config, slower dev server
2. **Parcel**: Rejected - less control over build output
3. **No build tool**: Rejected - miss out on minification, tree-shaking, dev experience improvements

### Graphics Rendering

**Decision**: Canvas API (2D Context) for analog clock, DOM for digital clock

**Rationale**:
- **Performance**: Canvas excels at continuous redraws (60 fps target)
  - Hardware-accelerated rendering
  - Efficient pixel manipulation
  - No layout/reflow overhead
- **Precision**: Smooth hand rotation via mathematical coordinates
- **Simplicity**: Straightforward drawing API (arc, line, text)
- **Accessibility**: Canvas content supplemented with ARIA live regions for screen readers

**Alternatives considered**:
1. **SVG**: Rejected - DOM manipulation overhead for smooth animation, though more accessible by default
2. **CSS transforms**: Rejected - requires creating DOM elements for hands/numerals, less flexible for custom drawing
3. **WebGL**: Rejected - massive overkill for 2D clock rendering

### Animation Strategy

**Decision**: requestAnimationFrame (rAF) with timestamp-based calculation

**Rationale**:
- **Smooth 60 fps**: rAF synchronized with browser repaint cycle
- **Battery efficient**: Automatically pauses when tab inactive
- **Timestamp-based**: Eliminates cumulative timing errors
  - Calculate decimal time from Date.now() on each frame
  - No drift over time
- **Graceful degradation**: Falls back to setTimeout in unsupported browsers (unlikely)

**Alternatives considered**:
1. **setInterval**: Rejected - not synchronized with repaint, causes jank, accumulates timing errors
2. **CSS animations**: Rejected - insufficient for dynamic time-based rendering
3. **Web Animations API**: Rejected - better for keyframe animations, not continuous calculated updates

## Implementation Patterns

### Time Conversion Algorithm

**Best Practice**: Millisecond-precision calculation from midnight

```javascript
function getDecimalTime() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);

  const millisecondsSinceMidnight = now - midnight;
  const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000

  // 100 decimal units per day
  const decimalTime = (millisecondsSinceMidnight / millisecondsPerDay) * 100;

  return decimalTime; // 0.00 to 99.99+
}
```

**Validation**:
- Midnight (00:00:00) → 0.00
- 6 AM (2160 seconds = 2,160,000 ms) → 25.00
- Noon (43,200,000 ms) → 50.00
- 11:59:59 PM (86,399,000 ms) → 99.98843...

### Canvas Drawing Pattern

**Best Practice**: Clear-render cycle in animation loop

```javascript
function drawAnalogClock(ctx, decimalTime) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw clock face
  drawClockFace(ctx, centerX, centerY, radius);

  // Draw hands
  const tens = Math.floor(decimalTime / 10);
  const ones = decimalTime % 10;

  drawHand(ctx, centerX, centerY, radius * 0.5, (tens / 10) * 360, 6); // tens hand
  drawHand(ctx, centerX, centerY, radius * 0.8, (ones / 10) * 360, 3); // ones hand
}
```

### Accessibility Pattern

**Best Practice**: ARIA live regions + semantic HTML

```html
<main role="main" aria-label="Decimal Clock">
  <section aria-labelledby="analog-clock-heading">
    <h2 id="analog-clock-heading" class="sr-only">Analog Clock</h2>
    <canvas id="analog-clock" aria-label="Analog decimal clock face"></canvas>
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      Current decimal time: <span id="time-announcement"></span>
    </div>
  </section>

  <section aria-labelledby="digital-clock-heading">
    <h2 id="digital-clock-heading" class="sr-only">Digital Clock</h2>
    <time id="digital-clock" aria-label="Digital decimal time display">00.00</time>
  </section>
</main>
```

**Update strategy**: Announce time changes every 10 decimal units (roughly every 14.4 minutes) to avoid overwhelming screen readers

### Testing Patterns

**Best Practice**: Test time conversion with fixed timestamps

```javascript
// Mock Date.now() for deterministic tests
describe('getDecimalTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('midnight returns 0.00', () => {
    const midnight = new Date('2026-03-06T00:00:00');
    vi.setSystemTime(midnight);
    expect(getDecimalTime()).toBe(0);
  });

  test('6 AM returns 25.00', () => {
    const sixAM = new Date('2026-03-06T06:00:00');
    vi.setSystemTime(sixAM);
    expect(getDecimalTime()).toBe(25);
  });

  test('noon returns 50.00', () => {
    const noon = new Date('2026-03-06T12:00:00');
    vi.setSystemTime(noon);
    expect(getDecimalTime()).toBe(50);
  });
});
```

## Performance Considerations

### Bundle Size Optimization

**Strategies**:
- No external dependencies (except dev dependencies for testing/building)
- Minification via Vite (Terser for JS, cssnano for CSS)
- Tree-shaking enabled automatically
- Code splitting not needed (single-page, minimal code)

**Expected bundle size**: ~10-20KB gzipped (well under 200KB target)

### Runtime Performance

**Strategies**:
- **Avoid unnecessary redraws**: Only redraw canvas when time changes visibly
  - Cache last drawn decimal time
  - Skip draw if change < 0.01 decimal units (imperceptible)
- **Debounce resize events**: Recalculate canvas dimensions on window resize with 150ms debounce
- **Offload calculations**: Pre-calculate numeral positions once, store in constants
- **Use integer arithmetic where possible**: Minimize floating-point operations in hot paths

### Memory Management

**Strategies**:
- No memory leaks from animation: Use single rAF loop with cleanup on unmount
- Canvas size optimization: Use CSS for display size, devicePixelRatio for canvas resolution
- No retained objects: All drawing calculations happen in function scope, no closures retaining references

## Browser Compatibility

### Target Support Matrix

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | Latest 2 | Primary development target |
| Firefox | Latest 2 | Full support expected |
| Safari | Latest 2 | Test on macOS and iOS |
| Edge | Latest 2 | Chromium-based, same as Chrome |

### Graceful Degradation

**No JavaScript fallback**:
```html
<noscript>
  <p>This decimal clock requires JavaScript to display dynamic time updates.</p>
  <p>Current time: [server-rendered static decimal time if backend added]</p>
</noscript>
```

**Canvas unsupported fallback**: Display message in canvas fallback content
```html
<canvas id="analog-clock">
  <p>Your browser does not support HTML5 Canvas, which is required for the analog clock display.</p>
</canvas>
```

## Security Considerations

**No security concerns identified**:
- No user input (XSS not applicable)
- No external data fetching (CSRF/injection not applicable)
- No sensitive data (no authentication, no storage)
- Client-side only (no server attack surface)

**CSP Recommendation**: Default restrictive CSP sufficient
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

Note: `'unsafe-inline'` for styles only if inline styles used, prefer external CSS

## Development Environment Setup

### Required Tools

- **Node.js**: v18+ (LTS)
- **npm**: v9+ (comes with Node.js)
- **Browser DevTools**: Chrome DevTools recommended for Canvas inspection

### Recommended VS Code Extensions

- ESLint: Code quality enforcement
- Prettier: Code formatting
- Live Server (fallback): Though Vite dev server preferred
- Testing Library snippets

### Project Initialization Commands

```bash
npm create vite@latest . -- --template vanilla
npm install -D vitest @testing-library/dom @playwright/test
npm install -D eslint prettier
```

## Open Questions / Future Research

**Resolved**: All major technical decisions complete for Phase 1 implementation

**Deferred** (out of scope for v1):
- Internationalization (i18n) for decimal time format
- Dark mode / theme customization
- Export time as image/screenshot feature
- PWA/offline capabilities
- Timezone selection

---

**Research Status**: ✅ Complete - All NEEDS CLARIFICATION items resolved
**Next Phase**: Phase 1 - Design & Contracts (data-model.md, contracts/, quickstart.md)
