import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#enableRedaction__anchor
 */
export default (enable) => {
  if (enable) {
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().enableRedaction());
  } else {
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().disableRedaction());
  }
};
