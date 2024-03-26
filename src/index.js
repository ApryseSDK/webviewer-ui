import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import thunk from 'redux-thunk';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import rootReducer from 'reducers/rootReducer';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import retargetEvents from 'react-shadow-dom-retarget-events';

import core from 'core';
import actions from 'actions';
import App from 'components/App';
import { workerTypes } from 'constants/types';
import defaultTool from 'constants/defaultTool';
import defineWebViewerInstanceUIAPIs from 'src/apis';

import getBackendPromise from 'helpers/getBackendPromise';
import loadCustomCSS from 'helpers/loadCustomCSS';
import loadScript, { loadConfig } from 'helpers/loadScript';
import setupLoadAnnotationsFromServer from 'helpers/setupLoadAnnotationsFromServer';
import eventHandler from 'helpers/eventHandler';
import setupI18n from 'helpers/setupI18n';
import setAutoSwitch from 'helpers/setAutoSwitch';
import setUserPermission from 'helpers/setUserPermission';
import logDebugInfo from 'helpers/logDebugInfo';
import getHashParameters from 'helpers/getHashParameters';
import { addDocumentViewer, setupOpenURLHandler } from 'helpers/documentViewerHelper';
import setEnableAnnotationNumbering from 'helpers/setEnableAnnotationNumbering';
import getRootNode from 'helpers/getRootNode';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';

import './index.scss';

if (window.isApryseWebViewerWebComponent) {
  if (window.webViewerPath.lastIndexOf('/') !== window.webViewerPath.length - 1) {
    window.webViewerPath += '/';
  }
  // eslint-disable-next-line no-undef, camelcase
  __webpack_public_path__ = `${window.webViewerPath}ui/`;
}

const middleware = [thunk];

let composeEnhancer = function noopStoreComposeEnhancer(middleware) {
  return middleware;
};

if (process.env.NODE_ENV === 'development') {
  const isSpamDisabled = localStorage.getItem('spamDisabled') === 'true';
  if (!isSpamDisabled) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { createLogger } = require('redux-logger');
    middleware.push(createLogger({ collapsed: true }));
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  const { composeWithDevTools } = require('redux-devtools-extension/logOnlyInProduction');
  composeEnhancer = composeWithDevTools({});
}


const store = createStore(rootReducer, composeEnhancer(applyMiddleware(...middleware)));
const persistor = persistStore(store);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('reducers/rootReducer', () => {
    // eslint-disable-next-line global-require
    const updatedReducer = require('reducers/rootReducer').default;
    store.replaceReducer(updatedReducer);
  });

  module.hot.accept();
}

if (process.env.NODE_ENV === 'development') {
  window.disableSpam = () => {
    localStorage.setItem('spamDisabled', 'true');
    location.reload();
  };

  window.enableSpam = () => {
    localStorage.setItem('spamDisabled', 'false');
    location.reload();
  };
}

if (window.CanvasRenderingContext2D) {
  let fullAPIReady = Promise.resolve();
  const state = store.getState();

  if (state.advanced.fullAPI) {
    window.Core.enableFullPDF();
    if (window.isApryseWebViewerWebComponent) {
      fullAPIReady = loadScript(`${window.webViewerPath}core/pdf/PDFNet.js`);
    } else {
      fullAPIReady = loadScript('../core/pdf/PDFNet.js');
    }
  }


  if (getHashParameters('disableLogs', false)) {
    window.Core.disableLogs(true);
  }

  if (getHashParameters('disableObjectURLBlobs', false)) {
    window.Core.disableObjectURLBlobs(getHashParameters('disableObjectURLBlobs', false));
  }

  window._disableStreaming = getHashParameters('disableStreaming', false);
  if (window.isApryseWebViewerWebComponent) {
    window.Core.setWorkerPath(`${window.webViewerPath}core`);
    window.Core.setResourcesPath(`${window.webViewerPath}core/assets`);
    loadScript(`${window.webViewerPath}core/pdf/PDFNetLean.js`);
  } else {
    window.Core.setWorkerPath('../core');
    window.Core.setResourcesPath('../core/assets');
    loadScript('../core/pdf/PDFNetLean.js');
  }

  try {
    const isUsingSharedWorker = state.advanced.useSharedWorker === 'true' || state.advanced.useSharedWorker === true;
    if (isUsingSharedWorker) {
      let workerTransportPromise;
      if (window.parent.WebViewer && !window.isApryseWebViewerWebComponent) {
        workerTransportPromise = window.parent.WebViewer.workerTransportPromise(window.frameElement);
      } else if (window.isApryseWebViewerWebComponent && window.apryseWorkerTransportPromise) {
        workerTransportPromise = window.apryseWorkerTransportPromise;
      }
      // originally the option was just for the pdf worker transport promise, now it can be an object
      // containing both the pdf and office promises
      if (workerTransportPromise.pdf || workerTransportPromise.office) {
        window.Core.setWorkerTransportPromise(workerTransportPromise);
      } else {
        window.Core.setWorkerTransportPromise({ 'pdf': workerTransportPromise });
      }
    }
  } catch (e) {
    console.warn(e);
    if (e.name === 'SecurityError') {
      console.warn('workerTransportPromise option cannot be used with CORS');
    }
  }

  const backendType = getHashParameters('pdf');
  if (backendType) {
    window.Core.forceBackendType(backendType);
  }

  const { enableOptimizedWorkers } = state.advanced;

  if (!enableOptimizedWorkers) {
    window.Core.disableOptimizedWorkers();
  }

  const { preloadWorker } = state.advanced;

  loadCustomCSS(state.advanced.customCSS);

  logDebugInfo();
  const documentViewer = addDocumentViewer(1);
  setupOpenURLHandler(documentViewer, store);

  if (getHashParameters('hideDetachedReplies', false)) {
    documentViewer.getAnnotationManager().hideDetachedReplies();
  }

  defineWebViewerInstanceUIAPIs(store);
  setItemToFlyoutStore(store);

  setupI18n(state);
  setEnableAnnotationNumbering(state);
  setUserPermission(state);
  setAutoSwitch();
  core.setToolMode(defaultTool);

  const { addEventHandlers, removeEventHandlers } = eventHandler(store);

  const getWorkersToLoad = (preloadWorker) => {
    const { PDF, OFFICE, LEGACY_OFFICE, CONTENT_EDIT, OFFICE_EDITOR, ALL } = workerTypes;
    if (preloadWorker === ALL) {
      return [PDF, OFFICE, LEGACY_OFFICE, CONTENT_EDIT, OFFICE_EDITOR];
    }
    const workersToLoad = [];

    const shouldLoadOfficeWorker = Array.isArray(preloadWorker) && preloadWorker.includes(OFFICE)
      || typeof preloadWorker === 'string' && preloadWorker.match(/(office[,|\s]|office$)/g);
    if (shouldLoadOfficeWorker) {
      workersToLoad.push(OFFICE);
    }

    [PDF, LEGACY_OFFICE, CONTENT_EDIT, OFFICE_EDITOR].forEach((workerType) => {
      if (preloadWorker.includes(workerType)) {
        workersToLoad.push(workerType);
      }
    });

    return workersToLoad;
  };

  const initTransports = () => {
    const { PDF, OFFICE, LEGACY_OFFICE, CONTENT_EDIT, OFFICE_EDITOR } = workerTypes;
    const workersToLoad = getWorkersToLoad(preloadWorker);

    if (workersToLoad.includes(PDF)) {
      getBackendPromise(getHashParameters('pdf', 'auto')).then((pdfType) => {
        window.Core.initPDFWorkerTransports(pdfType, {
          workerLoadingProgress: (percent) => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }

    if (workersToLoad.includes(OFFICE)) {
      getBackendPromise(getHashParameters('office', 'auto')).then((officeType) => {
        window.Core.initOfficeWorkerTransports(officeType, {
          workerLoadingProgress: (percent) => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }

    if (workersToLoad.includes(OFFICE_EDITOR)) {
      window.Core.initOfficeEditorWorkerTransports({
        workerLoadingProgress: (percent) => {
          store.dispatch(actions.setLoadingProgress(percent));
        },
      }, window.sampleL);
    }

    if (workersToLoad.includes(LEGACY_OFFICE)) {
      getBackendPromise(getHashParameters('legacyOffice', 'auto')).then((officeType) => {
        window.Core.initLegacyOfficeWorkerTransports(officeType, {
          workerLoadingProgress: (percent) => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }

    if (workersToLoad.includes(CONTENT_EDIT)) {
      window.Core.ContentEdit.preloadWorker(documentViewer.getContentEditManager());
    }
  };

  fullAPIReady.then(() => loadConfig()).then(() => {
    if (preloadWorker) {
      initTransports();
    }

    if (getHashParameters('disableVirtualDisplayMode', false)) {
      const displayMode = documentViewer.getDisplayModeManager();
      displayMode.disableVirtualDisplayMode();
    }

    if (getHashParameters('enableViewStateAnnotations', false)) {
      const tool = documentViewer.getTool(window.Core.Tools.ToolNames.STICKY);
      tool?.enableViewStateSaving();
    }

    setupLoadAnnotationsFromServer(store);

    ReactDOM.render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18next}>
            <DndProvider backend={HTML5Backend}>
              <App removeEventHandlers={removeEventHandlers} />
            </DndProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>,
      getRootNode().getElementById('app'),
    );
    window.isApryseWebViewerWebComponent && retargetEvents(getRootNode());
  });
  addEventHandlers();
}


window.addEventListener('hashchange', () => {
  if (!window.isApryseWebViewerWebComponent) {
    window.location.reload();
  }
});

/* The following adds a data attribute to `<html>` when user is keyboard navigating. */

function onTab(event) {
  if (event.key === 'Tab') {
    const documentElement = window.isApryseWebViewerWebComponent ? getRootNode().host : document.documentElement;
    documentElement.setAttribute('data-tabbing', 'true');
    window.removeEventListener('keydown', onTab);
    window.addEventListener('mousedown', onMouse);
  }
}

function onMouse() {
  document.documentElement.removeAttribute('data-tabbing');
  window.removeEventListener('mousedown', onMouse);
  window.addEventListener('keydown', onTab);
}

window.addEventListener('keydown', onTab);
