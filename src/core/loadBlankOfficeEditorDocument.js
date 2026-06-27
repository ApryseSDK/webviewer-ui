import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#loadBlankOfficeEditorDocument
 */
export default (options, documentViewerKey) => core.getDocumentViewer(documentViewerKey).loadBlankOfficeEditorDocument(options);
