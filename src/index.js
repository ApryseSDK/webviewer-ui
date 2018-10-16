import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import thunk from 'redux-thunk';

import apis from 'src/apis';
import App from 'components/App';
import rootReducer from 'reducers/rootReducer';
import { engineTypes } from 'constants/types';
import LayoutMode from 'constants/layoutMode';
import FitMode from 'constants/fitMode';
import getBackendPromise from 'helpers/getBackendPromise';
import loadCustomCSS from 'helpers/loadCustomCSS';
import loadScript from 'helpers/loadScript';
import setupLoadAnnotationsFromServer from 'helpers/setupLoadAnnotationsFromServer';
import eventHandler from 'helpers/eventHandler';
import setupPDFTron from 'helpers/setupPDFTron';
import setupI18n from 'helpers/setupI18n';
import setDefaultDisabledElements from 'helpers/setDefaultDisabledElements';
import setupDocViewer from 'helpers/setupDocViewer';
import setDefaultToolColor from 'helpers/setDefaultToolColor';
import setUserPermission from 'helpers/setUserPermission';

const middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  middleware.push(createLogger({ collapsed: true }));
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('reducers/rootReducer', () => {
    const updatedReducer = require('reducers/rootReducer').default;
    store.replaceReducer(updatedReducer);
  });
}

if (window.CanvasRenderingContext2D) {
  let fullAPIReady = Promise.resolve();
  const state = store.getState();

  $.ajaxSetup({ cache: true });

  if (state.advanced.fullAPI) {
    window.CoreControls.enableFullPDF(true);
    if (process.env.NODE_ENV === 'production') {
      fullAPIReady = loadScript('../../core/pdf/PDFNet.js');
    } else {
      fullAPIReady = loadScript('../core/pdf/PDFNet.js');
    }
  }

  window.CoreControls.enableSubzero(state.advanced.subzero);
  if (process.env.NODE_ENV === 'production') {
    window.CoreControls.setWorkerPath('../../core');
    window.CoreControls.setResourcesPath('../../core/assets');
  }

  try {
    if (state.advanced.useSharedWorker && window.parent.WebViewer) {
      var workerTransportPromise = window.parent.WebViewer.workerTransportPromise();
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

  if (state.advanced.preloadWorker && state.advanced.engineType === engineTypes.PDFNETJS) {
    if (state.document.pdfType !== 'wait') {
      getBackendPromise(state.document.pdfType).then(pdfType => {
        window.CoreControls.preloadPDFWorker(pdfType, {}, {});
      });
    }

    if (state.document.officeType !== 'wait') {
      getBackendPromise(state.document.officeType).then(officeType => {
        window.CoreControls.preloadOfficeWorker(officeType, {}, {});
      });
    }
  }

  loadCustomCSS(state.advanced.customCSS);

  fullAPIReady.then(() => {
    return loadScript(state.advanced.configScript, 'Config script could not be loaded. The default configuration will be used.');
  }).then(() => {
    const { addEventHandlers, removeEventHandlers } = eventHandler(store);
    const docViewer = new window.CoreControls.DocumentViewer();
    window.docViewer = docViewer;
    setupPDFTron();
    setupDocViewer();
    setupI18n(state);
    setDefaultToolColor();
    setUserPermission(state);
    addEventHandlers(),
    setDefaultDisabledElements(store),
    setupLoadAnnotationsFromServer(state.document.id, state.advanced.serverUrl, state.advanced.serverUrlHeaders);

    ReactDOM.render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App removeEventHandlers={removeEventHandlers} />
        </I18nextProvider>
      </Provider>,
      document.getElementById('app'),
      () => {
        window.readerControl = {
          ...apis.getActions(store),
          FitMode,
          LayoutMode,
          addSearchListener: apis.addSearchListener(store),
          closeDocument: apis.closeDocument(store),
          constants: apis.getConstants(),
          disableTool: apis.disableTool(store),
          disableTools: apis.disableTools(store),
          docViewer,
          downloadPdf: apis.downloadPdf(store),
          enableAnnotations: apis.enableAnnotations(store),
          enableDownload: apis.enableDownload(store),
          enableFilePicker: apis.enableFilePicker(store),
          enableNotesPanel: apis.enableNotesPanel(store),
          enablePrint: apis.enablePrint(store),
          enableTextSelection: apis.enableTextSelection(store),
          enableTool: apis.enableTool(store),
          enableTools: apis.enableTools(store),
          getAnnotationUser: apis.getAnnotationUser,
          getBBAnnotManager: apis.getBBAnnotManager(store),
          getCurrentPageNumber: apis.getCurrentPageNumber(store),
          getFitMode: apis.getFitMode(store),
          getLayoutMode: apis.getLayoutMode(store),
          getPageCount: apis.getPageCount(store),
          getShowSideWindow: apis.getShowSideWindow(store),
          getSideWindowVisibility: apis.getSideWindowVisibility(store),
          getToolMode: apis.getToolMode,
          getZoomLevel: apis.getZoomLevel(store),
          goToFirstPage: apis.goToFirstPage,
          goToLastPage: apis.goToLastPage(store),
          goToNextPage: apis.goToNextPage(store),
          goToPrevPage: apis.goToPrevPage(store),
          i18n,
          isAdminUser: apis.isAdminUser,
          isElementOpen: apis.isElementOpen(store),
          isElementDisabled: apis.isElementDisabled(store),
          isMobileDevice: apis.isMobileDevice,
          isReadOnly: apis.isReadOnly,
          isToolDisabled: apis.isToolDisabled(store),
          loadDocument: apis.loadDocument(store),
          registerTool: apis.registerTool(store),
          removeSearchListener: apis.removeSearchListener(store),
          rotateClockwise: apis.rotateClockwise,
          rotateCounterClockwise: apis.rotateCounterClockwise,
          saveAnnotations: apis.saveAnnotations(store),
          searchText: apis.searchText(store),
          searchTextFull: apis.searchTextFull(store),
          selectors: apis.getSelectors(store),
          setAdminUser: apis.setAdminUser,
          setAnnotationUser: apis.setAnnotationUser,
          setTheme: apis.setTheme,
          setCurrentPageNumber: apis.setCurrentPageNumber,
          setEngineType: apis.setEngineType(store),
          setFitMode: apis.setFitMode,
          setHeaderItems: apis.setHeaderItems(store),
          setLanguage: apis.setLanguage,
          setLayoutMode: apis.setLayoutMode,
          setNotesPanelSort: apis.setNotesPanelSort(store),
          setPrintQuality: apis.setPrintQuality(store),
          setReadOnly: apis.setReadOnly,
          setShowSideWindow: apis.setShowSideWindow(store),
          setSideWindowVisibility: apis.setSideWindowVisibility(store),
          setToolMode: apis.setToolMode(store),
          setZoomLevel: apis.setZoomLevel,
          toggleFullScreen: apis.toggleFullScreen,
          unregisterTool: apis.unregisterTool(store),
          loadedFromServer: false,
          serverFailed: false
        };

        window.ControlUtils = {
          byteRangeCheck: onComplete => {
            onComplete(206);
          },
          getCustomData: () => {
            return state.advanced.customData;
          }
        };

        $(document).trigger('viewerLoaded');
      }
    );
  });
}

window.addEventListener('hashchange', () => {
  window.location.reload();
});