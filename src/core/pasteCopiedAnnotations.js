import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#pasteCopiedAnnotations__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 * AnnotationSelected will be fired at most twice:
 * it will be fired with deselect action if you selected any annotations before paste
 * it will be fired with select action after the annotation is pasted
 */
export default (documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().pasteCopiedAnnotations();
};
