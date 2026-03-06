# Decimal Clock

A web application that displays the current time in decimal format, where 100 decimal units equal 24 hours.

## Features

- **Analog Clock**: Visual clock face with 10 numerals (0-9) and two hands representing tens and ones digits
- **Digital Display**: Precise decimal time in XX.XX format
- **Continuous Updates**: Smooth 60 FPS animation using requestAnimationFrame
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessible**: WCAG 2.1 AA compliant with ARIA labels and screen reader support

## Decimal Time System

- **00.00** = Midnight (00:00:00)
- **25.00** = 6:00 AM
- **50.00** = Noon (12:00:00)
- **75.00** = 6:00 PM
- **99.99** = Near midnight (23:59:59)

Each decimal unit represents 14.4 minutes (864 seconds) of standard time.

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 to view the application.

### Testing

```bash
# Run unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
decimal-clock/
├── src/
│   ├── components/
│   │   ├── AnalogClock/    # Canvas-based analog clock
│   │   ├── DigitalClock/   # Digital time display
│   │   └── ClockPage/      # Main page orchestrator
│   ├── utils/
│   │   ├── timeConversion.js  # Time calculation utilities
│   │   └── animation.js       # Animation loop controller
│   ├── styles/
│   │   └── main.css
│   └── index.js            # Application entry point
├── tests/
│   ├── unit/              # Unit tests (Vitest)
│   ├── integration/       # Integration tests
│   └── e2e/              # End-to-end tests (Playwright)
├── specs/                # Feature specifications
└── index.html           # HTML entry point
```

## Technology Stack

- **Vanilla JavaScript** (ES6+) - No frameworks
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Canvas API** - Analog clock rendering

## Performance

- **Bundle size**: ~10-20KB gzipped
- **Page load**: <2 seconds
- **Animation**: 60 FPS target
- **Memory usage**: <50MB

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Documentation

- [Feature Specification](specs/001-decimal-clock-display/spec.md)
- [Implementation Plan](specs/001-decimal-clock-display/plan.md)
- [API Contracts](specs/001-decimal-clock-display/contracts/api.md)
- [Development Guide](specs/001-decimal-clock-display/quickstart.md)

## License

MIT
