import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#getCurrentUser__anchor
 */
export default () => core.getDocumentViewer(1).getAnnotationManager().getCurrentUser();
