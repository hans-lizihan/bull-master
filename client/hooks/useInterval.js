import { useRef, useEffect } from 'react';

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      tick();
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);
}
