import getHashParams from 'helpers/getHashParams';

export default () => {
  if (!window.bbAnnotManager) {
    const serverURL = getHashParams('pdftronServer', '');
    window.bbAnnotManager = new window.CoreControls.BlackBoxAnnotationManager(serverURL, window.docViewer);
  }

  return window.bbAnnotManager;
};