import core from 'core';

export default (e, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationByMouseEvent(e);
