import { useEffect } from 'react';

export default function useCloseOnWindowResize(closeCallback) {
  useEffect(() => {
    window.addEventListener('resize', closeCallback);

    return () => {
      window.removeEventListener('resize', closeCallback);
    };
  }, [closeCallback]);
}
