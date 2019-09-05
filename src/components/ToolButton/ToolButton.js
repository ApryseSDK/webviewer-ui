import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import getToolStyles from 'helpers/getToolStyles';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './ToolButton.scss';

const propTypes = {
  toolName: PropTypes.string.isRequired,
  group: PropTypes.string,
};

const ToolButton = ({ toolName, ...restProps }) => {
  const [
    isActive,
    iconColor,
    { group = '', showColor, ...restObjectData },
  ] = useSelector(
    state => [
      selectors.getActiveToolName(state) === toolName,
      selectors.getIconColor(state, mapToolNameToKey(toolName)),
      selectors.getToolButtonObject(state, toolName),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    if (isActive) {
      if (toolStylesExist(toolName)) {
        dispatch(actions.toggleElement('toolStylePopup'));
      }
    } else {
      core.setToolMode(toolName);
      dispatch(actions.setActiveToolGroup(group));
      dispatch(actions.closeElement('toolStylePopup'));
    }
  };

  const toolStyles = getToolStyles(toolName);
  let color = '';

  if (showColor === 'always' || (showColor === 'active' && isActive)) {
    color = toolStyles[iconColor]?.toHexString?.();
  }

  // TODO: remove this
  return core.getTool(toolName)?.disabled ? null : (
    <Button
      className={classNames({
        ToolButton: true,
        hasStyles: toolStylesExist(toolName),
      })}
      onClick={handleClick}
      isActive={isActive}
      color={color}
      {...restProps}
      {...restObjectData}
    />
  );
};

ToolButton.propTypes = propTypes;

export default ToolButton;
