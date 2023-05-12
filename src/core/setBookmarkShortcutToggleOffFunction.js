import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOffFunction__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOffFunction__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setBookmarkShortcutToggleOffFunction(callback);
};
