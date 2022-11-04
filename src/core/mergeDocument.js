import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.Document.html#mergeDocument__anchor
 */

export default async (documentToMerge, position, documentViewerKey = 1) => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  if (documentViewer.getDocument()) {
    return documentViewer.getDocument().mergeDocument(documentToMerge, position);
  }

  await documentViewer.loadDocument(documentToMerge);
  const doc = documentViewer.getDocument();
  return { filename: doc.getFilename(), pages: [1] };
};
