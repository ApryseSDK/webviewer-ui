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
    if (this.props.activeToolName === 'AnnotationCreateRubberStamp') {
      this.setState({ isStylingOpen: true });
    }

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
      this.setState({ isStylingOpen: false });
    }

    if (this.itemsContainer.current) {
      this.setState({ siblingWidth: this.itemsContainer.current.offsetWidth });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setOverlayPosition();
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
    const { setActiveToolGroup, closeElements } = this.props;

    core.setToolMode(defaultTool);
    setActiveToolGroup('');
    closeElements(['toolsOverlay']);
  };

  handleStyleClick = toolName => {
    // debugger;
    if (toolName === this.props.activeToolName) {
      this.setState({ isStylingOpen: !this.state.isStylingOpen, toolNameThatOpenedStyling: null });
    } else if (toolName === this.state.toolNameThatOpenedStyling) {
      this.setState({ isStylingOpen: false, toolNameThatOpenedStyling: null });
      // } else if () {
    } else {
      this.setState({
        isStylingOpen: true,
        // isStylingOpen: !this.state.isStylingOpen,
        toolNameThatOpenedStyling: toolName,
      });
    }
    // this.setState({ isStylingOpen: !this.state.isStylingOpen });
  };

  render() {
    const { left, right, top, isStylingOpen } = this.state;

    const {
      isDisabled,
      isOpen,
      toolButtonObjects,
      activeToolGroup,
      isMobile,
      isTabletAndMobile,
    } = this.props;

    if (isDisabled || !activeToolGroup) {
      return null;
    }

    const toolNames = Object.keys(toolButtonObjects).filter(
      toolName => toolButtonObjects[toolName].group === activeToolGroup,
    );
    const className = getClassName('Overlay ToolsOverlay', { isOpen });

    let style = { left, right, top };
    let arrowStyle = {};
    if (isTabletAndMobile) {
      style = {
        left: 0,
        top: 52,
      };

      const { activeToolGroup, activeHeaderItems } = this.props;
      const element = activeHeaderItems.find(
        item => item.toolGroup === activeToolGroup,
      );
      const button = document.querySelector(`[data-element=${element.dataElement}]`);
      const { left: buttonLeft } = button.getBoundingClientRect();
      arrowStyle = {
        left: buttonLeft,
        right: 'auto',
        top: -10,
      };
    }

    return (
      <div
        className={className}
        ref={this.overlay}
        style={style}
        data-element="toolsOverlay"
      >
        <div
          className="arrow-up"
          style={arrowStyle}
        />
        <div ref={this.toolsContainer} className="tools-container">
          <div className="tool-buttons-container" ref={this.itemsContainer}>
            {toolNames.map((toolName, i) => (
              <ToolButton
                key={`${toolName}-${i}`}
                toolName={toolName}
                handleStyleClick={this.handleStyleClick}
                isStylingOpen={isStylingOpen}
              />
            ))}
          </div>
          {isStylingOpen && (
            <React.Fragment>
              <ToolStylePopup />
            </React.Fragment>
          )}
        </div>
        {!isTabletAndMobile && <div className="Close-Container">
          <div className="Close-Button" onClick={this.handleCloseClick}>
            <Icon className="Close-Icon" glyph="icon-close" />
          </div>
        </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'toolsOverlay'),
  isOpen: selectors.isElementOpen(state, 'toolsOverlay'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
  activeToolGroup: selectors.getActiveToolGroup(state),
  activeToolName: selectors.getActiveToolName(state),
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
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
