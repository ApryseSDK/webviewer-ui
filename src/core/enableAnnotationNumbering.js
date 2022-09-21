import getAnnotationManager from './getAnnotationManager';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#enableAnnotationNumbering__anchor
 */
export default (documentViewerKey = 1) => {
  getAnnotationManager(documentViewerKey).enableAnnotationNumbering();
};