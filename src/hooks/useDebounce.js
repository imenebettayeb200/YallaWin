import { useEffect, useState } from 'react';

/**
 * useDebounce — returns `value` only after it stopped changing for `delay` ms.
 * Used by the home search so the list is filtered once you pause typing,
 * not on every key press.
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer); // a new key press cancels the old timer
  }, [value, delay]);

  return debounced;
}