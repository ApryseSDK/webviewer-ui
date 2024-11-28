import React from 'react';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import Button from 'components/Button';

export const menuItems = {
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
  [PRESET_BUTTON_TYPES.JUSTIFY_LEFT]: {
    dataElement: 'justifyLeftButton',
    presetDataElement: DataElements.JUSTIFY_LEFT_PRESET_BUTTON,
    icon: 'icon-menu-left-align',
    label: 'officeEditor.leftAlign',
    title: 'officeEditor.leftAlign',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.JUSTIFY_CENTER]: {
    dataElement: 'justifyCenterButton',
    presetDataElement: DataElements.JUSTIFY_CENTER_PRESET_BUTTON,
    icon: 'icon-menu-center-align',
    label: 'officeEditor.centerAlign',
    title: 'officeEditor.centerAlign',
    hidden: false,
  },
  [PRESET_BUTTON_TYPES.JUSTIFY_RIGHT]: {
    dataElement: 'justifyRightButton',
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
  [PRESET_BUTTON_TYPES.PAGE_BREAK]: {
    dataElement: PRESET_BUTTON_TYPES.PAGE_BREAK,
    presetDataElement: DataElements.OFFICE_EDITOR_PAGE_BREAK,
    icon: 'icon-office-editor-page-break',
    label: 'officeEditor.pageBreak',
    title: 'officeEditor.pageBreak',
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
};

export const getPresetButtonDOM = (buttonType, isDisabled, onClick, isFullScreen = undefined, isActive = false) => {
  const { dataElement, presetDataElement } = menuItems[buttonType];
  let { icon, title } = menuItems[buttonType];

  if (buttonType === PRESET_BUTTON_TYPES.FULLSCREEN) {
    icon = isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen';
    title = isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen';
  }

  return (
    <Button
      className={`PresetButton ${dataElement}`}
      dataElement={presetDataElement}
      img={icon}
      title={title}
      onClick={onClick}
      disabled={isDisabled}
      isActive={isActive}
    />
  );
};