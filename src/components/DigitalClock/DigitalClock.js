/**
 * Digital Clock Component
 * Displays decimal time in digital format (XX.XX)
 */

/**
 * Creates a digital clock controller
 * @param {HTMLElement} element - DOM element to display time
 * @returns {Object} Controller with render and destroy methods
 */
export function createDigitalClock(element) {
  function render(decimalTime) {
    element.textContent = decimalTime.formatted;

    // Update datetime attribute if element is <time>
    if (element.tagName === 'TIME') {
      element.setAttribute('datetime', decimalTime.formatted);
    }
  }

  function destroy() {
    element.textContent = '';
    if (element.tagName === 'TIME') {
      element.removeAttribute('datetime');
    }
  }

  return {
    render,
    destroy,
  };
}
