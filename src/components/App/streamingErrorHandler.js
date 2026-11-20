/**
 * Subscribes to downloadError on the current document of each viewer, and re-subscribes
 * whenever a new document is loaded. Calls onError the first time a chunk fails per
 * viewer per document load, and onDocumentLoaded when no viewer has an active error.
 * Returns a cleanup function that removes all listeners.
 *
 * @param {Function} getDocumentViewers - Returns the array of active DocumentViewer instances.
 * @param {Function} onError - Called once per viewer when the first downloadError fires for its current document.
 * @param {Function} onDocumentLoaded - Clears the toast when no viewer has an active error.
 * @returns {Function} Cleanup function that removes all attached listeners.
 * @ignore
 */
export function subscribeToStreamingErrors(getDocumentViewers, onError, onDocumentLoaded) {
  const shownPerViewer = new WeakMap();
  const erroredViewers = new Set();
  const documentListeners = new Map();
  const documentViewers = getDocumentViewers();

  const detachFromDocument = (viewer) => {
    const entry = documentListeners.get(viewer);
    if (entry) {
      entry.document.removeEventListener('downloadError', entry.listener);
      documentListeners.delete(viewer);
    }
  };

  const attachToDocument = (viewer) => {
    detachFromDocument(viewer);
    const document = viewer.getDocument?.();
    if (!document) {
      return;
    }
    const listener = () => {
      if (!shownPerViewer.get(viewer)) {
        shownPerViewer.set(viewer, true);
        erroredViewers.add(viewer);
        onError();
      }
    };
    document.addEventListener('downloadError', listener);
    documentListeners.set(viewer, { document, listener });
  };

  const resetViewer = (viewer) => {
    shownPerViewer.delete(viewer);
    erroredViewers.delete(viewer);
    detachFromDocument(viewer);
    if (!erroredViewers.size) {
      onDocumentLoaded();
    }
  };

  const viewerListeners = documentViewers.map((viewer) => {
    const onLoad = () => {
      resetViewer(viewer);
      attachToDocument(viewer);
    };
    const onUnload = () => resetViewer(viewer);
    attachToDocument(viewer);
    viewer.addEventListener('documentLoaded', onLoad);
    viewer.addEventListener('documentUnloaded', onUnload);
    return { viewer, onLoad, onUnload };
  });

  return () => {
    viewerListeners.forEach(({ viewer, onLoad, onUnload }) => {
      viewer.removeEventListener('documentLoaded', onLoad);
      viewer.removeEventListener('documentUnloaded', onUnload);
      detachFromDocument(viewer);
    });
  };
}
