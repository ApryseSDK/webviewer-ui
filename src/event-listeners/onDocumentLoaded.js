import core from 'core';
import getHashParams from 'helpers/getHashParams';
import actions from 'actions';

export default dispatch => () => {
  dispatch(actions.setDocumentLoaded(true));
  dispatch(actions.openElement('pageNavOverlay'));
  dispatch(actions.setLoadingProgress(1));
  setTimeout(() => {
    dispatch(actions.closeElement('progressModal'));
    dispatch(actions.resetLoadingProgress());
  }, 300);

  if (window.innerWidth <= 640) {
    core.fitToWidth();
  } else {
    core.fitToPage();
  }

  core.enableRedaction(getHashParams('enableRedaction', false));
  if (core.isCreateRedactionEnabled()) {
    dispatch(actions.enableElement('redactionButton', 1));
  } else {
    dispatch(actions.disableElement('redactionButton', 1));
  }

  core.setOptions({
    enableAnnotations: getHashParams('a', false)
  });

  core.getOutlines(outlines => {
    dispatch(actions.setOutlines(outlines));
  });

  window.readerControl.loadedFromServer = false;
  window.readerControl.serverFailed = false;

  $(document).trigger('documentLoaded');
};