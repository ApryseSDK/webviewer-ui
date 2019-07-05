import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolButton from 'components/ToolButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';
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
      this.props.closeElements([ 'viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'toolStylePopup', 'signatureOverlay', 'zoomOverlay', 'redactionOverlay' ]);
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
    const { dataElement } = this.props;
    if (dataElement) {
      this.setState(getOverlayPositionBasedOn(dataElement, this.overlay));
    }
  }

  handleCloseClick = () => {
    const { setActiveToolGroup, closeElements } = this.props;

    core.setToolMode(defaultTool);
    setActiveToolGroup('');
    closeElements([ 'toolStylePopup', 'groupOverlay' ]);
  }

  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen, activeToolGroup, nestedChildren } = this.props;

    if (isDisabled || !activeToolGroup) {
      return null;
    }
    const className = getClassName('Overlay GroupOverlay', { isOpen });
    return (
      <div className={className} ref={this.overlay} style={{ left, right }} data-element="groupOverlay" onMouseDown={e => e.stopPropagation()}>
        {nestedChildren.map((element, i) => {
          switch (element.type) {
            case 'toolButton':
              return <ToolButton key={`${element.toolName}-${i}`} toolName={element.toolName} toolGroup={this.props.toolGroup} {...element} />;
            case 'toggleElementButton':
              return <ToggleElementButton key={i} {...element} />;
            case 'actionButton':
              return <ActionButton key={i} {...element} />;
            case 'statefulButton':
              return <StatefulButton key={i} {...element} />;
            case 'customElement':
              return <CustomElement key={i} {...element} />;
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
  activeHeaderItems: selectors.getActiveHeaderItems(state),
  activeToolGroup: selectors.getActiveToolGroup(state)
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setActiveToolGroup: actions.setActiveToolGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupOverlay);