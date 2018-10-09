import core from 'core';
import getHashParams from 'helpers/getHashParams';
import actions from 'actions';

export default dispatch => () => {
  core.setToolMode('AnnotationEdit');

  dispatch(actions.setDocumentLoaded(true));
  dispatch(actions.openElement('pageNavOverlay'));
  dispatch(actions.closeElement('loadingModal'));

  if (window.innerWidth <= 640) {
    core.fitToWidth();
  } else {
    core.fitToPage();
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