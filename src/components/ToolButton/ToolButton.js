import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import getToolStyles from 'helpers/getToolStyles';
import hotkeysManager from 'helpers/hotkeysManager';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './ToolButton.scss';

import DataElements from 'constants/dataElement';

const propTypes = {
  toolName: PropTypes.string.isRequired,
  group: PropTypes.string,
};

const ToolButton = ({ toolName, ...restProps }) => {
  const [
    isActive,
    iconColor,
    // use this to trigger rerender so the color will be right
    // TODO: fix the issue properly. Can listen to toolUpdated
    // eslint-disable-next-line
    activeToolStyles,
    toolButtonObject,
    customOverrides,
    isStylePopupDisabled
  ] = useSelector(
    state => [
      selectors.getActiveToolName(state) === toolName,
      selectors.getIconColor(state, mapToolNameToKey(toolName)),
      selectors.getActiveToolStyles(state),
      selectors.getToolButtonObject(state, toolName),
      selectors.getCustomElementOverrides(state, selectors.getToolButtonDataElement(state, toolName)),
      selectors.isElementDisabled(state, DataElements.STYLE_POPUP),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const { group = '', ...restObjectData } = toolButtonObject;

  useEffect(() => {
    if (typeof customOverrides?.disable === 'undefined') {
      return;
    }

    if (customOverrides.disable) {
      hotkeysManager.off(toolName);
    } else {
      hotkeysManager.on(toolName);
    }
  }, [customOverrides, toolName]);

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

  let color = '';
  const showColor = customOverrides?.showColor || toolButtonObject.showColor;
  if (showColor === 'always' || (showColor === 'active' && isActive)) {
    const toolStyles = getToolStyles(toolName);
    color = toolStyles?.[iconColor]?.toHexString?.();
  }

  return (
    <Button
      className={classNames({
        ToolButton: true,
        hasStyles: !isStylePopupDisabled && toolStylesExist(toolName),
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