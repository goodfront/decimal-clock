# Visual Design Contract: Clock Styling Updates

**Feature**: 002-clock-styling-updates
**Date**: 2026-03-06
**Version**: 1.0.0

## Purpose

This document defines the visual design contract for the decimal clock dark theme styling update. It serves as the authoritative reference for visual implementation and testing.

## Color Contract

### Exact Color Values

```css
/* Page Background */
--page-bg: #1a1a1a;           /* RGB(26, 26, 26), ~10% luminance */

/* Clock Face */
--clock-face-bg: #2d2d2d;     /* RGB(45, 45, 45), ~18% luminance */
--clock-face-border: #ffffff; /* Pure white, 2px stroke */

/* Text and Elements */
--text-color: #ffffff;        /* Pure white */
--numeral-color: #ffffff;     /* Pure white */
--hand-color: #ffffff;        /* Pure white */

/* Digital Display */
--digital-text: #ffffff;                    /* Pure white */
--digital-bg: rgba(255, 255, 255, 0.1);    /* 10% white transparency */
```

### Contrast Requirements

| Foreground | Background | Ratio | WCAG Level |
|------------|-----------|-------|------------|
| #ffffff (text) | #1a1a1a (page) | 15.8:1 | AAA |
| #ffffff (numerals) | #2d2d2d (clock face) | 13.6:1 | AAA |
| #ffffff (digital) | rgba(255,255,255,0.1) over #1a1a1a | ≥4.5:1 | AA (minimum) |

## Size Contract

### Desktop (≥1025px width)

```css
/* Analog Clock */
#analog-clock {
  width: 550px;
  height: 550px;
  canvas.width: 550;  /* Match CSS for sharp rendering */
  canvas.height: 550;
}

/* Digital Clock */
#digital-clock {
  font-size: 4rem;    /* 64px at default browser settings */
}
```

### Large Desktop (≥1440px width)

```css
/* Analog Clock - Maximum Size Cap */
#analog-clock {
  width: 650px;
  height: 650px;
  canvas.width: 650;
  canvas.height: 650;
}

/* Digital Clock */
#digital-clock {
  font-size: 4rem;    /* No increase beyond desktop */
}
```

### Tablet (≤1024px width)

```css
/* Analog Clock */
#analog-clock {
  width: 450px;
  height: 450px;
  canvas.width: 450;
  canvas.height: 450;
}

/* Digital Clock */
#digital-clock {
  font-size: 3rem;    /* 48px */
}
```

### Mobile (≤768px width)

```css
/* Analog Clock */
#analog-clock {
  width: 350px;
  height: 350px;
  canvas.width: 350;
  canvas.height: 350;
}

/* Digital Clock */
#digital-clock {
  font-size: 2rem;    /* 32px */
}
```

### Small Mobile (≤480px width)

```css
/* Analog Clock */
#analog-clock {
  width: 280px;
  height: 280px;
  canvas.width: 280;
  canvas.height: 280;
}

/* Digital Clock */
#digital-clock {
  font-size: 1.5rem;  /* 24px */
}
```

## Rotation Contract

### Numeral Positioning

**Formula**: `angle = (numeralValue / 10) × 2π + π/2` radians

**Expected Positions** (in standard mathematical coordinates):

| Numeral | Angle (radians) | Angle (degrees) | Visual Position |
|---------|-----------------|-----------------|-----------------|
| 0 | π/2 | 90° | Bottom (6 o'clock) |
| 1 | π/2 + π/5 | 126° | Bottom-left |
| 2 | π/2 + 2π/5 | 162° | Left-bottom |
| 3 | π/2 + 3π/5 | 198° | Left-top |
| 4 | π/2 + 4π/5 | 234° | Top-left |
| 5 | π/2 + π | 270° | Top (12 o'clock) |
| 6 | π/2 + 6π/5 | 306° | Top-right |
| 7 | π/2 + 7π/5 | 342° | Right-top |
| 8 | π/2 + 8π/5 | 378° (18°) | Right-bottom |
| 9 | π/2 + 9π/5 | 414° (54°) | Bottom-right |

**Verification**:
- Numeral 5 must be at top center (visual 12 o'clock position)
- Numeral 0 must be at bottom center (visual 6 o'clock position)
- Reading clockwise from 0 at bottom: 0→1→2→3→4→5→6→7→8→9→0

### Hand Rotation

Hands continue to use existing relative rotation logic (no changes needed). Hands point to decimal time positions relative to the rotated numeral layout.

**Current behavior preserved**:
- Tens hand: rotates one full circle per 10 decimal hours (0.00 → 10.00)
- Ones hand: rotates one full circle per 1 decimal hour (X.00 → X.99)

## Layout Contract

### Page Layout

```
┌─────────────────────────────────────────────┐
│  <body> (background: #1a1a1a)               │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  <main> (flexbox center)              │ │
│  │                                       │ │
│  │      ┌──────────────────┐            │ │
│  │      │  Analog Clock    │            │ │
│  │      │  (canvas)        │            │ │
│  │      │  bg: #2d2d2d     │            │ │
│  │      └──────────────────┘            │ │
│  │                                       │ │
│  │      ┌──────────────────┐            │ │
│  │      │  Digital: 45.67  │            │ │
│  │      │  (white text)    │            │ │
│  │      └──────────────────┘            │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Spacing (Unchanged from Current)

- Main padding: 2rem
- Section margin: 1rem 0
- Digital clock margin-top: 2rem
- Digital clock padding: 1rem 2rem

## Accessibility Contract

### ARIA Attributes (Preserved)

```html
<main role="main" aria-label="Decimal Clock">
  <section aria-labelledby="analog-clock-heading">
    <h2 id="analog-clock-heading" class="sr-only">Analog Clock</h2>
    <canvas id="analog-clock" aria-label="Analog decimal clock face">
      <!-- Fallback text -->
    </canvas>
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      Current decimal time: <span id="time-announcement"></span>
    </div>
  </section>

  <section aria-labelledby="digital-clock-heading">
    <h2 id="digital-clock-heading" class="sr-only">Digital Clock</h2>
    <time id="digital-clock" aria-label="Digital decimal time display">
      00.00
    </time>
  </section>
</main>
```

### Focus States

Not applicable - clock is non-interactive (display-only).

### Screen Reader Announcements

Existing behavior preserved:
- Time updates announced via `aria-live="polite"` region
- Updates occur when decimal time changes (not every frame)

## Animation Contract

### Performance Requirements

- **Frame Rate**: Maintain 60 fps for smooth hand rotation
- **Animation Method**: `requestAnimationFrame` (existing implementation)
- **Update Frequency**: Every frame (~16.67ms intervals)
- **No Jank**: Frame time must stay under 16.67ms (no long-running tasks)

### Animation Smoothness

- Hands move continuously, not in discrete jumps
- No stuttering during rotation
- No visible tearing or artifacts

## Browser Compatibility Contract

### Minimum Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

### Feature Requirements

- Canvas 2D rendering API
- CSS Flexbox
- CSS Media Queries
- CSS Custom Properties (optional enhancement)
- `requestAnimationFrame`

### Graceful Degradation

If JavaScript disabled:
- Static time display fallback (00.00)
- Accessible fallback text in canvas

## Testing Contract

### Visual Regression Tests

```javascript
// Playwright tests must verify:
test('dark theme colors', async ({ page }) => {
  const pageBg = await page.locator('body').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  expect(pageBg).toBe('rgb(26, 26, 26)'); // #1a1a1a

  await expect(page).toHaveScreenshot('dark-theme.png');
});

test('analog clock rotation', async ({ page }) => {
  // Set specific time for predictable hand positions
  await expect(page.locator('#analog-clock')).toHaveScreenshot(
    'rotation-5-at-top.png'
  );
});

test('responsive sizing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page).toHaveScreenshot('desktop-large.png');

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page).toHaveScreenshot('tablet.png');

  // ... additional breakpoints
});
```

### Accessibility Tests

```javascript
test('WCAG AA contrast', async ({ page }) => {
  // Use axe-core
  const results = await injectAxe(page);
  expect(results.violations).toHaveLength(0);
});
```

### Unit Tests

```javascript
test('numeral angle calculation', () => {
  // Verify rotation formula
  const getAngle = (i) => (i / 10) * 2 * Math.PI + Math.PI / 2;

  expect(getAngle(0)).toBeCloseTo(Math.PI / 2);      // 90° (bottom)
  expect(getAngle(5)).toBeCloseTo(3 * Math.PI / 2);  // 270° (top)
});
```

## Version History

- **1.0.0** (2026-03-06): Initial contract for dark theme + rotation + sizing updates
