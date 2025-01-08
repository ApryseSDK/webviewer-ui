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
  parent: PropTypes.string,
};

const ResponsiveContainer = ({
  headerDirection,
  elementRef,
  children,
  items,
  parent,
}) => {
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
    requestAnimationFrame(async () => {
      let freeSpace;
      try {
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
        freeSpace = getCurrentFreeSpace(headerDirection, elementRef.current);
        const itemToResizeFunc = findItemToResize(enabledItems, freeSpace, headerDirection, parent, elementRef.current);
        if (itemToResizeFunc) {
          itemToResizeFunc();
        }
      } catch (e) {
        console.error(e);
      } finally {
        isResizingRef.current = false;
      }
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