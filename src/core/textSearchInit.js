import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#textSearchInit__anchor
 */
export default (searchValue, searchMode, isFullSearch, handleSearchResult, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).textSearchInit(searchValue, searchMode, isFullSearch, handleSearchResult);
};
