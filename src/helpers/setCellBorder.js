import core from 'core';

function setCellBorder(border) {
  if (!border) {
    return;
  }

  if (border.style === 'None') {
    border.color = null;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellsStyle({
    border,
  });
}

export default setCellBorder;