/**
 * Gets a promise that resolves when the annotations in the current document have all been loaded
 */
export default () => window.docViewer.getAnnotationsLoadedPromise();
