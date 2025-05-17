import core from 'core';

function setCellFontStyle(font) {
  if (!font) {
    return;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellRangeStyle({
    font,
  });
}

export default setCellFontStyle;