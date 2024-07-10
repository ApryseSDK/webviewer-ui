import core from 'core';

export default (annotations, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().ungroupAnnotations(annotations);
