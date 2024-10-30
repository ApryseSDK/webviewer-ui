import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { JUSTIFICATION_OPTIONS, STYLE_TOGGLE_OPTIONS } from 'constants/officeEditor';
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
import OfficeEditorInsertImageButton from '../OfficeEditor/OfficeEditorInsertImageButton';
import IndentButton from './buttons/OfficeEditor/IndentButton';
import FontStyleToggleButton from './buttons/OfficeEditor/FontStyleToggleButton';
import ColorPickerButton from './buttons/OfficeEditor/ColorPickerButton';
import JustificationButton from './buttons/OfficeEditor/JustificationButton';
import CompareButton from './buttons/Compare';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import OfficeEditorPageBreakButton from '../OfficeEditor/OfficeEditorPageBreakButton';
import './PresetButton.scss';

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
      return <NewPortfolioButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.SETTINGS:
      return <SettingsButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.FORM_FIELD_EDIT:
      return <FormFieldEditButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.CONTENT_EDIT:
      return <ContentEditButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.INCREASE_INDENT:
      return <IndentButton {...props} ref={ref} isIncreaseIndent={true} />;
    case PRESET_BUTTON_TYPES.DECREASE_INDENT:
      return <IndentButton {...props} ref={ref} isIncreaseIndent={false} />;
    case PRESET_BUTTON_TYPES.BOLD:
      return <FontStyleToggleButton {...props} styleType={STYLE_TOGGLE_OPTIONS.Bold} ref={ref} />;
    case PRESET_BUTTON_TYPES.ITALIC:
      return <FontStyleToggleButton {...props} styleType={STYLE_TOGGLE_OPTIONS.Italic} ref={ref} />;
    case PRESET_BUTTON_TYPES.UNDERLINE:
      return <FontStyleToggleButton {...props} styleType={STYLE_TOGGLE_OPTIONS.Underline} ref={ref} />;
    case PRESET_BUTTON_TYPES.JUSTIFY_LEFT:
      return <JustificationButton {...props} justificationType={JUSTIFICATION_OPTIONS.Left} ref={ref} />;
    case PRESET_BUTTON_TYPES.JUSTIFY_CENTER:
      return <JustificationButton {...props} justificationType={JUSTIFICATION_OPTIONS.Center} ref={ref} />;
    case PRESET_BUTTON_TYPES.JUSTIFY_RIGHT:
      return <JustificationButton {...props} justificationType={JUSTIFICATION_OPTIONS.Right} ref={ref} />;
    case PRESET_BUTTON_TYPES.JUSTIFY_BOTH:
      return <JustificationButton {...props} justificationType={JUSTIFICATION_OPTIONS.Both} ref={ref} />;
    case PRESET_BUTTON_TYPES.OE_COLOR_PICKER:
      return <ColorPickerButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.INSERT_IMAGE:
      return <OfficeEditorInsertImageButton {...props} ref={ref} />;
    case PRESET_BUTTON_TYPES.COMPARE:
      return <MultiViewerWrapper><CompareButton {...props} ref={ref} /></MultiViewerWrapper>;
    case PRESET_BUTTON_TYPES.PAGE_BREAK:
      return <OfficeEditorPageBreakButton {...props} ref={ref} />;
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