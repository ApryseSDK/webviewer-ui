import { useEffect, useRef, useState } from 'react';

const useResizeObserver = () => {
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;

    if (node) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const observedWidth = entry.borderBoxSize[0].inlineSize;
          const observedHeight = entry.borderBoxSize[0].blockSize;
          setDimensions({
            width: observedWidth,
            height: observedHeight
          });
        }
      });

      observer.observe(node);

      // Cleanup: stop observing when the component unmounts
      return () => {
        observer.unobserve(node);
      };
    }
  }, [elementRef.current]);

  return [elementRef, dimensions];
};

export default useResizeObserver;
