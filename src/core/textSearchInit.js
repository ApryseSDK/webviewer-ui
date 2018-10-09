/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#textSearchInit__anchor
 */
export default (searchValue, searchMode, isFullSearch, handleSearchResult) =>  {
  window.docViewer.textSearchInit(searchValue, searchMode, isFullSearch, handleSearchResult);
};
