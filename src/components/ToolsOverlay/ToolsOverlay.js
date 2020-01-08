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

  handleStyleClick = () => {
    this.setState({ isStylingOpen: !this.state.isStylingOpen });
  }

  render() {
    const { left, right, top, isStylingOpen } = this.state;

    const {
      isDisabled,
      isOpen,
      toolButtonObjects,
      activeToolGroup,
    } = this.props;

    if (isDisabled || !activeToolGroup) {
      return null;
    }

    const toolNames = Object.keys(toolButtonObjects).filter(
      toolName => toolButtonObjects[toolName].group === activeToolGroup,
    );
    const className = getClassName('Overlay ToolsOverlay', { isOpen });

    return (
      <div
        className={className}
        ref={this.overlay}
        style={{ left, right, top }}
        data-element="toolsOverlay"
      >
        <div
          ref={this.toolsContainer}
          className="ToolsContainer"
        >
          <div>
            <div
              className="Items-Container"
              ref={this.itemsContainer}
            >
              {toolNames.map((toolName, i) => (
                <ToolButton key={`${toolName}-${i}`} toolName={toolName} />
              ))}
              <div className="divider" />
              <div
                className="Button ToolButton StyleButton"
                onClick={this.handleStyleClick}
              >
                <Icon
                  glyph="icon - tools - more - vertical"
                />
              </div>
            </div>
          </div>
          {isStylingOpen &&
            <React.Fragment>
              <div className="divider-horizontal" />
              <ToolStylePopup siblingWidth={this.state.siblingWidth} />
            </React.Fragment>
          }
        </div>
        <div
          className="Close-Container"
        >
          <div
            className="Close-Button"
            onClick={this.handleCloseClick}
          >
            <Icon
              className="Close-Icon"
              glyph="icon-close"
            />
          </div>
        </div>
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
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
  closeElements: actions.closeElements,
  setActiveToolGroup: actions.setActiveToolGroup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToolsOverlay);
