/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getPageSearchResults__anchor
 */
export default function getPageSearchResults(pageNumber) {
  return window.documentViewer.getPageSearchResults(pageNumber);
}
