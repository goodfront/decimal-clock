<!--
SYNC IMPACT REPORT - Constitution v1.0.0 (Initial Ratification)
===============================================================================
Version Change: [INITIAL] → 1.0.0
Ratification Date: 2026-02-27

PRINCIPLES ESTABLISHED:
- I. Simplicity First: YAGNI, minimal dependencies, avoid over-engineering
- II. Test-Driven Development: Red-Green-Refactor strictly enforced (NON-NEGOTIABLE)
- III. User Experience Excellence: Accessibility, intuitive design, visual delight
- IV. Modular Component Design: Composable, reusable, clear boundaries
- V. Visual Accuracy: Decimal clock correctness and smooth animations

ADDED SECTIONS:
- Development Workflow
- Quality Standards
- Governance

TEMPLATE SYNCHRONIZATION STATUS:
✅ plan-template.md: Constitution Check gate references this document
✅ spec-template.md: User scenarios align with UX excellence principle
✅ tasks-template.md: TDD workflow embedded (tests-first mandatory)

FOLLOW-UP TODOS:
- None (initial constitution complete)
===============================================================================
-->

# Decimal Clock Constitution

## Core Principles

### I. Simplicity First

Every line of code must justify its existence. The Decimal Clock project MUST:

- Apply YAGNI (You Aren't Gonna Need It) rigorously - implement only what is needed now
- Minimize dependencies - prefer native browser APIs and standard libraries
- Avoid premature abstraction - duplication is acceptable until patterns emerge clearly
- Keep file sizes small and focused - no "god components" or utility dumping grounds
- Use plain, readable code over clever tricks

**Rationale**: A decimal clock is conceptually simple. The codebase should reflect that simplicity to remain maintainable and approachable.

### II. Test-Driven Development (NON-NEGOTIABLE)

All feature development MUST follow the Red-Green-Refactor cycle:

1. **Red**: Write test(s) that describe desired behavior → Tests MUST fail
2. **Green**: Write minimal code to make tests pass
3. **Refactor**: Clean up code while keeping tests green

**Enforcement Rules**:
- No implementation code written before tests exist and are approved by the user/team
- Tests must be committed separately and verified to fail before implementation begins
- Any code review that finds implementation without corresponding tests must be rejected
- Emergency hotfixes may skip TDD but MUST have tests added within 24 hours

**Rationale**: TDD ensures correctness, prevents regression, and serves as living documentation. For time calculations and visual rendering, automated tests are essential to maintain accuracy.

### III. User Experience Excellence

The Decimal Clock must delight and serve users first:

- **Accessibility MUST be built-in**: ARIA labels, keyboard navigation, screen reader support, high contrast mode
- **Intuitive design**: No user manual required - the clock should be self-explanatory
- **Visual polish**: Smooth animations (60 fps), crisp rendering, thoughtful typography and spacing
- **Responsive**: Works beautifully on mobile, tablet, desktop without compromises
- **Performance**: Instant load (<2s), minimal battery drain, no jank

**Rationale**: The decimal clock is an educational and aesthetic tool. Poor UX undermines its purpose.

### IV. Modular Component Design

Code MUST be organized as composable, independent units:

- Each component has a single, clear responsibility
- Components expose minimal public interfaces
- Dependencies flow in one direction (avoid circular dependencies)
- Components can be developed, tested, and understood in isolation
- Shared logic lives in utility modules, not duplicated across components

**Examples**:
- Digital clock display: separate from analog clock rendering
- Time conversion logic: isolated from UI components
- Animation engine: decoupled from clock face rendering

**Rationale**: Modularity enables parallel development, easier testing, and confident refactoring.

### V. Visual Accuracy & Smoothness

Time display and clock animations MUST be mathematically correct and visually fluid:

- Decimal time calculations accurate to milliseconds
- Clock hands update at minimum 30fps (target 60fps)
- No stuttering, jittering, or visible frame drops
- Accurate mapping: 0.00 = midnight, 50.00 = noon, 100.00 = next midnight
- Analog clock: correct placement of 0-9 numerals, smooth hand rotation

**Rationale**: Inaccurate or janky time displays destroy trust and utility.

## Development Workflow

### Branch Strategy

- **main**: Always deployable, protected branch
- Feature branches: `###-feature-name` format (e.g., `001-analog-clock`)
- Hotfix branches: `hotfix-description` (merged directly to main with expedited review)

### Testing Gates

- Unit tests: Must cover all time conversion logic, component logic
- Integration tests: Must verify clock display accuracy end-to-end
- Visual regression tests: Ensure UI changes don't break rendering
- Accessibility tests: WCAG 2.1 AA compliance automated checks

## Quality Standards

### Performance Benchmarks

- Initial page load: <2 seconds (including clock rendering)
- Time-to-interactive: <3 seconds
- Animation frame rate: 30fps minimum, 60fps target
- Memory usage: <50MB heap for clock components
- Bundle size: <200KB (gzipped)

### Browser Compatibility

- Modern evergreen browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile: iOS Safari 14+, Chrome Android 90+
- Graceful degradation: No JavaScript = static time display fallback

### Accessibility Requirements

- WCAG 2.1 Level AA compliance (mandatory)
- Keyboard navigation: All interactive elements reachable via Tab
- Screen reader support: Announce time updates appropriately
- High contrast mode: Tested and functional
- No flashing/strobing effects (seizure risk)

## Governance

### Amendment Procedure

1. Proposed changes must be documented as a GitHub issue with "constitution" label
2. Rationale and impact analysis required
3. Approval from at least 2 project maintainers
4. Migration plan for any breaking changes to existing code
5. Version number incremented per semantic versioning rules
6. All dependent templates updated (plan, spec, tasks, commands)

### Versioning Policy

- **MAJOR**: Removing or fundamentally redefining a core principle, breaking governance changes
- **MINOR**: Adding new principles, expanding existing guidance materially
- **PATCH**: Clarifications, typo fixes, wording improvements

### Compliance Review

- All PRs must include a Constitution Check section confirming alignment
- Monthly audits to identify technical debt or drift from principles
- Any intentional violations (e.g., taking on complexity) must be documented in Complexity Tracking tables with clear justification

### Authority

This constitution supersedes all other project practices and documentation. When conflicts arise between this document and other guidance, the constitution takes precedence. Use this document to guide all architectural decisions, code reviews, and feature planning.

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
