import getHashParameters from 'helpers/getHashParameters';
import core from 'core';

export default () => {
  const documentViewer = core.getDocumentViewer();
  console.warn('Deprecated and will be removed in version 9.0');
  if (!window.bbAnnotManager) {
    const serverURL = getHashParameters('webviewerServerURL', '');
    window.bbAnnotManager = new window.Core.BlackBoxAnnotationManager(serverURL, documentViewer);
  }

  return window.bbAnnotManager;
};