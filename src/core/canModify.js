/**
 * Whether or not the current user can modify the annotation.
 */
export default annotation => window.docViewer.getAnnotationManager().canModify(annotation); 
