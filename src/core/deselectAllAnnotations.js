import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#deselectAllAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 */
export default () => {
  core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().deselectAllAnnotations());
};
