# Research: Clock Styling Updates

**Feature**: 002-clock-styling-updates
**Date**: 2026-03-06
**Status**: Complete

## Overview

This document captures research decisions for implementing dark theme styling, analog clock rotation, and responsive sizing enhancements for the decimal clock.

## Research Topics

### 1. Dark Theme Color Selection

**Decision**: Use `#1a1a1a` (very dark grey) for background and `#2d2d2d` (slightly lighter grey) for clock face.

**Rationale**:
- Background (#1a1a1a): RGB(26, 26, 26) has ~10% luminance - qualifies as "very dark grey"
- Clock face (#2d2d2d): RGB(45, 45, 45) has ~18% luminance - 8% lighter than background, within "slightly lighter" range
- White text (#ffffff) on #1a1a1a: 15.8:1 contrast ratio - exceeds WCAG AA requirement (4.5:1)
- White text (#ffffff) on #2d2d2d: 13.6:1 contrast ratio - exceeds WCAG AA requirement
- Pure black (#000000) avoided - causes eye strain and harsh contrast on modern displays

**Alternatives Considered**:
- True black (#000000): Rejected - too harsh, can cause OLED burn-in, uncomfortable for extended viewing
- Lighter greys (#404040+): Rejected - doesn't meet "very dark" requirement from spec
- Color tints (blue-grey, warm grey): Rejected - keep neutral for maximum flexibility

**References**:
- Material Design dark theme guidelines
- WCAG 2.1 contrast calculator
- Apple Human Interface Guidelines (dark mode)

---

### 2. Analog Clock Rotation Mathematics

**Decision**: Rotate numeral positioning by 180 degrees (π radians) from current implementation.

**Current Implementation Analysis**:
```javascript
// Current: 0 at bottom (line 31 in AnalogClock.js)
const angle = (i / NUMERAL_COUNT) * 2 * Math.PI - Math.PI / 2;
// This creates: 0 at bottom (270°), 2.5 at right (0°), 5 at top (90°), 7.5 at left (180°)
```

**Required Change**:
```javascript
// New: 5 at top, 0 at bottom
// Shift by 180° to move 5 from right-side to top
const angle = (i / NUMERAL_COUNT) * 2 * Math.PI - Math.PI / 2 + Math.PI;
// Or simplified: const angle = (i / NUMERAL_COUNT) * 2 * Math.PI + Math.PI / 2;
```

**Verification**:
- i=0: (0/10)*2π + π/2 = π/2 (90°) → bottom position ✓
- i=5: (5/10)*2π + π/2 = π + π/2 = 3π/2 (270°) → top position ✓
- Sequential order maintained clockwise: 0→1→2→3→4→5→6→7→8→9 ✓

**Rationale**:
- Simple angle offset, mathematically sound
- No changes to hand rotation logic needed (hands already relative to numeral positions)
- Maintains existing animation smoothness

**Alternatives Considered**:
- Reverse numeral array: Rejected - breaks clockwise ordering
- CSS transform rotation: Rejected - would rotate hands backwards, creates coordinate system confusion

---

### 3. Responsive Sizing Strategy

**Decision**: Increase base canvas size from 400px to 550px, with proportional responsive breakpoints.

**Current Sizing**:
- Desktop default: 400px × 400px
- Tablet (≤768px): 300px × 300px
- Mobile (≤480px): 250px × 250px
- Digital font: 3rem → 2rem → 1.5rem

**New Sizing** (25%+ increase per SC-004, SC-005):
- Desktop default: 550px × 550px (+37.5%)
- Large desktop (≥1440px): max 650px × 650px (prevent excessive scaling)
- Tablet (≤1024px): 450px × 450px (+50% over old tablet)
- Mobile (≤768px): 350px × 350px (+16.7% over old mobile)
- Small mobile (≤480px): 280px × 280px (+12% over old mobile, maintain legibility)
- Digital font: 4rem → 3rem → 2rem → 1.5rem (adds 1024px breakpoint)

**Rationale**:
- 550px base meets "at least 25% larger" requirement (37.5% increase)
- Max size cap (650px) prevents awkward scaling on ultra-wide monitors
- Breakpoints align with common device widths
- Proportional scaling maintains aspect ratio and visual consistency
- Digital font scales in sync with analog clock
- Smaller increments for mobile preserve usability on constrained screens

**Alternatives Considered**:
- Fixed 25% increase only: Rejected - too conservative for desktop, insufficient visual impact
- No max size: Rejected - looks ridiculous on 4K+ displays, violates simplicity principle
- Container queries: Rejected - not needed (layout is simple), adds complexity, browser support

---

### 4. Canvas vs CSS Sizing Approach

**Decision**: Use CSS sizing with `canvas.width/height` sync in JavaScript.

**Rationale**:
- Current implementation already uses this pattern (canvas element has width/height attributes)
- CSS controls visual size, canvas width/height set internal resolution
- Prevents blur/pixelation by matching CSS pixels to canvas pixels
- Responsive sizing via CSS media queries (established pattern in main.css)
- No changes to rendering logic needed (already uses canvas.width/height for calculations)

**Implementation Pattern**:
```css
/* CSS sets visual size */
#analog-clock {
  width: 550px;
  height: 550px;
}
```

```javascript
// JavaScript syncs canvas resolution (already in ClockPage.js)
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
```

**Alternatives Considered**:
- Pure CSS sizing: Rejected - causes blurry canvas rendering
- Pure attribute sizing: Rejected - not responsive, requires JavaScript for all breakpoints

---

### 5. Accessibility Testing Approach

**Decision**: Use axe-core for automated WCAG testing, manual verification for contrast ratios.

**Rationale**:
- axe-core is industry standard, free, integrates with Playwright
- Automated checks cover: color contrast, ARIA labels, keyboard navigation
- Manual verification needed for: visual inspection of dark theme, actual contrast measurement
- Constitution requires WCAG 2.1 AA (4.5:1 contrast minimum)

**Testing Strategy**:
1. Calculate contrast ratios during development (WebAIM contrast checker)
2. Add axe-core tests in e2e suite for automated regression prevention
3. Manual QA checklist for subjective readability

**Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe-core Playwright integration: @axe-core/playwright
- Browser DevTools: Lighthouse accessibility audit

**Alternatives Considered**:
- Manual testing only: Rejected - error-prone, no regression prevention
- Paid tools (Accessibility Insights): Rejected - unnecessary, axe-core sufficient

---

### 6. Visual Regression Testing

**Decision**: Use Playwright's built-in screenshot comparison for visual regression testing.

**Rationale**:
- Playwright already in project dependencies
- Built-in `toHaveScreenshot()` matcher sufficient for color/sizing verification
- No additional dependencies needed (aligns with Simplicity principle)
- Can verify: dark theme colors, analog clock rotation, responsive sizes

**Test Coverage**:
- Dark theme: full-page screenshots comparing background/clock face colors
- Rotation: analog clock screenshots with specific time (verify 5 at top, 0 at bottom)
- Responsive: screenshots at each breakpoint (550px, 450px, 350px, 280px)

**Alternatives Considered**:
- Dedicated visual testing tools (Percy, Chromatic): Rejected - overkill, cost, added complexity
- Manual visual QA only: Rejected - no regression protection
- Canvas pixel comparison: Rejected - too brittle, flaky tests

---

## Summary of Decisions

| Decision Area | Choice | Key Metric |
|---------------|--------|------------|
| Background color | #1a1a1a | 15.8:1 contrast with white |
| Clock face color | #2d2d2d | 13.6:1 contrast with white |
| Text/hands color | #ffffff | Pure white for maximum readability |
| Clock rotation | +180° angle offset (+π radians) | 5 at top, 0 at bottom |
| Desktop size | 550px × 550px | 37.5% increase |
| Max size cap | 650px × 650px | Prevents excessive scaling |
| Digital font | 4rem base (up from 3rem) | 33% increase |
| Responsive approach | CSS + canvas sync | Established pattern, no blur |
| Accessibility testing | axe-core + manual | WCAG 2.1 AA compliance |
| Visual regression | Playwright screenshots | No new dependencies |

## Open Questions

None - all research complete and ready for Phase 1 design.
