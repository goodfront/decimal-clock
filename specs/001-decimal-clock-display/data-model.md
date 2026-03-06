# Data Model: Decimal Clock Display

**Date**: 2026-03-06
**Feature**: 001-decimal-clock-display

## Overview

This document defines the core data structures and entities for the Decimal Clock Display application. Since this is a client-side-only application with no persistence, the data model focuses on runtime state and calculation outputs.

## Core Entities

### DecimalTime

**Purpose**: Represents a point in time using the decimal time system where 100 units = 24 hours.

**Structure**:
```javascript
{
  value: Number,        // Full decimal time (0.00 to 99.99+)
  tens: Number,         // Tens digit (0-9)
  ones: Number,         // Ones digit with decimals (0.00 to 9.99+)
  formatted: String     // Display string (e.g., "25.00", "75.24")
}
```

**Field Details**:
- `value`: Float, range [0.00, 100.00), precision to milliseconds
  - Calculation: `(millisecondsSinceMidnight / 86400000) * 100`
  - Examples: 0.00 (midnight), 25.00 (6 AM), 50.00 (noon), 99.99 (near midnight)
- `tens`: Integer, range [0, 9]
  - Calculation: `Math.floor(value / 10)`
  - Used for analog clock tens hand position
- `ones`: Float, range [0.00, 10.00)
  - Calculation: `value % 10`
  - Used for analog clock ones hand position
- `formatted`: String, format "XX.XX"
  - Calculation: `value.toFixed(2)`
  - Used for digital clock display

**Validation Rules**:
- `value` MUST be >= 0 and < 100
- `tens` MUST be an integer between 0 and 9
- `ones` MUST be >= 0 and < 10
- `formatted` MUST match regex pattern: `^\d{2}\.\d{2}$`

**State Transitions**:
- Recalculated on every animation frame (60 fps target)
- Midnight rollover: 99.99... → 0.00 (continuous, no special handling needed)

**Example Instances**:
```javascript
// Midnight
{ value: 0, tens: 0, ones: 0, formatted: "00.00" }

// 6 AM (2160 seconds after midnight)
{ value: 25, tens: 2, ones: 5, formatted: "25.00" }

// Noon
{ value: 50, tens: 5, ones: 0, formatted: "50.00" }

// 7:30:45 PM (75.24 decimal)
{ value: 75.24305..., tens: 7, ones: 5.24305..., formatted: "75.24" }
```

---

### ClockHandPosition

**Purpose**: Represents the visual position of an analog clock hand.

**Structure**:
```javascript
{
  angle: Number,        // Rotation angle in degrees (0-360)
  radius: Number,       // Hand length multiplier (0.0-1.0)
  width: Number         // Hand thickness in pixels
}
```

**Field Details**:
- `angle`: Float, range [0, 360), 0° = bottom (at numeral 0), increases clockwise
  - Calculation for tens hand: `(tens / 10) * 360`
  - Calculation for ones hand: `(ones / 10) * 360`
- `radius`: Float, range [0.0, 1.0], multiplier of clock face radius
  - Tens hand: 0.5 (shorter hand)
  - Ones hand: 0.8 (longer hand)
- `width`: Integer, pixels
  - Tens hand: 6px
  - Ones hand: 3px

**Relationships**:
- Derived from `DecimalTime` entity
- Two instances per clock: tens hand and ones hand

**Example Instances**:
```javascript
// Tens hand at 25.00 decimal time (2.5 on clock face)
{ angle: 90, radius: 0.5, width: 6 }

// Ones hand at 25.00 decimal time (5.0 on clock face)
{ angle: 180, radius: 0.8, width: 3 }
```

---

### ClockFace

**Purpose**: Defines the static structure of the analog clock display.

**Structure**:
```javascript
{
  centerX: Number,      // Center X coordinate (pixels)
  centerY: Number,      // Center Y coordinate (pixels)
  radius: Number,       // Clock face radius (pixels)
  numerals: Array<{    // Positions of 0-9 numerals
    value: Number,      // Numeral value (0-9)
    angle: Number,      // Position angle in degrees
    x: Number,          // X coordinate (pixels)
    y: Number           // Y coordinate (pixels)
  }>
}
```

**Field Details**:
- `centerX`, `centerY`: Calculated from canvas dimensions
  - `centerX = canvas.width / 2`
  - `centerY = canvas.height / 2`
- `radius`: Calculated from canvas dimensions with padding
  - `radius = Math.min(centerX, centerY) - 10`
- `numerals`: Array of 10 objects, one per numeral
  - `value`: 0 to 9
  - `angle`: `(value / 10) * 360`, where 0 = bottom (270° in standard coords)
  - `x`: `centerX + radius * 0.85 * Math.cos(angleRadians)`
  - `y`: `centerY + radius * 0.85 * Math.sin(angleRadians)`

**Validation Rules**:
- `radius` MUST be > 0
- `numerals` MUST contain exactly 10 elements
- Numeral 0 MUST be positioned at the bottom of the clock face

**State Transitions**:
- Recalculated only on canvas resize (window resize event, debounced)
- Remains constant during normal operation

---

### AnimationState

**Purpose**: Manages the animation loop lifecycle and frame timing.

**Structure**:
```javascript
{
  frameId: Number | null,        // requestAnimationFrame ID
  lastDrawnTime: Number | null,  // Last decimal time value drawn
  isRunning: Boolean             // Animation loop active status
}
```

**Field Details**:
- `frameId`: Return value from `requestAnimationFrame()`, used to cancel animation
  - `null` when animation is not running
- `lastDrawnTime`: Last `DecimalTime.value` that was rendered
  - Used to skip unnecessary redraws when time hasn't changed perceptibly
  - `null` before first frame
- `isRunning`: Boolean flag indicating animation loop state
  - `true` when animation is active
  - `false` when stopped (e.g., page hidden, component unmounted)

**State Transitions**:
1. **Initialization**: `{ frameId: null, lastDrawnTime: null, isRunning: false }`
2. **Start Animation**: Set `isRunning = true`, set `frameId = requestAnimationFrame(loop)`
3. **Animation Loop**: Update `lastDrawnTime` after each draw
4. **Stop Animation**: Call `cancelAnimationFrame(frameId)`, set `isRunning = false`

---

## Data Flow

### Time Calculation Flow

```
Browser Date API
       ↓
Date.now() - midnight timestamp
       ↓
millisecondsSinceMidnight
       ↓
(milliseconds / 86400000) * 100
       ↓
DecimalTime entity
       ↓
┌──────────────┬──────────────┐
↓              ↓              ↓
tens         ones       formatted
↓              ↓              ↓
AnalogClock  AnalogClock  DigitalClock
```

### Render Flow

```
requestAnimationFrame callback
       ↓
getCurrentDecimalTime() → DecimalTime
       ↓
Check if |DecimalTime.value - lastDrawnTime| > 0.01
       ↓
(if changed significantly)
       ↓
┌──────────────────────────────┐
↓                              ↓
renderAnalogClock()      renderDigitalClock()
↓                              ↓
ClockHandPosition         formatted string
↓                              ↓
Canvas draw commands      DOM textContent update
```

### Resize Flow

```
Window resize event
       ↓
Debounce 150ms
       ↓
Recalculate ClockFace dimensions
       ↓
Clear and redraw canvas
```

---

## Constants and Configuration

### Time Conversion Constants

```javascript
const MILLISECONDS_PER_DAY = 86400000;  // 24 * 60 * 60 * 1000
const DECIMAL_UNITS_PER_DAY = 100;
const SECONDS_AT_6AM = 2160;            // Validation checkpoint
const DECIMAL_TIME_AT_6AM = 25.00;      // Validation checkpoint
```

### Clock Display Constants

```javascript
const NUMERAL_COUNT = 10;               // 0 through 9
const NUMERAL_POSITION_RADIUS = 0.85;   // Multiplier for numeral placement
const TENS_HAND_RADIUS = 0.5;
const ONES_HAND_RADIUS = 0.8;
const TENS_HAND_WIDTH = 6;              // pixels
const ONES_HAND_WIDTH = 3;              // pixels
const CLOCK_PADDING = 10;               // pixels from canvas edge
```

### Animation Constants

```javascript
const TARGET_FPS = 60;
const MIN_DRAW_THRESHOLD = 0.01;        // Minimum decimal time change to trigger redraw
const RESIZE_DEBOUNCE_MS = 150;
```

### Accessibility Constants

```javascript
const SCREEN_READER_UPDATE_INTERVAL = 10;  // Announce every 10 decimal units (~14.4 min)
```

---

## Validation and Invariants

### System Invariants

1. **Time Accuracy**: `DecimalTime.value` MUST match hand positions within 0.01 units
   - Test: `Math.abs(decimalTime.value - (tens * 10 + ones)) < 0.01`

2. **Midnight Mapping**: At 00:00:00 standard time, decimal time MUST be 0.00
   - Test: `getDecimalTime(new Date('2026-03-06T00:00:00')) === 0`

3. **Noon Mapping**: At 12:00:00 standard time, decimal time MUST be 50.00
   - Test: `getDecimalTime(new Date('2026-03-06T12:00:00')) === 50`

4. **6 AM Mapping**: At 06:00:00 standard time, decimal time MUST be 25.00
   - Test: `getDecimalTime(new Date('2026-03-06T06:00:00')) === 25`

5. **Hand Synchronization**: Analog clock hands MUST visually correspond to digital display
   - Test: Visual regression test comparing rendered frames

6. **Continuous Updates**: Clock MUST update at least 10 times per second
   - Test: Count frame callbacks over 1-second interval >= 10

7. **No Memory Leaks**: Animation loop MUST clean up when page hidden
   - Test: Verify `cancelAnimationFrame()` called on `visibilitychange` event

---

## Testing Data Sets

### Unit Test Fixtures

```javascript
const TEST_TIMES = [
  { standard: '00:00:00', decimal: 0.00, tens: 0, ones: 0, formatted: '00.00' },
  { standard: '06:00:00', decimal: 25.00, tens: 2, ones: 5, formatted: '25.00' },
  { standard: '12:00:00', decimal: 50.00, tens: 5, ones: 0, formatted: '50.00' },
  { standard: '18:00:00', decimal: 75.00, tens: 7, ones: 5, formatted: '75.00' },
  { standard: '23:59:59', decimal: 99.99, tens: 9, ones: 9.99, formatted: '99.99' },
  { standard: '03:00:00', decimal: 12.50, tens: 1, ones: 2.50, formatted: '12.50' },
  { standard: '15:00:00', decimal: 62.50, tens: 6, ones: 2.50, formatted: '62.50' },
];
```

### Edge Case Fixtures

```javascript
const EDGE_CASES = [
  { name: 'One millisecond after midnight', standard: '00:00:00.001', decimal: ~0.000001 },
  { name: 'One millisecond before midnight', standard: '23:59:59.999', decimal: ~99.999998 },
  { name: 'Noon boundary', standard: '12:00:00.000', decimal: 50.00 },
  { name: 'Decimal unit rollover', standard: '00:08:38.400', decimal: 10.00 },  // Exactly 10.00
];
```

---

## Performance Characteristics

### Computational Complexity

- **Time Conversion**: O(1) - constant time calculation
- **Hand Position Calculation**: O(1) - constant time trigonometry
- **Canvas Rendering**: O(n) where n = number of numerals (always 10, so effectively O(1))
- **Animation Loop**: O(1) per frame

### Memory Usage

- **DecimalTime**: ~64 bytes (4 numbers + 1 string)
- **ClockFace**: ~600 bytes (static, allocated once)
- **AnimationState**: ~32 bytes
- **Canvas buffer**: Depends on canvas size, typically 1-4 MB

**Total estimated runtime memory**: <10 MB (well under 50 MB constraint)

---

## Future Extensibility

### Potential Data Model Extensions (Out of Scope for v1)

1. **TimeZone Entity**: For multi-timezone support
2. **ThemeConfiguration**: For dark mode / custom styling
3. **UserPreferences**: For saved settings (requires storage)
4. **AnimationPerformanceMetrics**: For runtime performance monitoring

These are explicitly out of scope per the feature specification but could be added in future versions without breaking the core data model.

---

**Data Model Status**: ✅ Complete
**Next Steps**: Define contracts (contracts/), generate quickstart (quickstart.md)
