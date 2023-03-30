import core from 'core';

/**
 * Gets a promise that resolves when the annotations in the current document have all been loaded
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationsLoadedPromise();
