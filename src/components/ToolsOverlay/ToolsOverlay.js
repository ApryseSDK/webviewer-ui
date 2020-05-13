import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolButton from 'components/ToolButton';
import ToolStylePopup from 'components/ToolStylePopup';
import ToolsDropdown from 'components/ToolsDropdown';
import SelectedSignatureRow from 'components/SignatureStylePopup/SelectedSignatureRow';
import { withTranslation } from 'react-i18next';

import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import defaultTool from 'constants/defaultTool';
import Icon from 'components/Icon';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import classNames from 'classnames';

import { motion, AnimatePresence } from "framer-motion";

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
    this.itemsContainer = React.createRef();
    this.toolsContainer = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);

    // this component can be opened before mounting to the DOM if users call the setToolMode API
    // in this case we need to set its position immediately after it's mounted
    // otherwise its left is 0 instead of left-aligned with the tool group button
    if (this.props.isOpen) {
      this.setOverlayPosition();
    }

    if (this.itemsContainer.current) {
      this.setState({ siblingWidth: this.itemsContainer.current.offsetWidth });
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

    if (this.itemsContainer.current) {
      this.setState({ siblingWidth: this.itemsContainer.current.offsetWidth });
    }
  }

  componentWillUnmount() {
    const { activeToolGroup } = this.props;
    if (activeToolGroup === 'miscTools') {
      core.setToolMode(defaultTool);
      this.props.setActiveToolGroup('');
    }
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
      isDisabled,
      isOpen,
      toolNames,
      activeToolGroup,
      isTabletAndMobile,
      isToolStyleOpen,
      swapableToolNames,
      isDesktop,
    } = this.props;

    let arrowStyle = {};
    if (isTabletAndMobile) {
      const { activeToolGroup, activeHeaderItems } = this.props;
      const element = activeHeaderItems.find(
        item => item.toolGroup === activeToolGroup,
      );

      if (element) {
        const button = document.querySelector(`[data-element=${element.dataElement}]`);
        const { left: buttonLeft } = button.getBoundingClientRect();
        arrowStyle = {
          left: buttonLeft,
          right: 'auto',
          top: -10,
        };
      }
    }

    // const isVisible = !(!isOpen || isDisabled || !activeToolGroup);
    const isVisible = (isOpen || isDesktop) && !isDisabled;

    let dropdownButton = (
      <div
        className={classNames({
          "styling-arrow-container": true,
          active: isToolStyleOpen,
          disabled: !activeToolGroup,
        })}
        data-element="styling-button"
        onClick={() => activeToolGroup && this.props.toggleElement('toolStylePopup')}
      >
        <Icon glyph="icon-menu-style-line" />
        {isToolStyleOpen ?
          <Icon className="styling-arrow-up" glyph="icon-chevron-up" /> :
          <Icon className="styling-arrow-down" glyph="icon-chevron-down" />}
      </div>
    );

    if (swapableToolNames.length > 0) {
      dropdownButton = (
        <ToolsDropdown
          onClick={() => this.props.toggleElement('toolStylePopup')}
          isActive={isToolStyleOpen}
          style={{ width: '40px' }}
        />
      );
    }

    let Component = (
      <React.Fragment>
        {toolNames.map((toolName, i) => (
          <ToolButton
            key={`${toolName}-${i}`}
            toolName={toolName}
          />
        ))}
        {activeToolGroup !== 'miscTools' && dropdownButton}
      </React.Fragment>
    );

    if (activeToolGroup === 'signatureTools') {
      Component = (
        <SelectedSignatureRow/>
      );
    } else if (!activeToolGroup) {
      Component = (
        <React.Fragment>
          <div className="no-presets-container">{t('message.toolsOverlayNoPresets')}</div>
          {dropdownButton}
        </React.Fragment>
      );
    }

    let containerAnimations = {
      visible: {},
      hidden: {},
    };

    if (isTabletAndMobile) {
      containerAnimations = {
        visible: {
          height: 'auto',
          overflow: 'hidden',
          transitionEnd: { overflow: 'initial' },
        },
        hidden: {
          height: '0px',
          overflow: 'hidden',
        },
      };
    }

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="ToolsOverlayContainer"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerAnimations}
            transition={{ ease: "easeOut", duration: 0.25 }}
          >
            <div
              className={classNames({
                Overlay: true,
                ToolsOverlay: true,
                open: isOpen,
                shadow: !isTabletAndMobile && isToolStyleOpen,
              })}
              ref={this.overlay}
              data-element="toolsOverlay"
            >
              <div
                className="arrow-up"
                style={arrowStyle}
              />
              <div
                ref={this.toolsContainer}
                className={classNames({
                  "tools-container": true,
                })}
              >
                <div
                  className="tool-buttons-container"
                  tool-group={activeToolGroup}
                  ref={this.itemsContainer}
                >
                  {Component}
                </div>
                {(isToolStyleOpen) && (
                  <Swipeable
                    onSwipedUp={() => this.props.closeElements(['toolStylePopup'])}
                    onSwipedDown={() => this.props.closeElements(['toolStylePopup'])}
                    preventDefaultTouchmoveEvent
                  >
                    <ToolStylePopup/>
                  </Swipeable>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  swapableToolNames: selectors.getSwapableToolNamesForActiveToolGroup(state),
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
