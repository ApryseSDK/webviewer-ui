import core from 'core';

export default (e, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationByMouseEvent(e);
