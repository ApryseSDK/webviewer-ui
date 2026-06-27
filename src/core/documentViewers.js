const documentViewerMap = new Map();

// Tracks the active instance in WC mode the user last interacted with.
let multiInstanceActiveKey = null;

// Mirror of `state.viewer.isMultiViewerMode` for non-React core wrappers.
let multiViewerModeActive = false;

export const setMultiInstanceActiveKey = (key) => {
  multiInstanceActiveKey = key;
};

export const getMultiInstanceActiveKey = () => multiInstanceActiveKey;

export const setMultiViewerModeActive = (active) => {
  multiViewerModeActive = !!active;
  if (multiViewerModeActive) {
    multiInstanceActiveKey = null;
  }
};

export const getMultiViewerModeActive = () => multiViewerModeActive;

export const setDocumentViewer = (number, documentViewer) => {
  documentViewerMap.set(number, documentViewer);
  return documentViewer;
};

export const deleteDocumentViewer = (number) => {
  documentViewerMap.delete(number);
  if (multiInstanceActiveKey === number) {
    multiInstanceActiveKey = null;
  }
};

// Deep, callable no-op returned during teardown when a DocumentViewer has already been removed.
const NULL_VIEWER_TARGET = function nullViewerTarget() { /* unreachable: see Proxy `apply` trap */ };
const NULL_VIEWER = new Proxy(NULL_VIEWER_TARGET, {
  get(_target, prop) {
    if (prop === 'then' || prop === Symbol.iterator) {
      return undefined;
    }
    if (prop === Symbol.toPrimitive) {
      return () => '';
    }
    if (prop === 'toString' || prop === 'valueOf') {
      return () => '';
    }
    if (prop === Symbol.toStringTag) {
      return 'NullDocumentViewer';
    }
    if (prop === 'name' || prop === 'displayName') {
      return '';
    }
    return NULL_VIEWER;
  },
  apply() {
    return NULL_VIEWER;
  },
});

export const hasDocumentViewer = (number) => {
  const key = number ?? multiInstanceActiveKey ?? 1;
  return documentViewerMap.has(key);
};

export const getDocumentViewer = (number) => {
  const key = number ?? multiInstanceActiveKey ?? 1;
  const viewer = documentViewerMap.get(key);
  if (viewer) {
    return viewer;
  }
  return NULL_VIEWER;
};

export const getDocumentViewers = () => {
  return Array.from(documentViewerMap.values());
};