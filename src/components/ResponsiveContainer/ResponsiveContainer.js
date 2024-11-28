import React, { useEffect } from 'react';
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
  const resizeResponsively = () => {
    requestAnimationFrame(() => {
      let freeSpace;
      try {
        const propertyToCheck = headerDirection === 'column' ? 'height' : 'width';
        const newSize = elementRef.current.getBoundingClientRect()[propertyToCheck];
        if (newSize <= 0) {
          return;
        }
        freeSpace = getCurrentFreeSpace(headerDirection, elementRef.current);
        const itemToResizeFunc = findItemToResize(items, freeSpace, headerDirection, parent, elementRef.current);
        if (itemToResizeFunc) {
          itemToResizeFunc();
        }
      } catch (e) {
        console.error(e);
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