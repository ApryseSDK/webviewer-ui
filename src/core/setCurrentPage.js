/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#setCurrentPage__anchor
 * @fires pageNumberUpdated on DocumentViewer if set to a different page number
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:pageNumberUpdated__anchor
 * @fires changePage on DocumentViewer if using a non-scrollable custom display mode
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:changePage__anchor
 */
export default pageNumber => {
  window.docViewer.setCurrentPage(pageNumber);
};
