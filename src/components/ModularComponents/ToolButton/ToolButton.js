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
import getToolStyles from 'helpers/getToolStyles';
import getColor from 'helpers/getColor';
import core from 'core';
import defaultTool from 'constants/defaultTool';
import { shortcutAria } from 'helpers/hotkeysManager';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';

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
    isFlyoutItem = false,
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
  const { t } = useTranslation();

  const handleClick = () => {
    if (isActive) {
      dispatch(actions.setLastPickedToolForCustomRibbon(''));
      core.setToolMode(defaultTool);
    } else {
      dispatch(actions.setLastPickedToolForCustomRibbon(toolName));
      core.setToolMode(toolName);
      if (toolName === 'AnnotationCreateRubberStamp') {
        dispatch(actions.openElement('toolStylePopup'));
      }
    }
  };

  const icon = img || toolButtonObject.img;
  const toolTipTitle = title || toolButtonObject.title;
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

  if (isFlyoutItem) {
    const shortcutKey = toolTipTitle ? toolTipTitle.slice(toolTipTitle.indexOf('.') + 1) : undefined;
    const ariaKeyshortcuts = shortcutKey ? shortcutAria(shortcutKey) : undefined;
    const displayTitle = label ? t(label) : toolTipTitle ? t(toolTipTitle) : undefined;
    return (
      <div className="menu-container" onClick={handleClick}>
        <div className="icon-label-wrapper">
          <Icon glyph={icon} className="menu-icon"/>
          {displayTitle && <div className="flyout-item-label">{displayTitle}</div>}
        </div>
        {ariaKeyshortcuts && <span className="hotkey-wrapper">{`(${ariaKeyshortcuts})`}</span>}
      </div>
    );
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
      img={icon}
      label={label}
      title={toolTipTitle}
      dataElement={dataElement}
      onClick={handleClick}
      disabled={disabled}
      forceTooltipPosition={forceTooltipPosition}
      isActive={isActive}
      color={color}
      fillColor={fillColor}
      strokeColor={strokeColor}
    />
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
