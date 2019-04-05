import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import GroupOverlay from 'components/GroupOverlay';
import { withTooltip } from 'components/Tooltip';

import core from 'core';
import getToolStyles from 'helpers/getToolStyles';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import Portal from 'src/Portal';

class GroupButton extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    activeToolName: PropTypes.string.isRequired,
    toolGroup: PropTypes.string.isRequired,
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
    isActive: PropTypes.bool.isRequired,
    iconColor: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor'])
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
    const { setActiveToolGroup, isActive, closeElement, toggleElement, openElement, toolGroup } = this.props;
    const { toolName } = this.state;

    e.stopPropagation();
    setActiveToolGroup(toolGroup);
    closeElement('toolStylePopup');

    if (isActive) {
      toggleElement('groupOverlay');
    } else {
      this.setToolMode(toolName);
      openElement('groupOverlay');
    }
  }

  setToolMode = toolName => {
    const { toolGroup } = this.props;

    // This is based on the current design where click on misc tools shouldn't have any tool selected
    if (toolGroup === 'miscTools') {
      core.setToolMode(defaultTool);
    } else {
      core.setToolMode(toolName);
    }
  }

  render() {
    const { mediaQueryClassName, isDisabled, dataElement, isActive, toolNames, iconColor, children, activeToolGroup, toolGroup, activeToolStyles} = this.props;
    const isOnlyTools = children.filter(button => button.type !== 'toolButton').length === 0;
    const allButtonsInGroupDisabled = toolNames.every(toolName => core.getTool(toolName) ? core.getTool(toolName).disabled : '');
    if (isDisabled || allButtonsInGroupDisabled) {
      if (isOnlyTools){
        return null;
      }
    }
    if (!img && !isOnlyTools) {
      console.warn('GroupButton contains buttons other than toolButtons and no img is found. Please specify an img');
    }
    const { toolName } = this.state;
    const activeIcon = children.find(button => button.toolName === toolName) ? children.find(button => button.toolName === toolName).img: '';
    const img = this.props.img ? this.props.img : isOnlyTools ? activeIcon : ''
    let color;
    if (isActive && !this.props.img && iconColor) {
      let toolStyles = activeToolStyles;
      color = toolStyles[iconColor].toHexString();
    } 

    // If it's a misc tool group button or customized tool group button we don't want to have the down arrow
    const showDownArrow = this.props.img === undefined;
    const className = [
      'GroupButton',
      showDownArrow ? 'down-arrow' : '',
    ].join(' ').trim();

    return (
      <React.Fragment>
        <Button className={className} mediaQueryClassName={mediaQueryClassName} isActive={isActive} onClick={this.onClick} dataElement={dataElement} img={img} color={color} />
        {toolGroup === activeToolGroup && 
          <Portal>
            <GroupOverlay nestedChildren={children} dataElement={dataElement} toolGroup={toolGroup}/>
          </Portal>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isDisabled: selectors.isToolGroupButtonDisabled(state, ownProps.dataElement, ownProps.toolNames),
  isActive: selectors.getActiveToolGroup(state) === ownProps.toolGroup,
  activeToolName: selectors.getActiveToolName(state),
  activeToolStyles: selectors.getActiveToolStyles(state),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  iconColor: selectors.getIconColor(state, selectors.getActiveToolName(state)),
  activeToolGroup: selectors.getActiveToolGroup(state)
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
  closeElement: actions.closeElement,
  setActiveToolGroup: actions.setActiveToolGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(withTooltip()(GroupButton));