import actions from 'actions';

export default (dispatch) => (event) => {

  const activeCellRange = event.getSelectionRangeDisplayValue();
  // Get cellRange returns the top-left and bottom-right cell of the current selection
  // Top left will be the cell containing the active cell a value or formula
  const [topLeft, bottomRight] = event.getBoundingCells();
  const { cellFormula, stringCellValue } = topLeft;
  const { rowIndex: topLeftRow, columnIndex: topLeftColumn, cellType  } = topLeft;
  // if bottomRight is undefined, then the selection is a single cell so we can repeat the topLeft values
  const { rowIndex: bottomRightRow, columnIndex: bottomRightColumn } = bottomRight ?? topLeft;

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
    }
  }));
};