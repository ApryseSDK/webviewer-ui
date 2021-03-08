import core from 'core';
import getHashParams from 'helpers/getHashParams';
import fireEvent from 'helpers/fireEvent';
import { getLeftPanelDataElements } from 'helpers/isDataElementPanel';
import actions from 'actions';
import selectors from 'selectors';
import { workerTypes } from 'constants/types';
import { PRIORITY_ONE, PRIORITY_TWO } from 'constants/actionPriority';
import { print } from 'helpers/print';

let onFirstLoad = true;

export default store => () => {
  const { dispatch, getState } = store;

  dispatch(actions.openElement('pageNavOverlay'));
  dispatch(actions.setLoadingProgress(1));

  // set timeout so that progress modal can show progress bar properly
  setTimeout(() => {
    dispatch(actions.closeElement('progressModal'));
    dispatch(actions.resetLoadingProgress());
  }, 300);

  if (onFirstLoad) {
    onFirstLoad = false;
    // redaction button starts hidden. when the user first loads a document, check HashParams the first time
    core.enableRedaction(getHashParams('enableRedaction', false) || core.isCreateRedactionEnabled());
    // if redaction is already enabled for some reason (i.e. calling readerControl.enableRedaction() before loading a doc), keep it enabled

    if (core.isCreateRedactionEnabled()) {
      dispatch(actions.enableElement('redactionToolGroupButton', PRIORITY_ONE));
    } else {
      dispatch(actions.disableElement('redactionToolGroupButton', PRIORITY_TWO));
    }
  }

  core.setOptions({
    enableAnnotations: getHashParams('a', false),
  });

  core.getOutlines(outlines => {
    dispatch(actions.setOutlines(outlines));
  });

  const doc = core.getDocument();
  doc.on('bookmarksUpdated', () => core.getOutlines(outlines => dispatch(actions.setOutlines(outlines))));
  if (!doc.isWebViewerServerDocument()) {
    doc.getLayersArray().then(layers => {
      if (layers.length === 0) {
        dispatch(actions.disableElement('layersPanel', PRIORITY_ONE));
        dispatch(actions.disableElement('layersPanelButton', PRIORITY_ONE));

        const state = getState();
        const activeLeftPanel = selectors.getActiveLeftPanel(state);
        if (activeLeftPanel === 'layersPanel') {
          // set the active left panel to another one that's not disabled so that users don't see a blank left panel
          const nextActivePanel = getLeftPanelDataElements(state).find(
            dataElement => !selectors.isElementDisabled(state, dataElement),
          );

          dispatch(actions.setActiveLeftPanel(nextActivePanel));
        }
      } else {
        dispatch(actions.enableElement('layersPanel', PRIORITY_ONE));
        dispatch(actions.enableElement('layersPanelButton', PRIORITY_ONE));
        dispatch(actions.setLayers(layers));
      }
    });
  }

  const docType = doc.getType();
  if (docType === workerTypes.PDF || (docType  === workerTypes.BLACKBOX && !doc.isWebViewerServerDocument())) {
    dispatch(actions.enableElement('cropToolGroupButton', PRIORITY_ONE));
  } else {
    dispatch(actions.disableElement('cropToolGroupButton', PRIORITY_ONE));
  }

  window.readerControl.loadedFromServer = false;
  window.readerControl.serverFailed = false;

  window.docViewer
    .getAnnotationManager()
    .getFieldManager()
    .setPrintHandler(() => {
      print(
        store.dispatch,
        selectors.isEmbedPrintSupported(store.getState()),
        selectors.getSortStrategy(store.getState()),
        selectors.getColorMap(store.getState())
      );
    });

  fireEvent('documentLoaded');
};
