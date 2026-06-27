import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#displayAdditionalSearchResults__anchor
 */
export default (results, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).displayAdditionalSearchResults(results);
};
