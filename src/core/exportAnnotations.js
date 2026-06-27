import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#exportAnnotations__anchor
 */
export default (options, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().exportAnnotations(options);
