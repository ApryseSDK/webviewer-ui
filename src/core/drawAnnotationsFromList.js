import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#drawAnnotationsFromList__anchor
 */
export default (annotations, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().drawAnnotationsFromList(annotations);
};
