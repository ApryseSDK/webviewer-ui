import getHashParams from 'helpers/getHashParams';

export default () => {
  console.warn('Deprecated and will be removed in version 9.0');
  if (!window.bbAnnotManager) {
    const serverURL = getHashParams('webviewerServerURL', '');
    window.bbAnnotManager = new window.Core.BlackBoxAnnotationManager(serverURL, window.documentViewer);
  }

  return window.bbAnnotManager;
};