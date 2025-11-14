import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageCount__anchor
 */
export default (documentViewerKey = 1) => {
  const document = core.getDocument();
  const isSpreadsheetEditorMode = document?.getType() === 'spreadsheetEditor';
  return isSpreadsheetEditorMode ? document.getSpreadsheetEditorDocument().getWorkbook()?.sheetCount : core.getDocumentViewer(documentViewerKey).getPageCount();
};