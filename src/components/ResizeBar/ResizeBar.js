import React, { useEffect, useRef } from 'react';

import Icon from 'components/Icon';

import './ResizeBar.scss';

const ResizeBar = ({ onResize, minWidth, left }) => {
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // this listener is throttled because the notes panel listens to the panel width
    // change in order to rerender to have the correct width and we don't want
    // it to rerender too often

    // Removed throttle for now. It was causing jitterness when resizing.
    // Maybe throttle is necessary because other components listening to the width would re-render too often?
    const dragMouseMove = ({ clientX }) => {
      if (isMouseDownRef.current && clientX < 900) {
        onResize(Math.max(minWidth, left ? window.innerWidth - clientX : clientX));
      }
    };

    document.addEventListener('mousemove', dragMouseMove);
    return () => document.removeEventListener('mousemove', dragMouseMove);
  }, [left, minWidth, onResize]);

  useEffect(() => {
    const finishDrag = () => {
      isMouseDownRef.current = false;
    };

    document.addEventListener('mouseup', finishDrag);
    return () => document.removeEventListener('mouseup', finishDrag);
  }, []);

  return (
    <div
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
