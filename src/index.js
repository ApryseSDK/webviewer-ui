import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import thunk from 'redux-thunk';

import core from 'core';
import actions from 'actions';
import apis from 'src/apis';
import App from 'components/App';
import { workerTypes } from 'constants/types';
import LayoutMode from 'constants/layoutMode';
import FitMode from 'constants/fitMode';
import defaultTool from 'constants/defaultTool';
import getBackendPromise from 'helpers/getBackendPromise';
import loadCustomCSS from 'helpers/loadCustomCSS';
import loadScript, { loadConfig } from 'helpers/loadScript';
import setupLoadAnnotationsFromServer from 'helpers/setupLoadAnnotationsFromServer';
import setupMIMETypeTest from 'helpers/setupMIMETypeTest';
import eventHandler from 'helpers/eventHandler';
import setupPDFTron from 'helpers/setupPDFTron';
import setupI18n from 'helpers/setupI18n';
import setAutoSwitch from 'helpers/setAutoSwitch';
import setDefaultDisabledElements from 'helpers/setDefaultDisabledElements';
import setupDocViewer from 'helpers/setupDocViewer';
import setDefaultToolStyles from 'helpers/setDefaultToolStyles';
import setUserPermission from 'helpers/setUserPermission';
import fireEvent from 'helpers/fireEvent';
import rootReducer from 'reducers/rootReducer';

const packageConfig = require('../package.json');

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

  module.hot.accept();
}

if (window.CanvasRenderingContext2D) {
  let fullAPIReady = Promise.resolve();
  const state = store.getState();

  if (state.advanced.fullAPI) {
    window.CoreControls.enableFullPDF(true);
    if (process.env.NODE_ENV === 'production') {
      fullAPIReady = loadScript('../core/pdf/PDFNet.js');
    } else {
      fullAPIReady = loadScript('../core/pdf/PDFNet.js');
    }
  }

  window.CoreControls.enableSubzero(state.advanced.subzero);
  if (process.env.NODE_ENV === 'production') {
    window.CoreControls.setWorkerPath('../core');
    window.CoreControls.setResourcesPath('../core/assets');
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

  const { preloadWorker } = state.advanced;
  const { PDF, OFFICE, ALL } = workerTypes;

  if (preloadWorker) {
    if (preloadWorker === PDF || preloadWorker === ALL) {
      getBackendPromise(state.document.pdfType).then(pdfType => {
        window.CoreControls.initPDFWorkerTransports(pdfType, {
          workerLoadingProgress: percent => {
            store.dispatch(actions.setWorkerLoadingProgress(percent));
          },
        });
      });
    }

    if (preloadWorker === OFFICE || preloadWorker === ALL) {
      getBackendPromise(state.document.officeType).then(officeType => {
        window.CoreControls.initOfficeWorkerTransports(officeType, {
          workerLoadingProgress: percent => {
            store.dispatch(actions.setWorkerLoadingProgress(percent));
          },
        });
      });
    }
  }

  loadCustomCSS(state.advanced.customCSS);

  const coreVersion = window.CoreControls.DocumentViewer.prototype.version;
  const uiVersion = packageConfig.version;

  if (coreVersion && uiVersion) {
    // we are using semantic versioning (ie ###.###.###) so the first number is the major version, follow by the minor version, and the patch number
    const [coreMajorVersion, coreMinorVersion] = coreVersion.split('.');
    const [uiMajorVersion, uiMinorVersion] = uiVersion.split('.');

    // eslint-disable-next-line no-console
    console.log(`[WebViewer] WebViewer UI version: ${uiVersion}, WebViewer Core version: ${coreVersion}`);

    if (parseInt(coreMajorVersion) !== parseInt(uiMajorVersion)) {
      console.error(`[WebViewer] Version Mismatch: the major versions of WebViewer UI and Core should be the same.`);
    } else if (parseInt(coreMinorVersion) < parseInt(uiMinorVersion)) {
      console.warn(`[WebViewer] Version Mismatch: WebViewer UI requires Core version ${uiVersion} and above.`);
    }
  }

  fullAPIReady.then(() => loadConfig()).then(() => {
    const { addEventHandlers, removeEventHandlers } = eventHandler(store);
    const docViewer = new window.CoreControls.DocumentViewer();
    window.docViewer = docViewer;
    setupPDFTron();
    setupDocViewer();
    setupI18n(state);
    setupMIMETypeTest(store);
    setUserPermission(state);
    setAutoSwitch();
    setDefaultDisabledElements(store);
    setupLoadAnnotationsFromServer(store);
    addEventHandlers();
    setDefaultToolStyles();
    core.setToolMode(defaultTool);

    ReactDOM.render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <App removeEventHandlers={removeEventHandlers} />
        </I18nextProvider>
      </Provider>,
      document.getElementById('app'),
      () => {
        window.readerControl = {
          docViewer,
          FitMode,
          LayoutMode,
          loadedFromServer: false, // undocumented
          serverFailed: false, // undocumented
          i18n: i18next,
          constants: apis.getConstants(), // undocumented
          addSearchListener: apis.addSearchListener(store),
          addSortStrategy: apis.addSortStrategy(store),
          closeDocument: apis.closeDocument(store),
          closeElement: apis.closeElement(store),
          closeElements: apis.closeElements(store),
          disableAnnotations: apis.disableAnnotations(store),
          disableDownload: apis.disableDownload(store),
          disableElement: apis.disableElement(store),
          disableElements: apis.disableElements(store),
          disableFilePicker: apis.disableFilePicker(store),
          disableLocalStorage: apis.disableLocalStorage,
          disableMeasurement: apis.disableMeasurement(store),
          disableNotesPanel: apis.disableNotesPanel(store),
          disablePrint: apis.disablePrint(store),
          disableRedaction: apis.disableRedaction(store),
          disableTextSelection: apis.disableTextSelection(store),
          disableTool: apis.disableTool(store), // undocumented
          disableTools: apis.disableTools(store),
          downloadPdf: apis.downloadPdf(store),
          enableAllElements: apis.enableAllElements(store), // undocumented
          enableAnnotations: apis.enableAnnotations(store),
          enableDownload: apis.enableDownload(store),
          enableElement: apis.enableElement(store),
          enableElements: apis.enableElements(store),
          enableFilePicker: apis.enableFilePicker(store),
          enableLocalStorage: apis.enableLocalStorage,
          enableMeasurement: apis.enableMeasurement(store),
          enableNotesPanel: apis.enableNotesPanel(store),
          enablePrint: apis.enablePrint(store),
          enableRedaction: apis.enableRedaction(store),
          enableTextSelection: apis.enableTextSelection(store),
          enableTool: apis.enableTool(store),
          enableTools: apis.enableTools(store),
          focusNote: apis.focusNote(store),
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
          header: apis.header(store),
          isAdminUser: apis.isAdminUser,
          isElementDisabled: apis.isElementDisabled(store),
          isElementOpen: apis.isElementOpen(store),
          isMobileDevice: apis.isMobileDevice,
          isReadOnly: apis.isReadOnly,
          isToolDisabled: apis.isToolDisabled,
          loadDocument: apis.loadDocument(store),
          openElement: apis.openElement(store),
          openElements: apis.openElements(store),
          print: apis.print(store),
          registerTool: apis.registerTool(store),
          removeSearchListener: apis.removeSearchListener(store),
          rotateClockwise: apis.rotateClockwise,
          rotateCounterClockwise: apis.rotateCounterClockwise,
          saveAnnotations: apis.saveAnnotations(store),
          searchText: apis.searchText(store),
          searchTextFull: apis.searchTextFull(store),
          selectors: apis.getSelectors(store), // undocumented
          setActiveHeaderGroup: apis.setActiveHeaderGroup(store),
          setActiveLeftPanel: apis.setActiveLeftPanel(store),
          setAdminUser: apis.setAdminUser,
          setAnnotationUser: apis.setAnnotationUser,
          setColorPalette: apis.setColorPalette(store), // undocumented
          setCurrentPageNumber: apis.setCurrentPageNumber,
          setCustomNoteFilter: apis.setCustomNoteFilter(store),
          setCustomPanel: apis.setCustomPanel(store),
          setEngineType: apis.setEngineType(store), // undocumented
          setFitMode: apis.setFitMode,
          setHeaderItems: apis.setHeaderItems(store),
          setIconColor: apis.setIconColor(store),
          setLanguage: apis.setLanguage,
          setLayoutMode: apis.setLayoutMode,
          setMaxZoomLevel: apis.setMaxZoomLevel(store),
          setMinZoomLevel: apis.setMinZoomLevel(store),
          setNoteDateFormat: apis.setNoteDateFormat(store),
          setNotesPanelSort: apis.setNotesPanelSort(store), // undocumented
          setMeasurementUnits: apis.setMeasurementUnits(store),
          setPageLabels: apis.setPageLabels(store),
          setPrintQuality: apis.setPrintQuality(store),
          setReadOnly: apis.setReadOnly,
          setShowSideWindow: apis.setShowSideWindow(store), // undocumented
          setSideWindowVisibility: apis.setSideWindowVisibility(store), // undocumented
          setSortNotesBy: apis.setSortNotesBy(store),
          setSortStrategy: apis.setSortStrategy(store),
          setSwipeOrientation: apis.setSwipeOrientation(store),
          setTheme: apis.setTheme,
          setToolMode: apis.setToolMode(store),
          setZoomLevel: apis.setZoomLevel,
          setZoomList: apis.setZoomList(store),
          showErrorMessage: apis.showErrorMessage(store),
          showWarningMessage: apis.showWarningMessage(store), // undocumented
          toggleElement: apis.toggleElement(store),
          toggleFullScreen: apis.toggleFullScreen,
          unregisterTool: apis.unregisterTool(store),
          updateOutlines: apis.updateOutlines(store), // undocumented
          updateTool: apis.updateTool(store),
          useEmbeddedPrint: apis.useEmbeddedPrint(store),
        };

        window.ControlUtils = {
          byteRangeCheck: onComplete => {
            onComplete(206);
          },
          getCustomData: () => state.advanced.customData,
        };

        // TODO: move this to App.js
        fireEvent('viewerLoaded');
      },
    );
  });
}

window.addEventListener('hashchange', () => {
  window.location.reload();
});