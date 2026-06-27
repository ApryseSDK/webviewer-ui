import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageCount__anchor
 */
export default (documentViewerKey) => {
  const document = core.getDocument(documentViewerKey);
  const isSpreadsheetEditorMode = document?.getType() === 'spreadsheetEditor';
  if (isSpreadsheetEditorMode) {
    const workbook = core.getDocumentViewer(documentViewerKey).getSpreadsheetEditorManager()?.getWorkbook();
    if (!workbook) {
      return 0;
    }
    return workbook.sheetCount;
  }
  return core.getDocumentViewer(documentViewerKey).getPageCount();
};