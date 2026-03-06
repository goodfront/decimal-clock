/**
 * Analog Clock Component
 * Renders decimal time on a canvas with analog clock face
 */

const CLOCK_PADDING = 10;
const NUMERAL_COUNT = 10;
const NUMERAL_POSITION_RADIUS = 0.85;
const TENS_HAND_RADIUS = 0.5;
const TENS_HAND_WIDTH = 6;
const ONES_HAND_RADIUS = 0.8;
const ONES_HAND_WIDTH = 3;

/**
 * T022, T023: Calculate the angle for a decimal numeral with 5 at top, 0 at bottom
 * @param {number} numeralValue - Numeral value (0-9)
 * @returns {number} Angle in radians
 */
function calculateNumeralAngle(numeralValue) {
  // Formula: (i / 10) × 2π + π/2
  // This places 0 at bottom (π/2 = 90°) and 5 at top (3π/2 = 270°)
  return (numeralValue / NUMERAL_COUNT) * 2 * Math.PI + Math.PI / 2;
}

/**
 * Creates an analog clock controller
 * @param {HTMLCanvasElement} canvas - Canvas element for rendering
 * @returns {Object} Controller with render, resize, and destroy methods
 */
export function createAnalogClock(canvas) {
  const ctx = canvas.getContext('2d');
  let clockFace = calculateClockFace();

  function calculateClockFace() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - CLOCK_PADDING;

    const numerals = [];
    for (let i = 0; i < NUMERAL_COUNT; i++) {
      const angle = calculateNumeralAngle(i); // T022: Use extracted function
      numerals.push({
        value: i,
        angle,
        x: centerX + radius * NUMERAL_POSITION_RADIUS * Math.cos(angle),
        y: centerY + radius * NUMERAL_POSITION_RADIUS * Math.sin(angle),
      });
    }

    return { centerX, centerY, radius, numerals };
  }

  function drawClockFace() {
    const { centerX, centerY, radius, numerals } = clockFace;

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff'; // T010: White border for dark theme
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw numerals
    ctx.fillStyle = '#ffffff'; // T011: White numerals for dark theme
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    numerals.forEach((numeral) => {
      ctx.fillText(numeral.value.toString(), numeral.x, numeral.y);
    });

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff'; // T012: White center dot for dark theme
    ctx.fill();
  }

  function drawHand(length, angle, width, color = '#ffffff') {
    const { centerX, centerY } = clockFace;

    // Convert decimal time angle to canvas angle (0° at bottom, clockwise)
    const radians = (angle / 360) * 2 * Math.PI - Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + length * Math.cos(radians),
      centerY + length * Math.sin(radians)
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function render(decimalTime) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clock face
    drawClockFace();

    // Calculate hand angles (0-360)
    const tensAngle = (decimalTime.tens / 10) * 360;
    const onesAngle = (decimalTime.ones / 10) * 360;

    // Draw hands (tens first, then ones on top)
    drawHand(
      clockFace.radius * TENS_HAND_RADIUS,
      tensAngle,
      TENS_HAND_WIDTH,
      '#ffffff' // T013: White tens hand for dark theme
    );
    drawHand(
      clockFace.radius * ONES_HAND_RADIUS,
      onesAngle,
      ONES_HAND_WIDTH,
      '#ffffff' // T014: White ones hand for dark theme
    );
  }

  function resize() {
    clockFace = calculateClockFace();
    // Note: Caller should trigger a render after resize
  }

  function destroy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return {
    render,
    resize,
    destroy,
  };
}
