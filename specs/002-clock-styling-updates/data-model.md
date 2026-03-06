# Data Model: Clock Styling Updates

**Feature**: 002-clock-styling-updates
**Date**: 2026-03-06

## Overview

This feature is purely presentational - it modifies visual styling and positioning without introducing new data entities or state management. This document captures the configuration values and visual entities involved in the styling changes.

## Configuration Values

These are the key styling constants that define the visual appearance:

### Color Scheme (Dark Theme)

| Entity | Value | Purpose | Constraints |
|--------|-------|---------|-------------|
| Page Background | `#1a1a1a` | Very dark grey backdrop for entire viewport | Must maintain ≥4.5:1 contrast with white text (WCAG AA) |
| Clock Face Background | `#2d2d2d` | Slightly lighter grey for analog clock circle | Must be visually distinguishable from page background (~10-20% luminance difference) |
| Text/Numerals Color | `#ffffff` | White color for all text, numbers, and labels | Pure white for maximum readability on dark backgrounds |
| Clock Hands Color | `#ffffff` | White color for both tens and ones hands | Consistent with text color, maintains visibility |
| Clock Face Border | `#ffffff` | White outline for analog clock circle | Defines clock face boundary |

### Sizing Values

| Entity | Breakpoint | Size | Rationale |
|--------|------------|------|-----------|
| Analog Clock (Desktop) | ≥1025px | 550px × 550px | 37.5% increase from 400px baseline |
| Analog Clock (Max) | ≥1440px | 650px × 650px | Cap to prevent excessive scaling |
| Analog Clock (Tablet) | ≤1024px | 450px × 450px | Proportional scaling for tablet displays |
| Analog Clock (Mobile) | ≤768px | 350px × 350px | Maintains legibility on smaller screens |
| Analog Clock (Small Mobile) | ≤480px | 280px × 280px | Minimum readable size |
| Digital Clock (Desktop) | ≥1025px | 4rem | 33% increase from 3rem baseline |
| Digital Clock (Tablet) | ≤1024px | 3rem | Proportional scaling |
| Digital Clock (Mobile) | ≤768px | 2rem | Readable on smaller screens |
| Digital Clock (Small Mobile) | ≤480px | 1.5rem | Minimum readable size |

### Rotation Values

| Entity | Current Angle | New Angle | Delta | Verification |
|--------|--------------|-----------|-------|--------------|
| Numeral 0 Position | 270° (bottom) | 90° (bottom) | +180° | Should remain at 6 o'clock visual position |
| Numeral 5 Position | 90° (top) | 270° (top) | +180° | Should move to 12 o'clock visual position |
| Angle Calculation | `(i/10) × 2π - π/2` | `(i/10) × 2π + π/2` | +π radians | Add π to existing formula |

## Visual Entities

These describe the visual components affected by styling changes:

### Clock Face Entity

**Properties**:
- Background color: Slightly lighter grey (#2d2d2d)
- Border color: White (#ffffff)
- Border width: 2px (unchanged from current)
- Shape: Circle (unchanged)
- Radius: Calculated as `min(canvas.width, canvas.height) / 2 - padding`

**Relationships**:
- Contains: 10 numerals (0-9)
- Contains: Center dot
- Displayed on: Page background
- Inside: Canvas element

**Validation Rules**:
- Must be fully visible within canvas bounds
- Must maintain circular aspect ratio
- Background color must contrast with page background

### Clock Numeral Entity

**Properties**:
- Value: 0-9 (integer)
- Position: Polar coordinates (angle, radius from center)
- Angle: `(value / 10) × 2π + π/2` radians
- Radius: `clock_radius × 0.85` (unchanged from current)
- Color: White (#ffffff)
- Font: 20px sans-serif (unchanged from current)
- Alignment: Center, middle baseline

**Relationships**:
- Belongs to: Clock face
- Positioned relative to: Clock center point

**Validation Rules**:
- Angle must place value=5 at top (270°)
- Angle must place value=0 at bottom (90°)
- Sequential order: 0→1→2→3→4→5→6→7→8→9 going clockwise
- All numerals must be within clock face bounds

### Clock Hand Entity

**Properties**:
- Type: Tens hand or Ones hand
- Color: White (#ffffff)
- Width: 6px (tens) or 3px (ones) - unchanged
- Length: 50% radius (tens) or 80% radius (ones) - unchanged
- Start point: Clock center
- End point: Calculated from decimal time and rotation

**Relationships**:
- Displayed on: Clock face
- Rotation relative to: Numeral positions (no change needed - hands already relative)

**Validation Rules**:
- Must be visible against clock face background
- Must maintain smooth animation (60fps target)
- Must point to correct decimal time position

### Digital Display Entity

**Properties**:
- Content: Decimal time string (format: "XX.XX")
- Color: White (#ffffff)
- Background: `rgba(255, 255, 255, 0.1)` (10% white transparency) - unchanged
- Font family: 'Courier New', monospace - unchanged
- Font size: 4rem (desktop), 3rem (tablet), 2rem (mobile), 1.5rem (small mobile)
- Padding: 1rem 2rem - unchanged
- Border radius: 10px - unchanged

**Relationships**:
- Displayed below: Analog clock
- Displayed on: Page background

**Validation Rules**:
- Text must contrast ≥4.5:1 with background
- Must remain readable at all responsive sizes
- Must update in sync with analog clock

### Page Background Entity

**Properties**:
- Color: Very dark grey (#1a1a1a)
- Coverage: Full viewport (100vw × 100vh)
- Display: Flex container, centered content

**Relationships**:
- Contains: Analog clock section
- Contains: Digital clock section

**Validation Rules**:
- Must cover entire viewport with no gaps
- Must provide sufficient contrast for white text

## State Transitions

No state transitions - this feature does not introduce interactive state changes. All visual updates continue to be driven by the existing time calculation system (updates every animation frame).

## Validation Summary

| Requirement | Validation Method | Success Criteria |
|-------------|-------------------|------------------|
| FR-001: Very dark grey background | Color picker / computed styles | Background color = #1a1a1a |
| FR-002: Slightly lighter clock face | Color picker / luminance calculation | Clock face = #2d2d2d, ~8% lighter luminance |
| FR-003: White text/hands | Color picker / computed styles | All text/hands = #ffffff |
| FR-004: 5 at top | Visual inspection / angle calculation | Numeral 5 at 270° (12 o'clock position) |
| FR-005: 0 at bottom | Visual inspection / angle calculation | Numeral 0 at 90° (6 o'clock position) |
| FR-006: Sequential order | Visual inspection | 0→9 clockwise from bottom |
| FR-007: Larger sizes | Computed styles / measurement | Desktop: 550px analog, 4rem digital |
| FR-008: Responsive | Resize testing | All breakpoints scale proportionally |
| FR-009: WCAG AA contrast | Contrast checker | All text ≥4.5:1 ratio |

## Notes

- No database/storage involved - all values are CSS constants and calculated positions
- No user input or form validation needed
- No data persistence or API calls
- Changes are purely visual and do not affect the underlying decimal time calculation logic
