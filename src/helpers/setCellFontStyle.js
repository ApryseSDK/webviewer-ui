import core from 'core';

function setCellFontStyle(font) {
  if (!font) {
    return;
  }

  if (font.color) {
    font.color = font.color.toHexString ? font.color.toHexString() : '';
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellsStyle({ font });
}

export default setCellFontStyle;