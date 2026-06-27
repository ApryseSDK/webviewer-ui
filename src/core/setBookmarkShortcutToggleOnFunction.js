import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOnFunction__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOnFunction__anchor
 */
export default (callback, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).setBookmarkShortcutToggleOnFunction(callback);
};
