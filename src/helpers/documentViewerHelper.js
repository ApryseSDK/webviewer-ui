import setupDocViewer from 'helpers/setupDocViewer';
import setDefaultToolStyles from 'helpers/setDefaultToolStyles';
import core from 'core';

export const addDocumentViewer = (number) => {
  const documentViewer = new window.Core.DocumentViewer();
  documentViewer.enableAnnotations();
  documentViewer.setFitMode(documentViewer.FitMode.FitPage);
  setupDocViewer(documentViewer);
  setDefaultToolStyles(documentViewer);
  core.setDocumentViewer(number, documentViewer);
  return documentViewer;
};

export const removeDocumentViewer = (number) => {
  const documentViewer = core.getDocumentViewer(number);
  documentViewer.closeDocument();
  core.deleteDocumentViewer(number);
};

export const syncDocumentViewers = (primarydocumentViewerKey, secondarydocumentViewerKey) => {
  const documentViewer = core.getDocumentViewer(primarydocumentViewerKey);
  const documentViewer2 = core.getDocumentViewer(secondarydocumentViewerKey);
  documentViewer2.setToolMode(documentViewer2.getTool(documentViewer.getToolMode().name));
  const annotationManager = documentViewer.getAnnotationManager();
  const annotationManager2 = documentViewer2.getAnnotationManager();
  annotationManager2.setCurrentUser(annotationManager.getCurrentUser());
  if (annotationManager.isUserAdmin()) {
    annotationManager2.promoteUserToAdmin();
  } else {
    annotationManager2.demoteUserFromAdmin();
  }
};
