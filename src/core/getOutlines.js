import core from 'core';
import outlineUtils from 'src/helpers/OutlineUtils';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#getBookmarks__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getDocument().getBookmarks().then(async (outlines) => {
    if (core.isFullPDFEnabled()) {
      await outlineUtils.attachColorPropertyToOutlines(outlines);
    }

    callback(outlines);
  });
};
