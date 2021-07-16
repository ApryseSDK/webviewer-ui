import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PresetButton from 'components/ToolButton/PresetButton';
import ToolStylePopup from 'components/ToolStylePopup';
import SelectedSignatureRow from 'components/SignatureStylePopup/SelectedSignatureRow';
import SelectedRubberStamp from 'components/RubberStampOverlay/SelectedRubberStamp';
import SelectedStamp from 'src/components/SelectedStamp/SelectedStamp';
import { withTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import Icon from 'components/Icon';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
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
        'viewControlsOverlay',
        'menuOverlay',
        'toolStylePopup',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
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
      item => item.toolGroup === activeToolGroup,
    );

    if (element) {
      this.setState(
        getOverlayPositionBasedOn(element.dataElement, this.overlay),
      );
    }
  };

  handleCloseClick = () => {
    const { closeElements } = this.props;
    closeElements(['toolsOverlay']);
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
      isDesktop,
      isMobile,
    } = this.props;

    const isVisible = (isOpen || true) && !isDisabled;
    if (!isVisible) {
      return null;
    }

    const toolsWithNoStylingPresets = [
      'stampTools',
      'cropTools',
      'redactionTools',
      'fileAttachmentTools',
      'radioButtonFieldTools',
      'checkBoxFieldTools'
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
        <SelectedSignatureRow t={t} />
      );
    } else if (activeToolGroup === 'rubberStampTools') {
      Component = (
        <SelectedRubberStamp />
      );
    } else if (activeToolGroup === 'model3DTools') {
      Component = (
        <div className="signature-row-content add-btn" onClick={() => this.props.openElement('Model3DModal')}>
          {t('Model3D.add3D')} 
        </div>
      );
    } else if (noPresets) {
      Component = (
        <div className="no-presets">
          {tReady ? t('message.toolsOverlayNoPresets') : ''}
        </div>
      );
    } else if (['crossStampTools', 'checkStampTools', 'dotStampTools'].includes(activeToolGroup)) {
      Component = (
        <SelectedStamp tReady={tReady} toolName={toolNames[0]}/>
      );
    }

    if (noPresets && isMobile) {
      return null;
    }

    return (
      <Swipeable
        onSwipedUp={() => this.props.closeElements(['toolStylePopup'])}
        onSwipedDown={() => this.props.closeElements(['toolStylePopup'])}
        preventDefaultTouchmoveEvent
        className="ToolsOverlayContainer"
      >
        <div 
          className={classNames({
            Overlay: true,
            ToolsOverlay: true,
            open: isOpen,
            shadow: isToolStyleOpen || isMobile,
          })}
          ref={this.overlay}
          data-element="toolsOverlay"
        >
          <div
            className={classNames({
              "tools-container": true,
              "is-styling-open": isToolStyleOpen,
            })}
          >
            {Component}
            {isMobile &&
              <button
                className="close-icon-container"
                onClick={() => {
                  this.props.closeElements(['toolsOverlay']);
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

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'toolsOverlay'),
  isOpen: selectors.isElementOpen(state, 'toolsOverlay'),
  isToolStyleOpen: selectors.isElementOpen(state, 'toolStylePopup'),
  toolNames: selectors.getActiveToolNamesForActiveToolGroup(state),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
  activeToolGroup: selectors.getActiveToolGroup(state),
  activeToolName: selectors.getActiveToolName(state),
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
  openElement: actions.openElement,
  closeElements: actions.closeElements,
  setActiveToolGroup: actions.setActiveToolGroup,
};

const ConnectedToolsOverlay = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ToolsOverlay));

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const isDesktop = useMedia(
    // Media queries
    ['(min-width: 901px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedToolsOverlay {...props} isMobile={isMobile} isTabletAndMobile={isTabletAndMobile} isDesktop={isDesktop} />
  );
};
