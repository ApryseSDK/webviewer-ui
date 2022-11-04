import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#drawAnnotationsFromList__anchor
 */
export default (annotations, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().drawAnnotationsFromList(annotations);
};
