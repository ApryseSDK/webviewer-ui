import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#getIsAdminUser__anchor
 */
export default () => core.getDocumentViewer(1).getAnnotationManager().isUserAdmin();
