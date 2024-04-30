import React from 'react';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import ActionButton from 'components/ActionButton';

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
};

export const getPresetButtonDOM = (buttonType, isDisabled, onClick, isFullScreen) => {
  const { dataElement, presetDataElement } = menuItems[buttonType];
  let { icon, title } = menuItems[buttonType];

  if (buttonType === PRESET_BUTTON_TYPES.FULLSCREEN) {
    icon = isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen';
    title = isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen';
  }

  return (
    <ActionButton
      className={`PresetButton ${dataElement}`}
      dataElement={presetDataElement}
      img={icon}
      title={title}
      onClick={onClick}
      disabled={isDisabled}
    />
  );
};