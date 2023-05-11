import core from 'core';

export default (documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationHistoryManager().redo();
};
