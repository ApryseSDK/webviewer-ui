import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import getToolStyles from 'helpers/getToolStyles';
import hotkeysManager from 'helpers/hotkeysManager';
import getColor from 'helpers/getColor';
import { mapToolNameToKey } from 'constants/map';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './ToolButton.scss';

const propTypes = {
  toolName: PropTypes.string.isRequired,
  group: PropTypes.string,
  className: PropTypes.string,
};

const ToolButton = ({
  toolName,
  className,
  ...restProps
}) => {
  const [
    isActive,
    iconColorKey,
    toolButtonObject,
    customOverrides,
  ] = useSelector(
    (state) => [
      selectors.getActiveToolName(state) === toolName,
      selectors.getIconColor(state, mapToolNameToKey(toolName)),
      selectors.getToolButtonObject(state, toolName),
      selectors.getCustomElementOverrides(state, selectors.getToolButtonDataElement(state, toolName)),
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
      if (toolName !== 'AnnotationCreateStamp' && toolName !== 'AnnotationCreateRedaction' && toolName !== 'AnnotationEraserTool') {
        if (toolStylesExist(toolName)) {
          dispatch(actions.toggleElement('toolStylePopup'));
          if (toolName === 'AnnotationCreateRubberStamp') {
            core.setToolMode(defaultTool);
          }
        }
      }
    } else {
      if (group === 'miscTools') {
        dispatch(actions.closeElement('toolStylePopup'));
      }

      core.setToolMode(toolName);
      dispatch(actions.setActiveToolGroup(group));
      dispatch(actions.setLastPickedToolForGroup(group, toolName));
      if (toolName === 'AnnotationCreateRubberStamp') {
        dispatch(actions.openElement('toolStylePopup'));
      }
    }
  };

  let color = '';
  let fillColor = '';
  let strokeColor = '';
  const showColor = customOverrides?.showColor || toolButtonObject.showColor;
  if (showColor === 'always' || (showColor === 'active' && isActive)) {
    const toolStyles = getToolStyles(toolName);
    color = toolStyles?.[iconColorKey]?.toHexString?.();
    fillColor = getColor(toolStyles?.FillColor);
    strokeColor = getColor(toolStyles?.StrokeColor);
    if (toolName.indexOf('AnnotationCreateFreeText') > -1 && toolStyles?.StrokeThickness === 0) {
      // transparent
      strokeColor = 'ff000000';
    }
  }

  return (
    <Button
      className={classNames({
        'tool-button': true,
        hasStyles: toolStylesExist(toolName),
        [className]: className,
      })}
      onClick={handleClick}
      isActive={isActive}
      color={color}
      fillColor={fillColor}
      strokeColor={strokeColor}
      {...restProps}
      {...restObjectData}
    />
  );
};

ToolButton.propTypes = propTypes;

export default ToolButton;
