import { subscribeToStreamingErrors } from './streamingErrorHandler';

// Minimal event emitter used for both document and viewer stubs.
const makeEmitter = () => {
  const listeners = {};
  return {
    addEventListener: (event, fn) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    removeEventListener: (event, fn) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((l) => l !== fn);
      }
    },
    emit: (event) => {
      (listeners[event] || []).slice().forEach((fn) => fn());
    },
    listenerCount: (event) => (listeners[event] || []).length,
  };
};

// A viewer stub that holds a current document and can swap it on documentLoaded.
const makeViewer = (initialDocument = null) => {
  const viewer = makeEmitter();
  let currentDocument = initialDocument;
  viewer.getDocument = () => currentDocument;
  viewer.setDocument = (doc) => {
    currentDocument = doc;
    viewer.emit('documentLoaded');
  };
  return viewer;
};

describe('subscribeToStreamingErrors', () => {
  it('should call onError when downloadError fires on the current document', () => {
    const doc = makeEmitter();
    const viewer = makeViewer(doc);
    const onError = jest.fn();

    subscribeToStreamingErrors(() => [viewer], onError, jest.fn());
    doc.emit('downloadError');

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('should only call onError once per document load regardless of how many chunks fail', () => {
    const doc = makeEmitter();
    const viewer = makeViewer(doc);
    const onError = jest.fn();

    subscribeToStreamingErrors(() => [viewer], onError, jest.fn());
    doc.emit('downloadError');
    doc.emit('downloadError');
    doc.emit('downloadError');

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('should reset the shown-once guard and re-subscribe when a new document loads', () => {
    const doc1 = makeEmitter();
    const doc2 = makeEmitter();
    const viewer = makeViewer(doc1);
    const onError = jest.fn();
    const onDocumentLoaded = jest.fn();

    subscribeToStreamingErrors(() => [viewer], onError, onDocumentLoaded);

    doc1.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(1);

    // Swap to a new document — simulates loading a second PDF.
    viewer.setDocument(doc2);
    expect(onDocumentLoaded).toHaveBeenCalledTimes(1);

    // The new document can now trigger onError again.
    doc2.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(2);

    // The old document's listener was removed — no longer triggers onError.
    doc1.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(2);
  });

  it('should call onDocumentLoaded when documentLoaded fires on the viewer', () => {
    const viewer = makeViewer(makeEmitter());
    const onDocumentLoaded = jest.fn();

    subscribeToStreamingErrors(() => [viewer], jest.fn(), onDocumentLoaded);
    viewer.setDocument(makeEmitter());

    expect(onDocumentLoaded).toHaveBeenCalledTimes(1);
  });

  it('should remove all listeners when the returned cleanup is called', () => {
    const doc = makeEmitter();
    const viewer = makeViewer(doc);
    const onError = jest.fn();

    const cleanup = subscribeToStreamingErrors(() => [viewer], onError, jest.fn());
    cleanup();

    doc.emit('downloadError');
    expect(onError).not.toHaveBeenCalled();
    expect(doc.listenerCount('downloadError')).toBe(0);
    expect(viewer.listenerCount('documentLoaded')).toBe(0);
    expect(viewer.listenerCount('documentUnloaded')).toBe(0);
  });

  it('should handle viewers with no document loaded yet', () => {
    const viewer = makeViewer(null); // no document yet
    const onError = jest.fn();

    // Should not throw when getDocument() returns null.
    expect(() => subscribeToStreamingErrors(() => [viewer], onError, jest.fn())).not.toThrow();

    // Once a document loads, the error listener attaches correctly.
    const doc = makeEmitter();
    viewer.setDocument(doc);
    doc.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('should call onError independently for each viewer', () => {
    const doc1 = makeEmitter();
    const doc2 = makeEmitter();
    const viewer1 = makeViewer(doc1);
    const viewer2 = makeViewer(doc2);
    const onError = jest.fn();

    subscribeToStreamingErrors(() => [viewer1, viewer2], onError, jest.fn());

    // Each viewer's first error triggers onError once.
    doc1.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(1);

    doc2.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(2);
  });

  it('should not clear viewer A error when viewer B loads a new document', () => {
    const doc1 = makeEmitter();
    const doc2 = makeEmitter();
    const viewer1 = makeViewer(doc1);
    const viewer2 = makeViewer(doc2);
    const onError = jest.fn();

    const clearToast = jest.fn();
    subscribeToStreamingErrors(() => [viewer1, viewer2], onError, clearToast);

    // Viewer1 has a streaming error.
    doc1.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(1);

    // Viewer2 loads a new doc — should NOT reset viewer1's guard.
    viewer2.setDocument(makeEmitter());
    expect(clearToast).not.toHaveBeenCalled();

    // Viewer1's doc fires another error — still suppressed (guard is per-viewer).
    doc1.emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(1);

    // Viewer1 loads a new doc — resets its own guard.
    viewer1.setDocument(makeEmitter());
    expect(clearToast).toHaveBeenCalledTimes(1);
    viewer1.getDocument().emit('downloadError');
    expect(onError).toHaveBeenCalledTimes(2);
  });
});
