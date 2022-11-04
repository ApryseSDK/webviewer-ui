import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setActiveSearchResult__anchor
 */
export default (result, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setActiveSearchResult(result);
};
