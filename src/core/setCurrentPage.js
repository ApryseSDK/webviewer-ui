import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setCurrentPage__anchor
 * @fires pageNumberUpdated on DocumentViewer if set to a different page number
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:pageNumberUpdated__anchor
 */
export default (pageNumber, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).setCurrentPage(pageNumber);
