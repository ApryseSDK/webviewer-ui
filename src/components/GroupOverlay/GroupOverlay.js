import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolButton from 'components/ToolButton';
import ActionButton from 'components/ActionButton';
import Button from 'components/Button';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './GroupOverlay.scss';

class GroupOverlay extends React.PureComponent {
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
    closeElements(['toolStylePopup', 'groupOverlay']);
  }

  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen, activeToolGroup, activeHeaderItems } = this.props;

    if (isDisabled || !activeToolGroup) {
      return null;
    }

    const className = getClassName('Overlay GroupOverlay', { isOpen });
    let buttonGroup = (Object.keys(activeHeaderItems).find(key => activeHeaderItems[key].toolGroup === activeToolGroup));
    const children = activeHeaderItems[buttonGroup].children;
    return (
      <div className={className} ref={this.overlay} style={{ left, right }} data-element="groupOverlay" onMouseDown={e => e.stopPropagation()}>
        {children.map((element, i) => {
          if (element.type === 'toolButton'){
            return <ToolButton key={`${element.toolName}-${i}`} toolName={element.toolName} />
          } else {
            return <ActionButton { ...element }/>
          }
        }
        )}
        <div className="spacer hide-in-desktop"></div>
        <Button className="close hide-in-desktop" dataElement="groupOverlayCloseButton" img="ic_check_black_24px" onClick={this.handleCloseClick} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'groupOverlay'),
  isOpen: selectors.isElementOpen(state, 'groupOverlay'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  activeHeaderItems: selectors.getActiveHeaderItems(state),
  activeToolGroup: selectors.getActiveToolGroup(state)
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setActiveToolGroup: actions.setActiveToolGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupOverlay);