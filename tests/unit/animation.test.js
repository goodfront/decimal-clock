import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimationController } from '../../src/utils/animation.js';

describe('AnimationController', () => {
  let callback;
  let controller;

  beforeEach(() => {
    callback = vi.fn();
    controller = new AnimationController(callback);
  });

  afterEach(() => {
    controller.stop();
  });

  test('initializes with isRunning = false', () => {
    expect(controller.isRunning()).toBe(false);
  });

  test('start() sets isRunning to true', () => {
    controller.start();
    expect(controller.isRunning()).toBe(true);
  });

  test('start() initiates animation loop', async () => {
    controller.start();
    // Wait for requestAnimationFrame to execute
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(callback).toHaveBeenCalled();
  });

  test('stop() sets isRunning to false', () => {
    controller.start();
    controller.stop();
    expect(controller.isRunning()).toBe(false);
  });

  test('stop() stops calling callback', async () => {
    controller.start();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    callback.mockClear();
    controller.stop();

    // Wait for potential additional frame (shouldn't happen)
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(callback).not.toHaveBeenCalled();
  });

  test('start() is idempotent', () => {
    controller.start();
    const firstCallCount = callback.mock.calls.length;

    controller.start(); // Call again
    const secondCallCount = callback.mock.calls.length;

    // Should not have initiated additional callbacks
    expect(secondCallCount).toBe(firstCallCount);
  });

  test('stop() is idempotent', () => {
    controller.start();
    controller.stop();
    const running1 = controller.isRunning();

    controller.stop(); // Call again
    const running2 = controller.isRunning();

    expect(running1).toBe(false);
    expect(running2).toBe(false);
  });

  test('callback receives timestamp', async () => {
    controller.start();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(callback).toHaveBeenCalledWith(expect.any(Number));
  });
});
