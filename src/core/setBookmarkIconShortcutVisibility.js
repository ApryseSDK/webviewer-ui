import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setBookmarkIconShortcutVisibility__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#setBookmarkIconShortcutVisibility__anchor
 */
export default (isEnabled, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setBookmarkIconShortcutVisibility(isEnabled);
};
