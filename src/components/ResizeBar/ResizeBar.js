import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'components/Icon';
import fireEvent from 'helpers/fireEvent';
import selectors from 'selectors';
import Events from 'constants/events';

import './ResizeBar.scss';

const ResizeBar = ({ onResize, minWidth, leftDirection, dataElement }) => {
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // this listener is throttled because the notes panel listens to the panel width
    // change in order to rerender to have the correct width and we don't want
    // it to rerender too often

    // Removed throttle for now. It was causing jitterness when resizing.
    // Maybe throttle is necessary because other components listening to the width would re-render too often?
    const dragMouseMove = ({ clientX }) => {
      if (isMouseDownRef.current) {
        const newWidth = Math.max(minWidth, Math.min(window.innerWidth, leftDirection ? window.innerWidth - clientX : clientX));
        onResize(newWidth);
        fireEvent(Events.PANEL_RESIZED, { element: dataElement, width: newWidth });
      }
    };

    document.addEventListener('mousemove', dragMouseMove);
    return () => document.removeEventListener('mousemove', dragMouseMove);
  }, [leftDirection, minWidth, onResize]);

  useEffect(() => {
    const finishDrag = () => {
      isMouseDownRef.current = false;
    };

    document.addEventListener('mouseup', finishDrag);
    return () => document.removeEventListener('mouseup', finishDrag);
  }, []);

  return isDisabled ? null : (
    <div
      data-element={dataElement}
      className="resize-bar"
      onMouseDown={() => {
        isMouseDownRef.current = true;
      }}
    >
      <Icon glyph="icon-detach-toolbar" />
    </div>
  );
};

export default ResizeBar;
