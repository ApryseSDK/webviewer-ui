import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';
import Icon from 'components/Icon';

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

const ToolButton = ({ toolName, handleStyleClick, ...restProps }) => {
  const [
    isActive,
    iconColor,
    // use this to trigger rerender so the color will be right
    // TODO: fix the issue properly. Can listen to toolUpdated
    // eslint-disable-next-line
    activeToolStyles,
    { group = '', showColor, ...restObjectData },
  ] = useSelector(
    state => [
      selectors.getActiveToolName(state) === toolName,
      selectors.getIconColor(state, mapToolNameToKey(toolName)),
      selectors.getActiveToolStyles(state),
      selectors.getToolButtonObject(state, toolName),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    core.setToolMode(toolName);
    dispatch(actions.setActiveToolGroup(group));
  };

  const toolStyles = getToolStyles(toolName);
  let color = '';

  if (showColor === 'always' || (showColor === 'active' && isActive)) {
    color = toolStyles[iconColor]?.toHexString?.();
  }

  return (
    <div className="tool-button-container">
      <Button
        className={classNames({
          'tool-button': true,
          hasStyles: toolStylesExist(toolName),
        })}
        onClick={handleClick}
        isActive={isActive}
        color={color}
        {...restProps}
        {...restObjectData}
      />
      {handleStyleClick &&
        <div
          className="styling-down-arrow-container"
          onClick={() => {
            handleClick();
            handleStyleClick(toolName);
          }}
        >
          <Icon
            className="styling-down-arrow"
            glyph="icon-chevron-down-bold"
          />
        </div>}
    </div>
  );
};

ToolButton.propTypes = propTypes;

export default ToolButton;
