import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageCount__anchor
 */
export default (documentViewerKey = 1) => {
  const document = core.getDocument(documentViewerKey);
  const isSpreadsheetEditorMode = document?.getType() === 'spreadsheetEditor';
  if (isSpreadsheetEditorMode) {
    const workbook = document.getSpreadsheetEditorDocument?.()?.getWorkbook?.();
    if (!workbook) {
      return 0;
    }
    return workbook.sheetCount;
  }
  return core.getDocumentViewer(documentViewerKey).getPageCount();
};