import getAnnotationManager from './getAnnotationManager';

export default (documentViewerKey = 1) => {
  const annotManager = getAnnotationManager(documentViewerKey);
  return annotManager.getFormFieldCreationManager();
};
