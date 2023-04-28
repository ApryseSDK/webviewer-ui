import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#isApplyRedactionEnabled__anchor
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:isApplyRedactionEnabled__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().isApplyRedactionEnabled();
