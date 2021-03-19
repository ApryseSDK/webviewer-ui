import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import getToolStyles from 'helpers/getToolStyles';
import defaultTool from 'constants/defaultTool';
import { mapToolNameToKey, getDataWithKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

class ToolGroupButton extends React.PureComponent {
  static propTypes = {
    activeToolName: PropTypes.string.isRequired,
    toolGroup: PropTypes.string.isRequired,
    mediaQueryClassName: PropTypes.string.isRequired,
    dataElement: PropTypes.string.isRequired,
    img: PropTypes.string,
    title: PropTypes.string,
    toolNames: PropTypes.arrayOf(PropTypes.string),
    toolButtonObjects: PropTypes.object,
    allButtonsInGroupDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    toggleElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    showColor: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      toolName: props.toolNames[0],
    };
  }

  componentDidUpdate(prevProps) {
    const activeToolNameChanged = prevProps.activeToolName !== this.props.activeToolName;
    const wasActiveToolNameInGroup = prevProps.toolNames.includes(prevProps.activeToolName);
    const isActiveToolNameInGroup = this.props.toolNames.includes(this.props.activeToolName);
    const toolNamesLengthChanged = prevProps.toolNames.length !== this.props.toolNames.length;

    if (activeToolNameChanged && isActiveToolNameInGroup) {
      this.setState({ toolName: this.props.activeToolName });
    }

    if (toolNamesLengthChanged && !this.props.toolNames.includes(this.state.toolName)) {
      this.setState({ toolName: this.props.toolNames[0] });
    }

    if (toolNamesLengthChanged && !wasActiveToolNameInGroup && isActiveToolNameInGroup) {
      this.setState({ toolName: this.props.activeToolName });
      this.props.setActiveToolGroup(this.props.toolGroup);
    }
  }

  onClick = () => {
    const {
      setActiveToolGroup,
      isActive,
      closeElement,
      toggleElement,
      openElement,
      toolGroup,
    } = this.props;
    const { toolName } = this.state;

    setActiveToolGroup(toolGroup);
    closeElement('toolStylePopup');

    if (isActive) {
      toggleElement('toolsOverlay');
    } else {
      this.setToolMode(toolName);
      openElement('toolsOverlay');
    }
  };

  setToolMode = toolName => {
    const { toolGroup } = this.props;

    // This is based on the current design where click on misc tools shouldn't have any tool selected
    if (toolGroup === 'miscTools') {
      core.setToolMode(defaultTool);
    } else {
      core.setToolMode(toolName);
    }
  };

  getColor = () => {
    const { isActive, showColor } = this.props;
    const { toolName } = this.state;
    const { iconColor } = getDataWithKey(mapToolNameToKey(toolName));

    let color = '';
    if (showColor === 'always' || (showColor === 'active' && isActive)) {
      const toolStyles = getToolStyles(toolName);
      color = toolStyles?.[iconColor]?.toHexString?.();
    }

    return color;
  };

  render() {
    const {
      mediaQueryClassName,
      dataElement,
      toolButtonObjects,
      isActive,
      allButtonsInGroupDisabled,
      title,
    } = this.props;
    const { toolName } = this.state;

    return allButtonsInGroupDisabled ? null : (
      <Button
        title={title}
        className={classNames({
          ToolGroupButton: true,
          // if it's a misc tool group button or customized tool group button with a predefined image, then we don't want to have the down arrow
          'down-arrow': !this.props.img,
        })}
        mediaQueryClassName={mediaQueryClassName}
        isActive={isActive}
        onClick={this.onClick}
        dataElement={dataElement}
        img={this.props.img || toolButtonObjects[toolName]?.img}
        color={this.getColor()}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isActive: selectors.getActiveToolGroup(state) === ownProps.toolGroup,
  activeToolName: selectors.getActiveToolName(state),
  toolNames: selectors.getToolNamesByGroup(state, ownProps.toolGroup),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  allButtonsInGroupDisabled: selectors.allButtonsInGroupDisabled(state, ownProps.toolGroup),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
  closeElement: actions.closeElement,
  setActiveToolGroup: actions.setActiveToolGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolGroupButton);
