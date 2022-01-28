import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ResizeBar from 'components/ResizeBar';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import classNames from 'classnames';

import './RightPanel.scss';

const RightPanel = ({ children, dataElement, onResize }) => {
  const [
    currentToolbarGroup,
    isHeaderOpen,
    isToolsHeaderOpen,
    isOpen,
    isDisabled,
    isInDesktopOnlyMode
  ] = useSelector(
    state => [
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
      selectors.isInDesktopOnlyMode(state)
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

  return (
    <div
      className={classNames({
        'right-panel': true,
        'closed': !isVisible,
        'tools-header-open': isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View',
        'tools-header-and-header-hidden': !isHeaderOpen && !isToolsHeaderOpen
      })}
    >
      {(isInDesktopOnlyMode || !isTabletAndMobile) &&
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
