import React from 'react';
import selectors from 'selectors';
import core from 'core';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import './ZoomText.scss';
import { FLYOUT_ITEM_TYPES, ITEM_TYPE, ITEM_RENDER_PREFIXES } from 'constants/customizationVariables';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { itemToFlyout, getIconDOMElement } from 'helpers/itemToFlyoutHelper';
import { LIST_OPTIONS, OFFICE_BULLET_OPTIONS, OFFICE_NUMBER_OPTIONS, EditingStreamType } from 'constants/officeEditor';
import {
  getListTypeFlyoutItems,
  getLineSpacingFlyoutItems,
  PAGE_SECTION_BREAK_OPTIONS,
  MARGIN_OPTIONS,
  COLUMN_OPTIONS,
} from 'helpers/officeEditor';
import RibbonItem from 'components/ModularComponents/RibbonItem';
import PresetButton from 'components/ModularComponents/PresetButton';
import ZoomText from 'components/ModularComponents/Flyout/flyoutHelpers/ZoomText';
import PageControlsInput from 'components/ModularComponents/PageControls/PageControlsInput';
import getToolbarTranslationString from 'helpers/translationKeyMapping';
import ToolButton from 'components/ModularComponents/ToolButton';
import FlyoutItemContainer from 'components/ModularComponents/FlyoutItemContainer';
import StylePresetDropdown from 'components/ModularComponents/OfficeEditor/StylePresetDropdown';
import OfficeEditorModeDropdown from 'components/ModularComponents/OfficeEditor/OfficeEditorModeDropdown';
import CellBorderStyleDropdown from 'components/ModularComponents/CellBorderStyleDropdown';
import Label from 'components/ModularComponents/Label';
import CustomElement from 'components/CustomElement';
import StatefulButton from 'components/ModularComponents/StatefulButton';
import CellTextColor from '../../SpreadsheetEditor/CellTextColor';
import CellBorderColor from '../../SpreadsheetEditor/CellBorderColor';
import CellBackgroundColor from '../../SpreadsheetEditor/CellBackgroundColor';
import CellBorders from '../../CellBorders';
import FontSizeDropdownContainer from 'components/ModularComponents/EditorSwitchers/FontSizeDropdown';
import FontFamilyDropdownContainer
  from 'components/ModularComponents/EditorSwitchers/FontFamilyDropdown/FontFamilyDropdownContainer';
import SpreadsheetEditorEditModeDropdown from '../../SpreadsheetEditor/SpreadsheetEditorEditModeDropdown';
import StylePanel from 'components/StylePanel';
import RubberStampPanel from 'components/RubberStampPanel';
import SignatureListPanel from 'components/SignatureListPanel';

const propTypes = {
  flyoutItem: PropTypes.oneOfType([
    // ie. 'divider'
    PropTypes.string,
    PropTypes.object
  ]),
  onClickHandler: PropTypes.func,
  activeFlyout: PropTypes.string,
  type: PropTypes.string,
};

const FlyoutItem = React.forwardRef((props, ref) => {
  const { flyoutItem, type, onClickHandler } = props;
  const modularComponent = useSelector((state) => flyoutItem?.dataElement ? selectors.getModularComponent(state, flyoutItem.dataElement) : undefined) || flyoutItem;

  const isDisabledViewOnly = useSelector((state) => selectors.isDisabledViewOnly(state, modularComponent.dataElement));
  if (modularComponent && isDisabledViewOnly) {
    return null;
  }

  const typesToGetExtraInfo = [
    ITEM_TYPE.PRESET_BUTTON,
    ITEM_TYPE.RIBBON_ITEM,
    ITEM_TYPE.TOOL_BUTTON,
    ITEM_TYPE.BUTTON,
    ITEM_TYPE.STATEFUL_BUTTON,
    ITEM_TYPE.TOGGLE_BUTTON,
    ITEM_TYPE.PAGE_CONTROLS,
    ITEM_TYPE.PAGE_NAVIGATION_BUTTON,
  ];

  const shouldGetMoreInfo = [modularComponent?.type, type].some((type) => typesToGetExtraInfo.includes(type));
  if (flyoutItem && flyoutItem.dataElement && shouldGetMoreInfo) {
    const newFlyoutItemState = {
      ...flyoutItem,
      ...itemToFlyout(modularComponent, {
        useOverrideClickOnly: true,
        onClick: flyoutItem?.onClick,
        children: flyoutItem?.children,
      }),
      type: type,
      onClickHandler: onClickHandler,
    };
    return <StaticItem {...props} flyoutItem={newFlyoutItemState} ref={ref} />;
  }
  return <StaticItem {...props} />;
});

FlyoutItem.propTypes = propTypes;
FlyoutItem.displayName = 'FlyoutItem';

export default FlyoutItem;

const StaticItem = React.forwardRef((props, ref) => {
  const { flyoutItem, isChild, index, activeItem, items, activeFlyout, type, onKeyDownHandler } = props;
  const allProps = { ...flyoutItem, ...props };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customHeadersAdditionalProperties = useSelector(selectors.getCustomHeadersAdditionalProperties, shallowEqual);
  const getActiveTabInPanel = useSelector((state) => selectors.getActiveTabInPanel(state, activeFlyout.split('-flyout')[0]));
  const isDisabledItem = useSelector((state) => selectors.isElementDisabled(state, flyoutItem?.dataElement));
  const currentLineSpacing = useSelector(selectors.getLineSpacing);
  const activeListType = useSelector((state) => selectors.getActiveListType(state));
  const isCursorInTable = useSelector(selectors.isCursorInTable);
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);

  if (isDisabledItem || (flyoutItem.hasOwnProperty('hidden') && flyoutItem.hidden)) {
    return null;
  }

  const itemsToRender = isChild ? activeItem.children : items;
  const icon = getIconDOMElement(flyoutItem, itemsToRender);

  const wrapElementInListItem = (element, className) => {
    return (
      <li className={className}>
        {element}
      </li>
    );
  };

  if (flyoutItem.render && typeof flyoutItem.render === 'string') {
    switch (flyoutItem.render) {
      case ITEM_RENDER_PREFIXES.STYLE_PANEL: {
        return (
          <StylePanel dataElement={flyoutItem.dataElement} isFlyout={true} />
        );
      }
      case ITEM_RENDER_PREFIXES.RUBBER_STAMP_PANEL: {
        return (
          <RubberStampPanel dataElement={flyoutItem.dataElement} isFlyout={true} />
        );
      }
      case ITEM_RENDER_PREFIXES.SIGNATURE_LIST_PANEL: {
        return (
          <SignatureListPanel dataElement={flyoutItem.dataElement} isFlyout={true} />
        );
      }
      default:
        console.warn(`Unknown render type: ${flyoutItem.render} for item ${flyoutItem.dataElement}`);
    }
  }

  switch (type) {
    case FLYOUT_ITEM_TYPES.STATEFUL_BUTTON: {
      return <StatefulButton ref={ref} key={`stateful-button-${index}`} {...allProps} isFlyoutItem/>;
    }
    case FLYOUT_ITEM_TYPES.CUSTOM_ELEMENT: {
      return <CustomElement key={`custom-element-${index}`} {...flyoutItem} isFlyoutItem/>;
    }
    case FLYOUT_ITEM_TYPES.LABEL: {
      if (typeof flyoutItem === 'object') {
        return <Label {...flyoutItem} isFlyoutItem key={`label-${index}`} />;
      }
      return <div className="flyout-label" key={`label-${index}`}>{t(flyoutItem)}</div>;
    }
    case FLYOUT_ITEM_TYPES.DIVIDER: {
      return <div className="divider" key={`divider-${index}`} />;
    }
    case FLYOUT_ITEM_TYPES.RIBBON_ITEM: {
      return <RibbonItem isFlyoutItem={true} {...allProps} ref={ref} icon={icon} />;
    }
    case FLYOUT_ITEM_TYPES.PRESET_BUTTON: {
      return <PresetButton {...allProps} isFlyoutItem={true} ref={ref} icon={icon} buttonType={allProps.buttonType || allProps.dataElement} flyoutItem={flyoutItem} allFlyoutItems={itemsToRender} />;
    }
    case FLYOUT_ITEM_TYPES.TOOL_BUTTON: {
      return <ToolButton {...allProps} isFlyoutItem={true} ref={ref} allFlyoutItems={itemsToRender} />;
    }
    case FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_INPUT: {
      return <PageControlsInput {...allProps} isFlyoutItem={true} ref={ref} icon={icon} />;
    }
    case FLYOUT_ITEM_TYPES.ZOOM_OPTIONS_BUTTON: {
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          index={index}
          label={<ZoomText />}
          additionalClass={'zoom-options'}
          icon={icon}
          isZoomOptions={true}
          isChild={isChild}
        />
      );
    }
    case ITEM_TYPE.CELL_BORDERS: {
      return <CellBorders {...allProps} isFlyoutItem={true} />;
    }
    case ITEM_TYPE.ORDERED_LIST: {
      const isActive = LIST_OPTIONS.Ordered === activeListType;
      flyoutItem.icon = 'icon-office-editor-number-list';
      flyoutItem.label = 'officeEditor.numberList';
      flyoutItem.className = 'listTypeToggleFlyoutMenu';
      flyoutItem.children = getListTypeFlyoutItems('number', OFFICE_NUMBER_OPTIONS);
      flyoutItem.additionalClass = isActive ? 'active' : '';
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          label={t(flyoutItem.label)}
          additionalClass={isActive ? 'active' : ''}
          icon={icon}
        />
      );
    }
    case ITEM_TYPE.UNORDERED_LIST: {
      const isActive = LIST_OPTIONS.Unordered === activeListType;
      flyoutItem.icon = 'icon-office-editor-bullet-list';
      flyoutItem.label = 'officeEditor.bulletList';
      flyoutItem.className = 'listTypeToggleFlyoutMenu';
      flyoutItem.children = getListTypeFlyoutItems('bullet', OFFICE_BULLET_OPTIONS);
      flyoutItem.additionalClass = isActive ? 'active' : '';
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          label={t(flyoutItem.label)}
          additionalClass={isActive ? 'active' : ''}
          icon={icon}
        />
      );
    }
    case FLYOUT_ITEM_TYPES.LIST_TYPE_BUTTON: {
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          index={index}
          dataElement={flyoutItem.dataElement}
          label={t(flyoutItem.label)}
          icon={icon}
          isChild={isChild}
          additionalClass="flyout-item-container--list-type"
        />
      );
    }
    case FLYOUT_ITEM_TYPES.FONT_SIZE_DROPDOWN: {
      const dropdownElement = <FontSizeDropdownContainer {...allProps} onKeyDown={onKeyDownHandler} ref={ref} key={`font-size-dropdown-${index}`} isFlyoutItem={true} />;
      return wrapElementInListItem(dropdownElement, 'flyout-item-dropdown-container');
    }
    case FLYOUT_ITEM_TYPES.FONT_FAMILY_DROPDOWN: {
      const dropdownElement = <FontFamilyDropdownContainer {...allProps} onKeyDown={onKeyDownHandler} ref={ref} key={`font-face-dropdown-${index}`} isFlyoutItem={true} />;
      return wrapElementInListItem(dropdownElement, 'flyout-item-dropdown-container');
    }
    case FLYOUT_ITEM_TYPES.STYLE_PRESET_DROPDOWN: {
      const dropdownElement = <StylePresetDropdown {...allProps} onKeyDown={onKeyDownHandler} ref={ref} key={`style-preset-dropdown-${index}`} isFlyoutItem={true} />;
      return wrapElementInListItem(dropdownElement, 'flyout-item-dropdown-container');
    }
    case FLYOUT_ITEM_TYPES.OFFICE_EDITOR_MODE_DROPDOWN: {
      const dropdownElement = <OfficeEditorModeDropdown {...allProps} onKeyDown={onKeyDownHandler} ref={ref} key={`office-editor-mode-dropdown-${index}`} isFlyoutItem={true} />;
      return wrapElementInListItem(dropdownElement, 'flyout-item-dropdown-container');
    }
    case FLYOUT_ITEM_TYPES.SPREADSHEET_EDITOR_MODE_DROPDOWN: {
      const dropdownElement = <SpreadsheetEditorEditModeDropdown {...allProps} onKeyDown={onKeyDownHandler} ref={ref} key={`sheet-editor-mode-dropdown-${index}`} isFlyoutItem={true} />;
      return wrapElementInListItem(dropdownElement, 'flyout-item-dropdown-container');
    }
    case FLYOUT_ITEM_TYPES.CELL_TEXT_COLOR: {
      return <CellTextColor {...allProps} isFlyoutItem={true} ref={ref} />;
    }
    case FLYOUT_ITEM_TYPES.CELL_BORDER_COLOR: {
      return <CellBorderColor {...allProps} isFlyoutItem={true} ref={ref} />;
    }
    case FLYOUT_ITEM_TYPES.CELL_BACKGROUND_COLOR: {
      return <CellBackgroundColor {...allProps} isFlyoutItem={true} ref={ref} />;
    }
    case FLYOUT_ITEM_TYPES.OFFICE_EDITOR_FILE_NAME: {
      // Hiding this component from the flyout until we implement mobile functionality
      return null;
    }
    case ITEM_TYPE.CELL_BORDER_STYLE_DROPDOWN: {
      const dropdownElement = <CellBorderStyleDropdown {...allProps} onKeyDown={onKeyDownHandler} ref={ref} key={`cell-border-style-dropdown-${index}`} isFlyoutItem={true} />;
      return wrapElementInListItem(dropdownElement, 'flyout-item-dropdown-container');
    }
    case ITEM_TYPE.LINE_SPACING_BUTTON: {
      flyoutItem.icon = 'icon-office-editor-line-spacing';
      flyoutItem.label = 'officeEditor.lineSpacingMenu';
      flyoutItem.className = 'LineSpacingButton';
      flyoutItem.children = getLineSpacingFlyoutItems();
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          label={t(flyoutItem.label)}
          icon={icon}
        />
      );
    }
    case FLYOUT_ITEM_TYPES.LINE_SPACING_OPTIONS_BUTTON: {
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          index={index}
          dataElement={flyoutItem.dataElement}
          label={t(flyoutItem.label)}
          icon={icon}
          isChild={isChild}
          additionalClass={currentLineSpacing.toLowerCase().split('.').join('') === flyoutItem.dataElement?.split('line-spacing-button-')[1] ? 'active' : ''}
        />
      );
    }
    case FLYOUT_ITEM_TYPES.OFFICE_EDITOR_BREAK_DROPDOWN: {
      flyoutItem.children = PAGE_SECTION_BREAK_OPTIONS;
      return (
        <FlyoutItemContainer
          {...allProps}
          ref={ref}
          index={index}
          dataElement={flyoutItem.dataElement}
          icon={icon}
          disabled={isCursorInTable || activeStream !== EditingStreamType.BODY}
        />
      );
    }
    case FLYOUT_ITEM_TYPES.OFFICE_EDITOR_MARGIN_DROPDOWN: {
      flyoutItem.children = MARGIN_OPTIONS.map((item) => ({
        ...item,
        onClick: () => item.onClick(dispatch, actions),
      }));
      return (
        <FlyoutItemContainer
          {...allProps}
          ref={ref}
          index={index}
          dataElement={flyoutItem.dataElement}
          icon={icon}
          isChild={isChild}
        />
      );
    }
    case FLYOUT_ITEM_TYPES.OFFICE_EDITOR_COLUMN_DROPDOWN: {
      flyoutItem.children = COLUMN_OPTIONS.map((item) => ({
        ...item,
        onClick: () => item.onClick(dispatch, actions),
      }));
      return (
        <FlyoutItemContainer
          {...allProps}
          ref={ref}
          index={index}
          dataElement={flyoutItem.dataElement}
          icon={icon}
          isChild={isChild}
        />
      );
    }
    default: {
      const alabel = flyoutItem.toolbarGroup
        ? getToolbarTranslationString(flyoutItem.toolbarGroup, customHeadersAdditionalProperties)
        : flyoutItem.label;
      const itemIsAPanelTab = type === FLYOUT_ITEM_TYPES.TAB_PANEL_ITEM;
      const itemIsAZoomButton = type === FLYOUT_ITEM_TYPES.ZOOM_BUTTON;
      const isItemActive = flyoutItem.isActive ||
        itemIsAPanelTab && getActiveTabInPanel === flyoutItem.dataElement ||
        itemIsAZoomButton && Math.ceil(core.getZoom() * 100).toString() === flyoutItem.dataElement?.split('zoom-button-')[1];

      allProps.additionalClass = allProps.additionalClass || '';
      const flyoutItemClasses = classNames({
        'disabled': flyoutItem.disabled,
        'active': isItemActive,
        [allProps.additionalClass]: true,
      });
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          label={alabel}
          additionalClass={flyoutItemClasses}
          icon={icon}
          secondaryLabel={flyoutItem.secondaryLabel || null}
        />
      );
    }
  }
});

const staticItemPropTypes = {
  flyoutItem: PropTypes.oneOfType([
    // ie. 'divider'
    PropTypes.string,
    PropTypes.object
  ]),
  isChild: PropTypes.bool,
  index: PropTypes.number,
  onClickHandler: PropTypes.func,
  activeItem: PropTypes.object,
  items: PropTypes.array,
  type: PropTypes.string,
  activeFlyout: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

StaticItem.propTypes = staticItemPropTypes;
StaticItem.displayName = 'StaticItem';