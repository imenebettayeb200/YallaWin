import { useEffect, useState } from 'react';

/**
 * A clock that re-renders the screen on a timer.
 * Event lists, greetings, and countdowns stay current without a refresh.
 */
export default function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
