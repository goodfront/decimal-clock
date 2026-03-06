/**
 * Clock Page Controller
 * Orchestrates the complete decimal clock application
 */

import { createAnalogClock } from '../AnalogClock/AnalogClock.js';
import { createDigitalClock } from '../DigitalClock/DigitalClock.js';
import { getDecimalTime } from '../../utils/timeConversion.js';
import { AnimationController } from '../../utils/animation.js';

const MIN_DRAW_THRESHOLD = 0.01;
const RESIZE_DEBOUNCE_MS = 150;
const SCREEN_READER_UPDATE_INTERVAL = 10;

/**
 * Initializes the clock page with auto-discovery of DOM elements
 * @returns {Object} Controller with start, stop, isRunning, and destroy methods
 */
export function initializeClockPage() {
  const canvasElement = document.getElementById('analog-clock');
  const digitalElement = document.getElementById('digital-clock');
  const announcementElement = document.getElementById('time-announcement');

  if (!canvasElement || !digitalElement) {
    throw new Error('Required clock elements not found in DOM');
  }

  const analogClock = createAnalogClock(canvasElement);
  const digitalClock = createDigitalClock(digitalElement);

  let lastDrawnTime = null;
  let lastAnnouncedTens = null;
  let resizeTimeout = null;

  function updateClocks() {
    const decimalTime = getDecimalTime();

    // Skip redraw if change is imperceptible
    if (
      lastDrawnTime !== null &&
      Math.abs(decimalTime.value - lastDrawnTime) < MIN_DRAW_THRESHOLD
    ) {
      return;
    }

    analogClock.render(decimalTime);
    digitalClock.render(decimalTime);
    lastDrawnTime = decimalTime.value;

    // Update screen reader announcement every 10 decimal units
    if (announcementElement) {
      const currentTens = Math.floor(
        decimalTime.value / SCREEN_READER_UPDATE_INTERVAL
      );
      if (currentTens !== lastAnnouncedTens) {
        announcementElement.textContent = decimalTime.formatted;
        lastAnnouncedTens = currentTens;
      }
    }
  }

  const animationController = new AnimationController(updateClocks);

  function handleResize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      analogClock.resize();
      updateClocks(); // Redraw after resize
    }, RESIZE_DEBOUNCE_MS);
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      animationController.stop();
    } else {
      animationController.start();
    }
  }

  // Attach event listeners
  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  function start() {
    animationController.start();
  }

  function stop() {
    animationController.stop();
  }

  function isRunning() {
    return animationController.isRunning();
  }

  function destroy() {
    stop();
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    analogClock.destroy();
    digitalClock.destroy();
  }

  return {
    start,
    stop,
    isRunning,
    destroy,
  };
}
