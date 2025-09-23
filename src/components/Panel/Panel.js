import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import Icon from 'components/Icon';
import actions from 'actions';
import './Panel.scss';
import { panelMinWidth, panelNames, RESIZE_BAR_WIDTH } from 'constants/panel';
import ResizeBar from 'components/ResizeBar';
import { isIE } from 'helpers/device';
import MobilePanelWrapper from '../ModularComponents/MobilePanelWrapper';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { isElementOnLeftSide, isElementOnRightSide } from 'src/helpers/rightToLeft';

const DesktopPanel = ({ children }) => {
  const { dataElement, isCustom, location } = children.props;
  const isMobile = isMobileSize();

  const currentWidth = useSelector((state) => selectors.getPanelWidth(state, dataElement));
  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const isOpen = useSelector((state) => selectors.isElementOpen(state, dataElement));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const currentToolbarGroup = useSelector(selectors.getCurrentToolbarGroup);
  const isHeaderOpen = useSelector((state) => selectors.isElementOpen(state, 'header'));
  const isToolsHeaderOpen = useSelector((state) => selectors.isElementOpen(state, 'toolsHeader'));
  const isLogoBarEnabled = useSelector((state) => !selectors.isElementDisabled(state, 'logoBar'));
  const featureFlags = useSelector(selectors.getFeatureFlags);
  const activeTopHeaders = useSelector(selectors.getActiveTopHeaders);
  const activeBottomHeaders = useSelector(selectors.getActiveBottomHeaders);
  const isMultiTabActive = useSelector(selectors.getIsMultiTab);
  const dispatch = useDispatch();

  const appDirection = i18next.dir();
  const isRightToLeft = appDirection === 'rtl';

  let style = {};
  if (currentWidth && (isInDesktopOnlyMode || !isMobile)) {
    const widthStyle = isCustom ? currentWidth - RESIZE_BAR_WIDTH : currentWidth;
    style = { width: `${widthStyle}px`, minWidth: `${widthStyle}px` };
  } else {
    style = { minWidth: `${panelMinWidth}px` };
  }

  const isVisible = !(!isOpen || isDisabled);
  const isPanelOnLeftSide = isElementOnLeftSide(location);
  const isPanelOnRightSide = isElementOnRightSide(location);

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
        'tools-header-open': customizableUI ? isModularToolsHeaderOpen : legacyToolsHeaderOpen,
        'tools-header-and-header-hidden': customizableUI ? activeTopHeaders.length === 0 && activeBottomHeaders.length === 0 : legacyAllHeadersHidden,
        'logo-bar-enabled': isLogoBarEnabled,
        'modular-ui-panel': customizableUI,
        'multi-tab-active': isMultiTabActive,
        'right-to-left': isRightToLeft,
      })}
      data-element={dataElement}
      onDragOver={onDragOver}
    >
      {isCustom && isPanelOnRightSide && !isInDesktopOnlyMode && !isMobile &&
        <ResizeBar minWidth={panelMinWidth} dataElement={`${dataElement}ResizeBar`} onResize={onResize}
          leftDirection={true} />}
      <div className={`ModularPanel-container ${dataElement}`} style={style}>
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
  const dispatch = useDispatch();

  const children = React.cloneElement(props.children, {
    dataElement: dataElement,
    isCustom: isCustom,
    location: location,
  });

  const panelsWithMobileVersion = [
    panelNames.SIGNATURE_LIST,
    panelNames.RUBBER_STAMP,
    panelNames.STYLE,
    panelNames.NOTES,
    panelNames.SEARCH,
    panelNames.TEXT_EDITING,
    panelNames.TABS,
    panelNames.REDACTION,
    panelNames.FORM_FIELD,
    panelNames.INDEX,
  ];

  if (isOpen) {
    if (isMobile && panelsWithMobileVersion.includes(dataElement)) {
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
