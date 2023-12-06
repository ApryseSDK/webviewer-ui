import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#enableRedaction__anchor
 */
export default (enable) => {
  if (enable) {
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().enableRedaction());
  } else {
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().disableRedaction());
  }
};
