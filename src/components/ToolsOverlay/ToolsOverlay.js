import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolButton from 'components/ToolButton';
import Button from 'components/Button';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import defaultTool from 'constants/defaultTool';
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
    setActiveToolGroup: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto'
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
    const clickedOnAnotherToolGroupButton = prevProps.activeToolGroup !== this.props.activeToolGroup;

    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'toolStylePopup', 'signatureOverlay', 'zoomOverlay', 'redactionOverlay']);
      this.setOverlayPosition();
    }

    if (clickedOnAnotherToolGroupButton) {
      this.setOverlayPosition();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setOverlayPosition();
  }

  setOverlayPosition = () => {
    const { activeToolGroup, activeHeaderItems } = this.props;
    const element = activeHeaderItems.find(item => item.toolGroup === activeToolGroup);
    
    if (element) {
      this.setState(getOverlayPositionBasedOn(element.dataElement, this.overlay));
    }
  }

  handleCloseClick = () => {
    const { setActiveToolGroup, closeElements } = this.props;

    core.setToolMode(defaultTool);
    setActiveToolGroup('');
    closeElements(['toolStylePopup', 'toolsOverlay']);
  }

  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen, toolButtonObjects, activeToolGroup } = this.props;

    if (isDisabled || !activeToolGroup) {
      return null;
    }

    const toolNames = Object.keys(toolButtonObjects).filter(toolName => toolButtonObjects[toolName].group === activeToolGroup);
    const className = getClassName('Overlay ToolsOverlay', { isOpen });

    return (
      <div className={className} ref={this.overlay} style={{ left, right }} data-element="toolsOverlay" onMouseDown={e => e.stopPropagation()}>
        {toolNames.map((toolName, i) => <ToolButton key={`${toolName}-${i}`} toolName={toolName} />)}
        <div className="spacer hide-in-desktop"></div>
        <Button className="close hide-in-desktop" dataElement="toolsOverlayCloseButton" img="ic_check_black_24px" onClick={this.handleCloseClick} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'toolsOverlay'),
  isOpen: selectors.isElementOpen(state, 'toolsOverlay'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  activeHeaderItems: selectors.getActiveHeaderItems(state),
  activeToolGroup: selectors.getActiveToolGroup(state)
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setActiveToolGroup: actions.setActiveToolGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsOverlay);