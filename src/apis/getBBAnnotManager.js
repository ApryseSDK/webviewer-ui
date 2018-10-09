export default store => () => {
  if (!window.bbAnnotManager) {
    const serverURL = store.getState().advanced.pdftronServer;
    window.bbAnnotManager = new window.CoreControls.BlackBoxAnnotationManager(serverURL, window.docViewer);
  }

  return window.bbAnnotManager;
};
