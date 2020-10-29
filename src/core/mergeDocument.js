/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#mergeDocument__anchor
 */

export default async(documentToMerge, position) => {
  const { docViewer } = window;
  if (docViewer.getDocument()) {
    return docViewer.getDocument().mergeDocument(documentToMerge, position);
  } else {
    await docViewer.loadDocument(documentToMerge);
    const doc = docViewer.getDocument();
    return { filename: doc.getFilename(), pages: [1] };
  }
};
