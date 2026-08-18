import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'components/Icon';
import fireEvent from 'helpers/fireEvent';
import selectors from 'selectors';
import Events from 'constants/events';
import PropTypes from 'prop-types';
import useIsRTL from 'hooks/useIsRTL';

import './ResizeBar.scss';
import { getInstanceRect } from 'src/helpers/getRootNode';

const ResizeBar = ({ onResize, minWidth, leftDirection, dataElement, currentWidth }) => {
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const isMouseDownRef = useRef(false);
  const initialMouseXRef = useRef(0);
  const initialWidthRef = useRef(0);
  const resizeAnimationFrameRef = useRef(null);
  const pendingWidthRef = useRef(null);
  const isRTL = useIsRTL();
  const onResizeRef = useRef(onResize);
  const resizeBarRef = useRef(null);

  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    const scheduleResize = (newWidth) => {
      pendingWidthRef.current = newWidth;
      if (resizeAnimationFrameRef.current !== null) {
        return;
      }
      resizeAnimationFrameRef.current = window.requestAnimationFrame(() => {
        resizeAnimationFrameRef.current = null;
        if (pendingWidthRef.current !== null) {
          onResizeRef.current(pendingWidthRef.current);
          fireEvent(Events.PANEL_RESIZED, [dataElement, pendingWidthRef.current]);
          pendingWidthRef.current = null;
        }
      });
    };
    const cancelScheduledResize = () => {
      if (resizeAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeAnimationFrameRef.current);
        resizeAnimationFrameRef.current = null;
      }
      pendingWidthRef.current = null;
    };
    const dragMouseMove = ({ clientX }) => {
      if (isMouseDownRef.current) {
        const deltaX = clientX - initialMouseXRef.current;
        let newWidth;

        if (typeof currentWidth === 'number') {
          newWidth = initialWidthRef.current + (isRTL ? -deltaX : deltaX);
        } else {

          const windowRect = getInstanceRect(resizeBarRef.current);
          if (leftDirection) {
            const elementOffset = windowRect.right;
            newWidth = Math.max(minWidth, Math.min(window.innerWidth, elementOffset - clientX));
          } else {
            const elementOffset = windowRect.left;
            newWidth = Math.max(minWidth, Math.min(window.innerWidth, clientX - elementOffset));
          }
        }
        newWidth = Math.max(minWidth, newWidth);
        scheduleResize(newWidth);
      }
    };
    const finishDrag = () => {
      isMouseDownRef.current = false;
      cancelScheduledResize();
    };
    document.addEventListener('mousemove', dragMouseMove);
    document.addEventListener('mouseup', finishDrag);
    return () => {
      cancelScheduledResize();
      document.removeEventListener('mousemove', dragMouseMove);
      document.removeEventListener('mouseup', finishDrag);
    };
  }, [isRTL, leftDirection, minWidth, currentWidth, dataElement]);

  if (isDisabled) {
    return null;
  }

  return (
    <div
      ref={resizeBarRef}
      data-element={dataElement}
      className="resize-bar"
      onMouseDown={(e) => {
        isMouseDownRef.current = true;
        initialMouseXRef.current = e.clientX;
        initialWidthRef.current = typeof currentWidth === 'number' ? currentWidth : 0;
      }}
    >
      <Icon glyph="icon-detach-toolbar" />
    </div>
  );
};

ResizeBar.propTypes = {
  onResize: PropTypes.func.isRequired,
  minWidth: PropTypes.number.isRequired,
  leftDirection: PropTypes.bool,
  dataElement: PropTypes.string.isRequired,
  currentWidth: PropTypes.number,
};

export default ResizeBar;
