import core from 'core';

/**
 * Return the viewer element. It is the div with class name "document" in DocumentContainer.js
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getViewerElement();
