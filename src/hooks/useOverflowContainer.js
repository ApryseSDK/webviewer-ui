import { useState, useRef, useLayoutEffect, useMemo } from 'react';

/**
 * Check if popup overflows top or bottom of container and return new location
 * @param {boolean | undefined} isOpen
 * @param {{
 *  defaultLocation: 'bottom' | 'top',
 *  offset: number,
 *  padding: number,
 *  container: string
 * }} options Default values { defaultLocation: 'bottom', offset: 10, padding: 5, container: 'body' }
 * @returns {{
 *    popupMenuRef: React.MutableRefObject<null>,
 *    location: 'bottom' | 'top',
 *    style: { top: string | undefined, bottom: string | undefined, transform: string | undefined }
 * }}
 */
const useOverflowContainer = (isOpen, options) => {
  const { defaultLocation, padding, offset, container } = {
    defaultLocation: 'bottom',
    padding: 5,
    offset: 10,
    container: 'body',
    ...options,
  };

  const [location, setLocation] = useState(defaultLocation);
  const popupMenuRef = useRef();
  const topBottomCalc = useMemo(() => `calc(100% + ${padding ?? 5}px)`, [padding]);
  const containerEle =
    document.querySelector(container) === null ? document.querySelector('body') : document.querySelector(container);
  const [top, setTop] = useState(defaultLocation === 'bottom' ? topBottomCalc : undefined);
  const [bottom, setBottom] = useState(defaultLocation === 'top' ? topBottomCalc : undefined);
  const [transform, setTransform] = useState(undefined);

  useLayoutEffect(() => {
    const popupMenuEle = popupMenuRef.current;
    if (!popupMenuEle) {
      return;
    }

    const _isOpen = isOpen !== undefined ? isOpen : true;
    const popupRect = popupMenuEle.getBoundingClientRect();
    setTransform('');
    if (_isOpen && popupMenuEle && containerEle) {
      const containerRect = containerEle.getBoundingClientRect();

      if (popupRect.left + popupRect.width > containerRect.right) {
        const newTransform = `translateX(-${popupRect.width - offset}px)`;
        if (transform !== newTransform) {
          setTransform(newTransform);
        }
      }
      if (location === 'bottom' && popupRect.bottom > containerRect.bottom) {
        setLocation('top');
        setBottom(topBottomCalc);
        setTop(undefined);
      }
      if (location === 'top' && popupRect.top < containerRect.top) {
        setLocation('bottom');
        setTop(topBottomCalc);
        setBottom(undefined);
      }
    }

    if (containerEle === null) {
      const newTransform = `translateX(-${popupRect.width - offset}px)`;
      if (transform !== newTransform) {
        setTransform(newTransform);
      }
    }
  }, [isOpen, popupMenuRef, containerEle, topBottomCalc, offset]); // Removed `transform` and `location` from dependencies

  const style = useMemo(() => ({ top, bottom, transform }), [top, bottom, transform]);

  return { popupMenuRef, location, style };
};

export default useOverflowContainer;
