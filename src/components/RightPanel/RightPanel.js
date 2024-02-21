import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ResizeBar from 'components/ResizeBar';
import selectors from 'selectors';
import { isTabletAndMobileSize } from 'helpers/getDeviceSize';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';

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
    isLogoBarEnabled,
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
      !selectors.isElementDisabled(state, DataElements.LOGO_BAR)
    ],
    shallowEqual,
  );

  const isTabletAndMobile = isTabletAndMobileSize();
  const isVisible = isOpen && !isDisabled;

  // TODO: For whoever is refactoring the RightPanel to make it generic, review if this is the best approach
  // Once we move to the new modular UI we can remove the legacy stuff
  const legacyToolsHeaderOpen = isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View';
  const legacyAllHeadersHidden = !isHeaderOpen && !legacyToolsHeaderOpen;
  const { customizableUI } = featureFlags;
  const style = {
    // prevent panel from appearing until scss is loaded
    display: 'none',
  };
  // Calculating its height according to the existing horizontal modular headers
  if (customizableUI) {
    const horizontalHeadersHeight = topHeadersHeight + bottomHeadersHeight;
    style['height'] = `calc(100% - ${horizontalHeadersHeight}px)`;
  }

  return (
    <div
      className={classNames({
        'right-panel': true,
        'closed': !isVisible,
        'tools-header-open': (customizableUI ? topHeaders.length === 2 : legacyToolsHeaderOpen) || isOfficeEditorToolsHeaderOpen,
        'tools-header-and-header-hidden': customizableUI ? topHeaders.length === 0 : legacyAllHeadersHidden,
        'multi-tab-active': isMultiTabActive,
        'logo-bar-enabled': isLogoBarEnabled,
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
