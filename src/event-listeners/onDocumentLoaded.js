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

  core.setRedactionEnable( getHashParams('enableRedaction', false));

  if (core.isRedactionEnabled()) { // TODO double check if this is working for "blackBox"
    dispatch(actions.enableElement('redactionButton'));
  } else {
    dispatch(actions.disableElement('redactionButton'));
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