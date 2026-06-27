import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#insertblankpages
 */
export default (insertBeforeThesePages, width, height, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getDocument().insertBlankPages(insertBeforeThesePages, width, height);
