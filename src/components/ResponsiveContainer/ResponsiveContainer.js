import React, { useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import { getCurrentFreeSpace, findItemToResize } from 'helpers/responsivenessHelper';

const propTypes = {};

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
  };

  useEffect(() => {
    if (!window.ResizeObserver) {
      return console.error('Browser not support for header responsiveness');
    }
    const resizeFunction = throttle(resizeResponsively, 200, { trailing: true });
    const resizeObserver = new ResizeObserver(resizeFunction);
    resizeObserver.observe(elementRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [items, elementRef, parent, headerDirection]);

  useEffect(() => {
    // Timeout to ensure component has properly been mutated into the dom before we try to fit elements
    setTimeout(() => {
      resizeResponsively();
    }, 500);
  }, []);

  return (
    <>
      {children}
    </>
  );
};

ResponsiveContainer.propTypes = propTypes;

export default ResponsiveContainer;