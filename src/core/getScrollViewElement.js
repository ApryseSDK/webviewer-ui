import core from 'core';

/**
 * Return the scroll view element set when document is loaded
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getScrollViewElement();
