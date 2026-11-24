import { useEffect, useState } from 'react';

/**
 * useLocalStorageState — works like useState, but the value is remembered
 * in localStorage, so it is still there after a page refresh.
 *
 * const [filters, setFilters] = useLocalStorageState('yw_home_filters', DEFAULT_FILTERS);
 */
export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? { ...initialValue, ...JSON.parse(saved) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or disabled: keep working without saving */
    }
  }, [key, value]);

  return [value, setValue];
}