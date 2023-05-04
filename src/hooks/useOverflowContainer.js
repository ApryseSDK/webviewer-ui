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
    ...options
  };

  const [location, setLocation] = useState(defaultLocation);
  const popupMenuRef = useRef();
  const topBottomCalc = useMemo(() => `calc(100% + ${padding ?? 5}px)`, [padding]);
  const containerEle = useMemo(() => document.querySelector(container), [container]);

  const [top, setTop] = useState(defaultLocation === 'bottom' ? topBottomCalc : undefined);
  const [bottom, setBottom] = useState(defaultLocation === 'top' ? topBottomCalc : undefined);
  const [transform, setTransform] = useState(undefined);

  useLayoutEffect(() => {
    const popupMenuEle = popupMenuRef.current;

    const _isOpen = isOpen !== undefined ? isOpen : true;

    if (_isOpen && popupMenuEle && containerEle) {
      const popupRect = popupMenuEle.getBoundingClientRect();
      const containerRect = containerEle.getBoundingClientRect();

      let overflow = undefined;

      if (popupRect.left < containerRect.left) {
        overflow = Math.floor(containerRect.left - popupRect.left) + offset;
      } else if (popupRect.right > containerRect.right) {
        overflow = -Math.ceil(popupRect.right - containerRect.right) - offset;
      }

      if (!transform && overflow) setTransform(`translateX(${overflow}px)`);

      const shouldRelocateTop = location === 'bottom' && popupRect.bottom > containerRect.bottom;
      if (shouldRelocateTop) {
        setLocation('top');
        setBottom(topBottomCalc);
        setTop(undefined);
      }

      const shouldRelocateBottom = location === 'top' && popupRect.top < containerRect.top;
      if (shouldRelocateBottom) {
        setLocation('bottom');
        setTop(topBottomCalc);
        setBottom(undefined);
      }
    }
  }, [isOpen, popupMenuRef, location, container]);

  const style = useMemo(() => ({ top, bottom, transform }), [top, bottom, transform]);

  return { popupMenuRef, location, style };
};

export default useOverflowContainer;
