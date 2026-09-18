import actions from 'actions';
import {
  verticalAlignmentLabels,
  horizontalAlignmentLabels,
  wrapTextLabels,
} from 'constants/spreadsheetEditor';
import { defaultCellStyle, defaultTextColor } from 'src/helpers/initialColorStates';
import getFormatTypeFromFormatString from 'src/helpers/getFormatTypeFromFormatString';
import core from 'core';

export default (dispatch) => (event) => {
  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const spreadsheetEditorHistoryManager = spreadsheetEditorManager.getSpreadsheetEditorHistoryManager();
  const activeCellRange = event.getSelectionRangeDisplayValue();
  const clipboard = event.getClipboard();

  const [topLeft, bottomRight] = event.getBoundingCells();
  const { cellFormula, stringCellValue, cellType } = topLeft;

  const cellRange = event.getCellRange();
  const topLeftRow = cellRange['firstRow'];
  const topLeftColumn = cellRange['firstColumn'];
  const bottomRightRow = cellRange['lastRow'];
  const bottomRightColumn = cellRange['lastColumn'];
  const cellStyle = topLeft.getStyle() || defaultCellStyle;

  const isSingleCell = !bottomRight;
  const isCellRangeMerged = event.isMerged();
  const rawVerticalAlignment = cellStyle?.verticalAlignment;
  const rawHorizontalAlignment = cellStyle?.horizontalAlignment;
  const rawWrapText = cellStyle?.wrapText;
  const rawFont = cellStyle?.font || {};
  const formatString = topLeft.getStyle()?.getDataFormatString();
  const backgroundColor = cellStyle?.backgroundColor;
  const border = {
    top: cellStyle?.getCellBorder('Top'),
    left: cellStyle?.getCellBorder('Left'),
    bottom: cellStyle?.getCellBorder('Bottom'),
    right: cellStyle?.getCellBorder('Right'),
  };

  const canCopy = clipboard.canCopy();
  const canPaste = clipboard.canPaste();
  const canCut = clipboard.canCut();

  const verticalAlignment = verticalAlignmentLabels[rawVerticalAlignment];
  const horizontalAlignment = horizontalAlignmentLabels[rawHorizontalAlignment];
  const wrapText = wrapTextLabels[rawWrapText];
  const font = {
    fontFace: rawFont.fontFace,
    pointSize: rawFont.pointSize,
    bold: rawFont.bold,
    italic: rawFont.italic,
    underline: rawFont.underline,
    strikeout: rawFont.strikeout,
    color: rawFont.color === 'black' ? defaultTextColor : rawFont.color
  };

  const formatType = getFormatTypeFromFormatString(formatString);
  const canUndo = spreadsheetEditorHistoryManager.canUndo();
  const canRedo = spreadsheetEditorHistoryManager.canRedo();

  dispatch(actions.setActiveCellRange({
    activeCellRange,
    cellProperties: {
      cellType,
      cellFormula,
      stringCellValue,
      topLeftRow,
      topLeftColumn,
      bottomRightRow,
      bottomRightColumn,
      isSingleCell,
      canCopy,
      canPaste,
      canCut,
      styles: {
        verticalAlignment,
        horizontalAlignment,
        wrapText,
        font,
        formatType,
        isCellRangeMerged,
        backgroundColor,
        border,
      },
    }
  }));
  dispatch(actions.setSpreadsheetEditorCanUndo(canUndo));
  dispatch(actions.setSpreadsheetEditorCanRedo(canRedo));
};