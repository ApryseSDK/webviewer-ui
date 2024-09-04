import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import './PresetButton.scss';
import NewDocumentButton from './buttons/NewDocument';
import FilePickerButton from './buttons/FilePicker';
import UndoButton from './buttons/Undo';
import RedoButton from './buttons/Redo';
import DownloadButton from './buttons/Download';
import FullScreenButton from './buttons/FullScreen';
import SaveAsButton from './buttons/SaveAs';
import PrintButton from './buttons/Print';
import NewPortfolioButton from './buttons/NewPortfolio';
import SettingsButton from './buttons/Settings';
import FormFieldEditButton from './buttons/FormFieldEdit';
import ContentEditButton from './buttons/ContentEdit';

import FontStyleToggleButton from './buttons/OfficeEditor/FontStyleToggleButton';

import { LIST_OPTIONS } from 'constants/officeEditor';
import ListToggleButton from '../OfficeEditor/ListToggleButton';

const PresetButton = forwardRef((props, ref) => {
  const { buttonType } = props;

  switch (buttonType) {
    case PRESET_BUTTON_TYPES.UNDO:
      return <UndoButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.REDO:
      return <RedoButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.NEW_DOCUMENT:
      return <NewDocumentButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.FILE_PICKER:
      return <FilePickerButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.DOWNLOAD:
      return <DownloadButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.FULLSCREEN:
      return <FullScreenButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.SAVE_AS:
      return <SaveAsButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.PRINT:
      return <PrintButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.CREATE_PORTFOLIO:
      return <NewPortfolioButton {...props} ref={ref}/>;
    case PRESET_BUTTON_TYPES.SETTINGS:
      return <SettingsButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.FORM_FIELD_EDIT:
      return <FormFieldEditButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.CONTENT_EDIT:
      return <ContentEditButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.BOLD:
      return <FontStyleToggleButton {...props} styleType="bold" ref={ref} />;
    case PRESET_BUTTON_TYPES.ITALIC:
      return <FontStyleToggleButton {...props} styleType="italic" ref={ref} />;
    case PRESET_BUTTON_TYPES.UNDERLINE:
      return <FontStyleToggleButton {...props} styleType="underline" ref={ref} />;
    case PRESET_BUTTON_TYPES.ORDERED_LIST:
      return <ListToggleButton {...props} listType={LIST_OPTIONS.Ordered} ref={ref} />;
    case PRESET_BUTTON_TYPES.UNORDERED_LIST:
      return <ListToggleButton {...props} listType={LIST_OPTIONS.Unordered} ref={ref} />;
    default:
      console.warn(`${buttonType} is not a valid item type.`);
      return null;
  }
});

PresetButton.propTypes = {
  buttonType: PropTypes.string.isRequired
};
PresetButton.displayName = 'PresetButton';

export default PresetButton;