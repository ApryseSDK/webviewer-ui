import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#isCreateRedactionEnabled__anchor
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#isCreateRedactionEnabled__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().isCreateRedactionEnabled();
