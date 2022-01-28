/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#enableRedaction__anchor
 */
export default enable => {
  if (enable) {
    window.documentViewer.getAnnotationManager().enableRedaction();
  } else {
    window.documentViewer.getAnnotationManager().disableRedaction();
  }
};
