import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import Icon from 'components/Icon';
import actions from 'actions';
import './Panel.scss';
import { panelMinWidth, RESIZE_BAR_WIDTH } from 'constants/panel';
import ResizeBar from 'components/ResizeBar';
import { isIE } from 'helpers/device';

const Panel = (props) => {
  const { isCustom, dataElement, location } = props;
  const isMobile = isMobileSize();

  const [
    currentWidth,
    isInDesktopOnlyMode,
    isOpen,
    isDisabled,
    currentToolbarGroup,
    isHeaderOpen,
    isToolsHeaderOpen,
    isLogoBarEnabled,
    featureFlags,
    activeTopHeaders,
  ] = useSelector(
    (state) => [
      selectors.getPanelWidth(state, dataElement),
      selectors.isInDesktopOnlyMode(state),
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      !selectors.isElementDisabled(state, 'logoBar'),
      selectors.getFeatureFlags(state),
      selectors.getActiveTopHeaders(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  let style = {};
  if (currentWidth && (isInDesktopOnlyMode || !isMobile)) {
    const widthStyle = isCustom ? currentWidth - RESIZE_BAR_WIDTH : currentWidth;
    style = { width: `${widthStyle}px`, minWidth: `${widthStyle}px` };
  } else {
    style = { minWidth: `${panelMinWidth}px` };
  }
  const isVisible = !(!isOpen || isDisabled);
  const isLeftSide = !location ? true : location === 'left';
  const isRightSide = location === 'right';

  // TODO: For whoever is refactoring the LeftPanel to make it generic, review if this is the best approach
  // Once we move to the new UI we can remove the legacy stuff
  const legacyToolsHeaderOpen = isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View';
  const legacyAllHeadersHidden = !isHeaderOpen && !legacyToolsHeaderOpen;

  const customizableUI = featureFlags?.customizableUI;

  const onResize = (_width) => {
    let maxAllowedWidth = window.innerWidth;
    // there will be a scroll bar in IE, so we don't allow 100% page width
    if (isIE) {
      maxAllowedWidth -= 30;
    }
    dispatch(actions.setPanelWidth(dataElement, Math.min(_width, maxAllowedWidth)));
  };

  const children = React.cloneElement(props.children, {
    isCustomPanel: true,
    dataElement: dataElement,
    isCustomPanelOpen: isVisible,
    isLeftSide: isLeftSide,
  });

  return (
    <>
      <div
        className={classNames({
          'flx-Panel': true,
          'closed': !isVisible,
          'left': isLeftSide,
          'right': isRightSide,
          'tools-header-open': customizableUI ? activeTopHeaders.length === 2 : legacyToolsHeaderOpen,
          'tools-header-and-header-hidden': customizableUI ? activeTopHeaders.length === 0 : legacyAllHeadersHidden,
          'logo-bar-enabled': isLogoBarEnabled,
        })}
        data-element={dataElement}
      >
        {isCustom && location === 'right' && !isInDesktopOnlyMode && !isMobile &&
          <ResizeBar minWidth={panelMinWidth} dataElement={`${dataElement}ResizeBar`} onResize={onResize}
            leftDirection={true} />}
        <div className={`flx-Panel-container ${dataElement}`} style={style}>
          {!isInDesktopOnlyMode && isMobile && (
            <div className="close-container">
              <div
                className="close-icon-container"
                onClick={() => {
                  dispatch(actions.closeElements([dataElement]));
                }}
              >
                <Icon glyph="ic_close_black_24px" className="close-icon" />
              </div>
            </div>
          )}
          {children}
        </div>
        {isCustom && location === 'left' && !isInDesktopOnlyMode && !isMobile &&
          <ResizeBar minWidth={panelMinWidth} dataElement={`${dataElement}ResizeBar`} onResize={onResize} />}
      </div>
    </>
  );
};

export default Panel;
