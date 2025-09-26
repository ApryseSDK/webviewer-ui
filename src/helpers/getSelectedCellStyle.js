import core from 'core';

function getSelectedCellStyle() {
  if (!core.getDocumentViewer()) {
    return;
  }
  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const selectedCells = spreadsheetEditorManager.getSelectedCells();
  if (selectedCells.length === 0) {
    return null;
  }

  const style = selectedCells[0].getStyle();
  return style;
}

export default getSelectedCellStyle;