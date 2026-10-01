// Records whether the user last used a pointer or the keyboard, as
// data-input-modality on <html>. Google Maps moves focus in code after mouse and
// touch use (to a dragged marker, or into an opened info window) in a way that
// matches :focus-visible, so index.css uses this to show focus styles to
// keyboard users only.

const modifierKeys = new Set(['Alt', 'Control', 'Meta', 'Shift']);

export const trackInputModality = (root: HTMLElement = document.documentElement) => {
  const listeners = new AbortController();
  const options = {capture: true, signal: listeners.signal};

  root.dataset.inputModality = 'keyboard';
  window.addEventListener('pointerdown', () => {
    root.dataset.inputModality = 'pointer';
  }, options);
  window.addEventListener('keydown', (event) => {
    // Modifier keys are often held during a click, so they do not count
    if (!modifierKeys.has(event.key)) {
      root.dataset.inputModality = 'keyboard';
    }
  }, options);

  return () => listeners.abort();
};
