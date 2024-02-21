import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#displayAdditionalSearchResult__anchor
 */
export default (result, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).displayAdditionalSearchResult(result);
};
