/**
 * Annotations may set the author to a unique id which isn't suitable for display in the UI.
 * this function gets the author name of the annotation that should be displayed based on a unique userID/GUID.
 */
export default userId => window.documentViewer.getAnnotationManager().getDisplayAuthor(userId);
