# Tasks: Decimal Clock Display

**Input**: Design documents from `/specs/001-decimal-clock-display/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Per Constitution Principle II (Test-Driven Development), ALL tasks follow Red-Green-Refactor workflow. Tests are MANDATORY and must be written FIRST.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure at repository root:
- `src/` - Source code
- `tests/` - All test files
- `public/` - Static assets
- Configuration files at root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Vite project with vanilla JavaScript template in project root
- [X] T002 [P] Install development dependencies: vitest, @vitest/ui, @testing-library/dom, @playwright/test
- [X] T003 [P] Install code quality tools: eslint, prettier, eslint-config-prettier
- [X] T004 [P] Install Playwright browsers with `npx playwright install`
- [X] T005 Create vite.config.js with test configuration and build settings per quickstart.md
- [X] T006 [P] Create .eslintrc.json configuration file per quickstart.md
- [X] T007 [P] Create .prettierrc configuration file per quickstart.md
- [X] T008 [P] Create .gitignore file with node_modules/, dist/, coverage/
- [X] T009 Update package.json with scripts: dev, build, preview, test, test:ui, test:e2e, lint, format
- [X] T010 Create project directory structure: src/components/{AnalogClock,DigitalClock,ClockPage}, src/utils/, src/styles/, tests/{unit,integration,e2e}/
- [X] T011 Create public/index.html with semantic HTML structure and accessibility attributes per quickstart.md

**Checkpoint**: Basic project infrastructure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T012 Create tests/unit/timeConversion.test.js with test suite for getDecimalTime() - MUST FAIL initially (RED phase)
- [X] T013 Implement src/utils/timeConversion.js with getDecimalTime() function per API contract (GREEN phase)
- [X] T014 Refactor src/utils/timeConversion.js: extract constants MILLISECONDS_PER_DAY, DECIMAL_UNITS_PER_DAY (REFACTOR phase)
- [X] T015 Add tests to tests/unit/timeConversion.test.js for edge cases: midnight, 6 AM, noon, near-midnight
- [X] T016 [P] Implement src/utils/timeConversion.js standardToDecimal() function with tests in tests/unit/timeConversion.test.js
- [X] T017 [P] Implement src/utils/timeConversion.js decimalToStandard() function with tests in tests/unit/timeConversion.test.js
- [X] T018 Create tests/unit/animation.test.js for AnimationController class - MUST FAIL initially
- [X] T019 Implement src/utils/animation.js with AnimationController class per API contract
- [X] T020 Add AnimationController lifecycle tests: start(), stop(), isRunning() in tests/unit/animation.test.js
- [X] T021 Create src/styles/main.css with base styles, CSS reset, and screen-reader-only utility class

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Current Decimal Time (Priority: P1) 🎯 MVP

**Goal**: Display current time in decimal format with both analog and digital clocks updating continuously

**Independent Test**: Open web page and verify both clocks display current time in decimal format, updating continuously. Time should be mathematically correct based on seconds since midnight.

**Acceptance Criteria**:
- Midnight (00:00:00) → both clocks display 00.00
- 6:00 AM → digital displays 25.00, analog tens hand between 2-3, ones hand at 5
- Noon → both clocks display 50.00
- 11:59:59 PM → decimal time near 99.99
- Clocks update smoothly and continuously without page refresh

### Tests for User Story 1 (TDD - Write FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T022 [P] [US1] Create tests/unit/components/AnalogClock.test.js with tests for createAnalogClock() initialization - MUST FAIL
- [ ] T023 [P] [US1] Create tests/unit/components/DigitalClock.test.js with tests for createDigitalClock() initialization - MUST FAIL
- [ ] T024 [P] [US1] Create tests/unit/components/ClockPage.test.js with tests for initializeClockPage() - MUST FAIL
- [ ] T025 [P] [US1] Add render() tests to tests/unit/components/AnalogClock.test.js for drawing clock face and hands
- [ ] T026 [P] [US1] Add render() tests to tests/unit/components/DigitalClock.test.js for updating text content
- [ ] T027 [US1] Create tests/integration/clockDisplay.test.js with integration tests for full clock page lifecycle

### Implementation for User Story 1

- [ ] T028 [P] [US1] Create src/components/AnalogClock/AnalogClock.js implementing createAnalogClock() per API contract (GREEN phase)
- [ ] T029 [P] [US1] Create src/components/DigitalClock/DigitalClock.js implementing createDigitalClock() per API contract (GREEN phase)
- [ ] T030 [US1] Implement drawClockFace() helper in src/components/AnalogClock/AnalogClock.js (draws circle, numerals 0-9)
- [ ] T031 [US1] Implement drawHand() helper in src/components/AnalogClock/AnalogClock.js (draws clock hand at angle)
- [ ] T032 [US1] Implement AnalogClock render() method with ClockHandPosition calculation per data-model.md
- [ ] T033 [US1] Implement AnalogClock resize() method with debounced recalculation of ClockFace dimensions
- [ ] T034 [US1] Implement AnalogClock destroy() method with cleanup
- [ ] T035 [US1] Implement DigitalClock render() method updating textContent and datetime attribute
- [ ] T036 [US1] Implement DigitalClock destroy() method with cleanup
- [ ] T037 [US1] Create src/components/ClockPage/ClockPage.js implementing initializeClockPage() per API contract
- [ ] T038 [US1] Implement ClockPage animation loop with getDecimalTime() and render() calls for both clocks
- [ ] T039 [US1] Add ClockPage optimization: skip redraw if decimal time change < 0.01 units per data-model.md
- [ ] T040 [US1] Implement ClockPage visibility change handler (pause animation when tab hidden)
- [ ] T041 [US1] Implement ClockPage window resize handler with 150ms debounce per data-model.md
- [ ] T042 [US1] Implement ClockPage start(), stop(), isRunning(), destroy() methods
- [ ] T043 [US1] Create src/index.js as main entry point: import ClockPage, initialize, start per quickstart.md
- [ ] T044 [US1] Add beforeunload event listener in src/index.js to call clockPage.destroy()
- [ ] T045 [US1] Refactor src/components/AnalogClock/AnalogClock.js: extract constants (TENS_HAND_RADIUS, ONES_HAND_RADIUS, etc.) per data-model.md
- [ ] T046 [US1] Run all unit tests to verify User Story 1 functionality
- [ ] T047 [US1] Create tests/e2e/clockDisplay.spec.js with E2E test: verify clocks display on page load
- [ ] T048 [US1] Add E2E test to tests/e2e/clockDisplay.spec.js: verify time format matches XX.XX regex
- [ ] T049 [US1] Run E2E tests with `npm run test:e2e` to validate User Story 1 end-to-end

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Both clocks display and update continuously.

---

## Phase 4: User Story 2 - Understand Decimal Time Visually (Priority: P2)

**Goal**: Enhance analog clock visual design so users unfamiliar with decimal time can intuitively understand the concept

**Independent Test**: A user unfamiliar with decimal time should be able to interpret the analog clock without instruction, recognizing numeral positions and hand movements

**Acceptance Criteria**:
- Numerals 0-9 evenly distributed around clock face with 0 at bottom
- At 25.00, tens hand points between 2 and 3, ones hand points at 5
- Hands move smoothly and continuously (not in discrete jumps)
- At 29.99→30.00 transition, ones hand completes full rotation and tens hand advances to 3

### Tests for User Story 2 (TDD - Write FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T050 [P] [US2] Add visual regression test to tests/e2e/clockDisplay.spec.js: verify numeral positions at 0° (0), 36° (1), 72° (2), etc.
- [ ] T051 [P] [US2] Add unit tests to tests/unit/components/AnalogClock.test.js: verify hand angle calculations for various times
- [ ] T052 [US2] Add E2E test to tests/e2e/clockDisplay.spec.js: verify smooth hand animation (no jank) using Performance API

### Implementation for User Story 2

- [ ] T053 [P] [US2] Add numeral positioning logic to src/components/AnalogClock/AnalogClock.js using NUMERAL_POSITION_RADIUS constant
- [ ] T054 [P] [US2] Enhance drawClockFace() in src/components/AnalogClock/AnalogClock.js with improved numeral rendering (font, size, alignment)
- [ ] T055 [US2] Add visual styling to src/styles/main.css for analog clock: clock face border, background, numeral styling
- [ ] T056 [US2] Implement smooth hand rotation in src/components/AnalogClock/AnalogClock.js with continuous angle calculation (not stepped)
- [ ] T057 [US2] Add clock hand styling to src/components/AnalogClock/AnalogClock.js: different colors/styles for tens vs ones hand
- [ ] T058 [US2] Add center dot/hub rendering to drawClockFace() for visual polish
- [ ] T059 [US2] Verify hand synchronization invariant: Math.abs(decimalTime.value - (tens * 10 + ones)) < 0.01 per data-model.md
- [ ] T060 [US2] Run visual regression tests to validate User Story 2 enhancements
- [ ] T061 [US2] Test 29.99→30.00 transition manually to verify ones hand completes rotation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Analog clock is visually intuitive.

---

## Phase 5: User Story 3 - Read Precise Decimal Time (Priority: P3)

**Goal**: Enhance digital clock display to show precise decimal time value with clear formatting

**Independent Test**: At any moment, digital display shows exact decimal time with two decimal places, matching analog clock hand positions

**Acceptance Criteria**:
- Digital clock shows format XX.XX (e.g., 00.00, 25.00, 75.24)
- Digital value accurately represents same time as analog clock
- Decimal time increments smoothly and continuously
- At 25.47, analog hands positioned proportionally and digital shows precise value

### Tests for User Story 3 (TDD - Write FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T062 [P] [US3] Add unit tests to tests/unit/components/DigitalClock.test.js: verify formatted string matches /^\d{2}\.\d{2}$/
- [ ] T063 [P] [US3] Add integration test to tests/integration/clockDisplay.test.js: verify analog and digital clocks display same time value
- [ ] T064 [US3] Add E2E test to tests/e2e/clockDisplay.spec.js: verify digital clock updates continuously (check value changes over 2 seconds)

### Implementation for User Story 3

- [ ] T065 [P] [US3] Add typography and layout styling to src/styles/main.css for digital clock display
- [ ] T066 [P] [US3] Add large font size styling to src/styles/main.css for digital clock (prominent, easy to read)
- [ ] T067 [US3] Enhance digital clock positioning in public/index.html and src/styles/main.css (below analog clock per FR-011)
- [ ] T068 [US3] Add ARIA live region updates in src/components/ClockPage/ClockPage.js to announce time every 10 decimal units per data-model.md
- [ ] T069 [US3] Implement screen reader announcement logic in src/components/ClockPage/ClockPage.js using SCREEN_READER_UPDATE_INTERVAL constant
- [ ] T070 [US3] Add datetime attribute handling in src/components/DigitalClock/DigitalClock.js for <time> element
- [ ] T071 [US3] Verify synchronization: run tests/integration/clockDisplay.test.js to ensure max deviation < 0.01 decimal units
- [ ] T072 [US3] Test fractional times (e.g., 25.47) to verify analog hands and digital display match

**Checkpoint**: All user stories should now be independently functional. Digital clock provides precise values.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality enhancements

### Accessibility & Responsiveness

- [ ] T073 [P] Add responsive CSS media queries to src/styles/main.css for mobile, tablet, desktop layouts
- [ ] T074 [P] Add high contrast mode CSS to src/styles/main.css for accessibility
- [ ] T075 [P] Verify ARIA labels in public/index.html match quickstart.md semantic HTML structure
- [ ] T076 [P] Test keyboard navigation (all interactive elements reachable via Tab)
- [ ] T077 [P] Test screen reader support using VoiceOver/NVDA: verify time announcements work
- [ ] T078 Add canvas fallback content in public/index.html for browsers without Canvas support

### Performance Optimization

- [ ] T079 [P] Add devicePixelRatio handling to src/components/AnalogClock/AnalogClock.js for crisp rendering on high-DPI displays
- [ ] T080 [P] Verify frame rate meets 60 fps target: add temporary FPS counter per quickstart.md debugging section
- [ ] T081 [P] Profile memory usage in Chrome DevTools: ensure < 50MB heap per plan.md constraints
- [ ] T082 Run Lighthouse audit: verify < 2s page load and < 3s TTI per success criteria SC-001, SC-004
- [ ] T083 Build production bundle with `npm run build` and verify < 200KB gzipped per plan.md constraints
- [ ] T084 Test animation pause/resume on tab visibility change: ensure no battery drain when hidden

### Visual Polish

- [ ] T085 [P] Add color scheme to src/styles/main.css: choose colors for clock face, hands, background, text
- [ ] T086 [P] Add CSS animations/transitions to src/styles/main.css for smooth visual effects
- [ ] T087 [P] Ensure analog clock is prominently displayed and larger than digital clock per FR-010
- [ ] T088 [P] Add page title, favicon, and meta tags to public/index.html
- [ ] T089 Test visual appearance on Chrome, Firefox, Safari, Edge (latest 2 versions) per plan.md browser support

### Testing & Validation

- [ ] T090 [P] Run full test suite with coverage: `npm test -- --coverage` and verify > 80% coverage
- [ ] T091 [P] Run E2E tests across all target browsers with Playwright
- [ ] T092 [P] Validate all acceptance scenarios from spec.md: midnight, 6 AM, noon, near-midnight, continuous updates
- [ ] T093 Test edge cases from spec.md: midnight rollover (99.99 → 00.00), tab inactive, browser window resize
- [ ] T094 Run linter: `npm run lint` and fix any issues
- [ ] T095 Run formatter: `npm run format` to ensure consistent code style
- [ ] T096 Manual validation: run through quickstart.md development workflow to ensure accuracy

### Documentation & Deployment

- [ ] T097 [P] Verify all JSDoc comments are complete in src/utils/timeConversion.js and src/utils/animation.js
- [ ] T098 [P] Add inline code comments for complex Canvas drawing logic in src/components/AnalogClock/AnalogClock.js
- [ ] T099 Create README.md in project root with project overview, setup instructions, and links to specs
- [ ] T100 Test production build with `npm run preview` to verify dist/ bundle works correctly
- [ ] T101 Validate deployment readiness: check all success criteria SC-001 through SC-007 from spec.md

**Checkpoint**: Application is production-ready, tested, accessible, and performant

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 3 (P3)**: Depends on Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

Per Constitution Principle II (TDD):
1. **RED**: Tests MUST be written and verified to FAIL before implementation
2. **GREEN**: Write minimal code to make tests pass
3. **REFACTOR**: Clean up code while keeping tests green

Order within each story:
- Tests first (MUST fail initially)
- Core implementation (make tests pass)
- Refactoring and optimization
- Integration and validation
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 Setup**: T002-T004, T006-T007, T010 can run in parallel
- **Phase 2 Foundational**: T016-T017 can run in parallel after T012-T015 complete
- **User Story 1 Tests**: T022-T026 can run in parallel (different test files)
- **User Story 1 Implementation**: T028-T029 can run in parallel (different components)
- **User Story 2 Tests**: T050-T052 can run in parallel
- **User Story 2 Implementation**: T053-T054 can run in parallel
- **User Story 3 Tests**: T062-T064 can run in parallel
- **User Story 3 Implementation**: T065-T066 can run in parallel
- **Phase 6 Polish**: Most tasks (T073-T078, T079-T081, T085-T089, T090-T091, T097-T098) can run in parallel

- **Once Foundational phase completes, all user stories (US1, US2, US3) can be worked on in parallel by different developers**

---

## Parallel Example: User Story 1

```bash
# Launch all test files for User Story 1 together (TDD RED phase):
Task T022: "Create tests/unit/components/AnalogClock.test.js"
Task T023: "Create tests/unit/components/DigitalClock.test.js"
Task T024: "Create tests/unit/components/ClockPage.test.js"

# After tests fail, launch core implementations together (GREEN phase):
Task T028: "Create src/components/AnalogClock/AnalogClock.js"
Task T029: "Create src/components/DigitalClock/DigitalClock.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T011)
2. Complete Phase 2: Foundational (T012-T021) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T022-T049)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Open page, verify both clocks display and update
   - Test acceptance scenarios: midnight, 6 AM, noon, near-midnight
   - Verify continuous updates without page refresh
5. Deploy/demo if ready

**Estimated MVP**: ~35 tasks (T001-T049 excluding US2/US3 enhancements)

### Incremental Delivery

1. **Foundation** (T001-T021): Setup + Core utilities → Can test time conversion independently
2. **MVP: US1** (T022-T049): Add clocks → Test independently → Deploy/Demo
   - Delivers: Functional decimal clock with both analog and digital displays
3. **Enhancement: US2** (T050-T061): Visual polish for analog clock → Test independently → Deploy/Demo
   - Delivers: Intuitive, visually appealing analog clock
4. **Enhancement: US3** (T062-T072): Digital clock precision → Test independently → Deploy/Demo
   - Delivers: Clear, precise digital time display with accessibility
5. **Production Ready** (T073-T101): Polish, testing, documentation → Final validation → Production deployment

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T021)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (T022-T049) - Core functionality
   - **Developer B**: User Story 2 (T050-T061) - Visual enhancements
   - **Developer C**: User Story 3 (T062-T072) - Digital display precision
3. Stories complete and integrate independently
4. **Team converges for Polish** (T073-T101)

---

## Task Count Summary

- **Phase 1 (Setup)**: 11 tasks
- **Phase 2 (Foundational)**: 10 tasks
- **Phase 3 (User Story 1 - P1)**: 28 tasks
- **Phase 4 (User Story 2 - P2)**: 12 tasks
- **Phase 5 (User Story 3 - P3)**: 11 tasks
- **Phase 6 (Polish)**: 29 tasks

**Total**: 101 tasks

**MVP Scope** (Setup + Foundational + US1): 49 tasks
**Full Feature** (All phases): 101 tasks

---

## Notes

- **[P] marker**: Tasks in different files with no dependencies, safe to run in parallel
- **[Story] label**: Maps task to specific user story (US1, US2, US3) for traceability
- **TDD Mandatory**: Per Constitution Principle II, all tests MUST be written first and FAIL before implementation
- **Red-Green-Refactor**: Each user story follows this cycle strictly
- **Independent Stories**: Each user story should be independently completable and testable
- **Verify tests fail before implementing** - This is NON-NEGOTIABLE per constitution
- **Commit after each task or logical group** for incremental progress
- **Stop at any checkpoint to validate story independently**
- **File paths are explicit**: Every task specifies exact file location for clarity
- **Constitution alignment**: Tasks respect Simplicity First (minimal dependencies), TDD (tests first), UX Excellence (accessibility), Modular Design (clear boundaries), Visual Accuracy (60 fps, precision)

---

**Tasks Generated**: 2026-03-06
**Ready for Implementation**: Yes - Follow TDD workflow starting with Phase 1
