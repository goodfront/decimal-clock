/**
 * Animation Controller for managing requestAnimationFrame loop
 * Provides lifecycle management for continuous clock updates
 */

export class AnimationController {
  /**
   * Creates an animation controller
   * @param {Function} callback - Function to call on each animation frame
   */
  constructor(callback) {
    this.callback = callback;
    this.frameId = null;
    this.running = false;
    this.loop = this.loop.bind(this);
  }

  /**
   * Internal animation loop
   * @param {DOMHighResTimeStamp} timestamp - High-resolution timestamp
   * @private
   */
  loop(timestamp) {
    if (!this.running) return;

    this.callback(timestamp);
    this.frameId = requestAnimationFrame(this.loop);
  }

  /**
   * Starts the animation loop
   */
  start() {
    if (this.running) return; // Idempotent

    this.running = true;
    this.frameId = requestAnimationFrame(this.loop);
  }

  /**
   * Stops the animation loop
   */
  stop() {
    if (!this.running) return; // Idempotent

    this.running = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Returns whether the animation loop is running
   * @returns {boolean} True if animation is active
   */
  isRunning() {
    return this.running;
  }
}
