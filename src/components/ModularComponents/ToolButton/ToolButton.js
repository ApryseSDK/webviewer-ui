import React from 'react';
import '../../Button/Button.scss';
import './ToolButton.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';
import { mapToolNameToKey } from 'constants/map';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import toolStylesExist from 'helpers/toolStylesExist';
import getToolStyles from 'helpers/getToolStyles';
import getColor from 'helpers/getColor';
import core from 'core';

const ToolButton = (props) => {
  const {
    title,
    dataElement,
    label,
    img,
    disabled,
    className,
    preset,
    headerPlacement,
    toolName,
  } = props;
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

  const handleClick = () => {
    if (isActive) {
      if (toolName !== 'AnnotationCreateStamp' && toolName !== 'AnnotationCreateRedaction' && toolName !== 'AnnotationEraserTool') {
        if (toolStylesExist(toolName)) {
          dispatch(actions.toggleElement('toolStylePopup'));
        }
      }
    } else {
      core.setToolMode(toolName);
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

  let forceTooltipPosition;

  if (['left', 'right'].includes(headerPlacement)) {
    forceTooltipPosition = headerPlacement === 'left' ? 'right' : 'left';
  }

  return (
    <Button
      className={classNames({
        'ToolButton': true,
        'Button': true,
        [className]: className,
        'confirm-button': preset === 'confirm',
        'cancel-button': preset === 'cancel'
      })}
      img={img}
      label={label}
      title={title}
      dataElement={dataElement}
      onClick={handleClick}
      disabled={disabled}
      forceTooltipPosition={forceTooltipPosition}
      isActive={isActive}
      color={color}
      fillColor={fillColor}
      strokeColor={strokeColor}
      {...props}
    ></Button>
  );
};

ToolButton.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  img: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ToolButton;
