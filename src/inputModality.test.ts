import {afterEach, describe, expect, it} from 'vitest';

import {trackInputModality} from './inputModality';

describe('trackInputModality', () => {
  let stop = () => {};
  afterEach(() => stop());

  const modality = () => document.documentElement.dataset.inputModality;

  it('starts as keyboard and follows the last input used', () => {
    stop = trackInputModality();
    expect(modality()).toBe('keyboard');

    window.dispatchEvent(new Event('pointerdown'));
    expect(modality()).toBe('pointer');

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
    expect(modality()).toBe('keyboard');
  });

  it('ignores modifier keys held during a click', () => {
    stop = trackInputModality();
    window.dispatchEvent(new Event('pointerdown'));
    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Shift'}));

    expect(modality()).toBe('pointer');
  });
});
