import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#displayAdditionalSearchResults__anchor
 */
export default (results, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).displayAdditionalSearchResults(results);
};
