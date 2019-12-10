import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
// import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import Button from 'components/Button';
import ToolButton from 'components/ToolButton';
import getClassName from 'helpers/getClassName';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';




// const StampToolButton = () => {
class StampToolButton extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    this.overlay = React.createRef();
    this.state = {
      toolName: props.toolNames[0],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    const activeToolNameChanged =
      prevProps.activeToolName !== this.props.activeToolName;
    const wasAcitveToolNameInGroup =
      prevProps.toolNames.indexOf(prevProps.activeToolName) > -1;
    const isAcitveToolNameInGroup =
      this.props.toolNames.indexOf(this.props.activeToolName) > -1;
    const toolNamesLengthChanged =
      prevProps.toolNames.length !== this.props.toolNames.length;

    if (activeToolNameChanged && isAcitveToolNameInGroup) {
      this.setState({ toolName: this.props.activeToolName });
    }

    if (
      toolNamesLengthChanged &&
      !this.props.toolNames.includes(this.state.toolName)
    ) {
      this.setState({ toolName: this.props.toolNames[0] });
    }
    if (
      toolNamesLengthChanged &&
      !wasAcitveToolNameInGroup &&
      isAcitveToolNameInGroup
    ) {
      this.setState({ toolName: this.props.activeToolName });
      this.props.setActiveToolGroup(this.props.toolGroup);
    }
  }

  handleClick() {
    const { toggleElement, isActive, openElement } = this.props;
    const { toolName } = this.state;

    if (isActive) {
      toggleElement('stampOverlay');
    } else {
      core.setToolMode(toolName);
      openElement('stampOverlay');
    }
  }


  render() {
    const {
      toolButtonObjects,
      isOpen,
      isActive,
    } = this.props;
    const { toolName } = this.state;

    const img = this.props.img
      ? this.props.img
      : toolButtonObjects[toolName].img;


    const buttonClass = classNames({
      'down-arrow': true,
    });
    // const className = getClassName('Overlay RedactionOverlay', this.props);
    return (
      <div>
        {/* <ToolButton toolName="AnnotationCreateStamp" /> */}
        <Button
          className={buttonClass}
          dataElement="stampToolButton"
          isActive={isActive}
          img={img}
          onClick={this.handleClick}
        />
        {/* <div
          className={className}
          ref={this.overlay}
          style={{}}
          data-element="redactionOverlay"
        >
          <ToolButton toolName="AnnotationCreateStamp" />
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isActive: selectors.getActiveToolGroup(state) === ownProps.toolGroup,
  isOpen: selectors.isElementOpen(state, 'stampOverlay'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  activeToolName: selectors.getActiveToolName(state),
  toolNames: selectors.getToolNamesByGroup(state, ownProps.toolGroup),
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
  openElement: actions.openElement,
  setActiveToolGroup: actions.setActiveToolGroup,

};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StampToolButton);

// export default StampToolButton;
