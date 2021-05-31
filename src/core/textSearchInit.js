/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#textSearchInit__anchor
 */
export default (searchValue, searchMode, isFullSearch, handleSearchResult) => {
  window.documentViewer.textSearchInit(searchValue, searchMode, isFullSearch, handleSearchResult);
};
