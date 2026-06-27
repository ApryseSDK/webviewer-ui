import core from 'core';

/**
 * Gets a promise that resolves when the annotations in the current document have all been loaded
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationsLoadedPromise();
