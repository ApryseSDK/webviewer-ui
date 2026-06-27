import core from 'core';

/**
 * Return the viewer element. It is the div with class name "document" in DocumentContainer.js
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getViewerElement();
