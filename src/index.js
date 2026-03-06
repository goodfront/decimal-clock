/**
 * Main Entry Point for Decimal Clock Application
 */

import { initializeClockPage } from './components/ClockPage/ClockPage.js';
import './styles/main.css';

// Initialize and start the clock
const clockPage = initializeClockPage();
clockPage.start();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  clockPage.destroy();
});
