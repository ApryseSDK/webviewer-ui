import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#loadBlankSpreadsheet
 */
export default (options, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).loadBlankSpreadsheet(options);
