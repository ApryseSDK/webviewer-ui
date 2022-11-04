import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOffFunction__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOffFunction__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setBookmarkShortcutToggleOffFunction(callback);
};
