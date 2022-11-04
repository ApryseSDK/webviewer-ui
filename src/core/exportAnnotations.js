import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#exportAnnotations__anchor
 */
export default (options, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().exportAnnotations(options);
