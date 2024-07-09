import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PresetButton from 'components/ToolButton/PresetButton';
import ToolStylePopup from 'components/ToolStylePopup';
import SelectedSignatureRow from 'components/SignatureStylePopup/SelectedSignatureRow';
import SelectedRubberStamp from 'components/RubberStampOverlay/SelectedRubberStamp';
import SelectedStamp from 'components/SelectedStamp/SelectedStamp';
import Icon from 'components/Icon';
import { withTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import DataElements from 'constants/dataElement';
import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import actions from 'actions';
import { isDesktopSize, isMobileSize, isTabletAndMobileSize } from 'helpers/getDeviceSize';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import classNames from 'classnames';

import './ToolsOverlay.scss';

class ToolsOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    toolButtonObjects: PropTypes.object,
    activeHeaderItems: PropTypes.arrayOf(PropTypes.object),
    activeToolGroup: PropTypes.string,
    closeElements: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
    isInDesktopOnlyMode: PropTypes.bool,
    showPresets: PropTypes.bool,
    customizableUI: PropTypes.bool,
  };

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
      top: 'auto',
      isStylingOpen: false,
      siblingWidth: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);

    // this component can be opened before mounting to the DOM if users call the setToolMode API
    // in this case we need to set its position immediately after it's mounted
    // otherwise its left is 0 instead of left-aligned with the tool group button
    if (this.props.isOpen) {
      this.setOverlayPosition();
    }
  }

  componentDidUpdate(prevProps) {
    const clickedOnAnotherToolGroupButton =
      prevProps.activeToolGroup !== this.props.activeToolGroup;

    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        DataElements.VIEW_CONTROLS_OVERLAY,
        DataElements.MENU_OVERLAY,
        DataElements.TOOL_STYLE_POPUP,
        DataElements.SIGNATURE_OVERLAY,
        DataElements.ZOOM_OVERLAY,
        DataElements.REDACTION_OVERLAY,
      ]);
      this.setOverlayPosition();
    }

    if (clickedOnAnotherToolGroupButton) {
      this.setOverlayPosition();
    }

    if (this.props.activeToolGroup === '') {
      this.props.closeElements(['toolStylePopup']);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setOverlayPosition();
    this.forceUpdate();
  };

  setOverlayPosition = () => {
    const { activeToolGroup, activeHeaderItems } = this.props;
    const element = activeHeaderItems.find(
      (item) => item.toolGroup === activeToolGroup,
    );

    if (element) {
      this.setState(
        getOverlayPositionBasedOn(element.dataElement, this.overlay),
      );
    }
  };

  handleCloseClick = () => {
    const { closeElements } = this.props;
    closeElements([DataElements.TOOLS_OVERLAY]);
  };

  render() {
    const {
      t,
      tReady,
      isDisabled,
      isOpen,
      toolNames,
      activeToolGroup,
      isToolStyleOpen,
      isMobile,
      isInDesktopOnlyMode,
      showPresets,
      customizableUI,
    } = this.props;

    const isSmallComponent = window.isApryseWebViewerWebComponent ? isMobileSize() : isMobile;

    const isVisible = (isOpen || true) && !isDisabled;
    if (!isVisible) {
      return null;
    }

    const toolsWithNoStylingPresets = [
      'stampTools',
      'cropTools',
      'fileAttachmentTools',
      'radioButtonFieldTools',
      'checkBoxFieldTools',
      'contentEditTools',
      'addParagraphTools',
      'calibrationTools',
      'addImageContentTools'
    ];
    const noPresets = !activeToolGroup || toolsWithNoStylingPresets.includes(activeToolGroup);
    let Component = (
      <div
        className="tool-buttons-container"
      >
        {toolNames.map((toolName, i) => (
          <PresetButton
            key={`${toolName}-${i}`}
            toolName={toolName}
            isToolStyleOpen={isToolStyleOpen}
          />
        ))}
      </div>
    );

    if (activeToolGroup === 'signatureTools') {
      Component = (
        <SelectedSignatureRow />
      );
    } else if (activeToolGroup === 'rubberStampTools') {
      Component = (
        <SelectedRubberStamp />
      );
    } else if (activeToolGroup === 'model3DTools') {
      Component = (
        <div className="model-3D-btn add-btn" onClick={() => this.props.openElement('Model3DModal')}>
          {t('Model3D.add3D')}
        </div>
      );
    } else if (noPresets || !showPresets) {
      Component = (
        <div className="no-presets">
          {tReady ? t('message.toolsOverlayNoPresets') : ''}
        </div>
      );
    } else if (['crossStampTools', 'checkStampTools', 'dotStampTools'].includes(activeToolGroup)) {
      Component = (
        <SelectedStamp tReady={tReady} toolName={toolNames[0]} />
      );
    }

    if ((noPresets && (isSmallComponent && !isInDesktopOnlyMode)) || customizableUI) {
      return null;
    }

    return (
      <Swipeable
        onSwipedUp={() => this.props.closeElements(['toolStylePopup'])}
        onSwipedDown={() => this.props.closeElements(['toolStylePopup'])}
        preventDefaultTouchmoveEvent
        className={classNames({
          ToolsOverlayContainer: true
        })}
      >
        <div
          className={classNames({
            Overlay: true,
            ToolsOverlay: true,
            open: isOpen,
            shadow: isToolStyleOpen || (isMobile && !isInDesktopOnlyMode)
          })}
          ref={this.overlay}
          data-element={DataElements.TOOLS_OVERLAY}
        >
          <div
            className={classNames({
              'tools-container': true,
              'is-styling-open': isToolStyleOpen
            })}
          >
            {Component}
            {(isSmallComponent && !isInDesktopOnlyMode) &&
              <button
                className="close-icon-container"
                onClick={() => {
                  this.props.closeElements([DataElements.TOOLS_OVERLAY]);
                  core.setToolMode(defaultTool);
                  this.props.setActiveToolGroup('');
                }}
              >
                <Icon
                  glyph="ic_close_black_24px"
                  className="close-icon"
                />
              </button>}
          </div>
          {isToolStyleOpen &&
            <ToolStylePopup />}
        </div>
      </Swipeable>
    );
  }
}

const mapStateToProps = (state) => ({
  isDisabled: selectors.isElementDisabled(state, DataElements.TOOLS_OVERLAY),
  isOpen: selectors.isElementOpen(state, DataElements.TOOLS_OVERLAY),
  isToolStyleOpen: selectors.isElementOpen(state, 'toolStylePopup'),
  toolNames: selectors.getActiveToolNamesForActiveToolGroup(state),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
  activeToolGroup: selectors.getActiveToolGroup(state),
  activeToolName: selectors.getActiveToolName(state),
  isInDesktopOnlyMode: selectors.isInDesktopOnlyMode(state),
  showPresets: selectors.shouldShowPresets(state),
  customizableUI: state.featureFlags.customizableUI,
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
  openElement: actions.openElement,
  closeElements: actions.closeElements,
  setActiveToolGroup: actions.setActiveToolGroup,
};

const ConnectedToolsOverlay = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ToolsOverlay));

const connectedComponent = (props) => {
  const isMobile = isMobileSize();

  const isTabletAndMobile = isTabletAndMobileSize();

  const isDesktop = isDesktopSize();

  return (
    <ConnectedToolsOverlay {...props} isMobile={isMobile} isTabletAndMobile={isTabletAndMobile} isDesktop={isDesktop} />
  );
};

export default connectedComponent;
