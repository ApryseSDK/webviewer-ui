import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolButton from 'components/ToolButton';
import ToolStylePopup from 'components/ToolStylePopup';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import defaultTool from 'constants/defaultTool';
import Icon from 'components/Icon';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import classNames from 'classnames';

import { motion, AnimatePresence } from "framer-motion";

import toolStylesExist from "helpers/toolStylesExist";

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
    // this.setArrowStyle();
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
    // this.setArrowStyle();
    // if (this.props.activeToolName === 'AnnotationCreateRubberStamp') {
    //   this.props.openElement('toolStylePopup');
    //   // this.setState({ isStylingOpen: true });
    // }

    const clickedOnAnotherToolGroupButton =
      prevProps.activeToolGroup !== this.props.activeToolGroup;

    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
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
      // this.setState({ isStylingOpen: false });
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

  // setArrowStyle = () => {
  //   const { activeToolGroup, activeHeaderItems, isTabletAndMobile } = this.props;
  //   if (isTabletAndMobile) {
  //     const element = activeHeaderItems.find(
  //       item => item.toolGroup === activeToolGroup,
  //     );

  //     if (!element) {
  //       return null;
  //     }
  //     const button = document.querySelector(`[data-element=${element.dataElement}]`);
  //     const { left: buttonLeft } = button.getBoundingClientRect();
  //     const arrowStyle = {
  //       left: buttonLeft,
  //       right: 'auto',
  //       top: -10,
  //     };

  //     this.setState({ arrowStyle });
  //   }
  // }

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
    const { setActiveToolGroup, closeElements, activeToolGroup } = this.props;
    // core.setToolMode(defaultTool);
    // setActiveToolGroup('');
    closeElements(['toolsOverlay']);
  };

  render() {
    const { left, right, top, isStylingOpen } = this.state;

    const {
      isDisabled,
      isOpen,
      toolNames,
      activeToolGroup,
      isMobile,
      isTabletAndMobile,
      closeElements,
      isToolStyleOpen,
      activeToolName,
    } = this.props;

    // const toolNames = Object.keys(toolButtonObjects).filter(
    //   toolName => toolButtonObjects[toolName].group === activeToolGroup,
    // );
    const className = getClassName('Overlay ToolsOverlay', { isOpen });

    // let style = { left, right, top };
    let style = {};
    let arrowStyle = {};

    if (isTabletAndMobile) {
      style = {
        // left: 0,
        // top: 52,
      };

      const { activeToolGroup, activeHeaderItems } = this.props;
      const element = activeHeaderItems.find(
        item => item.toolGroup === activeToolGroup,
      );

      if (!element) {
        return null;
      }
      const button = document.querySelector(`[data-element=${element.dataElement}]`);
      const { left: buttonLeft } = button.getBoundingClientRect();
      arrowStyle = {
        left: buttonLeft,
        right: 'auto',
        top: -10,
      };
    }

    const isVisible = !(!isOpen || isDisabled || !activeToolGroup);

    let list = {
      visible: {
        width: "214px",
        opacity: 1,
      },
      hidden: {
        width: "0px",
        opacity: 0.5,
      },
    };

    let itemVisible = {
      'marginLeft': "8px",
      'marginRight': "8px",
    };

    if (activeToolGroup === 'miscTools') {
      const margin = Math.floor((214 - (toolNames.length * 26)) / (2 * toolNames.length));
      itemVisible = {
        'marginLeft': `${margin}px`,
        'marginRight': `${margin}px`,
      };
    } else if (activeToolGroup === 'measurementTools') {
      itemVisible = {
        'marginLeft': "15px",
        'marginRight': "15px",
      };
    }

    let item = {
      visible: itemVisible,
      hidden: {
        'marginLeft': "8px",
        'marginRight': "8px",
      },
    };

    if (isTabletAndMobile) {
      list = {
        visible: {
          width: "100%",
        },
        hidden: false,
      };

      item = {
        visible: {
          'marginLeft': "8px",
          'marginRight': "8px",
        },
        hidden: false,
      };
    }

    let motionStyle = {};
    if (!isToolStyleOpen && !isTabletAndMobile) {
      motionStyle = { 'overflow': 'hidden' };
    }

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="toolsOverlayAnim"
            style={motionStyle}
            initial={isTabletAndMobile ? false : "hidden"}
            animate="visible"
            exit="hidden"
            variants={list}
            transition={{ duration: 0.3 }}
          >
            <div
              className={classNames({
                [className]: true,
                shadow: !isTabletAndMobile && isToolStyleOpen,
              })}
              ref={this.overlay}
              style={style}
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
                <div className="tool-buttons-container" ref={this.itemsContainer}>
                  {toolNames.map((toolName, i) => (
                    <motion.div
                      key={`${toolName}-${i}`}
                      initial={false}
                      animate="visible"
                      exit="hidden"
                      variants={item}
                      transition={{ duration: 0.3 }}
                    >
                      <ToolButton
                        toolName={toolName}
                      />
                    </motion.div>
                  ))}
                  {activeToolGroup !== 'miscTools' &&
                    <div
                      className={classNames({
                        "styling-arrow-container": true,
                        active: isToolStyleOpen,
                      })}
                      data-element="styling-button"
                      onClick={() => this.props.toggleElement('toolStylePopup')}
                    >
                      <Icon glyph="icon-menu-style-line" />
                      {isToolStyleOpen ?
                        <Icon className="styling-arrow-up" glyph="icon-chevron-up" /> :
                        <Icon className="styling-arrow-down" glyph="icon-chevron-down" />}
                    </div>}
                </div>
                {(isToolStyleOpen) && (
                  <Swipeable
                    onSwipedUp={() => this.props.closeElements(['toolStylePopup'])}
                    onSwipedDown={() => this.props.closeElements(['toolStylePopup'])}
                    preventDefaultTouchmoveEvent
                  >
                    <ToolStylePopup
                      handleCloseClick={() => this.props.closeElements(['toolStylePopup'])}
                    />
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
  // toolButtonObjects: selectors.getToolButtonObjects(state),
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

const ConnectedToolsOverlay = connect(mapStateToProps, mapDispatchToProps)(ToolsOverlay);

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

  return (
    <ConnectedToolsOverlay {...props} isMobile={isMobile} isTabletAndMobile={isTabletAndMobile} />
  );
};
