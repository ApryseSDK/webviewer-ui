import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import Icon from 'components/Icon';
import actions from 'actions';
import './Panel.scss';
import { panelMinWidth } from 'constants/panel';

const Panel = (props) => {
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
    topHeaders,
  ] = useSelector(
    (state) => [
      selectors.getPanelWidth(state, props.dataElement),
      selectors.isInDesktopOnlyMode(state),
      selectors.isElementOpen(state, props.dataElement),
      selectors.isElementDisabled(state, props.dataElement),
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      !selectors.isElementDisabled(state, 'logoBar'),
      selectors.getFeatureFlags(state),
      selectors.getTopHeaders(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  let style = {};
  if (currentWidth && (isInDesktopOnlyMode || !isMobile)) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  } else {
    style = { minWidth: `${panelMinWidth}px` };
  }
  const isVisible = !(!isOpen || isDisabled);
  const isLeftSide = !props.location ? true : props.location === 'left';
  const isRightSide = props.location === 'right';

  // TODO: For whoever is refactoring the LeftPanel to make it generic, review if this is the best approach
  // Once we move to the new UI we can remove the legacy stuff
  const legacyToolsHeaderOpen = isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View';
  const legacyAllHeadersHidden = !isHeaderOpen && !legacyToolsHeaderOpen;

  const customizableUI = featureFlags?.customizableUI;

  return (
    <div
      className={classNames({
        'flx-Panel': true,
        'closed': !isVisible,
        'left': isLeftSide,
        'right': isRightSide,
        'tools-header-open': customizableUI ? topHeaders.length === 2 : legacyToolsHeaderOpen,
        'tools-header-and-header-hidden': customizableUI ? topHeaders.length === 0 : legacyAllHeadersHidden,
        'logo-bar-enabled': isLogoBarEnabled,
      })}
      data-element={props.dataElement}
    >
      <div className="flx-Panel-container" style={style}>
        {!isInDesktopOnlyMode && isMobile && (
          <div className="close-container">
            <div
              className="close-icon-container"
              onClick={() => {
                dispatch(actions.closeElements([props.dataElement]));
              }}
            >
              <Icon glyph="ic_close_black_24px" className="close-icon" />
            </div>
          </div>
        )}
        {props.children}
      </div>
    </div>
  );
};

export default Panel;
