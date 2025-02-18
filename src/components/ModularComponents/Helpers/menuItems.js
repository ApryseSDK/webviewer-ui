import React from 'react';
import DataElements from 'constants/dataElement';
import {
  PRESET_BUTTON_TYPES,
  CELL_ADJUSTMENT_BUTTONS,
  CELL_FORMAT_BUTTONS,
} from 'constants/customizationVariables';
import Button from 'components/Button';
import classNames from 'classnames';

const baseMenuItems = {
  [PRESET_BUTTON_TYPES.UNDO]: {
    dataElement: 'undoButton',
    presetDataElement: DataElements.UNDO_PRESET_BUTTON,
    icon: 'icon-operation-undo',
    label: 'action.undo',
    title: 'action.undo',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.REDO]: {
    dataElement: 'redoButton',
    presetDataElement: DataElements.REDO_PRESET_BUTTON,
    icon: 'icon-operation-redo',
    label: 'action.redo',
    title: 'action.redo',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.FORM_FIELD_EDIT]: {
    dataElement: 'formFieldEditButton',
    presetDataElement: DataElements.FORM_FIELD_EDIT_PRESET_BUTTON,
    icon: 'ic-fill-and-sign',
    label: 'action.formFieldEditMode',
    title: 'action.formFieldEditMode',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.CONTENT_EDIT]: {
    dataElement: 'contentEditButton',
    presetDataElement: DataElements.CONTENT_EDIT_PRESET_BUTTON,
    icon: 'icon-content-edit',
    label: 'action.contentEditMode',
    title: 'action.contentEditMode',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.NEW_DOCUMENT]: {
    dataElement: DataElements.NEW_DOCUMENT_BUTTON,
    presetDataElement: DataElements.NEW_DOCUMENT_PRESET_BUTTON,
    icon: 'icon-plus-sign',
    label: 'action.newDocument',
    title: 'action.newDocument',
    isActive: false,
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.FILE_PICKER]: {
    dataElement: DataElements.FILE_PICKER_BUTTON,
    presetDataElement: DataElements.FILE_PICKER_PRESET_BUTTON,
    icon: 'icon-header-file-picker-line',
    label: 'action.openFile',
    title: 'action.openFile',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.DOWNLOAD]: {
    dataElement: DataElements.DOWNLOAD_BUTTON,
    presetDataElement: DataElements.DOWNLOAD_PRESET_BUTTON,
    icon: 'icon-download',
    label: 'action.download',
    title: 'action.download',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.SAVE_AS]: {
    dataElement: DataElements.SAVE_AS_BUTTON,
    presetDataElement: DataElements.SAVE_AS_PRESET_BUTTON,
    icon: 'icon-save',
    label: 'saveModal.saveAs',
    title: 'saveModal.saveAs',
    isActive: false,
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.PRINT]: {
    dataElement: DataElements.PRINT_BUTTON,
    presetDataElement: DataElements.PRINT_PRESET_BUTTON,
    icon: 'icon-header-print-line',
    label: 'action.print',
    title: 'action.print',
    isActive: false,
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.CREATE_PORTFOLIO]: {
    dataElement: DataElements.CREATE_PORTFOLIO_BUTTON,
    presetDataElement: DataElements.CREATE_PORTFOLIO_PRESET_BUTTON,
    icon: 'icon-pdf-portfolio',
    label: 'portfolio.createPDFPortfolio',
    title: 'portfolio.createPDFPortfolio',
    isActive: false,
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.SETTINGS]: {
    dataElement: DataElements.SETTINGS_BUTTON,
    presetDataElement: DataElements.SETTINGS_PRESET_BUTTON,
    icon: 'icon-header-settings-line',
    label: 'option.settings.settings',
    title: 'option.settings.settings',
    isActive: false,
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.FULLSCREEN]: {
    dataElement: DataElements.FULLSCREEN_BUTTON,
    presetDataElement: DataElements.FULLSCREEN_PRESET_BUTTON,
    icon: 'icon-header-full-screen',
    label: 'action.enterFullscreen',
    title: 'action.enterFullscreen',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE]: {
    dataElement: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
    presetDataElement: DataElements.TOGGLE_ACCESSIBILITY_MODE_PRESET_BUTTON,
    icon: 'icon-accessibility-mode',
    label: 'accessibility.accessibilityMode',
    title: 'accessibility.accessibilityMode',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.BOLD]: {
    dataElement: 'boldButton',
    presetDataElement: DataElements.BOLD_PRESET_BUTTON,
    icon: 'icon-text-bold',
    label: 'officeEditor.bold',
    title: 'officeEditor.bold',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.ITALIC]: {
    dataElement: 'italicButton',
    presetDataElement: DataElements.ITALIC_PRESET_BUTTON,
    icon: 'icon-text-italic',
    label: 'officeEditor.italic',
    title: 'officeEditor.italic',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.UNDERLINE]: {
    dataElement: 'underlineButton',
    presetDataElement: DataElements.UNDERLINE_PRESET_BUTTON,
    icon: 'icon-text-underline',
    label: 'officeEditor.underline',
    title: 'officeEditor.underline',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.STRIKETHROUGH]: {
    dataElement: 'strikethroughButton',
    presetDataElement: DataElements.STRIKETHROUGH_PRESET_BUTTON,
    icon: 'icon-tool-text-manipulation-strikethrough',
    label: 'sheetEditor.strikethrough',
    title: 'sheetEditor.strikethrough',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.INCREASE_INDENT]: {
    dataElement: 'increaseIndentButton',
    presetDataElement: DataElements.INCREASE_INDENT_PRESET_BUTTON,
    icon: 'ic-indent-increase',
    label: 'officeEditor.increaseIndent',
    title: 'officeEditor.increaseIndent',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.DECREASE_INDENT]: {
    dataElement: 'decreaseIndentButton',
    presetDataElement: DataElements.DECREASE_INDENT_PRESET_BUTTON,
    icon: 'ic-indent-decrease',
    label: 'officeEditor.decreaseIndent',
    title: 'officeEditor.decreaseIndent',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS]: {
    dataElement: PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS,
    presetDataElement: DataElements.OFFICE_EDITOR_TOGGLE_NON_PRINTING_CHARACTERS_BUTTON,
    icon: 'icon-office-editor-toggle-non-printing-characters',
    label: 'officeEditor.nonPrintingCharacters',
    title: 'officeEditor.nonPrintingCharacters',
    hidden: false,
  },

  [PRESET_BUTTON_TYPES.ALIGN_LEFT]: {
    dataElement: 'alignLeftButton',
    presetDataElement: DataElements.JUSTIFY_LEFT_PRESET_BUTTON,
    icon: 'icon-menu-left-align',
    label: 'officeEditor.leftAlign',
    title: 'officeEditor.leftAlign',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.ALIGN_CENTER]: {
    dataElement: 'alignCenterButton',
    presetDataElement: DataElements.JUSTIFY_CENTER_PRESET_BUTTON,
    icon: 'icon-menu-center-align',
    label: 'officeEditor.centerAlign',
    title: 'officeEditor.centerAlign',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.ALIGN_RIGHT]: {
    dataElement: 'alignRightButton',
    presetDataElement: DataElements.JUSTIFY_RIGHT_PRESET_BUTTON,
    icon: 'icon-menu-right-align',
    label: 'officeEditor.rightAlign',
    title: 'officeEditor.rightAlign',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.JUSTIFY_BOTH]: {
    dataElement: 'justifyBothButton',
    presetDataElement: DataElements.JUSTIFY_BOTH_PRESET_BUTTON,
    icon: 'icon-menu-both-align',
    label: 'officeEditor.justify',
    title: 'officeEditor.justify',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.INSERT_IMAGE]: {
    dataElement: PRESET_BUTTON_TYPES.INSERT_IMAGE,
    presetDataElement: DataElements.OFFICE_EDITOR_TOOLS_HEADER_INSERT_IMAGE,
    icon: 'icon-tool-image-line',
    label: 'officeEditor.image',
    title: 'officeEditor.insertImage',
  },
  [PRESET_BUTTON_TYPES.OE_COLOR_PICKER]: {
    dataElement: DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER,
    presetDataElement: DataElements.OFFICE_EDITOR_COLOR_PICKER_PRESET_BUTTON,
    icon: 'icon-office-editor-circle',
    label: 'officeEditor.textColor',
    title: 'officeEditor.textColor',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.COMPARE]: {
    dataElement: 'comparePanelToggle',
    presetDataElement: 'comparePanelToggle',
    title: 'action.comparePages',
    label: 'action.comparePages',
    icon: 'icon-header-compare',
  },
  [PRESET_BUTTON_TYPES.NEW_SPREADSHEET]: {
    dataElement: PRESET_BUTTON_TYPES.NEW_SPREADSHEET,
    presetDataElement: DataElements.NEW_SPREADSHEET_PRESET_BUTTON,
    icon: 'icon-plus-sign',
    label: 'action.newSheetDocument',
    title: 'action.newSheetDocument',
    isActive: false,
  },



  [PRESET_BUTTON_TYPES.CELL_TEXT_COLOR]: {
    dataElement: 'cellTextColor',
    presetDataElement: DataElements.CELL_TEXT_COLOR_BUTTON,
    icon: 'icon-tool-text-free-text',
    label: 'sheetEditor.fontColor',
    title: 'sheetEditor.fontColor',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.CELL_BACKGROUND_COLOR]: {
    dataElement: 'cellBackgroundColor',
    presetDataElement: DataElements.CELL_BG_COLOR_BUTTON,
    icon: 'ic-fill',
    label: 'sheetEditor.cellBackgroundColor',
    title: 'sheetEditor.cellBackgroundColor',
    hidden: false,
  },


  [PRESET_BUTTON_TYPES.CELL_ADJUSTMENT]: {
    dataElement: 'cellAdjustment',
    presetDataElement: DataElements.CELL_ADJUSTMENT_BUTTON,
    icon: 'ic-column-insert',
    label: 'sheetEditor.cellAdjustment',
    title: 'sheetEditor.cellAdjustment',
    hidden: false,
  },

  [PRESET_BUTTON_TYPES.CELL_BORDER_STYLE]: {
    dataElement: 'cellBorderStyle',
    presetDataElement: DataElements.BORDER_STYLE_BUTTON,
    icon: 'ic-border-main',
    label: 'sheetEditor.cellBorderStyle',
    title: 'sheetEditor.cellBorderStyle',
    hidden: false,
  },

  [PRESET_BUTTON_TYPES.CELL_MERGE_TOGGLE]: {
    dataElement: 'cellMergeToggle',
    presetDataElement: DataElements.MERGE_TOGGLE_BUTTON,
    icon: 'ic-merge',
    label: 'sheetEditor.merge',
    title: 'sheetEditor.merge',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.CELL_UNMERGE_TOGGLE]: {
    dataElement: 'cellUnmergeToggle',
    presetDataElement: DataElements.UNMERGE_TOGGLE_BUTTON,
    icon: 'ic-unmerge',
    label: 'sheetEditor.unmerge',
    title: 'sheetEditor.unmerge',
    hidden: false,
  },

  [PRESET_BUTTON_TYPES.CELL_FORMAT_CURRENCY]: {
    dataElement: 'cellFormatAsCurrencyButton',
    presetDataElement: DataElements.CELL_FORMAT_CURRENCY_BUTTON,
    icon: 'ic-currency-dollar',
    label: 'sheetEditor.formatAsCurrency',
    title: 'sheetEditor.formatAsCurrency',
    hidden: false,
  },

  [PRESET_BUTTON_TYPES.CELL_FORMAT_MORE]: {
    dataElement: 'formatMore',
    presetDataElement: DataElements.CELL_FORMAT_MORE_BUTTON,
    icon: 'icon-tools-more-vertical',
    label: 'action.more',
    title: 'action.more',
    hidden: false,
  },

  /** CELL COPY PASTE CUT */
  [PRESET_BUTTON_TYPES.CELL_COPY]: {
    dataElement: 'cellCopy',
    presetDataElement: DataElements.CELL_COPY_BUTTON,
    icon: 'icon-copy',
    label: 'action.copy',
    title: 'action.copy',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.CELL_CUT]: {
    dataElement: 'cellCut',
    presetDataElement: DataElements.CELL_CUT_BUTTON,
    icon: 'icon-cut',
    label: 'action.cut',
    title: 'action.cut',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.CELL_PASTE]: {
    dataElement: 'cellPaste',
    presetDataElement: DataElements.CELL_PASTE_BUTTON,
    icon: 'icon-paste',
    label: 'action.paste',
    title: 'action.paste',
    hidden: false,
  },


  /** CELL TEXT ALIGNMENT */
  [PRESET_BUTTON_TYPES.CELL_TEXT_ALIGNMENT]: {
    dataElement: 'cellTextAlignment',
    presetDataElement: DataElements.CELL_TEXT_ALIGNMENT_BUTTON,
    icon: 'icon-menu-left-align',
    label: 'sheetEditor.textAlignment',
    title: 'sheetEditor.textAlignment',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.ALIGN_TOP]: {
    dataElement: PRESET_BUTTON_TYPES.ALIGN_TOP,
    presetDataElement: DataElements.CELL_TEXT_ALIGN_TOP_BUTTON,
    icon: 'ic-align-top-ios',
    label: 'sheetEditor.alignTop',
    title: 'sheetEditor.alignTop',
    isActive: false,
  },
  [PRESET_BUTTON_TYPES.ALIGN_MIDDLE]: {
    dataElement: PRESET_BUTTON_TYPES.ALIGN_MIDDLE,
    presetDataElement: DataElements.CELL_TEXT_ALIGN_MIDDLE_BUTTON,
    icon: 'ic-align-middle-ios',
    label: 'sheetEditor.alignMiddle',
    title: 'sheetEditor.alignMiddle',
    isActive: false,
  },
  [PRESET_BUTTON_TYPES.ALIGN_BOTTOM]: {
    dataElement: PRESET_BUTTON_TYPES.ALIGN_BOTTOM,
    presetDataElement: DataElements.CELL_TEXT_ALIGN_BOTTOM_BUTTON,
    icon: 'ic-align-bottom-ios',
    label: 'sheetEditor.alignBottom',
    title: 'sheetEditor.alignBottom',
    isActive: false,
  },
};

export const menuItems = {
  ...baseMenuItems,
  ...CELL_ADJUSTMENT_BUTTONS.reduce((acc, item) => {
    if (item === 'divider') {
      return acc;
    }
    const icon = item.replace(/[A-Z]/g, (m) => `-${  m.toLowerCase()}`);
    const label = item.charAt(0).toLowerCase() + item.slice(1);
    acc[`adjustment${item}`] = {
      dataElement: `adjustment${item}`,
      presetDataElement: `adjustment${item}Btn`,
      icon: `ic${icon}`,
      label: `sheetEditor.${label}`,
      title: `sheetEditor.${label}`,
      isActive: false,
    };
    return acc;
  }, {}),

  ...CELL_FORMAT_BUTTONS.reduce((acc, item) => {
    if (item === 'divider') {
      return acc;
    }
    const { label } = item;
    let { icon } = item;
    if (!icon) {
      icon = `ic${label.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
    }

    const txt = label.charAt(0).toLowerCase() + label.slice(1);
    acc[`format${label}`] = {
      dataElement: `format${label}`,
      presetDataElement: `format${label}Btn`,
      icon: `${icon}`,
      label: `sheetEditor.${txt}`,
      title: `sheetEditor.${txt}`,
      isActive: false,
    };
    return acc;
  }, {}),
};

export const getPresetButtonDOM = (presetButtonProperties) => {
  const { buttonType, isDisabled, onClick, isFullScreen, isActive, style, className } = presetButtonProperties;
  let { dataElement, presetDataElement, icon, title } = menuItems[buttonType];

  if (buttonType === PRESET_BUTTON_TYPES.FULLSCREEN) {
    icon = isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen';
    title = isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen';
  }

  return (
    <Button
      className={classNames({
        PresetButton: true,
        [dataElement]: true,
        [className]: true,
      })}
      dataElement={presetDataElement}
      img={icon}
      title={title}
      onClick={onClick}
      disabled={isDisabled}
      isActive={isActive}
      style={style}
    />
  );
};