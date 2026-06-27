import core from 'core';

export default (isReadOnly) => {
  for (const documentViewer of core.getDocumentViewers()) {
    const annotationManager = documentViewer.getAnnotationManager();
    if (isReadOnly) {
      annotationManager.enableReadOnlyMode();
    } else {
      annotationManager.disableReadOnlyMode();
    }
  }
};
