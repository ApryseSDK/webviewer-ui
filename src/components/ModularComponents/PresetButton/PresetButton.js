import React, { forwardRef, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { PRESET_BUTTON_TYPES, CELL_ADJUSTMENT_FLYOUT_ITEMS, CELL_FORMAT_BUTTONS, STYLE_TOGGLE_OPTIONS } from 'constants/customizationVariables';
import { JUSTIFICATION_OPTIONS } from 'constants/officeEditor';
import {
  CELL_ACTION_OPTIONS,
  checkIfArrayContains,
  CELL_ALIGNMENT_OPTIONS
} from 'src/constants/spreadsheetEditor';
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
import ToggleAccessibilityMode from './buttons/ToggleAccessibilityMode';
import OfficeEditorInsertImageButton from '../OfficeEditor/OfficeEditorInsertImageButton';
import IndentButton from './buttons/OfficeEditor/IndentButton';
import ColorPickerButton from './buttons/OfficeEditor/ColorPickerButton';
import NonPrintingCharactersToggleButton from './buttons/OfficeEditor/NonPrintingCharactersToggleButton';
import CompareButton from './buttons/Compare';
import NewSpreadsheetButton from './buttons/NewSpreadsheet';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import AlignmentButtonContainer from './buttons/AlignmentButtonContainer';
import './PresetButton.scss';
import './buttons/SheetEditor/SheetEditor.scss';
import StyleButtonContainer from './buttons/StyleButtonContainer';
// Lazy load sheet editor components
const VerticalAlignmentButton = lazy(() => import('./buttons/SheetEditor/VerticalAlignmentButton'));
const CellAdjustmentButton = lazy(() => import('./buttons/SheetEditor/CellAdjustmentButton'));
const MergeToggleButton = lazy(() => import('./buttons/SheetEditor/MergeToggleButton'));
const CellFormatButton = lazy(() => import('./buttons/SheetEditor/CellFormatButton'));
const CopyPasteCutButton = lazy(() => import('./buttons/SheetEditor/CopyPasteCutButton'));

const PresetButton = forwardRef((props, ref) => {
  const { buttonType } = props;

  return (
    <Suspense fallback={<></>}>
      {(() => {
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

          case PRESET_BUTTON_TYPES.ALIGN_TOP:
            return <VerticalAlignmentButton {...props} ref={ref} alignment={CELL_ALIGNMENT_OPTIONS.Top} />;
          case PRESET_BUTTON_TYPES.ALIGN_MIDDLE:
            return <VerticalAlignmentButton {...props} ref={ref} alignment={CELL_ALIGNMENT_OPTIONS.Middle} />;
          case PRESET_BUTTON_TYPES.ALIGN_BOTTOM:
            return <VerticalAlignmentButton {...props} ref={ref} alignment={CELL_ALIGNMENT_OPTIONS.Bottom} />;
          case PRESET_BUTTON_TYPES.CELL_MERGE_TOGGLE:
            return <MergeToggleButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.CONTENT_EDIT:
            return <ContentEditButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE:
            return <ToggleAccessibilityMode {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.INCREASE_INDENT:
            return <IndentButton {...props} ref={ref} isIncreaseIndent={true} />;
          case PRESET_BUTTON_TYPES.DECREASE_INDENT:
            return <IndentButton {...props} ref={ref} isIncreaseIndent={false} />;
          case PRESET_BUTTON_TYPES.OE_TOGGLE_NON_PRINTING_CHARACTERS:
            return <NonPrintingCharactersToggleButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.BOLD:
            return <StyleButtonContainer {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Bold} />;
          case PRESET_BUTTON_TYPES.ITALIC:
            return <StyleButtonContainer {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Italic} />;
          case PRESET_BUTTON_TYPES.UNDERLINE:
            return <StyleButtonContainer {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Underline} />;
          case PRESET_BUTTON_TYPES.STRIKEOUT:
            return <StyleButtonContainer {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Strikeout} />;
          case PRESET_BUTTON_TYPES.ALIGN_LEFT:
            return <AlignmentButtonContainer {...props} alignment={JUSTIFICATION_OPTIONS.Left} ref={ref} />;
          case PRESET_BUTTON_TYPES.ALIGN_CENTER:
            return <AlignmentButtonContainer {...props} alignment={JUSTIFICATION_OPTIONS.Center} ref={ref} />;
          case PRESET_BUTTON_TYPES.ALIGN_RIGHT:
            return <AlignmentButtonContainer {...props} alignment={JUSTIFICATION_OPTIONS.Right} ref={ref} />;
          case PRESET_BUTTON_TYPES.JUSTIFY_BOTH:
            return <AlignmentButtonContainer {...props} alignment={JUSTIFICATION_OPTIONS.Both} ref={ref} />;
          case PRESET_BUTTON_TYPES.OE_COLOR_PICKER:
            return <ColorPickerButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.INSERT_IMAGE:
            return <OfficeEditorInsertImageButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.COMPARE:
            return <MultiViewerWrapper><CompareButton {...props} ref={ref} /></MultiViewerWrapper>;
          case PRESET_BUTTON_TYPES.NEW_SPREADSHEET:
            return <NewSpreadsheetButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.CELL_COPY:
            return <CopyPasteCutButton {...props} ref={ref} actionType={CELL_ACTION_OPTIONS.Copy} />;
          case PRESET_BUTTON_TYPES.CELL_PASTE:
            return <CopyPasteCutButton {...props} ref={ref} actionType={CELL_ACTION_OPTIONS.Paste} />;
          case PRESET_BUTTON_TYPES.CELL_CUT:
            return <CopyPasteCutButton {...props} ref={ref} actionType={CELL_ACTION_OPTIONS.Cut} />;
          default:
            // Since switch uses strict comparison, here we should use if statement to check for matches
            if (checkIfArrayContains(CELL_ADJUSTMENT_FLYOUT_ITEMS, buttonType)) {
              return <CellAdjustmentButton {...props} ref={ref} />;
            } else if (checkIfArrayContains(CELL_FORMAT_BUTTONS.map((i) => i.label), buttonType)) {
              return <CellFormatButton {...props} ref={ref} formatType={buttonType} />;
            }

            console.warn(`${buttonType} is not a valid item type.`);
            return null;
        }
      })()}
    </Suspense>
  );
});

PresetButton.propTypes = {
  buttonType: PropTypes.string.isRequired
};
PresetButton.displayName = 'PresetButton';

export default PresetButton;