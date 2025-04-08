import core from 'core';

const reverseVerticalAlignmentMap = {
  1: 'top',
  2: 'middle',
  3: 'bottom',
};

const reverseHorizontalAlignmentMap = {
  1: 'left',
  2: 'center',
  3: 'right',
};

export default () => {
  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const cells = spreadsheetEditorManager.getCellsFromSelectedCellRange();
  if (cells.length === 0) {
    return {
      verticalAlignment: undefined,
      horizontalAlignment: undefined,
    };
  }

  const currentVerticalAlignmentNumber = cells[0].getStyle()?.verticalAlignment;
  const currentHorizontalAlignmentNumber = cells[0].getStyle()?.horizontalAlignment;

  return {
    verticalAlignment: reverseVerticalAlignmentMap[currentVerticalAlignmentNumber],
    horizontalAlignment: reverseHorizontalAlignmentMap[currentHorizontalAlignmentNumber],
  };
};