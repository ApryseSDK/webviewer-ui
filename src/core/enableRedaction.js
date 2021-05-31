/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#enableRedaction__anchor
 */
export default enable => {
  window.documentViewer.getAnnotationManager().enableRedaction(enable);
};
