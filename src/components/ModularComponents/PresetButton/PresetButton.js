import React, { forwardRef, lazy, Suspense  } from 'react';
import PropTypes from 'prop-types';
import { PRESET_BUTTON_TYPES, CELL_ADJUSTMENT_BUTTONS, CELL_FORMAT_BUTTONS } from 'constants/customizationVariables';
import { JUSTIFICATION_OPTIONS, STYLE_TOGGLE_OPTIONS } from 'constants/officeEditor';
import {
  CELL_FORMAT_OPTIONS,
  CELL_ACTION_OPTIONS,
  CELL_COLOR_OPTIONS,
  checkIfArrayContains
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
import FontStyleToggleButton from './buttons/OfficeEditor/FontStyleToggleButton';
import ColorPickerButton from './buttons/OfficeEditor/ColorPickerButton';
import AlignmentButton from './buttons/OfficeEditor/AlignmentButton';
import NonPrintingCharactersToggleButton from './buttons/OfficeEditor/NonPrintingCharactersToggleButton';
import CompareButton from './buttons/Compare';
import NewSpreadsheetButton from './buttons/NewSpreadsheet';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import './PresetButton.scss';
import './buttons/SheetEditor/SheetEditor.scss';

// Lazy load sheet editor components
const TextAlignmentButton = lazy(() => import('./buttons/SheetEditor/TextAlignmentButton'));
const CellAdjustmentButton = lazy(() => import('./buttons/SheetEditor/CellAdjustmentButton'));
const MergeToggleButton = lazy(() => import('./buttons/SheetEditor/MergeToggleButton'));
const CellFormatButton = lazy(() => import('./buttons/SheetEditor/CellFormatButton'));
const CopyPasteCutButton = lazy(() => import('./buttons/SheetEditor/CopyPasteCutButton'));
const BorderStyleButton = lazy(() => import('./buttons/SheetEditor/BorderStyleButton'));
const CellDecoratorButton = lazy(() => import('./buttons/SheetEditor/CellDecoratorButton'));
const SheetColorPickerButton = lazy(() => import('./buttons/SheetEditor/ColorPickerButton'));


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
            return <FontStyleToggleButton {...props} styleType={STYLE_TOGGLE_OPTIONS.Bold} ref={ref} />;
          case PRESET_BUTTON_TYPES.ITALIC:
            return <FontStyleToggleButton {...props} styleType={STYLE_TOGGLE_OPTIONS.Italic} ref={ref} />;
          case PRESET_BUTTON_TYPES.UNDERLINE:
            return <FontStyleToggleButton {...props} styleType={STYLE_TOGGLE_OPTIONS.Underline} ref={ref} />;
          case PRESET_BUTTON_TYPES.ALIGN_LEFT:
            return <AlignmentButton {...props} alignmentType={JUSTIFICATION_OPTIONS.Left} ref={ref} />;
          case PRESET_BUTTON_TYPES.ALIGN_CENTER:
            return <AlignmentButton {...props} alignmentType={JUSTIFICATION_OPTIONS.Center} ref={ref} />;
          case PRESET_BUTTON_TYPES.ALIGN_RIGHT:
            return <AlignmentButton {...props} alignmentType={JUSTIFICATION_OPTIONS.Right} ref={ref} />;
          case PRESET_BUTTON_TYPES.JUSTIFY_BOTH:
            return <AlignmentButton {...props} alignmentType={JUSTIFICATION_OPTIONS.Both} ref={ref} />;
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

          case PRESET_BUTTON_TYPES.CELL_DECORATOR_BOLD:
            return <CellDecoratorButton {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Bold} />;
          case PRESET_BUTTON_TYPES.CELL_DECORATOR_ITALIC:
            return <CellDecoratorButton {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Italic} />;
          case PRESET_BUTTON_TYPES.CELL_DECORATOR_UNDERLINE:
            return <CellDecoratorButton {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Underline} />;
          case PRESET_BUTTON_TYPES.CELL_DECORATOR_STRIKETHROUGH:
            return <CellDecoratorButton {...props} ref={ref} styleType={STYLE_TOGGLE_OPTIONS.Strikethrough} />;

          case PRESET_BUTTON_TYPES.CELL_TEXT_COLOR:
            return <SheetColorPickerButton {...props} ref={ref} type={CELL_COLOR_OPTIONS.TextColor} />;
          case PRESET_BUTTON_TYPES.CELL_BACKGROUND_COLOR:
            return <SheetColorPickerButton {...props} ref={ref} type={CELL_COLOR_OPTIONS.BackgroundColor} />;
          case PRESET_BUTTON_TYPES.CELL_TEXT_ALIGNMENT:
            return <TextAlignmentButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.CELL_ALIGN_LEFT:
            return <TextAlignmentButton {...props} ref={ref} alignment={PRESET_BUTTON_TYPES.ALIGN_LEFT} />;
          case PRESET_BUTTON_TYPES.CELL_ALIGN_CENTER:
            return <TextAlignmentButton {...props} ref={ref} alignment={PRESET_BUTTON_TYPES.ALIGN_CENTER} />;
          case PRESET_BUTTON_TYPES.CELL_ALIGN_RIGHT:
            return <TextAlignmentButton {...props} ref={ref} alignment={PRESET_BUTTON_TYPES.ALIGN_RIGHT} />;
          case PRESET_BUTTON_TYPES.ALIGN_TOP:
            return <TextAlignmentButton {...props} ref={ref} alignment={PRESET_BUTTON_TYPES.ALIGN_TOP} alignmentValue='top' />;
          case PRESET_BUTTON_TYPES.ALIGN_MIDDLE:
            return <TextAlignmentButton {...props} ref={ref} alignment={PRESET_BUTTON_TYPES.ALIGN_MIDDLE} alignmentValue='middle' />;
          case PRESET_BUTTON_TYPES.ALIGN_BOTTOM:
            return <TextAlignmentButton {...props} ref={ref} alignment={PRESET_BUTTON_TYPES.ALIGN_BOTTOM} alignmentValue='bottom' />;
          case PRESET_BUTTON_TYPES.CELL_ADJUSTMENT:
            return <CellAdjustmentButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.CELL_BORDER_STYLE:
            return <BorderStyleButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.CELL_MERGE_TOGGLE:
            return <MergeToggleButton {...props} ref={ref} />;
          case PRESET_BUTTON_TYPES.CELL_FORMAT_MORE:
            return <CellFormatButton {...props} ref={ref} formatType={CELL_FORMAT_OPTIONS.More} />;
          default:

            // Since switch uses strict comparison, here we should use if statement to check for matches
            if (checkIfArrayContains(CELL_ADJUSTMENT_BUTTONS, buttonType, 'adjustment')) {
              return <CellAdjustmentButton {...props} ref={ref} />;
            } else if (checkIfArrayContains(CELL_FORMAT_BUTTONS.map((i) => i.label), buttonType, 'format')) {
              return <CellFormatButton {...props} ref={ref} formatType={buttonType}/>;
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