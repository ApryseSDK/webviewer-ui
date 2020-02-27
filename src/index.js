import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import thunk from 'redux-thunk';

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
import getHashParams from 'helpers/getHashParams';

const middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  const isSpamDisabled = localStorage.getItem('spamDisabled') === 'true';
  if (!isSpamDisabled) {
    const { createLogger } = require('redux-logger');
    middleware.push(createLogger({ collapsed: true }));
  }
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

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
    window.CoreControls.enableFullPDF(true);
    fullAPIReady = loadScript('../core/pdf/PDFNet.js');
  }

  if (getHashParams('disableLogs', false)) {
    window.CoreControls.disableLogs(true);
  }

  window.CoreControls.enableSubzero(getHashParams('subzero', false));
  window.CoreControls.setWorkerPath('../core');
  window.CoreControls.setResourcesPath('../core/assets');

  try {
    if (state.advanced.useSharedWorker && window.parent.WebViewer) {
      var workerTransportPromise = window.parent.WebViewer.workerTransportPromise(window.frameElement);
      // originally the option was just for the pdf worker transport promise, now it can be an object
      // containing both the pdf and office promises
      if (workerTransportPromise.pdf || workerTransportPromise.office) {
        window.CoreControls.setWorkerTransportPromise(workerTransportPromise);
      } else {
        window.CoreControls.setWorkerTransportPromise({ 'pdf': workerTransportPromise });
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
    const { PDF, OFFICE, ALL } = workerTypes;
    if (preloadWorker === PDF || preloadWorker === ALL) {
      getBackendPromise(getHashParams('pdf', 'auto')).then(pdfType => {
        window.CoreControls.initPDFWorkerTransports(pdfType, {
          workerLoadingProgress: percent => {
            store.dispatch(actions.setLoadingProgress(percent));
          },
        }, window.sampleL);
      });
    }

    if (preloadWorker === OFFICE || preloadWorker === ALL) {
      getBackendPromise(getHashParams('office', 'auto')).then(officeType => {
        window.CoreControls.initOfficeWorkerTransports(officeType, {
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
    const docViewer = new window.CoreControls.DocumentViewer();
    window.docViewer = docViewer;
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
        <I18nextProvider i18n={i18next}>
          <App removeEventHandlers={removeEventHandlers} />
        </I18nextProvider>
      </Provider>,
      document.getElementById('app'),
    );
  });
}

window.addEventListener('hashchange', () => {
  window.location.reload();
});