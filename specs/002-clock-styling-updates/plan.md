# Implementation Plan: Clock Styling Updates

**Branch**: `002-clock-styling-updates` | **Date**: 2026-03-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-clock-styling-updates/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Update the decimal clock's visual design to use a dark theme with rotated analog clock orientation. The analog clock will display number 5 at the top and 0 at the bottom, maintaining sequential order (0-9 clockwise). Both analog and digital displays will be enlarged for better visibility while maintaining responsive design across all device sizes. The dark theme uses very dark grey background with slightly lighter clock face and white text/numbers/hands, meeting WCAG AA accessibility standards.

## Technical Context

**Language/Version**: JavaScript ES6+ (Vanilla), ES2015 build target
**Primary Dependencies**: Vite 7.3.1 (build), Vitest 4.0.18 (unit), @testing-library/dom 10.4.1 (testing), Playwright 1.58.2 (e2e)
**Storage**: N/A (client-side only, no persistence)
**Testing**: Vitest (unit/integration), Playwright (e2e), Testing Library (DOM queries)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge latest 2 versions), Mobile (iOS Safari 14+, Chrome Android 90+)
**Project Type**: Web application (single-page, client-side)
**Performance Goals**: 60 fps animations, <2s initial load, <3s time-to-interactive
**Constraints**: <200KB bundle size (gzipped), <50MB heap memory, WCAG 2.1 AA accessibility, offline-capable
**Scale/Scope**: Single feature (clock display), ~10-15 source files, visual polish focus

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity First
✅ **PASS** - This feature modifies existing CSS/canvas rendering without adding new dependencies or abstractions. Changes are purely visual (color scheme, size adjustments, angle rotation). No new complexity introduced.

### Principle II: Test-Driven Development (NON-NEGOTIABLE)
✅ **PASS** - Will follow Red-Green-Refactor:
- Write visual regression tests for dark theme colors
- Write unit tests for analog clock rotation calculations (5 at top, 0 at bottom)
- Write e2e tests for responsive sizing across breakpoints
- Write accessibility tests for WCAG contrast ratios

### Principle III: User Experience Excellence
✅ **PASS** - Feature directly enhances UX:
- Dark theme reduces eye strain
- Larger displays improve readability
- Maintains responsive design across all devices
- WCAG AA compliance required (FR-009)
- Smooth 60fps animations preserved

### Principle IV: Modular Component Design
✅ **PASS** - Changes isolated to existing components:
- CSS styling in `src/styles/main.css`
- Analog clock rotation logic in `src/components/AnalogClock/AnalogClock.js`
- No new components needed, no cross-component dependencies added

### Principle V: Visual Accuracy & Smoothness
✅ **PASS** - Feature maintains accuracy requirements:
- Rotation changes position reference (5 at top vs 0 at top) but preserves mathematical correctness
- Animation frame rates unchanged (60fps target maintained)
- No impact on decimal time calculation accuracy

**GATE RESULT: ✅ ALL CHECKS PASS - Proceed to Phase 0**

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── AnalogClock/
│   │   └── AnalogClock.js        # MODIFY: rotation angles, colors
│   ├── DigitalClock/
│   │   └── DigitalClock.js       # No changes needed
│   └── ClockPage/
│       └── ClockPage.js          # No changes needed
├── styles/
│   └── main.css                  # MODIFY: dark theme, sizing, responsive breakpoints
└── index.js                      # No changes needed

tests/
├── unit/
│   └── AnalogClock.test.js       # ADD: rotation calculation tests
├── integration/
│   └── ClockPage.test.js         # MODIFY: visual snapshot tests for dark theme
└── e2e/
    └── responsive.spec.js        # ADD: responsive sizing tests across breakpoints

index.html                        # MODIFY: canvas size attribute (may need adjustment)
```

**Structure Decision**: Single-page web application structure. This feature only modifies existing styling and analog clock rotation logic. All changes are confined to:
1. CSS file (`src/styles/main.css`) - dark theme colors, sizing adjustments
2. Analog clock component (`src/components/AnalogClock/AnalogClock.js`) - numeral positioning angles
3. HTML (`index.html`) - canvas size attributes if default size increased
4. Test files - new/updated tests for rotation and visual regressions

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution checks passed.
