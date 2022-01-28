/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#isAnnotationRedactable__anchor
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:isAnnotationRedactable__anchor
 */
export default annotations => window.documentViewer.getAnnotationManager().isAnnotationRedactable(annotations);
