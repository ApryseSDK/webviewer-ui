import core from 'core';

function setCellBackgroundColor(backgroundColor) {
  const hexColor = backgroundColor?.toHexString?.() || '';

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellsStyle({
    backgroundColor: hexColor,
  });
}

export default setCellBackgroundColor;