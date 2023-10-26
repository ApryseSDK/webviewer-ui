const documentViewerMap = new Map();

export const setDocumentViewer = (number, documentViewer) => {
  documentViewerMap.set(number, documentViewer);
  return documentViewer;
};

export const deleteDocumentViewer = (number) => {
  documentViewerMap.delete(number);
};

export const getDocumentViewer = (number = 1) => {
  return documentViewerMap.get(number);
};

export const getDocumentViewers = () => {
  return Array.from(documentViewerMap.values());
};