import core from 'core';

export default (documentViewerKey) => {
  if (!documentViewerKey) {
    return core.getDocumentViewer(1);
  }

  return core.getDocumentViewer(documentViewerKey);
};