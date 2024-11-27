import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import core from 'core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';
import { mapToolNameToKey } from 'constants/map';
import defaultTool from 'constants/defaultTool';
import getToolStyles from 'helpers/getToolStyles';
import getColor from 'helpers/getColor';
import { shortcutAria } from 'helpers/hotkeysManager';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';
import DataElements from 'constants/dataElement';
import FlyoutItemContainer from '../FlyoutItemContainer';
import '../../Button/Button.scss';
import './ToolButton.scss';

const { ToolNames } = window.Core.Tools;

const ToolButton = forwardRef((props, ref) => {
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
    groupedItem,
    allFlyoutItems = [],
  } = props;

  // use this so that state gets updated when active tool styles change
  // eslint-disable-next-line no-unused-vars
  const activeToolStyles = useSelector((state) => selectors.getActiveToolStyles(state), shallowEqual);
  const activeToolName = useSelector(selectors.getActiveToolName);
  const iconColorKey = useSelector((state) => selectors.getIconColor(state, mapToolNameToKey(toolName)));
  const toolButtonObject = useSelector((state) => selectors.getToolButtonObject(state, toolName), shallowEqual);
  const activeGroupedItems = useSelector(selectors.getActiveGroupedItems, shallowEqual);
  const lastPickedToolAndGroup = useSelector(selectors.getLastPickedToolAndGroup, shallowEqual);
  const isSignatureListPanelOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.SIGNATURE_LIST_PANEL));
  const isRubberStampPanelOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.RUBBER_STAMP_PANEL));
  const customOverrides = useSelector(
    (state) => selectors.getCustomElementOverrides(state, selectors.getToolButtonDataElement(state, toolName)),
    shallowEqual
  );
  const lastPickedToolForGroupedItems = useSelector(
    (state) => selectors.getLastPickedToolForGroupedItems(state, groupedItem),
    shallowEqual
  );

  const dispatch = useDispatch();

  const isToolInActiveGroupedItems = groupedItem && activeGroupedItems.includes(groupedItem);
  const [isButtonActive, setIsButtonActive] = useState(activeToolName === toolName && (isToolInActiveGroupedItems || !groupedItem));

  const isToolWithPanelAssociatedActive = (toolName, activeTool) => {
    const isDefaultToolActive = activeTool === defaultTool;
    const isActiveToolSameOfToolName = activeTool === toolName;
    if (isDefaultToolActive || isActiveToolSameOfToolName) {
      if (toolName === ToolNames.SIGNATURE) {
        return isSignatureListPanelOpen;
      }
      if (toolName === ToolNames.RUBBER_STAMP) {
        return isRubberStampPanelOpen;
      }
    }
    return false;
  };

  const checkIfNeedsToOpenAPanel = (toolName) => {
    if (toolName === ToolNames.SIGNATURE) {
      dispatch(actions.openElement(DataElements.SIGNATURE_LIST_PANEL));
    } else if (toolName === ToolNames.RUBBER_STAMP) {
      dispatch(actions.openElement(DataElements.RUBBER_STAMP_PANEL));
    }
  };

  useEffect(() => {
    const handleToolModeChange = (tool) => {
      // prevent edit tool from deactivating when text is hovered
      const isEditToolAndItIsActive = toolName === ToolNames.EDIT && lastPickedToolAndGroup.tool === ToolNames.EDIT;
      const isSignatureToolActive = isToolWithPanelAssociatedActive(toolName, tool.name);
      const isRubberStampToolActive = isToolWithPanelAssociatedActive(toolName, tool.name);
      const shouldActivateButton = tool.name === toolName || (isEditToolAndItIsActive && tool.name === ToolNames.TEXT_SELECT) || isSignatureToolActive || isRubberStampToolActive;

      if (shouldActivateButton) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }
    };

    core.addEventListener('toolModeUpdated', handleToolModeChange);
    return () => {
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, [isSignatureListPanelOpen, isRubberStampPanelOpen]);

  useEffect(() => {
    const isLastPickedTool = lastPickedToolAndGroup?.tool === toolName;
    const noActiveGroupedItems = !activeGroupedItems?.length;
    const toolDoesNotBelongToAGroupAndIsActive = !groupedItem && toolName === activeToolName;
    const toolBelongsToAGroupAndIsActive = groupedItem && lastPickedToolAndGroup?.group?.includes(groupedItem) && isLastPickedTool;
    const isDefaultToolActive = activeToolName === defaultTool && toolName === defaultTool;

    if ((toolName === ToolNames.EDIT && noActiveGroupedItems) ||
      toolDoesNotBelongToAGroupAndIsActive ||
      toolBelongsToAGroupAndIsActive ||
      isDefaultToolActive
    ) {
      setIsButtonActive(true);
      const isUpdatingCursorIfTextSelect = lastPickedToolAndGroup?.tool === ToolNames.TEXT_SELECT && activeToolName === ToolNames.EDIT;
      if (isLastPickedTool && toolName !== activeToolName && !isUpdatingCursorIfTextSelect) {
        core.setToolMode(toolName);
        checkIfNeedsToOpenAPanel(toolName);
      }
    } else {
      setIsButtonActive(false);
    }
  }, [activeGroupedItems, lastPickedToolForGroupedItems, lastPickedToolAndGroup]);

  const handleClick = () => {
    if (groupedItem) {
      // The tool can be in a grouped item and not be related to a ribbon, so we keep both
      // grouped items active to not close the ribbon items
      const combinedGroupedItems = new Set([...activeGroupedItems, groupedItem]);
      const groupedItemsArray = Array.from(combinedGroupedItems);
      dispatch(actions.setActiveGroupedItems(groupedItemsArray));
    }

    if (isButtonActive) {
      setIsButtonActive(false);

      if (toolName === ToolNames.SIGNATURE) {
        dispatch(actions.closeElement(DataElements.SIGNATURE_LIST_PANEL));
      } else if (toolName === ToolNames.RUBBER_STAMP) {
        dispatch(actions.closeElement(DataElements.RUBBER_STAMP_PANEL));
      }

      core.setToolMode(defaultTool);
    } else {
      checkIfNeedsToOpenAPanel(toolName);
      core.setToolMode(toolName);
    }
  };

  const icon = img || toolButtonObject?.img;
  const toolTipTitle = title || toolButtonObject?.title;
  let color = '';
  let fillColor = '';
  let strokeColor = '';
  const showColor = customOverrides?.showColor || toolButtonObject?.showColor;
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
    const displayTitle = label || toolTipTitle;
    const icon = getIconDOMElement({ ...toolButtonObject }, allFlyoutItems);
    const isActive = activeToolName === toolName;

    return (
      <FlyoutItemContainer {...props}
        ref={ref}
        onClick={handleClick}
        label={displayTitle}
        ariaKeyshortcuts={ariaKeyshortcuts}
        icon={icon}
        additionalClass={isActive ? 'active' : ''}
      />
    );
  }

  return (
    <Button
      className={classNames({
        'ToolButton': true,
        'Button': true,
        [className]: className,
        'confirm-button': preset === 'confirm',
        'cancel-button': preset === 'cancel',
        'button-with-label': label,
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
      ariaCurrent={isButtonActive}
    />
  );
});

ToolButton.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  img: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  groupedItem: PropTypes.string,
  allFlyoutItems: PropTypes.array,
};
ToolButton.displayName = 'ToolButton';

export default ToolButton;