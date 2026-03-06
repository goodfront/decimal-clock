# API Contract: Decimal Clock Display

**Date**: 2026-03-06
**Feature**: 001-decimal-clock-display
**Contract Version**: 1.0.0

## Overview

This document defines the public JavaScript API contracts for the Decimal Clock Display library. While this is primarily a standalone web application, the core functionality is exposed as reusable modules that could be consumed by other projects or extended in the future.

---

## Module: `timeConversion`

**Purpose**: Convert between standard time and decimal time format.

### Function: `getDecimalTime(date?: Date): DecimalTime`

**Description**: Calculates the decimal time representation for a given date/time or current time.

**Signature**:
```javascript
function getDecimalTime(date?: Date): DecimalTime
```

**Parameters**:
- `date` (optional): Date object representing the time to convert. Defaults to `new Date()` (current time).

**Returns**: `DecimalTime` object
```typescript
{
  value: number,        // Full decimal time [0.00, 100.00)
  tens: number,         // Tens digit [0-9]
  ones: number,         // Ones digit with decimals [0.00, 10.00)
  formatted: string     // Format: "XX.XX"
}
```

**Behavior**:
- Calculates milliseconds elapsed since midnight (local time)
- Converts to decimal time: `(millisecondsSinceMidnight / 86400000) * 100`
- Returns all derived values (tens, ones, formatted)

**Invariants**:
- `value` is always in range [0.00, 100.00)
- `tens === Math.floor(value / 10)`
- `ones === value % 10`
- `formatted === value.toFixed(2)`

**Examples**:
```javascript
// Midnight
const midnight = new Date('2026-03-06T00:00:00');
getDecimalTime(midnight);
// Returns: { value: 0, tens: 0, ones: 0, formatted: "00.00" }

// 6 AM
const sixAM = new Date('2026-03-06T06:00:00');
getDecimalTime(sixAM);
// Returns: { value: 25, tens: 2, ones: 5, formatted: "25.00" }

// Noon
const noon = new Date('2026-03-06T12:00:00');
getDecimalTime(noon);
// Returns: { value: 50, tens: 5, ones: 0, formatted: "50.00" }

// Current time (no argument)
getDecimalTime();
// Returns: DecimalTime for Date.now()
```

**Error Handling**:
- No exceptions thrown (calculation always succeeds)
- Invalid date argument results in `NaN` values (caller responsible for validation)

---

### Function: `standardToDecimal(hours: number, minutes: number, seconds: number): number`

**Description**: Converts standard time components (hours, minutes, seconds) to decimal time value.

**Signature**:
```javascript
function standardToDecimal(hours: number, minutes: number, seconds: number): number
```

**Parameters**:
- `hours`: Integer [0-23], hour in 24-hour format
- `minutes`: Integer [0-59], minute
- `seconds`: Number [0-60), second with optional decimal fractions

**Returns**: Number, decimal time value [0.00, 100.00)

**Behavior**:
- Calculates total seconds since midnight: `hours * 3600 + minutes * 60 + seconds`
- Converts to decimal time: `(totalSeconds / 86400) * 100`

**Examples**:
```javascript
standardToDecimal(0, 0, 0);    // 0.00 (midnight)
standardToDecimal(6, 0, 0);    // 25.00 (6 AM)
standardToDecimal(12, 0, 0);   // 50.00 (noon)
standardToDecimal(18, 0, 0);   // 75.00 (6 PM)
standardToDecimal(12, 30, 0);  // 52.08333... (12:30 PM)
```

**Error Handling**:
- No validation performed (caller responsible for valid input ranges)
- Out-of-range inputs produce mathematically correct but potentially unexpected results

---

### Function: `decimalToStandard(decimalTime: number): StandardTime`

**Description**: Converts decimal time value to standard time components.

**Signature**:
```javascript
function decimalToStandard(decimalTime: number): StandardTime
```

**Parameters**:
- `decimalTime`: Number [0.00, 100.00), decimal time value

**Returns**: `StandardTime` object
```typescript
{
  hours: number,        // [0-23]
  minutes: number,      // [0-59]
  seconds: number,      // [0-59]
  milliseconds: number  // [0-999]
}
```

**Behavior**:
- Calculates total milliseconds: `(decimalTime / 100) * 86400000`
- Extracts hours, minutes, seconds, milliseconds components

**Examples**:
```javascript
decimalToStandard(0);    // { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
decimalToStandard(25);   // { hours: 6, minutes: 0, seconds: 0, milliseconds: 0 }
decimalToStandard(50);   // { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }
decimalToStandard(75);   // { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 }
```

**Error Handling**:
- No validation performed (caller responsible for valid input range)

---

## Module: `animation`

**Purpose**: Manage the animation loop lifecycle for continuous clock updates.

### Class: `AnimationController`

**Description**: Controls the requestAnimationFrame-based animation loop with lifecycle management.

**Constructor**:
```javascript
constructor(callback: (timestamp: DOMHighResTimeStamp) => void)
```

**Parameters**:
- `callback`: Function invoked on each animation frame with high-resolution timestamp

**Public Methods**:

#### `start(): void`

**Description**: Starts the animation loop.

**Behavior**:
- Initiates `requestAnimationFrame` loop
- Sets `isRunning` to `true`
- Idempotent (calling multiple times has no additional effect)

**Example**:
```javascript
const controller = new AnimationController((timestamp) => {
  // Render clock
});
controller.start();
```

---

#### `stop(): void`

**Description**: Stops the animation loop.

**Behavior**:
- Cancels pending `requestAnimationFrame`
- Sets `isRunning` to `false`
- Idempotent (calling multiple times has no additional effect)

**Example**:
```javascript
controller.stop();
```

---

#### `isRunning(): boolean`

**Description**: Returns the current animation loop state.

**Returns**: Boolean, `true` if animation is running, `false` otherwise

**Example**:
```javascript
if (controller.isRunning()) {
  console.log('Animation is active');
}
```

---

## Module: `components/AnalogClock`

**Purpose**: Render and manage the analog decimal clock display using Canvas API.

### Function: `createAnalogClock(canvas: HTMLCanvasElement): AnalogClockController`

**Description**: Initializes an analog clock controller bound to a canvas element.

**Signature**:
```javascript
function createAnalogClock(canvas: HTMLCanvasElement): AnalogClockController
```

**Parameters**:
- `canvas`: HTML Canvas element where the clock will be rendered

**Returns**: `AnalogClockController` object with methods:

```typescript
interface AnalogClockController {
  render(decimalTime: DecimalTime): void;
  resize(): void;
  destroy(): void;
}
```

**Methods**:

#### `render(decimalTime: DecimalTime): void`

**Description**: Draws the analog clock for the given decimal time.

**Parameters**:
- `decimalTime`: DecimalTime object from `getDecimalTime()`

**Behavior**:
- Clears canvas
- Draws clock face with numerals 0-9
- Draws tens hand (shorter, thicker)
- Draws ones hand (longer, thinner)

**Example**:
```javascript
const canvas = document.getElementById('analog-clock');
const clock = createAnalogClock(canvas);

const decimalTime = getDecimalTime();
clock.render(decimalTime);
```

---

#### `resize(): void`

**Description**: Recalculates clock dimensions and redraws after canvas size change.

**Behavior**:
- Updates internal dimensions based on current canvas size
- Recalculates numeral positions
- Triggers re-render

**Example**:
```javascript
window.addEventListener('resize', () => {
  clock.resize();
});
```

---

#### `destroy(): void`

**Description**: Cleans up resources and event listeners.

**Behavior**:
- Removes internal event listeners
- Clears canvas
- Invalidates controller (subsequent calls to render/resize will throw)

**Example**:
```javascript
// Before removing canvas from DOM
clock.destroy();
```

---

## Module: `components/DigitalClock`

**Purpose**: Render and manage the digital decimal time display using DOM.

### Function: `createDigitalClock(element: HTMLElement): DigitalClockController`

**Description**: Initializes a digital clock controller bound to a DOM element.

**Signature**:
```javascript
function createDigitalClock(element: HTMLElement): DigitalClockController
```

**Parameters**:
- `element`: HTML element (typically `<time>` or `<div>`) where the time will be displayed

**Returns**: `DigitalClockController` object with methods:

```typescript
interface DigitalClockController {
  render(decimalTime: DecimalTime): void;
  destroy(): void;
}
```

**Methods**:

#### `render(decimalTime: DecimalTime): void`

**Description**: Updates the element's text content with the formatted decimal time.

**Parameters**:
- `decimalTime`: DecimalTime object from `getDecimalTime()`

**Behavior**:
- Sets `element.textContent` to `decimalTime.formatted`
- Updates `datetime` attribute if element is `<time>`

**Example**:
```javascript
const element = document.getElementById('digital-clock');
const clock = createDigitalClock(element);

const decimalTime = getDecimalTime();
clock.render(decimalTime);
// element.textContent is now "25.00" (or whatever the current time is)
```

---

#### `destroy(): void`

**Description**: Cleans up resources and resets element content.

**Behavior**:
- Clears element's text content
- Removes attributes set by controller

**Example**:
```javascript
clock.destroy();
```

---

## Module: `components/ClockPage`

**Purpose**: Orchestrate the full decimal clock application (both analog and digital clocks).

### Function: `initializeClockPage(): ClockPageController`

**Description**: Initializes the complete decimal clock application with auto-discovery of DOM elements.

**Signature**:
```javascript
function initializeClockPage(): ClockPageController
```

**Behavior**:
- Searches for `#analog-clock` canvas element
- Searches for `#digital-clock` element
- Creates controllers for both clocks
- Sets up animation loop
- Handles visibility changes (pauses when tab hidden)
- Handles window resize events

**Returns**: `ClockPageController` object

```typescript
interface ClockPageController {
  start(): void;
  stop(): void;
  isRunning(): boolean;
  destroy(): void;
}
```

**Methods**:

#### `start(): void`

**Description**: Starts the clock update loop.

**Example**:
```javascript
const clockPage = initializeClockPage();
clockPage.start();
```

---

#### `stop(): void`

**Description**: Stops the clock update loop (clocks remain visible at last rendered time).

**Example**:
```javascript
clockPage.stop();
```

---

#### `isRunning(): boolean`

**Description**: Returns whether the clock update loop is active.

**Returns**: Boolean

---

#### `destroy(): void`

**Description**: Cleans up all resources, event listeners, and stops animation.

**Behavior**:
- Stops animation loop
- Destroys analog and digital clock controllers
- Removes event listeners for resize and visibility change

**Example**:
```javascript
// Before navigating away or unmounting
clockPage.destroy();
```

---

## Usage Example: Full Integration

```javascript
import { initializeClockPage } from './components/ClockPage';

// HTML structure:
// <canvas id="analog-clock" width="400" height="400"></canvas>
// <time id="digital-clock">00.00</time>

// Initialize and start
const clockPage = initializeClockPage();
clockPage.start();

// Later, when cleaning up
window.addEventListener('beforeunload', () => {
  clockPage.destroy();
});
```

---

## Versioning and Stability

**Contract Stability**: These APIs are considered **experimental** for v1.0.0 of the Decimal Clock Display feature. Breaking changes may occur in minor versions during initial development.

**Semantic Versioning** (post-v1.0.0 stabilization):
- **Major version**: Breaking changes to function signatures or return types
- **Minor version**: New functions or optional parameters added
- **Patch version**: Bug fixes with no API changes

---

## Testing Contracts

All public APIs MUST have corresponding unit tests that verify:
1. **Correct behavior** for documented examples
2. **Invariants** (e.g., `tens === Math.floor(value / 10)`)
3. **Edge cases** (midnight, noon, near-midnight)
4. **Error handling** (where applicable)

See `tests/unit/` directory for contract validation tests.

---

**Contract Status**: ✅ Complete
**Next Steps**: Generate quickstart.md, update agent context
