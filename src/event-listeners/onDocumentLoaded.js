import core from 'core';
import getHashParams from 'helpers/getHashParams';
import fireEvent from 'helpers/fireEvent';
import actions from 'actions';
import { workerTypes } from 'constants/types';
import { PRIORITY_ONE } from 'constants/actionPriority';

let onFirstLoad = true;

export default dispatch => () => {
  dispatch(actions.setDocumentLoaded(true));
  dispatch(actions.openElement('pageNavOverlay'));
  dispatch(actions.setDocumentLoadingProgress(1));
  dispatch(actions.setWorkerLoadingProgress(1));
  // set timeout so that progress modal can show progress bar properly
  setTimeout(() => {
    dispatch(actions.closeElement('progressModal'));
    dispatch(actions.resetLoadingProgress());
    dispatch(actions.resetUploadProgress());
    dispatch(actions.setIsUploading(false));
  }, 300);

  if (onFirstLoad) {
    onFirstLoad = false;
    // redaction button starts hidden. when the user first loads a document, check HashParams the first time
    core.enableRedaction(getHashParams('enableRedaction', false) || core.isCreateRedactionEnabled());
    // if redaction is already enabled for some reason (i.e. calling readerControl.enableRedaction() before loading a doc), keep it enabled

    if (core.isCreateRedactionEnabled()) {
      dispatch(actions.enableElement('redactionButton', PRIORITY_ONE));
    } else {
      dispatch(actions.disableElement('redactionButton', PRIORITY_ONE));
    }
  }

  core.setOptions({
    enableAnnotations: getHashParams('a', false),
  });

  core.getOutlines(outlines => {
    dispatch(actions.setOutlines(outlines));
  });

  const doc = core.getDocument();
  if (!doc.isWebViewerServerDocument()) {
    doc.getLayersArray().then(layers => {
      if (layers.length === 0) {
        dispatch(actions.disableElement('layersPanel', PRIORITY_ONE));
        dispatch(actions.disableElement('layersPanelButton', PRIORITY_ONE));
      } else {
        dispatch(actions.enableElement('layersPanel', PRIORITY_ONE));
        dispatch(actions.enableElement('layersPanelButton', PRIORITY_ONE));
        dispatch(actions.setLayers(layers));
      }
    });
  }

  if (doc.getType() === workerTypes.PDF) {
    dispatch(actions.enableElement('cropToolButton', PRIORITY_ONE));
  } else {
    dispatch(actions.disableElement('cropToolButton', PRIORITY_ONE));
  }

  window.readerControl.loadedFromServer = false;
  window.readerControl.serverFailed = false;

  fireEvent('documentLoaded');
};
