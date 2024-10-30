import React, { useRef, useEffect } from 'react';
import { getCurrentFreeSpace, findItemToResize } from 'helpers/responsivenessHelper';
import PropTypes from 'prop-types';

const propTypes = {
  headerDirection: PropTypes.string,
  elementRef: PropTypes.object,
  children: PropTypes.any,
  items: PropTypes.array,
  parent: PropTypes.string,
};

const ResponsiveContainer = ({
  headerDirection,
  elementRef,
  children,
  items,
  parent,
}) => {
  const lastCheckedFreeSpaceRef = useRef(null);
  const isResizingRef = useRef(false);
  const defaultLoopCounterState = { counter: 0, space: null };
  const loopingCounterRef = useRef(defaultLoopCounterState);

  const resizeResponsively = () => {
    if (isResizingRef.current) {
      return;
    }
    isResizingRef.current = true;
    requestAnimationFrame(() => {
      let freeSpace;
      while (typeof freeSpace === 'undefined' || freeSpace !== lastCheckedFreeSpaceRef.current) {
        try {
          const propertyToCheck = headerDirection === 'column' ? 'height' : 'width';
          const newSize = elementRef.current.getBoundingClientRect()[propertyToCheck];
          if (newSize <= 0) {
            break;
          }
          freeSpace = getCurrentFreeSpace(headerDirection, elementRef.current);
          const itemToResizeFunc = findItemToResize(items, freeSpace, headerDirection, parent, elementRef.current);
          if (itemToResizeFunc) {
            // Prevent more than 3 loops with the same free space
            if (loopingCounterRef.current.counter === 3) {
              loopingCounterRef.current = defaultLoopCounterState;
              break;
            }
            if (freeSpace && freeSpace === loopingCounterRef.current.space) {
              loopingCounterRef.current.counter++;
            } else {
              loopingCounterRef.current = { counter: 1, space: freeSpace };
            }
            lastCheckedFreeSpaceRef.current = null;
            itemToResizeFunc();
          } else {
            lastCheckedFreeSpaceRef.current = freeSpace;
            loopingCounterRef.current = defaultLoopCounterState;
          }
        } catch (e) {
          console.error(e);
          break;
        }
      }
      isResizingRef.current = false;
    });
  };

  useEffect(() => {
    if (!window.ResizeObserver) {
      return console.error('Browser not support for header responsiveness');
    }
    const resizeObserver = new ResizeObserver(resizeResponsively);
    resizeObserver.observe(elementRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [items, elementRef, parent, headerDirection]);

  useEffect(() => {
    resizeResponsively();
  }, []);

  return (
    <>
      {children}
    </>
  );
};

ResponsiveContainer.propTypes = propTypes;

export default ResponsiveContainer;