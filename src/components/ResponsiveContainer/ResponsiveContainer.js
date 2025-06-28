import React, { useEffect, useRef } from 'react';
import { getCurrentFreeSpace, findItemToResize, ResizingPromises } from 'helpers/responsivenessHelper';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const propTypes = {
  headerDirection: PropTypes.string,
  elementRef: PropTypes.object,
  children: PropTypes.any,
  items: PropTypes.array,
  parentDataElement: PropTypes.string,
};

const ResponsiveContainer = ({
  headerDirection,
  elementRef,
  children,
  items,
  parentDataElement,
}) => {
  const animationRequest = useRef(null);
  const isResizingRef = useRef(false);
  const enabledItems = useSelector((state) => items.map((item) => {
    if (selectors.isElementDisabled(state, item.dataElement)) {
      return null;
    }
    return item;
  }).filter((item) => !!item));

  const resizeResponsively = () => {
    if (isResizingRef.current) {
      return;
    }
    isResizingRef.current = true;
    animationRequest.current = requestAnimationFrame(async () => {
      animationRequest.current = null;
      let retry = false;
      try {
        if (ResizingPromises[parentDataElement]) {
          await ResizingPromises[parentDataElement].promise;
        }
        for (let item of items) {
          const { dataElement } = item;
          if (ResizingPromises[dataElement]) {
            await ResizingPromises[dataElement].promise;
          }
        }
        const propertyToCheck = headerDirection === 'column' ? 'height' : 'width';
        const newSize = elementRef.current.getBoundingClientRect()[propertyToCheck];
        if (newSize <= 0) {
          return;
        }
        const freeSpace = getCurrentFreeSpace({ headerDirection, element: elementRef.current });
        const itemToResizeFunc = findItemToResize({
          items: enabledItems,
          freeSpace,
          headerDirection, parentDataElement,
        });
        if (itemToResizeFunc) {
          itemToResizeFunc();
          retry = true;
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(e);
        }
      } finally {
        isResizingRef.current = false;
        if (retry) {
          resizeResponsively();
        }
      }
    });
  };

  useEffect(() => {
    if (!window.ResizeObserver || !window.MutationObserver) {
      return console.error('Browser not support for header responsiveness');
    }
    if (!elementRef.current) {
      // Element might be disabled so no error or warning
      return;
    }
    const resizeObserver = new ResizeObserver(resizeResponsively);
    resizeObserver.observe(elementRef.current);
    const mutationObserver = new MutationObserver(resizeResponsively);
    mutationObserver.observe(elementRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (animationRequest.current) {
        cancelAnimationFrame(animationRequest.current);
        animationRequest.current = null;
        isResizingRef.current = false;
      }
    };
  }, [items, elementRef?.current, parentDataElement, headerDirection]);

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