import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook to animate scores / numbers smoothly when scrolled into view.
 * @param {number} targetValue - The numeric target value to reach.
 * @param {number} duration - Animation duration in ms.
 * @param {number} decimals - Number of decimal places (e.g., 1 for 4.2 or 8.5).
 */
export function useScoreAnimation(targetValue, duration = 1600, decimals = 0) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic curve for natural decelerating number animation
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const current = targetValue * easeOutProgress;

            if (decimals > 0) {
              setDisplayValue(parseFloat(current.toFixed(decimals)));
            } else {
              setDisplayValue(Math.floor(current));
            }

            if (progress < 1) {
              window.requestAnimationFrame(animate);
            } else {
              setDisplayValue(targetValue);
            }
          };

          window.requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [targetValue, duration, decimals]);

  return [displayValue, elementRef];
}
