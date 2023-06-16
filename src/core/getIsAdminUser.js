import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getIsAdminUser__anchor
 */
export default () => core.getDocumentViewer(1).getAnnotationManager().isUserAdmin();
