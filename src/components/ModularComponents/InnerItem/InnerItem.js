import React from 'react';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { LIST_OPTIONS } from 'constants/officeEditor';
import CustomButton from '../CustomButton';
import StatefulButton from '../StatefulButton';
import GroupedItems from '../GroupedItems/GroupedItems';
import Divider from '../Divider';
import RibbonGroup from '../RibbonGroup';
import ToggleElementButton from '../ToggleElementButton';
import ZoomControls from '../ZoomControls';
import ToolButton from '../ToolButton';
import PageControls from '../PageControls';
import PresetButton from '../PresetButton';
import ViewControls from '../ViewControls';
import EditorFileName from '../EditorFileName';
import CellBorders from '../CellBorders';
import Label from '../Label';
import StylePresetDropdown from '../OfficeEditor/StylePresetDropdown';
import CreateTableDropdown from '../OfficeEditor/CreateTableDropdown';
import OfficeEditorModeDropdown from '../OfficeEditor/OfficeEditorModeDropdown';
import SpreadsheetEditorEditModeDropdown from '../SpreadsheetEditor/SpreadsheetEditorEditModeDropdown';
import CellBorderStyleDropdown from '../CellBorderStyleDropdown';
import LineSpacingToggleButton from '../OfficeEditor/LineSpacing';
import OfficeEditorInsertImageButton from '../OfficeEditor/OfficeEditorInsertImageButton';
import PageSectionBreakDropdown from '../OfficeEditor/PageSectionBreakDropdown';
import ListToggleButton from '../OfficeEditor/ListToggleButton';
import OfficeEditorMarginDropdown from '../OfficeEditor/OfficeEditorMarginDropdown';
import OfficeEditorColumnDropdown from '../OfficeEditor/OfficeEditorColumnDropdown';
import CustomElement from 'components/CustomElement';
import CellTextColor from '../SpreadsheetEditor/CellTextColor';
import CellBackgroundColor from '../SpreadsheetEditor/CellBackgroundColor';
import FontSizeDropdownContainer from '../EditorSwitchers/FontSizeDropdown/FontSizeDropdownContainer';
import FontFamilyDropdownContainer from '../EditorSwitchers/FontFamilyDropdown/FontFamilyDropdownContainer';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const InnerItem = (props) => {
  const { type, dataElement, headerDirection, headerPlacement } = props;
  const key = `${type}-${dataElement}-${headerPlacement}`;
  const isDisabledViewOnly = useSelector((state) => selectors.isDisabledViewOnly(state, dataElement));
  if (isDisabledViewOnly) {
    return null;
  }

  switch (type) {
    case ITEM_TYPE.BUTTON:
      return <CustomButton key={key} {...props} />;
    case ITEM_TYPE.STATEFUL_BUTTON:
      return <StatefulButton key={key} {...props} />;
    case ITEM_TYPE.GROUPED_ITEMS:
      return <GroupedItems key={key} {...props} headerDirection={headerDirection} />;
    case ITEM_TYPE.RIBBON_ITEM:
      console.warn(`${ITEM_TYPE.RIBBON_ITEM} needs to be added to a ${ITEM_TYPE.RIBBON_GROUP}`);
    case ITEM_TYPE.DIVIDER:
      return <Divider headerDirection={headerDirection} {...props} />;
    case ITEM_TYPE.TOGGLE_BUTTON:
      return <ToggleElementButton key={key} {...props} />;
    case ITEM_TYPE.RIBBON_GROUP:
      return <RibbonGroup key={key} {...props} />;
    case ITEM_TYPE.ZOOM:
      return <ZoomControls {...props} />;
    case ITEM_TYPE.TOOL_BUTTON:
      return <ToolButton key={key} {...props} />;
    case ITEM_TYPE.PAGE_CONTROLS:
      return <PageControls {...props} headerDirection={headerDirection} />;
    case ITEM_TYPE.PRESET_BUTTON:
      return <PresetButton key={key} {...props} />;
    case ITEM_TYPE.VIEW_CONTROLS:
      return <ViewControls key={key} {...props} />;
    case ITEM_TYPE.CELL_BORDERS:
      return <CellBorders key={key} {...props} />;
    case ITEM_TYPE.SPREADSHEET_EDITOR_FILE_NAME:
      return <EditorFileName key={key} {...props} />;
    case ITEM_TYPE.OFFICE_EDITOR_FILE_NAME:
      return <EditorFileName key={key} {...props} />;
    case ITEM_TYPE.FONT_SIZE_DROPDOWN:
      return <FontSizeDropdownContainer key={key} {...props} />;
    case ITEM_TYPE.FONT_FAMILY_DROPDOWN:
      return <FontFamilyDropdownContainer key={key} {...props} />;
    case ITEM_TYPE.STYLE_PRESET_DROPDOWN:
      return <StylePresetDropdown key={key} {...props} />;
    case ITEM_TYPE.OFFICE_EDITOR_MARGIN_DROPDOWN:
      return <OfficeEditorMarginDropdown key={key} {...props} />;
    case ITEM_TYPE.OFFICE_EDITOR_COLUMN_DROPDOWN:
      return <OfficeEditorColumnDropdown key={key} {...props} />;
    case ITEM_TYPE.CREATE_TABLE_DROPDOWN:
      return <CreateTableDropdown key={key} {...props} />;
    case ITEM_TYPE.OFFICE_EDITOR_INSERT_IMAGE_BUTTON:
      return <OfficeEditorInsertImageButton key={key} {...props} />;
    case ITEM_TYPE.OFFICE_EDITOR_BREAK_DROPDOWN:
      return <PageSectionBreakDropdown key={key} {...props} />;
    case ITEM_TYPE.OFFICE_EDITOR_MODE_DROPDOWN:
      return <OfficeEditorModeDropdown key={key} {...props} />;
    case ITEM_TYPE.LINE_SPACING_BUTTON:
      return <LineSpacingToggleButton key={key} {...props} />;
    case ITEM_TYPE.ORDERED_LIST:
      return <ListToggleButton {...props} listType={LIST_OPTIONS.Ordered} key={key} />;
    case ITEM_TYPE.UNORDERED_LIST:
      return <ListToggleButton {...props} listType={LIST_OPTIONS.Unordered} key={key} />;
    case ITEM_TYPE.LABEL:
      return <Label key={key} {...props} />;
    case ITEM_TYPE.SPREADSHEET_EDITOR_MODE_DROPDOWN:
      return <SpreadsheetEditorEditModeDropdown key={key} {...props} />;
    case ITEM_TYPE.CELL_TEXT_COLOR:
      return <CellTextColor key={key} {...props} />;
    case ITEM_TYPE.CELL_BACKGROUND_COLOR:
      return <CellBackgroundColor key={key} {...props} />;
    case ITEM_TYPE.CELL_BORDER_STYLE_DROPDOWN:
      return <CellBorderStyleDropdown key={key} {...props} />;
    case ITEM_TYPE.CUSTOM_ELEMENT:
      return <CustomElement key={key} {...props} />;
    default:
      console.warn(`${type} is not a valid item type.`);
      return null;
  }
};

export default InnerItem;