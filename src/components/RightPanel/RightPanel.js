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
    isOfficeEditorToolsHeaderOpen,
    isOpen,
    isDisabled,
    isInDesktopOnlyMode,
    isMultiTabActive,
    topHeaders,
    featureFlags = {},
    topHeadersHeight,
    bottomHeadersHeight,
  ] = useSelector(
    (state) => [
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementOpen(state, 'officeEditorToolsHeader'),
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
      selectors.isInDesktopOnlyMode(state),
      selectors.getIsMultiTab(state),
      selectors.getTopHeaders(state),
      selectors.getFeatureFlags(state),
      selectors.getTopHeadersHeight(state),
      selectors.getBottomHeadersHeight(state),
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

  // TODO: For whoever is refactoring the RightPanel to make it generic, review if this is the best approach
  // Once we move to the new modular UI we can remove the legacy stuff
  const legacyToolsHeaderOpen = isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View';
  const legacyAllHeadersHidden = !isHeaderOpen && !legacyToolsHeaderOpen;
  const { modularHeader } = featureFlags;
  const style = {};
  // Calculating its height according to the existing horizontal modular headers
  if (modularHeader) {
    const horizontalHeadersHeight = topHeadersHeight + bottomHeadersHeight;
    style['height'] = `calc(100% - ${horizontalHeadersHeight}px)`;
  }

  return (
    <div
      className={classNames({
        'right-panel': true,
        'closed': !isVisible,
        'tools-header-open': (modularHeader ? topHeaders.length === 2 : legacyToolsHeaderOpen) || isOfficeEditorToolsHeaderOpen,
        'tools-header-and-header-hidden': modularHeader ? topHeaders.length === 0 : legacyAllHeadersHidden,
        'multi-tab-active': isMultiTabActive
      })}
      style={style}
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
