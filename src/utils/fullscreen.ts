/**
 * Fullscreen helpers.
 *
 * iOS Safari has no Fullscreen API for non-video elements, so requestFullscreen
 * is undefined there and calling it throws synchronously — before any .catch()
 * can attach. The optional calls below keep it a no-op on those platforms.
 */

export const isFullscreenSupported = (): boolean =>
  typeof document.documentElement.requestFullscreen === 'function';

export const toggleFullscreen = (): void => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
};
