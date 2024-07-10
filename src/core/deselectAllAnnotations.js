import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#deselectAllAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 */
export default () => {
  core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().deselectAllAnnotations());
};
