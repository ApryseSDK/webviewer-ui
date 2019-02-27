import core from 'core';
import getHashParams from 'helpers/getHashParams';
import actions from 'actions';

let onFirstLoad = true;

export default dispatch => () => {
  dispatch(actions.setDocumentLoaded(true));
  dispatch(actions.openElement('pageNavOverlay'));
  dispatch(actions.setDocumentLoadingProgress(1));
  dispatch(actions.setWorkerLoadingProgress(1));
  setTimeout(() => {
    dispatch(actions.closeElement('progressModal'));
    dispatch(actions.resetLoadingProgress());
  }, 300);

  if (window.innerWidth <= 640) {
    core.fitToWidth();
  } else {
    core.fitToPage();
  }

  if (onFirstLoad) {
    onFirstLoad = false;
    // redaction button starts hidden. when the user first loads a document, check HashParams the first time
    core.enableRedaction(getHashParams('enableRedaction', false) || core.isCreateRedactionEnabled());
    // if redaction is already enabled for some reason (i.e. calling readerControl.enableRedaction() before loading a doc), keep it enabled

    if (core.isCreateRedactionEnabled()) {
      dispatch(actions.enableElement('redactionButton', 1));
    } else {
      dispatch(actions.disableElement('redactionButton', 1));
    }
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