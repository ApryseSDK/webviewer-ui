import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';

const useResizeObserver = () => {
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const elementRef = useRef(null);

  const updateDimensions = throttle((entries) => {
    for (const entry of entries) {
      const observedWidth = entry.borderBoxSize[0].inlineSize;
      const observedHeight = entry.borderBoxSize[0].blockSize;
      setDimensions({
        width: observedWidth,
        height: observedHeight
      });
    }
  }, 100);

  useEffect(() => {
    const node = elementRef.current;

    if (node) {
      const observer = new ResizeObserver((entries) => {
        requestAnimationFrame(() => updateDimensions(entries));
      });

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }
  }, [elementRef.current]);

  return [elementRef, dimensions];
};

export default useResizeObserver;
