import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import getColorFromStyle from 'helpers/getColorFromStyle';
import getToolStyle from 'helpers/getToolStyle';
import actions from 'actions';
import selectors from 'selectors';

import './ToolGroupButton.scss';

class ToolGroupButton extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    activeToolName: PropTypes.string.isRequired,
    toolGroup:PropTypes.string.isRequired,
    mediaQueryClassName: PropTypes.string.isRequired,
    dataElement: PropTypes.string.isRequired,
    img: PropTypes.string,
    title: PropTypes.string,
    toolNames: PropTypes.arrayOf(PropTypes.string),
    toolButtonObjects: PropTypes.object,
    openElement: PropTypes.func.isRequired,
    toggleElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      toolName: props.toolNames[0]
    };
  }

  componentDidUpdate(prevProps) {
    const activeToolNameChanged = prevProps.activeToolName !== this.props.activeToolName;
    const wasAcitveToolNameInGroup = prevProps.toolNames.indexOf(prevProps.activeToolName) > -1; 
    const isAcitveToolNameInGroup = this.props.toolNames.indexOf(this.props.activeToolName) > -1; 
    const toolNamesLengthChanged = prevProps.toolNames.length !== this.props.toolNames.length;
    
    if (activeToolNameChanged && isAcitveToolNameInGroup) {      
      this.setState({ toolName: this.props.activeToolName });
    }
    
    if (toolNamesLengthChanged && !this.props.toolNames.includes(this.state.toolName)) {
      this.setState({ toolName: this.props.toolNames[0] });
    }
    if (toolNamesLengthChanged && !wasAcitveToolNameInGroup && isAcitveToolNameInGroup) {
      this.setState({ toolName: this.props.activeToolName });
      this.props.setActiveToolGroup(this.props.toolGroup);
    }
  }

  onClick = e => {
    const { setActiveToolGroup, isActive, closeElement, toggleElement, openElement, toolGroup} = this.props;
    const { toolName } = this.state;

    e.stopPropagation();

    setActiveToolGroup(toolGroup);
    closeElement('toolStylePopup');

    if (isActive) {
      toggleElement('toolsOverlay');
    } else {
      openElement('toolsOverlay');
      this.setToolMode(toolName);
    }
  }

  setToolMode = toolName => {
    const { toolGroup } = this.props;

    // This is based on the current design where click on misc tools shouldn't have any tool selected
    if (toolGroup === 'miscTools') {
      core.setToolMode('AnnotationEdit');
    } else {
      core.setToolMode(toolName);
    }
  }

  render() {
    const { mediaQueryClassName, isDisabled, dataElement, toolButtonObjects, title, isActive } = this.props;
    
    if (isDisabled) {
      return null;
    }
    
    const { toolName } = this.state;
    const img = this.props.img ? this.props.img : toolButtonObjects[toolName].img;
    const color = isActive && !this.props.img ? getColorFromStyle(getToolStyle(toolName)) : '';
    // If it's a misc tool group button or customized tool group button we don't want to have the down arrow
    const showDownArrow = this.props.img === undefined;
    const className = [
      'ToolGroupButton',
      showDownArrow ? 'down-arrow' : '',
    ].join(' ').trim();

    return <Button className={className} mediaQueryClassName={mediaQueryClassName} isActive={isActive} onClick={this.onClick} dataElement={dataElement} img={img} title={title} color={color} />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
  isActive: selectors.getActiveToolGroup(state) === ownProps.toolGroup,
  activeToolName: selectors.getActiveToolName(state),
  toolNames: selectors.getToolNamesByGroup(state, ownProps.toolGroup),
  toolButtonObjects: selectors.getToolButtonObjects(state),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
  closeElement: actions.closeElement,
  setActiveToolGroup: actions.setActiveToolGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolGroupButton);