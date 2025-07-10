import core from 'core';

function mergeCellRange(merge) {
  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellsStyle({
    merge,
  });
}

export default mergeCellRange;