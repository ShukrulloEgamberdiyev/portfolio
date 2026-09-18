import { useEffect, useState } from 'react';

/**
 * Media query hook that is hydration-safe: the first render always returns
 * `fallback` (the same value the server rendered), then updates after mount.
 */
export function useMedia(query: string, fallback = false) {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
