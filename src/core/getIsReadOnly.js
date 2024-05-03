import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getReadOnly__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().isReadOnlyModeEnabled();
