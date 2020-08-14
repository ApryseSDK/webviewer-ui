/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#getPageSearchResults__anchor
 */
export default function getPageSearchResults(pageNumber) {
  return window.docViewer.getPageSearchResults(pageNumber);
}
