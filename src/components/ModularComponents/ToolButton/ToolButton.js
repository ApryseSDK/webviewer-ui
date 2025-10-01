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
import { ITEM_RENDER_PREFIXES, PLACEMENT } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import getToolStyles from 'helpers/getToolStyles';
import getColor from 'helpers/getColor';
import { shortcutAria } from 'helpers/hotkeysManager';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';
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
    style
  } = props;

  // use this so that state gets updated when active tool styles change
  // eslint-disable-next-line no-unused-vars
  const activeToolStyles = useSelector(selectors.getActiveToolStyles);
  const activeToolName = useSelector(selectors.getActiveToolName);
  const iconColorKey = useSelector((state) => selectors.getIconColor(state, mapToolNameToKey(toolName)));
  const toolButtonObject = useSelector((state) => selectors.getToolButtonObject(state, toolName), shallowEqual);
  const activeGroupedItems = useSelector(selectors.getActiveGroupedItems, shallowEqual);
  const isSignatureListPanelOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.SIGNATURE_LIST_PANEL));
  const isRubberStampPanelOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.RUBBER_STAMP_PANEL));
  const customOverrides = useSelector(
    (state) => selectors.getCustomElementOverrides(state, selectors.getToolButtonDataElement(state, toolName)),
    shallowEqual
  );
  const rubberStampPanelInFlyout = useSelector((state) => selectors.getIsPanelInFlyout(state, ITEM_RENDER_PREFIXES.RUBBER_STAMP_PANEL), shallowEqual);
  const signatureListPanelInFlyout = useSelector((state) => selectors.getIsPanelInFlyout(state, ITEM_RENDER_PREFIXES.SIGNATURE_LIST_PANEL), shallowEqual);
  const isSignatureListFlyoutOpen = useSelector((state) => selectors.isElementOpen(state, signatureListPanelInFlyout?.dataElement));
  const isRubberStampPanelInFlyoutOpen = useSelector((state) => selectors.isElementOpen(state, rubberStampPanelInFlyout?.dataElement));

  const dispatch = useDispatch();

  const [isButtonActive, setIsButtonActive] = useState(activeToolName === toolName);

  const isToolAssociatedWithPanel = [ToolNames.SIGNATURE, ToolNames.RUBBER_STAMP].includes(toolName);

  const isPanelAssociatedWithToolOpen = () => {
    const isDefaultToolActive = toolName === defaultTool;

    if (isToolAssociatedWithPanel) {
      if (isDefaultToolActive || toolName === ToolNames.SIGNATURE) {
        return signatureListPanelInFlyout ? isSignatureListFlyoutOpen : isSignatureListPanelOpen;
      }
      if (isDefaultToolActive || toolName === ToolNames.RUBBER_STAMP) {
        return rubberStampPanelInFlyout ? isRubberStampPanelInFlyoutOpen : isRubberStampPanelOpen;
      }
    }
    return false;
  };


  const handleToolModeChange = (activeTool) => {
    const isActiveTool = activeTool === toolName;
    const shouldActivateButton = (isActiveTool && !isToolAssociatedWithPanel) || (isToolAssociatedWithPanel && isPanelAssociatedWithToolOpen());

    if (shouldActivateButton) {
      setIsButtonActive(true);
      handlePanels(activeTool, 'open');
    } else {
      setIsButtonActive(false);
    }
  };

  useEffect(() => {
    handleToolModeChange(activeToolName);
  }, [activeToolName, isSignatureListPanelOpen, isRubberStampPanelOpen, isSignatureListFlyoutOpen, isRubberStampPanelInFlyoutOpen]);

  const handlePanels = (toolName, action) => {
    let panelToHandle;
    let isPanelInFlyout = false;

    if (toolName === ToolNames.SIGNATURE) {
      if (signatureListPanelInFlyout) {
        panelToHandle = signatureListPanelInFlyout.dataElement;
        isPanelInFlyout = true;
      } else {
        panelToHandle = DataElements.SIGNATURE_LIST_PANEL;
      }
    } else if (toolName === ToolNames.RUBBER_STAMP) {
      if (rubberStampPanelInFlyout) {
        panelToHandle = rubberStampPanelInFlyout.dataElement;
        isPanelInFlyout = true;
      } else {
        panelToHandle = DataElements.RUBBER_STAMP_PANEL;
      }
    }

    if (!panelToHandle) {
      return;
    }

    if (action === 'open') {
      if (isPanelInFlyout) {
        dispatch(actions.openFlyout(panelToHandle, dataElement));
        return;
      }
      dispatch(actions.openElement(panelToHandle));
    } else if (action === 'close') {
      dispatch(actions.closeElement(panelToHandle));
    }
  };

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
      handlePanels(toolName, 'close');
      core.setToolMode(defaultTool);
    } else {
      handlePanels(toolName, 'open');
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

  if ([PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(headerPlacement)) {
    forceTooltipPosition = headerPlacement === PLACEMENT.LEFT ? PLACEMENT.RIGHT : PLACEMENT.LEFT;
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
      ariaPressed={isButtonActive}
      style={style}
    />
  );
});

ToolButton.propTypes = {
  toolName: PropTypes.string.isRequired,
  dataElement: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  preset: PropTypes.string,
  headerPlacement: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  img: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  groupedItem: PropTypes.string,
  allFlyoutItems: PropTypes.array,
  style: PropTypes.object,
};

ToolButton.displayName = 'ToolButton';

export default ToolButton;