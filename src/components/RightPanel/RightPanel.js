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
    isInDesktopOnlyMode,
    isMultiTabActive,
    featureFlags = {},
    headerList = [],
  ] = useSelector(
    (state) => [
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
      selectors.isInDesktopOnlyMode(state),
      selectors.getIsMultiTab(state),
      selectors.getFeatureFlags(state),
      selectors.getModularHeaderList(state),
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
  const topHeaders = headerList.filter((header) => header.props.placement === 'top');
  const legacyToolsHeaderOpen = isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View';
  const legacyAllHeadersHidden = !isHeaderOpen && !legacyToolsHeaderOpen;
  const { modularHeader } = featureFlags;

  return (
    <div
      className={classNames({
        'right-panel': true,
        'closed': !isVisible,
        'tools-header-open': modularHeader ? topHeaders.length === 2 : legacyToolsHeaderOpen,
        'tools-header-and-header-hidden': modularHeader ? topHeaders.length === 0 : legacyAllHeadersHidden,
        'multi-tab-active': isMultiTabActive
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
