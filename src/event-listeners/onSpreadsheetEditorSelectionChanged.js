import actions from 'actions';
import {
  verticalAlignmentLabels,
  horizontalAlignmentLabels,
  getFormatTypeFromFormatString,
} from 'constants/spreadsheetEditor';

export default (dispatch) => (event) => {

  const activeCellRange = event.getSelectionRangeDisplayValue();
  // Get cellRange returns the top-left and bottom-right cell of the current selection
  // Top left will be the cell containing the active cell a value or formula
  const [topLeft, bottomRight] = event.getBoundingCells();
  const { cellFormula, stringCellValue } = topLeft;
  const { rowIndex: topLeftRow, columnIndex: topLeftColumn, cellType  } = topLeft;
  // if bottomRight is undefined, then the selection is a single cell so we can repeat the topLeft values
  const { rowIndex: bottomRightRow, columnIndex: bottomRightColumn } = bottomRight ?? topLeft;
  const cellStyle = topLeft.getStyle();

  const rawVerticalAlignment = cellStyle?.verticalAlignment;
  const rawHorizontalAlignment = cellStyle?.horizontalAlignment;
  const rawFont = cellStyle?.font || {};
  const formatString = topLeft.getStyle()?.getDataFormatString();

  const verticalAlignment = verticalAlignmentLabels[rawVerticalAlignment];
  const horizontalAlignment = horizontalAlignmentLabels[rawHorizontalAlignment];
  const bold = rawFont.bold;
  const italic = rawFont.italic;
  const underline = rawFont.underline;
  const strikeout = rawFont.strikeout;
  const formatType = getFormatTypeFromFormatString(formatString);

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
      styles: {
        verticalAlignment,
        horizontalAlignment,
        font: {
          bold,
          italic,
          underline,
          strikeout,
        },
        formatType,
      },
    }
  }));
};