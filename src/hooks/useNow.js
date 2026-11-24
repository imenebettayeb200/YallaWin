import { useEffect, useState } from 'react';

/**
 * useNow — the current time, updated every `intervalMs` (default 1 second).
 * Used by "Application under review" to update the status live.
 */
export default function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer); // stop the timer when the page closes
  }, [intervalMs]);

  return now;
}