import core from 'core';

/**
 * Return the scroll view element set when document is loaded
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getScrollViewElement();
