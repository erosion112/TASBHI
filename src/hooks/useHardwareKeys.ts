import { useEffect, useRef } from 'react';

interface UseHardwareKeysOptions {
  enabled: boolean;
  onIncrement: () => void;
}

export function useHardwareKeys({ enabled, onIncrement }: UseHardwareKeysOptions) {
  const onIncrementRef = useRef(onIncrement);
  onIncrementRef.current = onIncrement;

  useEffect(() => {
    if (!enabled) return;

    let lastKeyPressTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Keys to intercept:
      // - Volume keys: 'AudioVolumeUp', 'AudioVolumeDown', 'VolumeUp', 'VolumeDown'
      // - Accessibility/Earphone/Hardware triggers: 'ArrowUp', 'ArrowDown', 'Space', 'Enter', 'PageUp', 'PageDown'
      const isVolumeKey =
        e.code === 'AudioVolumeUp' ||
        e.code === 'AudioVolumeDown' ||
        e.key === 'AudioVolumeUp' ||
        e.key === 'AudioVolumeDown' ||
        e.key === 'VolumeUp' ||
        e.key === 'VolumeDown';

      const isConvenientKey =
        e.code === 'Space' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowUp' ||
        e.code === 'Enter' ||
        e.code === 'PageDown' ||
        e.code === 'PageUp' ||
        e.key === 'v' ||
        e.key === 'V'; // 'V' for volume simulator

      if (isVolumeKey || isConvenientKey) {
        // Prevent scrolling page on space or arrows
        if (e.code === 'Space' || e.code.startsWith('Arrow') || e.code.startsWith('Page')) {
          e.preventDefault();
        }

        const now = performance.now();
        // Debounce to prevent mechanical bounce (130ms)
        if (now - lastKeyPressTime > 130) {
          lastKeyPressTime = now;
          onIncrementRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [enabled]);
}
