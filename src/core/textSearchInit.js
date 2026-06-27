import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#textSearchInit__anchor
 */
export default (searchValue, searchMode, isFullSearch, handleSearchResult, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).textSearchInit(searchValue, searchMode, isFullSearch, handleSearchResult);
};
