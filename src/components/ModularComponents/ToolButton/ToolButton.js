import React, { useEffect, useState } from 'react';
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
import DataElements from 'src/constants/dataElement';

const { ToolNames } = window.Core.Tools;

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
    groupedItem
  } = props;

  const [
    activeToolName,
    iconColorKey,
    toolButtonObject,
    customOverrides,
    // use this so that state gets updated when active tool styles change
    activeToolStyles, // eslint-disable-line no-unused-vars
    activeGroupedItems,
    lastPickedToolForGroupedItems,
    isSignatureListPanelOpen,
    isRubberStampPanelOpen,
  ] = useSelector(
    (state) => [
      selectors.getActiveToolName(state),
      selectors.getIconColor(state, mapToolNameToKey(toolName)),
      selectors.getToolButtonObject(state, toolName),
      selectors.getCustomElementOverrides(state, selectors.getToolButtonDataElement(state, toolName)),
      selectors.getActiveToolStyles(state),
      selectors.getActiveGroupedItems(state),
      selectors.getLastPickedToolForGroupedItems(state, groupedItem),
      selectors.isElementOpen(state, DataElements.SIGNATURE_LIST_PANEL),
      selectors.isElementOpen(state, DataElements.RUBBER_STAMP_PANEL),
    ],
    shallowEqual,
  );

  const isActive = (toolName === ToolNames.SIGNATURE && isSignatureListPanelOpen) ||
    (toolName === ToolNames.RUBBER_STAMP && isRubberStampPanelOpen) ||
    activeToolName === toolName;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isToolInActiveGroupedItems, setIsToolInActiveGroupedItems] = useState(activeGroupedItems.includes(groupedItem));
  const [isButtonActive, setIsButtonActive] = useState(isActive && isToolInActiveGroupedItems);

  useEffect(() => {
    if (toolName === lastPickedToolForGroupedItems && activeGroupedItems.includes(groupedItem)) {
      core.setToolMode(toolName);
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, []);

  useEffect(() => {
    if (toolName === lastPickedToolForGroupedItems && activeGroupedItems.includes(groupedItem)) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }

    setIsToolInActiveGroupedItems(activeGroupedItems.includes(groupedItem));
  }, [activeGroupedItems, lastPickedToolForGroupedItems]);

  const handleClick = () => {
    if (toolName !== ToolNames.EDIT) {
      dispatch(actions.setActiveGroupedItems([groupedItem]));

      if (isButtonActive) {
        dispatch(actions.setLastPickedToolForGroupedItems(groupedItem, ''));
        setIsButtonActive(false);

        if (toolName === ToolNames.SIGNATURE) {
          dispatch(actions.closeElement(DataElements.SIGNATURE_LIST_PANEL));
        } else if (toolName === ToolNames.RUBBER_STAMP) {
          dispatch(actions.closeElement(DataElements.RUBBER_STAMP_PANEL));
        }

        core.setToolMode(defaultTool);
      } else {
        if (toolName === ToolNames.SIGNATURE) {
          dispatch(actions.openElement(DataElements.SIGNATURE_LIST_PANEL));
        } else if (toolName === ToolNames.RUBBER_STAMP) {
          dispatch(actions.openElement(DataElements.RUBBER_STAMP_PANEL));
        }
        dispatch(actions.setLastPickedToolForGroupedItems(groupedItem, toolName));
        core.setToolMode(toolName === ToolNames.SIGNATURE || toolName === ToolNames.RUBBER_STAMP ? defaultTool : toolName);
      }
    } else {
      if (isActive) {
        setIsButtonActive(false);
      } else {
        activeGroupedItems.forEach((group) => {
          dispatch(actions.setLastPickedToolForGroupedItems(group, ''));
        });
        setIsButtonActive(true);
        core.setToolMode(defaultTool);
      }
    }
  };

  const icon = img || toolButtonObject.img;
  const toolTipTitle = title || toolButtonObject.title;
  let color = '';
  let fillColor = '';
  let strokeColor = '';
  const showColor = customOverrides?.showColor || toolButtonObject.showColor;
  if (showColor === 'always' || (showColor === 'active' && isButtonActive)) {
    const toolStyles = getToolStyles(toolName);
    color = toolStyles?.[iconColorKey]?.toHexString?.();
    fillColor = getColor(toolStyles?.FillColor);
    strokeColor = getColor(toolStyles?.StrokeColor);
    if (toolName.indexOf(ToolNames.FREETEXT) > -1 && toolStyles?.StrokeThickness === 0) {
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
          <Icon glyph={icon} className="menu-icon" />
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
      isActive={isButtonActive}
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
  groupedItem: PropTypes.string,
};

export default ToolButton;
