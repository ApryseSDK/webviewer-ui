import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ResizeBar from 'components/ResizeBar';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './RightPanel.scss';

const RightPanel = ({ children, dataElement, onResize }) => {
  const [
    isOpen,
    isDisabled,
  ] = useSelector(
    state => [
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
    ],
    shallowEqual,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const isVisible = isOpen && !isDisabled;
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="right-panel"
    >
      {!isTabletAndMobile &&
        <ResizeBar
          dataElement={`${dataElement}ResizeBar`}
          minWidth={293}
          onResize={onResize}
          leftDirection
        />}
      {children}
    </div>
  );
};

export default RightPanel;
