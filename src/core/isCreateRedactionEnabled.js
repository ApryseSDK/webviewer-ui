import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#isCreateRedactionEnabled__anchor
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:isCreateRedactionEnabled__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().isCreateRedactionEnabled();
