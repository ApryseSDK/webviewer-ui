/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkIconShortcutVisibility__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#setBookmarkIconShortcutVisibility__anchor
 */
export default (isEnabled) => {
  window.documentViewer.setBookmarkIconShortcutVisibility(isEnabled);
};
