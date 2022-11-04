import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOnFunction__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkShortcutToggleOnFunction__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setBookmarkShortcutToggleOnFunction(callback);
};
