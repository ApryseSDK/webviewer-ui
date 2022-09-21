import core from 'core';

export default (annotations, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getNumberOfGroups(annotations);
