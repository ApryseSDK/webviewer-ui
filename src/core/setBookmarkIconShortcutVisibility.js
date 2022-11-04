import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkIconShortcutVisibility__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkIconShortcutVisibility__anchor
 */
export default (isEnabled, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setBookmarkIconShortcutVisibility(isEnabled);
};
