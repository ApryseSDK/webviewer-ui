import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import { withTooltip } from 'components/Tooltip';

import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import getToolStyles from 'helpers/getToolStyles';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './ToolButton.scss';

class ToolButton extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isActive: PropTypes.bool.isRequired,
    activeToolStyles: PropTypes.object.isRequired,
    toolName: PropTypes.string.isRequired,
    group: PropTypes.string,
    showColor: PropTypes.string.isRequired,
    toggleElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    iconColor: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor'])
  }

  onClick = e => {
    const { isActive, toolName, group = '', setActiveToolGroup, closeElement, toggleElement } = this.props;

    e.stopPropagation();
   
    if (isActive) {
      if (toolStylesExist(toolName)) {
        toggleElement('toolStylePopup');
      }
    } else {
      core.setToolMode(toolName);
      setActiveToolGroup(group);
      closeElement('toolStylePopup');
    }
  }

  getToolButtonColor = () => {
    const { showColor, activeToolStyles, isActive, toolName, iconColor } = this.props;

    let toolStyles;
    if (showColor === 'always') {
      toolStyles = getToolStyles(toolName);
    } else if (showColor === 'active' && isActive) {
      toolStyles = activeToolStyles;
    }

    let color = '';
    if (toolStyles && iconColor) {
      color = toolStyles[iconColor].toHexString();
    }

    return color;
  }

  render() {
    const { isDisabled, toolName } = this.props;
    const color = this.getToolButtonColor();
    const className = [
      'ToolButton',
      toolStylesExist(toolName) ? 'hasStyles' : ''
    ].join(' ').trim();

    if (isDisabled) {
      return null;
    }

    return (
      <Button {...this.props} className={className} color={color} onClick={this.onClick} />
    );
  }
}

const mapStateToProps = (state, { toolName }) => ({
  isDisabled: selectors.isToolButtonDisabled(state, toolName),
  isActive: selectors.getActiveToolName(state) === toolName,
  activeToolStyles: selectors.getActiveToolStyles(state),
  iconColor: selectors.getIconColor(state, mapToolNameToKey(toolName)),
  ...selectors.getToolButtonObject(state, toolName)
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
  closeElement: actions.closeElement,
  setActiveToolGroup: actions.setActiveToolGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(withTooltip()(ToolButton));