# Tasks: Clock Styling Updates

**Input**: Design documents from `/specs/002-clock-styling-updates/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/visual-design.md

**Tests**: This feature follows TDD (Test-Driven Development) per Constitution Principle II. All test tasks MUST be completed and verified to fail before implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Repository uses single-project structure:
- Source: `src/`, `tests/` at repository root
- Existing files to modify: `src/styles/main.css`, `src/components/AnalogClock/AnalogClock.js`, `index.html`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure development environment is ready for feature implementation

- [X] T001 Verify dev server is running on http://localhost:5173
- [X] T002 [P] Verify test suite runs successfully with `npm run test`
- [X] T003 [P] Verify e2e test environment with `npm run test:e2e`

**Checkpoint**: Development environment ready - all existing tests pass

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational tasks needed - this feature modifies existing components only

**⚠️ Note**: This phase is empty because the feature does not require new infrastructure. User story implementation can begin immediately after Phase 1.

---

## Phase 3: User Story 1 - Dark-Themed Clock Display (Priority: P1) 🎯 MVP

**Goal**: Implement dark theme with very dark grey background (#1a1a1a), slightly lighter clock face (#2d2d2d), and white text/elements (#ffffff)

**Independent Test**: Load page and verify: (1) background is very dark grey, (2) clock face is slightly lighter grey, (3) all text/numerals/hands are white, (4) WCAG AA contrast ratios met

### Tests for User Story 1 (TDD - Red Phase) ⚠️

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] [US1] Write unit test for color contrast calculations in tests/unit/ColorContrast.test.js
- [X] T005 [P] [US1] Write visual regression test for dark theme in tests/e2e/dark-theme.spec.js
- [X] T006 [P] [US1] Write accessibility test for WCAG AA compliance in tests/e2e/accessibility.spec.js

**Checkpoint**: Run `npm run test` and `npm run test:e2e` - all new tests MUST fail. Commit tests before implementation.

### Implementation for User Story 1 (Green Phase)

- [X] T007 [US1] Update page background color to #1a1a1a in src/styles/main.css (body and main elements)
- [X] T008 [US1] Update clock face background to #2d2d2d in src/styles/main.css (#analog-clock selector)
- [X] T009 [US1] Update digital clock text color to white in src/styles/main.css (#digital-clock selector)
- [X] T010 [US1] Update clock face border color to white in src/components/AnalogClock/AnalogClock.js (drawClockFace function, strokeStyle)
- [X] T011 [US1] Update numeral text color to white in src/components/AnalogClock/AnalogClock.js (drawClockFace function, fillStyle for text)
- [X] T012 [US1] Update center dot color to white in src/components/AnalogClock/AnalogClock.js (drawClockFace function, fillStyle for center)
- [X] T013 [US1] Update tens hand color to white in src/components/AnalogClock/AnalogClock.js (render function, first drawHand call)
- [X] T014 [US1] Update ones hand color to white in src/components/AnalogClock/AnalogClock.js (render function, second drawHand call)
- [X] T015 [US1] Update box shadow for dark theme in src/styles/main.css (#analog-clock box-shadow)

**Checkpoint**: Run tests - all User Story 1 tests should now pass. Verify dark theme visually. Test independently before proceeding.

### Refactor for User Story 1 (Refactor Phase)

- [X] T016 [US1] Extract color constants to CSS custom properties in src/styles/main.css (:root selector)
- [X] T017 [US1] Update all color references to use CSS variables in src/styles/main.css

**Checkpoint**: Tests still pass after refactoring. User Story 1 complete and independently functional.

---

## Phase 4: User Story 2 - Rotated Analog Clock (Priority: P1)

**Goal**: Rotate analog clock so number 5 is at top (12 o'clock) and 0 is at bottom (6 o'clock), maintaining sequential clockwise order

**Independent Test**: View analog clock and verify: (1) numeral 5 at top position, (2) numeral 0 at bottom position, (3) all numerals in order 0→9 clockwise from bottom, (4) hands point to correct positions

### Tests for User Story 2 (TDD - Red Phase) ⚠️

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T018 [P] [US2] Write unit test for numeral angle calculation in tests/unit/AnalogClock.test.js (test angle for numeral 0 = π/2, numeral 5 = 3π/2)
- [X] T019 [P] [US2] Write unit test for clockwise sequential order in tests/unit/AnalogClock.test.js (verify angles increase from 0 to 9)
- [X] T020 [P] [US2] Write visual regression test for rotated clock in tests/e2e/clock-rotation.spec.js (snapshot with 5 at top, 0 at bottom)

**Checkpoint**: Run tests - all new tests MUST fail. Commit tests before implementation.

### Implementation for User Story 2 (Green Phase)

- [X] T021 [US2] Update numeral angle calculation formula in src/components/AnalogClock/AnalogClock.js (change from `(i/10)*2π - π/2` to `(i/10)*2π + π/2` in calculateClockFace function)

**Checkpoint**: Run tests - all User Story 2 tests should now pass. Verify rotation visually (5 at top, 0 at bottom). Test independently.

### Refactor for User Story 2 (Refactor Phase)

- [X] T022 [US2] Extract angle calculation to named function in src/components/AnalogClock/AnalogClock.js (create calculateNumeralAngle function)
- [X] T023 [US2] Add JSDoc comments for angle calculation in src/components/AnalogClock/AnalogClock.js

**Checkpoint**: Tests still pass after refactoring. User Story 2 complete and independently functional.

---

## Phase 5: User Story 3 - Larger Clock Displays (Priority: P2)

**Goal**: Increase analog clock size to 550px (desktop), 650px (large desktop max), and digital clock to 4rem (desktop), with responsive sizing at all breakpoints

**Independent Test**: View on desktop (>1024px) and verify clocks are 25%+ larger. Resize browser and verify responsive scaling at breakpoints: 1440px, 1024px, 768px, 480px

### Tests for User Story 3 (TDD - Red Phase) ⚠️

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [P] [US3] Write e2e test for desktop sizing (1440px viewport) in tests/e2e/responsive.spec.js (verify analog = 650px, digital = 4rem)
- [ ] T025 [P] [US3] Write e2e test for laptop sizing (1024px viewport) in tests/e2e/responsive.spec.js (verify analog = 550px, digital = 4rem)
- [ ] T026 [P] [US3] Write e2e test for tablet sizing (768px viewport) in tests/e2e/responsive.spec.js (verify analog = 450px, digital = 3rem)
- [ ] T027 [P] [US3] Write e2e test for mobile sizing (480px viewport) in tests/e2e/responsive.spec.js (verify analog = 350px, digital = 2rem)
- [ ] T028 [P] [US3] Write e2e test for small mobile sizing (320px viewport) in tests/e2e/responsive.spec.js (verify analog = 280px, digital = 1.5rem)

**Checkpoint**: Run e2e tests - all new tests MUST fail. Commit tests before implementation.

### Implementation for User Story 3 (Green Phase)

- [ ] T029 [US3] Update default canvas size to 550px in index.html (width and height attributes on #analog-clock canvas)
- [ ] T030 [US3] Update default analog clock CSS size to 550px in src/styles/main.css (#analog-clock width/height)
- [ ] T031 [US3] Update default digital clock font size to 4rem in src/styles/main.css (#digital-clock font-size)
- [ ] T032 [US3] Add large desktop media query (min-width: 1440px) with 650px analog clock in src/styles/main.css
- [ ] T033 [US3] Update tablet media query (max-width: 1024px) with 450px analog, 3rem digital in src/styles/main.css
- [ ] T034 [US3] Update mobile media query (max-width: 768px) with 350px analog, 2rem digital in src/styles/main.css
- [ ] T035 [US3] Update small mobile media query (max-width: 480px) with 280px analog, 1.5rem digital in src/styles/main.css

**Checkpoint**: Run e2e tests - all User Story 3 tests should now pass. Test manually at all breakpoints. User Story 3 complete.

### Refactor for User Story 3 (Refactor Phase)

- [ ] T036 [US3] Verify canvas resolution sync with CSS size in src/components/ClockPage/ClockPage.js (ensure canvas.width/height match offsetWidth/offsetHeight)

**Checkpoint**: Tests still pass. All responsive sizes work correctly. User Story 3 complete and independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T037 [P] Update visual regression baseline screenshots with `npm run test:e2e -- --update-snapshots`
- [ ] T038 Run full test suite to verify all tests pass with `npm run test && npm run test:e2e`
- [ ] T039 [P] Run linter and fix any issues with `npm run lint`
- [ ] T040 [P] Run formatter on all modified files with `npm run format`
- [ ] T041 Verify performance with DevTools (60fps maintained, <2s load, <50MB memory)
- [ ] T042 Manual accessibility audit with Lighthouse (verify 100% score or document issues)
- [ ] T043 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T044 Manual testing on physical mobile device (iOS or Android)
- [ ] T045 Verify all success criteria from spec.md are met
- [ ] T046 Build production bundle and verify size <200KB gzipped with `npm run build`

**Checkpoint**: Feature complete, all tests pass, all success criteria met, ready for PR/deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Empty - no blocking prerequisites
- **User Stories (Phase 3-5)**: Can proceed immediately after Setup
  - User Story 1 (P1): Independent - can start after Phase 1
  - User Story 2 (P1): Independent - can start after Phase 1, can run parallel with US1
  - User Story 3 (P2): Independent - can start after Phase 1, can run parallel with US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Dark Theme)**: No dependencies on other stories
- **User Story 2 (Rotation)**: No dependencies on other stories (though visually builds on US1's dark theme)
- **User Story 3 (Sizing)**: No dependencies on other stories

**Key Insight**: All three user stories are independent and can be implemented in parallel by different developers.

### Within Each User Story (TDD Workflow)

1. **Red Phase**: Write tests, verify they FAIL
2. **Green Phase**: Implement minimal code to pass tests
3. **Refactor Phase**: Clean up while keeping tests green
4. Tests MUST be written and fail before implementation begins (Constitution Principle II)

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002 and T003 can run in parallel

**Phase 3 (User Story 1) - Red Phase**:
- T004, T005, T006 (all test writing) can run in parallel

**Phase 4 (User Story 2) - Red Phase**:
- T018, T019, T020 (all test writing) can run in parallel

**Phase 5 (User Story 3) - Red Phase**:
- T024, T025, T026, T027, T028 (all test writing) can run in parallel

**Phase 6 (Polish)**:
- T037, T039, T040 can run in parallel

**Cross-Story Parallelism**:
- User Story 1, 2, and 3 can be worked on in parallel by different developers
- Each story has its own files/sections in CSS and JS

---

## Parallel Example: User Story 1

```bash
# RED PHASE - Launch all test writing tasks together:
Task: "Write unit test for color contrast calculations in tests/unit/ColorContrast.test.js"
Task: "Write visual regression test for dark theme in tests/e2e/dark-theme.spec.js"
Task: "Write accessibility test for WCAG AA compliance in tests/e2e/accessibility.spec.js"

# Verify tests fail, commit tests

# GREEN PHASE - Implementation tasks (sequential due to same file dependencies):
# T007-T015 modify same files, must be done sequentially or carefully coordinated

# REFACTOR PHASE - Can be done after Green phase passes:
Task: "Extract color constants to CSS custom properties"
Task: "Update all color references to use CSS variables"
```

---

## Parallel Example: User Story 2

```bash
# RED PHASE - Launch all test writing tasks together:
Task: "Write unit test for numeral angle calculation in tests/unit/AnalogClock.test.js"
Task: "Write unit test for clockwise sequential order in tests/unit/AnalogClock.test.js"
Task: "Write visual regression test for rotated clock in tests/e2e/clock-rotation.spec.js"

# Verify tests fail, commit tests

# GREEN PHASE - Single implementation task:
Task: "Update numeral angle calculation formula in src/components/AnalogClock/AnalogClock.js"

# REFACTOR PHASE:
Task: "Extract angle calculation to named function"
Task: "Add JSDoc comments for angle calculation"
```

---

## Parallel Example: User Story 3

```bash
# RED PHASE - Launch all test writing tasks together:
Task: "Write e2e test for desktop sizing (1440px viewport)"
Task: "Write e2e test for laptop sizing (1024px viewport)"
Task: "Write e2e test for tablet sizing (768px viewport)"
Task: "Write e2e test for mobile sizing (480px viewport)"
Task: "Write e2e test for small mobile sizing (320px viewport)"

# Verify tests fail, commit tests

# GREEN PHASE - Can be done as single batch edit to CSS:
# T029-T035 all modify same sections in CSS and HTML
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify environment)
2. Skip Phase 2: Foundational (empty)
3. Complete Phase 3: User Story 1 (Dark Theme)
   - TDD: Tests → Verify fail → Implementation → Verify pass → Refactor
4. **STOP and VALIDATE**: Dark theme should work independently
5. Run all tests, manual testing, deploy/demo if ready

**Result**: Minimum viable feature - dark themed clock

### Incremental Delivery (Recommended)

1. Complete Setup (Phase 1)
2. Add User Story 1 (Dark Theme) → Test → Demo/Deploy ✓
3. Add User Story 2 (Rotation) → Test → Demo/Deploy ✓
4. Add User Story 3 (Sizing) → Test → Demo/Deploy ✓
5. Complete Polish (Phase 6) → Final validation ✓

**Benefits**:
- Each story adds value independently
- Can demo progress after each story
- Lower risk - can stop at any checkpoint
- Easier to validate and debug

### Parallel Team Strategy

With 3 developers available:

1. All complete Phase 1: Setup together
2. Then split:
   - **Developer A**: User Story 1 (Dark Theme)
   - **Developer B**: User Story 2 (Rotation)
   - **Developer C**: User Story 3 (Sizing)
3. Each developer follows TDD (Red-Green-Refactor)
4. Stories merge independently
5. Team completes Phase 6: Polish together

**Coordination needed**:
- US1 and US2 both modify AnalogClock.js (coordinate or merge carefully)
- US1 and US3 both modify main.css (coordinate or merge carefully)
- All modify different test files - no conflicts

**Recommended approach**: Sequential by priority (US1 → US2 → US3) to avoid merge conflicts in shared files.

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **TDD Enforcement**: Constitution Principle II requires test-first approach
- **Independent Stories**: Each user story can be validated standalone
- **File Conflicts**: US1 and US2 modify same JS file, US1 and US3 modify same CSS file - coordinate merges
- **Commit Strategy**:
  - Commit tests separately (Red phase)
  - Commit implementation when tests pass (Green phase)
  - Commit refactorings separately (Refactor phase)
- **Checkpoints**: Stop after each user story to validate independently before proceeding

---

## Task Summary

- **Total Tasks**: 46
- **Setup**: 3 tasks
- **Foundational**: 0 tasks (no blocking prerequisites)
- **User Story 1 (Dark Theme)**: 14 tasks (6 tests, 9 implementation, refactor)
- **User Story 2 (Rotation)**: 6 tasks (3 tests, 1 implementation, refactor)
- **User Story 3 (Sizing)**: 13 tasks (5 tests, 7 implementation, refactor)
- **Polish**: 10 tasks

**Parallelizable Tasks**: 19 tasks marked with [P]

**Independent Test Criteria**:
- US1: Load page → verify dark grey background, lighter clock face, white text, WCAG AA contrast
- US2: View analog clock → verify 5 at top, 0 at bottom, sequential 0-9 clockwise
- US3: Resize browser → verify size changes at breakpoints: 1440px/1024px/768px/480px

**Suggested MVP Scope**: User Story 1 only (dark theme) = 14 tasks
