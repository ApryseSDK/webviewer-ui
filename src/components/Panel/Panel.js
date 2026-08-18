import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import Icon from 'components/Icon';
import actions from 'actions';
import './Panel.scss';
import { panelMinWidth, RESIZE_BAR_WIDTH } from 'constants/panel';
import ResizeBar from 'components/ResizeBar';
import { isIE } from 'helpers/device';
import MobilePanelWrapper from '../ModularComponents/MobilePanelWrapper';
import PropTypes from 'prop-types';
import { isElementOnLeftSide, isElementOnRightSide } from 'src/helpers/rightToLeft';
import useIsRTL from 'hooks/useIsRTL';
import { css } from '@emotion/react';
import ErrorBoundaryComponent from 'components/ErrorBoundaryComponent';
import COMPONENT_TYPES from 'constants/componentTypes';

const DesktopPanel = ({ children }) => {
  const { dataElement, isCustom, location } = children.props;
  const isMobile = isMobileSize();

  const currentWidth = useSelector((state) => selectors.getPanelWidth(state, dataElement));
  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const isOpen = useSelector((state) => selectors.isElementOpen(state, dataElement));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const isLogoBarEnabled = useSelector((state) => !selectors.isElementDisabled(state, 'logoBar'));
  const activeTopHeaders = useSelector(selectors.getActiveTopHeaders);
  const activeBottomHeaders = useSelector(selectors.getActiveBottomHeaders);
  const isMultiTabActive = useSelector(selectors.getIsMultiTab);
  const isSpreadsheetEditorMode = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const dispatch = useDispatch();
  const isRightToLeft = useIsRTL();

  const containerCss = useMemo(() => {
    if (currentWidth && (isInDesktopOnlyMode || !isMobile)) {
      const widthStyle = isCustom ? currentWidth - RESIZE_BAR_WIDTH : currentWidth;
      return css({ width: `${widthStyle}px`, minWidth: `${widthStyle}px` });
    }
    return css({ minWidth: `${panelMinWidth}px` });
  }, [currentWidth, isInDesktopOnlyMode, isMobile, isCustom, panelMinWidth]);

  const isVisible = !(!isOpen || isDisabled);
  const isPanelOnLeftSide = isElementOnLeftSide(location);
  const isPanelOnRightSide = isElementOnRightSide(location);
  const shouldUseMobilePanel = isMobile && !isInDesktopOnlyMode;

  const onResize = (_width) => {
    let maxAllowedWidth = window.innerWidth;
    // there will be a scroll bar in IE, so we don't allow 100% page width
    if (isIE) {
      maxAllowedWidth -= 30;
    }
    const newPanelWidth = Math.min(_width, maxAllowedWidth);
    dispatch(actions.setPanelWidth(dataElement, newPanelWidth));
  };

  const onDragOver = (e) => {
    // Enable drop operations for child elements, e.g. ThumbnailPanel
    e.preventDefault();
  };

  const isModularToolsHeaderOpen =
    activeTopHeaders.length === 2 ||
    (activeTopHeaders.length === 1 && activeBottomHeaders.length === 1) ||
    activeBottomHeaders.length === 2;

  return (
    <div
      className={classNames({
        'ModularPanel': true,
        'closed': !isVisible,
        'left': isPanelOnLeftSide,
        'right': isPanelOnRightSide,
        'tools-header-open': isModularToolsHeaderOpen,
        'tools-header-and-header-hidden': activeTopHeaders.length === 0 && activeBottomHeaders.length === 0,
        'logo-bar-enabled': isLogoBarEnabled,
        'modular-ui-panel': true,
        'multi-tab-active': isMultiTabActive,
        'right-to-left': isRightToLeft,
        'spreadsheet-editor': isSpreadsheetEditorMode,
      })}
      tabIndex="-1"
      data-element={dataElement}
      onDragOver={onDragOver}
    >
      {isCustom && isPanelOnRightSide && !isInDesktopOnlyMode && !isMobile &&
        <ResizeBar minWidth={panelMinWidth} dataElement={`${dataElement}ResizeBar`} onResize={onResize}
          leftDirection={true} />}
      <div className={`ModularPanel-container ${dataElement}`} css={containerCss}>
        {shouldUseMobilePanel && (
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
        <ErrorBoundaryComponent
          dataElement={dataElement}
          componentType={COMPONENT_TYPES.PANEL}
        >
          {children}
        </ErrorBoundaryComponent>
      </div>
      {isCustom && isPanelOnLeftSide && !isInDesktopOnlyMode && !isMobile &&
        <ResizeBar minWidth={panelMinWidth} dataElement={`${dataElement}ResizeBar`} onResize={onResize} />}
    </div>
  );
};

DesktopPanel.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      dataElement: PropTypes.string.isRequired,
      isCustom: PropTypes.bool,
      location: PropTypes.string,
    }),
  }),
};

const Panel = (props) => {
  const { isCustom, dataElement, location } = props;
  const isMobile = isMobileSize();

  const [isOpen] = useSelector((state) => [selectors.isElementOpen(state, dataElement)]);
  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const shouldUseMobilePanel = isMobile && !isInDesktopOnlyMode;
  const dispatch = useDispatch();

  const children = React.cloneElement(props.children, {
    dataElement: dataElement,
    isCustom: isCustom,
    location: location,
  });

  if (isOpen) {
    if (shouldUseMobilePanel) {
      dispatch(actions.openElement('MobilePanelWrapper'));
      return (
        <MobilePanelWrapper>
          {props.children}
        </MobilePanelWrapper>
      );
    }
    return (
      <DesktopPanel>
        {children}
      </DesktopPanel>
    );
  }
  return null;
};

Panel.propTypes = {
  children: PropTypes.node,
  isCustom: PropTypes.bool,
  dataElement: PropTypes.string,
  location: PropTypes.string,
};

export default Panel;
