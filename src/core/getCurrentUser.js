import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getCurrentUser__anchor
 */
export default () => core.getDocumentViewer(1)?.getAnnotationManager()?.getCurrentUser();
