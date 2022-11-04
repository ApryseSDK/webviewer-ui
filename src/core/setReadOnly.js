import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#enableReadOnlyMode__anchor
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#disableReadOnlyMode__anchor
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#enableReadOnlyMode__anchor
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#disableReadOnlyMode__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @fires readyOnlyModeChanged on DocumentViewer
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:readOnlyModeChanged__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:readOnlyModeChanged__anchor
 */
export default (isReadOnly) => {
  for (const documentViewer of core.getDocumentViewers()) {
    if (isReadOnly) {
      documentViewer.getAnnotationManager().enableReadOnlyMode();
      documentViewer.enableReadOnlyMode();
    } else {
      documentViewer.getAnnotationManager().disableReadOnlyMode();
      documentViewer.disableReadOnlyMode();
    }
  }
};
