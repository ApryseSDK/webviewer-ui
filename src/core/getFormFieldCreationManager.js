import getAnnotationManager from './getAnnotationManager';

export default (documentViewerKey) => {
  const annotManager = getAnnotationManager(documentViewerKey);
  return annotManager.getFormFieldCreationManager();
};
