import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getSelectedText__anchor
 */
export default (documentViewerKey) => {
  return core.getDocumentViewer(documentViewerKey).getSelectedText();
};
