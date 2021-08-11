import 'core-js/stable';
import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import thunk from 'redux-thunk';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import core from 'core';
import actions from 'actions';
import App from 'components/App';
import { workerTypes } from 'constants/types';
import defaultTool from 'constants/defaultTool';
import getBackendPromise from 'helpers/getBackendPromise';
import loadCustomCSS from 'helpers/loadCustomCSS';
import loadScript, { loadConfig } from 'helpers/loadScript';
import setupLoadAnnotationsFromServer from 'helpers/setupLoadAnnotationsFromServer';
import eventHandler from 'helpers/eventHandler';
import setupI18n from 'helpers/setupI18n';
import setAutoSwitch from 'helpers/setAutoSwitch';
import setDefaultDisabledElements from 'helpers/setDefaultDisabledElements';
import setupDocViewer from 'helpers/setupDocViewer';
import setDefaultToolStyles from 'helpers/setDefaultToolStyles';
import setUserPermission from 'helpers/setUserPermission';
import logDebugInfo from 'helpers/logDebugInfo';
import rootReducer from 'reducers/rootReducer';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import getHashParams from 'helpers/getHashParams';

import './index.scss';

const middleware = [thunk];

let composeEnhancer = function noopStoreComposeEnhancer(middleware) {
  return middleware;
};

if (process.env.NODE_ENV === 'development') {
  const isSpamDisabled = localStorage.getItem('spamDisabled') === 'true';
  if (!isSpamDisabled) {
    const { createLogger } = require('redux-logger');
    middleware.push(createLogger({ collapsed: true }));
  }
  const { composeWithDevTools } = require('redux-devtools-extension/logOnlyInProduction');
  composeEnhancer = composeWithDevTools({});
}


const store = createStore(rootReducer, composeEnhancer(applyMiddleware(...middleware)));
const persistor = persistStore(store);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('reducers/rootReducer', () => {
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
    fullAPIReady = loadScript('../core/pdf/PDFNet.js');
  }

  if (getHashParams('disableLogs', false)) {
    window.Core.disableLogs(true);
  }

  window.Core.setWorkerPath('../core');
  window.Core.setResourcesPath('../core/assets');

  try {
    if (state.advanced.useSharedWorker && window.parent.WebViewer) {
      var workerTransportPromise = window.parent.WebViewer.workerTransportPromise(window.frameElement);
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

  const { preloadWorker } = state.advanced;

  function initTransports() {
    const { PDF, OFFICE, LEGACY_OFFICE, ALL } = workerTypes;
    if (preloadWorker.includes(PDF) || preloadWorker === ALL) {
      getBackendPromise(getHashParams('pdf', 'auto')).then(pdfType => {
        window.Core.initPDFWorkerTransports(pdfType, {
          workerLoadingProgress: percent => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }

    if (preloadWorker.includes(OFFICE) || preloadWorker === ALL) {
      getBackendPromise(getHashParams('office', 'auto')).then(officeType => {
        window.Core.initOfficeWorkerTransports(officeType, {
          workerLoadingProgress: percent => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }

    if (preloadWorker.includes(LEGACY_OFFICE) || preloadWorker === ALL) {
      getBackendPromise(getHashParams('legacyOffice', 'auto')).then(officeType => {
        window.CoreControls.initLegacyOfficeWorkerTransports(officeType, {
          workerLoadingProgress: percent => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }
  }


  loadCustomCSS(state.advanced.customCSS);

  logDebugInfo();

  fullAPIReady.then(() => loadConfig()).then(() => {
    if (preloadWorker) {
      initTransports();
    }

    const { addEventHandlers, removeEventHandlers } = eventHandler(store);
    const docViewer = new window.Core.DocumentViewer();

    window.documentViewer = docViewer;
    if (getHashParams('enableViewStateAnnotations', false)) {
      const tool = docViewer.getTool(window.Core.Tools.ToolNames.STICKY);
      tool?.setSaveViewState(true);
    }

    setupDocViewer();
    setupI18n(state);
    setUserPermission(state);
    setAutoSwitch();
    addEventHandlers();
    setDefaultDisabledElements(store);
    setupLoadAnnotationsFromServer(store);
    setDefaultToolStyles();
    core.setToolMode(defaultTool);

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
      document.getElementById('app'),
    );
  });
}

window.addEventListener('hashchange', () => {
  window.location.reload();
});

/* The following adds a data attribute to `<html>` when user is keyboard navigating. */

function onTab(event) {
  if (event.key === 'Tab') {
    document.documentElement.setAttribute('data-tabbing', 'true');
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
