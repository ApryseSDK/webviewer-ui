import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import thunk from 'redux-thunk';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRootReducer } from 'reducers/rootReducer';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import retargetEvents from 'react-shadow-dom-retarget-events';
// eslint-disable-next-line custom/use-core-hook-in-components
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import App from 'components/App';
import Theme from 'constants/theme';
import LoadingScreenStyles from 'constants/loadingScreenStyles';
import { workerTypes } from 'constants/types';
import defaultTool from 'constants/defaultTool';
import defineWebViewerInstanceUIAPIs from 'src/apis';
import importModularComponents from 'src/apis/importModularComponents';

import getBackendPromise from 'helpers/getBackendPromise';
import loadCustomCSS from 'helpers/loadCustomCSS';
import loadScript, { loadConfig } from 'helpers/loadScript';
import wildCardMatch from 'helpers/wildCardMatch';
import setupLoadAnnotationsFromServer from 'helpers/setupLoadAnnotationsFromServer';
import eventHandler from 'helpers/eventHandler';
import setupI18n from 'helpers/setupI18n';
import setAutoSwitch from 'helpers/setAutoSwitch';
import setUserPermission from 'helpers/setUserPermission';
import logDebugInfo from 'helpers/logDebugInfo';
import getCspNonce from 'helpers/getCspNonce';
import getHashParameters, { getHashParameterFromHost } from 'helpers/getHashParameters';
import applyPrePaintTheme from 'helpers/applyPrePaintTheme';
import {
  addDocumentViewer,
  setupOpenURLHandler,
  setupFormSubmissionHandler,
} from 'helpers/documentViewerHelper';
import setEnableAnnotationNumbering from 'helpers/setEnableAnnotationNumbering';
import setViewportRelativeAnnotationPositioning from 'helpers/setViewportRelativeAnnotationPositioning';
import getRootNode, { getInstanceID, releaseRootNode, setInstanceRootNode } from 'helpers/getRootNode';
import { createHotkeysManager, setHotkeysManagerForStore } from 'helpers/hotkeysManager';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import ensureReactDraggableStyleEl from 'helpers/ensureReactDraggableStyleEl';
import EmotionProvider from '../emotion/EmotionProvider';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { runWithInstance } from 'core/documentViewers';
import localStorageManager from './localStorageManager';

// Global counter for unique UI instance ids.
// Each createUIInstance call gets its own id,
// which scopes every shared core module registry to that instance.
let nextInstanceId = 1;

// Per-instance cleanup registry, keyed by root node.
const instanceCleanups = new Map();
const UI_CONFIG_ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

function noopStoreComposeEnhancer(middleware) {
  return middleware;
}

export function normalizeWebViewerPath() {
  if (!window.isApryseWebViewerWebComponent) {
    return;
  }

  if (window.webViewerPath.lastIndexOf('/') !== window.webViewerPath.length - 1) {
    window.webViewerPath += '/';
  }
}

export function createInstanceStoreAndPersistor(instanceRootNode) {
  const middleware = [thunk];
  let composeEnhancer = noopStoreComposeEnhancer;

  if (process.env.NODE_ENV === 'development') {
    const isSpamDisabled = localStorageManager.getItemSynchronous('spamDisabled') === 'true';
    if (!isSpamDisabled) {
      // eslint-disable-next-line global-require
      const { createLogger } = require('redux-logger');
      middleware.push(createLogger({ collapsed: true }));
    }

    // eslint-disable-next-line global-require
    const { composeWithDevTools } = require('redux-devtools-extension/logOnlyInProduction');
    composeEnhancer = composeWithDevTools({});
  }

  const instanceId = getInstanceID();
  const rootReducer = createRootReducer(instanceId);
  const store = createStore(rootReducer, composeEnhancer(applyMiddleware(...middleware)));
  const wcHost = window.isApryseWebViewerWebComponent
    ? (instanceRootNode?.host || instanceRootNode)
    : null;
  const loadingScreen = wcHost
    ? getHashParameterFromHost(wcHost, 'loadingScreen', LoadingScreenStyles.SKELETON)
    : getHashParameters('loadingScreen', LoadingScreenStyles.SKELETON);
  const loadingScreenStyle = Object.values(LoadingScreenStyles).includes(loadingScreen)
    ? loadingScreen
    : LoadingScreenStyles.SKELETON;
  store.dispatch(actions.setLoadingScreenStyle(loadingScreenStyle));
  const persistor = persistStore(store);

  if (!window.isApryseWebViewerWebComponent) {
    window.store = store;
  }

  return { store, persistor, instanceId };
}

export function setupHotModuleReplacement(hotModule, store, instanceId) {
  if (process.env.NODE_ENV !== 'development' || !hotModule?.hot) {
    return;
  }

  hotModule.hot.accept('reducers/rootReducer', () => {
    // eslint-disable-next-line global-require
    const updatedReducer = require('reducers/rootReducer').createRootReducer(instanceId);
    store.replaceReducer(updatedReducer);
  });

  hotModule.hot.accept();
}

export function createInstanceI18n() {
  return window.isApryseWebViewerWebComponent ? i18next.createInstance() : i18next;
}

export function setupSpamToggleHelpers() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  window.disableSpam = () => {
    localStorageManager.setItemSynchronous('spamDisabled', 'true');
    location.reload();
  };

  window.enableSpam = () => {
    localStorageManager.setItemSynchronous('spamDisabled', 'false');
    location.reload();
  };
}

function createFullAPIReady(state) {
  if (!state.advanced.fullAPI && !state.viewer.isAccessibleMode) {
    return Promise.resolve();
  }

  window.Core.enableFullPDF();

  const fullApiScriptPath = window.isApryseWebViewerWebComponent
    ? `${window.webViewerPath}core/pdf/PDFNet.js`
    : '../core/pdf/PDFNet.js';

  if (state.viewer.isAccessibleMode) {
    console.warn('FullAPI is required for accessibleMode. It has been automatically enabled to ensure accesible reading order mode will work.');
  }

  return loadScript(fullApiScriptPath);
}

function applyCoreRuntimeFlags() {
  if (getHashParameters('disableLogs', false)) {
    window.Core.disableLogs(true);
  }

  const disableObjectURLBlobs = getHashParameters('disableObjectURLBlobs', false);
  if (disableObjectURLBlobs) {
    window.Core.disableObjectURLBlobs(disableObjectURLBlobs);
  }

  window._disableStreaming = getHashParameters('disableStreaming', false);
}

let leanScriptLoadPromise;
export function setupCorePathsAndLoadLeanScript() {
  const corePath = window.isApryseWebViewerWebComponent ? `${window.webViewerPath}core` : '../core';
  const resourcesPath = window.isApryseWebViewerWebComponent ? `${window.webViewerPath}core/assets` : '../core/assets';
  const leanScriptPath = window.isApryseWebViewerWebComponent
    ? `${window.webViewerPath}core/pdf/PDFNetLean.js`
    : '../core/pdf/PDFNetLean.js';

  window.Core.setWorkerPath(corePath);
  window.Core.setResourcesPath(resourcesPath);
  // Core and its PDFNet namespace are shared by every Web Component instance, so the lean script only needs to run once.
  if (!leanScriptLoadPromise) {
    leanScriptLoadPromise = loadScript(leanScriptPath).then((didLoad) => {
      if (!didLoad) {
        leanScriptLoadPromise = null;
      }
      return didLoad;
    });
  }
  return leanScriptLoadPromise;
}

function getWorkerTransportPromise() {
  if (window.parent.WebViewer && !window.isApryseWebViewerWebComponent) {
    return window.parent.WebViewer.workerTransportPromise(window.frameElement);
  }

  if (window.isApryseWebViewerWebComponent && window.apryseWorkerTransportPromise) {
    return window.apryseWorkerTransportPromise;
  }

  return undefined;
}

function configureSharedWorkerTransport(state) {
  const isUsingSharedWorker = state.advanced.useSharedWorker === 'true' || state.advanced.useSharedWorker === true;
  if (!isUsingSharedWorker) {
    return;
  }

  try {
    const workerTransportPromise = getWorkerTransportPromise();

    // Originally the option was just for the PDF worker transport promise; now it can be an object containing both the PDF and office promises.
    if (workerTransportPromise.pdf || workerTransportPromise.office) {
      window.Core.setWorkerTransportPromise(workerTransportPromise);
    } else {
      window.Core.setWorkerTransportPromise({ pdf: workerTransportPromise });
    }
  } catch (e) {
    console.warn(e);
    if (e.name === 'SecurityError') {
      console.warn('workerTransportPromise option cannot be used with CORS');
    }
  }
}

function applyBackendSettings(state, instanceRootNode) {
  const backendType = getHashParameters('pdf');
  if (backendType) {
    window.Core.forceBackendType(backendType);
  }

  if (!state.advanced.enableOptimizedWorkers) {
    window.Core.disableOptimizedWorkers();
  }

  // Re-read the css attribute per-instance: `state.advanced.customCSS` is
  // frozen at module load time (initialState.js evaluates getHashParameters
  // eagerly), so in multi-WC / dispose-and-recreate scenarios it carries the
  // FIRST instance's value. Resolve fresh from the current host element so a
  // freshly created WC's `css` attribute actually takes effect.
  let customCSS = state.advanced.customCSS;
  if (window.isApryseWebViewerWebComponent && instanceRootNode) {
    const wcHost = instanceRootNode.host || instanceRootNode;
    customCSS = getHashParameterFromHost(wcHost, 'css', null) || customCSS;
  }
  loadCustomCSS(customCSS, instanceRootNode);
}

function createInstanceDocumentViewer(store, instanceI18n, instanceRootNode) {
  logDebugInfo();

  const instanceId = nextInstanceId++;
  core.registerInstance(instanceId);
  if (window.isApryseWebViewerWebComponent && instanceRootNode && instanceRootNode !== document) {
    setInstanceRootNode(instanceId, instanceRootNode);
  }
  const documentViewer = addDocumentViewer(1, instanceId);
  setupOpenURLHandler(documentViewer, store);
  setupFormSubmissionHandler(documentViewer, store);

  store.dispatch(actions.setInstanceId(instanceId));
  store.dispatch(actions.setActiveDocumentViewerKey(1));

  if (getHashParameters('hideDetachedReplies', false)) {
    documentViewer.getAnnotationManager().hideDetachedReplies();
  }

  defineWebViewerInstanceUIAPIs(store, 1, instanceI18n, instanceRootNode);
  setItemToFlyoutStore(store);

  return { documentViewer, instanceId };
}

function setupMultiInstanceActivation(instanceId, instanceRoot) {
  if (!window.isApryseWebViewerWebComponent) {
    return undefined;
  }

  const activateThisInstance = () => core.setCurrentInstanceId(instanceId);

  activateThisInstance();

  // Listen for user interaction inside this instance's shadow root.
  const root = instanceRoot;
  if (!root || root === document) {
    return undefined;
  }

  root.addEventListener('pointerdown', activateThisInstance, true);
  root.addEventListener('focusin', activateThisInstance, true);
  return () => {
    root.removeEventListener('pointerdown', activateThisInstance, true);
    root.removeEventListener('focusin', activateThisInstance, true);
  };
}

function getWorkersToLoad(preloadWorker) {
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
}

function initWorkerTransports(preloadWorker, documentViewer, store) {
  const { PDF, OFFICE, LEGACY_OFFICE, CONTENT_EDIT, OFFICE_EDITOR, SPREADSHEET_EDITOR } = workerTypes;
  const workersToLoad = getWorkersToLoad(preloadWorker);

  if (workersToLoad.includes(PDF)) {
    getBackendPromise(getHashParameters('pdf', 'auto')).then((pdfType) => {
      window.Core.initPDFWorkerTransports(pdfType, {
        workerLoadingProgress: (percent) => {
          store.dispatch(actions.setLoadingProgress(percent));
        },
      });
    });
  }

  if (workersToLoad.includes(OFFICE)) {
    getBackendPromise(getHashParameters('office', 'auto')).then((officeType) => {
      window.Core.initOfficeWorkerTransports(officeType, {
        workerLoadingProgress: (percent) => {
          store.dispatch(actions.setLoadingProgress(percent));
        },
      });
    });
  }

  if (workersToLoad.includes(OFFICE_EDITOR)) {
    window.Core.initOfficeEditorWorkerTransports({
      workerLoadingProgress: (percent) => {
        store.dispatch(actions.setLoadingProgress(percent));
      },
    });
  }

  if (workersToLoad.includes(LEGACY_OFFICE)) {
    getBackendPromise(getHashParameters('legacyOffice', 'auto')).then((officeType) => {
      window.Core.initLegacyOfficeWorkerTransports(officeType, {
        workerLoadingProgress: (percent) => {
          store.dispatch(actions.setLoadingProgress(percent));
        },
      });
    });
  }

  if (workersToLoad.includes(CONTENT_EDIT)) {
    window.Core.ContentEdit.preloadWorker(documentViewer.getContentEditManager());
  }

  if (workersToLoad.includes(SPREADSHEET_EDITOR)) {
    window.Core.initSpreadsheetEditorWorkerTransports({
      workerLoadingProgress: (percent) => {
        store.dispatch(actions.setLoadingProgress(percent));
      },
    });
  }
}

async function validateUIConfigOrigin(uiConfigURL) {
  if (uiConfigURL.origin === window.location.origin) {
    return true;
  }

  // Load the allowed origins list from configorigin.txt using the same mechanism as loadConfig: https://github.com/XodoDocs/webviewer/blob/master/src/ui/src/helpers/loadScript.js.
  const response = await fetch('configorigin.txt');
  let data = '';
  if (response.ok) {
    data = await response.text();
  }

  data = data.replaceAll('\r', '\n').replaceAll('\t', '\n');
  const allowedOrigins = data.split('\n').filter(Boolean);

  if (!wildCardMatch(allowedOrigins, uiConfigURL.origin)) {
    console.warn(`uiConfig requested from origin ${uiConfigURL.origin}. Add this origin to lib/ui/configorigin.txt to allow loading this UI configuration.`);
    return false;
  }

  return true;
}

async function getValidatedUIConfigURL(uiConfigPath) {
  let uiConfigURL;

  try {
    // Normalize to a URL object to handle both absolute and relative paths.
    uiConfigURL = new URL(uiConfigPath, window.location.href);
  } catch {
    console.warn(`Failed to parse uiConfiguration URL: ${uiConfigPath}`);
    return null;
  }

  if (!UI_CONFIG_ALLOWED_PROTOCOLS.has(uiConfigURL.protocol)) {
    console.warn(`uiConfig requested with unsupported protocol ${uiConfigURL.protocol}.`);
    return null;
  }

  const isOriginAllowed = await validateUIConfigOrigin(uiConfigURL);
  if (!isOriginAllowed) {
    return null;
  }

  return uiConfigURL;
}

async function loadUiConfigIfPresent(store) {
  const uiConfigPath = getHashParameters('uiConfig', '');
  if (!uiConfigPath) {
    return;
  }

  try {
    const validatedUIConfigURL = await getValidatedUIConfigURL(uiConfigPath);
    if (!validatedUIConfigURL) {
      return;
    }

    const uiConfigRequest = await fetch(validatedUIConfigURL.href);
    const uiConfig = await uiConfigRequest.json();
    await importModularComponents(store)(uiConfig);
  } catch (e) {
    console.error(`Failed to load uiConfiguration from: ${uiConfigPath}`);
    console.error(e);
  }
}

function preloadWorkersIfConfigured(preloadWorker, documentViewer, store) {
  if (preloadWorker) {
    initWorkerTransports(preloadWorker, documentViewer, store);
  }
}

function applyDocumentViewerRuntimeSettings(documentViewer) {
  if (getHashParameters('disableVirtualDisplayMode', false)) {
    const displayMode = documentViewer.getDisplayModeManager();
    displayMode.disableVirtualDisplayMode();
  }

  if (getHashParameters('enableViewStateAnnotations', false)) {
    const tool = documentViewer.getTool(window.Core.Tools.ToolNames.STICKY);
    tool?.enableViewStateSaving();
  }
}

function resolveInitialLanguage(store) {
  const currentLanguage = store.getState().viewer.currentLanguage;
  const defaultLanguage = getHashParameters('defaultLanguage', 'en');

  return currentLanguage || defaultLanguage;
}

function resolveInitialTheme(store) {
  const currentTheme = store.getState().viewer.activeTheme;
  const requestedTheme = getHashParameters('theme', null);

  return Object.values(Theme).includes(requestedTheme) ? requestedTheme : currentTheme;
}

function updateInstanceTheme(store, theme) {
  if (!theme) {
    return;
  }

  const currentTheme = store.getState().viewer.activeTheme;
  if (currentTheme !== theme) {
    store.dispatch(actions.setActiveTheme(theme));
  }
}

// The global i18next may never initialize in Web Component mode, so keep its pending language at module scope.
// A closure registered per instance would share scope with that instance's i18n and keep the instance alive.
let pendingGlobalLanguage;
function applyPendingGlobalLanguage() {
  i18next.off('initialized', applyPendingGlobalLanguage);
  void i18next.changeLanguage(pendingGlobalLanguage).catch(() => undefined);
}

export function updateInstanceLanguage(instanceI18n, language) {
  // nsSeparator is the colon. We do not currently use this because a customer requested removing the colon from the namespace after it broke their labels. Avoid calling init() a second time for createInstance() instances because the first init (in setupI18n) may still be in flight and a second init() would corrupt options/services. Instead, apply the two settings directly.
  if (instanceI18n.options) {
    instanceI18n.options.nsSeparator = false;
  }

  const changeToLanguage = () => {
    try {
      instanceI18n.changeLanguage(language);
    } catch {
      // instance not ready yet - ignore, the language will be set on next call
    }
    // In Web Component multi-instance mode, also flip the global i18next so legacy callsites
    // (rightToLeft.js, sortStrategies.js, src/ui/src/event-listeners/*) that
    // import the global directly stay in sync with the per-instance one.
    if (instanceI18n !== i18next) {
      try {
        if (i18next.isInitialized) {
          i18next.changeLanguage(language);
        } else {
          pendingGlobalLanguage = language;
          i18next.off('initialized', applyPendingGlobalLanguage);
          i18next.on('initialized', applyPendingGlobalLanguage);
        }
      } catch {
        // global may not be ready yet; per-instance change above is authoritative
      }
    }
  };

  if (instanceI18n.isInitialized) {
    changeToLanguage();
    return;
  }

  instanceI18n.on('initialized', changeToLanguage);
}

function renderInstanceApp(rootNode, store, persistor, instanceI18n, removeEventHandlers) {
  const appElement = rootNode.getElementById('app');
  const app = (
    <EmotionProvider rootNode={rootNode}>
      <InstanceRootNodeContext.Provider value={rootNode}>
        <InstanceIdContext.Provider value={selectors.getInstanceId(store.getState())}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <I18nextProvider i18n={instanceI18n}>
                <DndProvider backend={HTML5Backend} options={{ rootElement: appElement }}>
                  <App removeEventHandlers={removeEventHandlers} instanceRootNode={rootNode}/>
                </DndProvider>
              </I18nextProvider>
            </PersistGate>
          </Provider>
        </InstanceIdContext.Provider>
      </InstanceRootNodeContext.Provider>
    </EmotionProvider>
  );

  ReactDOM.render(
    app,
    appElement,
  );

  if (window.isApryseWebViewerWebComponent) {
    retargetEvents(rootNode);
  }
}

function startAsyncUIInitialization({
  fullAPIReady,
  preloadWorker,
  documentViewer,
  store,
  persistor,
  instanceI18n,
  removeEventHandlers,
  rootNode,
  viewerInstanceId,
}) {
  // Every step runs bound to this instance:
  // by the time these continuations resolve,
  // a sibling instance may have become the ambient one.
  const inInstance = (fn) => runWithInstance(viewerInstanceId, fn);
  fullAPIReady
    .then(() => loadConfig())
    .then(async () => {
      inInstance(() => {
        preloadWorkersIfConfigured(preloadWorker, documentViewer, store);
        applyDocumentViewerRuntimeSettings(documentViewer);
      });
      await loadUiConfigIfPresent(store);
      inInstance(() => {
        setupLoadAnnotationsFromServer(store);
        updateInstanceTheme(store, resolveInitialTheme(store));
        updateInstanceLanguage(instanceI18n, resolveInitialLanguage(store));
      });
      if (store.themeUpdateQueue) {
        await store.themeUpdateQueue;
      }
      // Render into THIS instance's captured root, not the module-level singleton getRootNode(): under the Vite/ESM build the UI module is evaluated once and shared across every WebComponent instance, so by the time this callback runs (after several awaits) a sibling instance may have flipped the singleton, and rendering into it would mount this instance's React tree into another instance's shadow root.
      inInstance(() => renderInstanceApp(rootNode, store, persistor, instanceI18n, removeEventHandlers));
    })
    .catch((err) => {
      console.error('[WebViewer] Error during UI initialization:', err);
    });
}

export function unmountAndDeleteDocumentViewers(viewerInstanceId) {
  try {
    // closeDocument alone leaves the window, root node and ContentEdit listeners bound, which retain this instance's shadow root.
    // unmountInstance releases those without disposing the worker and other state shared with sibling Web Component instances.
    core.getDocumentViewers(viewerInstanceId).forEach((documentViewer) => {
      Promise.resolve(documentViewer.unmountInstance()).catch((err) => {
        console.warn('[WebViewer] Error while unmounting DocumentViewer:', err);
      });
    });
  } catch {
    // DocumentViewer may already be gone - ignore
  }
  core.unregisterInstance(viewerInstanceId);
}

export function buildInstanceCleanup(instanceRoot, removeEventHandlers, removeActivationHandlers, viewerInstanceId) {
  return () => {
    if (removeActivationHandlers) {
      removeActivationHandlers();
    }
    removeEventHandlers();

    unmountAndDeleteDocumentViewers(viewerInstanceId);

    const appEl = instanceRoot.getElementById('app');
    if (appEl) {
      ReactDOM.unmountComponentAtNode(appEl);
    }
    releaseRootNode(instanceRoot);
  };
}

function registerInstanceCleanup(instanceRoot, removeEventHandlers, removeActivationHandlers, viewerInstanceId) {
  instanceCleanups.set(
    instanceRoot,
    buildInstanceCleanup(instanceRoot, removeEventHandlers, removeActivationHandlers, viewerInstanceId),
  );
}

export function initializeCanvasInstance({ store, persistor, instanceI18n, instanceRootNode, instanceId }) {
  const initialTheme = resolveInitialTheme(store);
  const resolvedRootNode = instanceRootNode || getRootNode();

  // Set the html theme attribute before React renders to avoid light-theme first paint.
  applyPrePaintTheme(initialTheme, resolvedRootNode);

  const cspNonce = getCspNonce();
  ensureReactDraggableStyleEl(cspNonce);

  const instanceHotkeysManager = createHotkeysManager();
  setHotkeysManagerForStore(store, instanceHotkeysManager);

  const state = store.getState();
  const fullAPIReady = createFullAPIReady(state);
  applyCoreRuntimeFlags();
  setupCorePathsAndLoadLeanScript();
  configureSharedWorkerTransport(state);
  applyBackendSettings(state, instanceRootNode);

  const { preloadWorker } = state.advanced;
  const { documentViewer, instanceId: viewerInstanceId } = createInstanceDocumentViewer(store, instanceI18n, resolvedRootNode);

  const removeActivationHandlers = setupMultiInstanceActivation(viewerInstanceId, resolvedRootNode);
  setupI18n(state, instanceI18n, documentViewer);
  setEnableAnnotationNumbering(state);
  setUserPermission(state, 1);
  setViewportRelativeAnnotationPositioning(state, 1);
  setAutoSwitch();
  documentViewer.setToolMode(documentViewer.getTool(defaultTool));

  const { addEventHandlers, removeEventHandlers } = eventHandler(store, 1, false, instanceId);

  startAsyncUIInitialization({
    fullAPIReady,
    preloadWorker,
    documentViewer,
    store,
    persistor,
    instanceI18n,
    removeEventHandlers,
    rootNode: resolvedRootNode,
    viewerInstanceId,
  });
  addEventHandlers();

  const instanceRoot = resolvedRootNode;
  registerInstanceCleanup(instanceRoot, removeEventHandlers, removeActivationHandlers, viewerInstanceId);
}

export function destroyUIInstance(rootNode) {
  const cleanup = instanceCleanups.get(rootNode);
  if (cleanup) {
    cleanup();
    instanceCleanups.delete(rootNode);
  }
}
