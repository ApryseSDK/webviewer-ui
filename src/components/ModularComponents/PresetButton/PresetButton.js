import React from 'react';
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

const PresetButton = (props) => {
  const { buttonType } = props;

  switch (buttonType) {
    case PRESET_BUTTON_TYPES.UNDO:
      return <UndoButton {...props} />;
    case PRESET_BUTTON_TYPES.REDO:
      return <RedoButton {...props} />;
    case PRESET_BUTTON_TYPES.NEW_DOCUMENT:
      return <NewDocumentButton {...props} />;
    case PRESET_BUTTON_TYPES.FILE_PICKER:
      return <FilePickerButton {...props} />;
    case PRESET_BUTTON_TYPES.DOWNLOAD:
      return <DownloadButton {...props} />;
    case PRESET_BUTTON_TYPES.FULLSCREEN:
      return <FullScreenButton {...props} />;
    case PRESET_BUTTON_TYPES.SAVE_AS:
      return <SaveAsButton {...props} />;
    case PRESET_BUTTON_TYPES.PRINT:
      return <PrintButton {...props} />;
    case PRESET_BUTTON_TYPES.CREATE_PORTFOLIO:
      return <NewPortfolioButton {...props} />;
    case PRESET_BUTTON_TYPES.SETTINGS:
      return <SettingsButton {...props} />;
    case PRESET_BUTTON_TYPES.FORM_FIELD_EDIT:
      return <FormFieldEditButton {...props} />;
    case PRESET_BUTTON_TYPES.CONTENT_EDIT:
      return <ContentEditButton {...props} />;
    default:
      console.warn(`${buttonType} is not a valid item type.`);
      return null;
  }
};

PresetButton.propTypes = {
  buttonType: PropTypes.string.isRequired
};

export default PresetButton;