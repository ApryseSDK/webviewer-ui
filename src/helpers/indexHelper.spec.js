import ReactDOM from 'react-dom';
import core from 'core';
import i18next from 'i18next';
import { getCurrentInstanceId, registerInstance, resetInstances } from 'core/documentViewers';
import getRootNode, { resetRootNode, setRootNode } from 'helpers/getRootNode';
import loadScript from 'helpers/loadScript';
import {
  buildInstanceCleanup,
  createInstanceStoreAndPersistor,
  createInstanceI18n,
  destroyUIInstance,
  initializeCanvasInstance,
  setupCorePathsAndLoadLeanScript,
  updateInstanceLanguage,
} from './indexHelper';

jest.mock('components/App', () => () => null);
jest.mock('helpers/loadScript', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(true)),
  loadConfig: () => Promise.resolve(),
}));
jest.mock('helpers/loadCustomCSS', () => () => {});

describe('buildInstanceCleanup', () => {
  let originalWebComponentMode;
  let host;
  let instanceRoot;

  beforeEach(() => {
    originalWebComponentMode = window.isApryseWebViewerWebComponent;
    window.isApryseWebViewerWebComponent = true;

    host = document.createElement('div');
    instanceRoot = host.attachShadow({ mode: 'open' });
    const appElement = document.createElement('div');
    appElement.id = 'app';
    instanceRoot.appendChild(appElement);
    document.body.appendChild(host);
    setRootNode(instanceRoot);
  });

  afterEach(() => {
    window.isApryseWebViewerWebComponent = originalWebComponentMode;
    resetRootNode();
    resetInstances();
    host.remove();
    jest.restoreAllMocks();
  });

  it('should release the instance and its mounted resources', () => {
    const documentViewer = {
      unmountInstance: jest.fn().mockResolvedValue(),
    };
    registerInstance(7);
    core.setDocumentViewer(1, documentViewer, 7);
    const removeEventHandlers = jest.fn();
    const removeActivationHandlers = jest.fn();
    const unmountComponent = jest.spyOn(ReactDOM, 'unmountComponentAtNode').mockImplementation(() => true);
    const cleanup = buildInstanceCleanup(instanceRoot, removeEventHandlers, removeActivationHandlers, 7);

    cleanup();

    expect(removeActivationHandlers).toHaveBeenCalledTimes(1);
    expect(removeEventHandlers).toHaveBeenCalledTimes(1);
    expect(documentViewer.unmountInstance).toHaveBeenCalledTimes(1);
    expect(core.getDocumentViewers(7)).toHaveLength(0);
    expect(unmountComponent).toHaveBeenCalledWith(instanceRoot.getElementById('app'));
    expect(getRootNode()).not.toBe(instanceRoot);
  });

  it('should tolerate an instance whose viewer and React tree are already gone', () => {
    instanceRoot.getElementById('app').remove();
    const removeEventHandlers = jest.fn();
    const cleanup = buildInstanceCleanup(instanceRoot, removeEventHandlers, undefined, 7);

    expect(cleanup).not.toThrow();
    expect(removeEventHandlers).toHaveBeenCalledTimes(1);
    expect(getRootNode()).not.toBe(instanceRoot);
  });
});

describe('updateInstanceLanguage', () => {
  let originalIsInitialized;

  beforeEach(() => {
    originalIsInitialized = i18next.isInitialized;
    i18next.isInitialized = false;
  });

  afterEach(() => {
    i18next.isInitialized = originalIsInitialized;
    jest.restoreAllMocks();
  });

  it('should apply only the latest pending language when global i18next initializes', async () => {
    const changeGlobalLanguage = jest.spyOn(i18next, 'changeLanguage').mockRejectedValue(new Error('not ready'));
    const instanceI18n = {
      isInitialized: true,
      options: {},
      changeLanguage: jest.fn(),
    };

    updateInstanceLanguage(instanceI18n, 'fr');
    updateInstanceLanguage(instanceI18n, 'de');
    i18next.emit('initialized');
    await Promise.resolve();

    expect(instanceI18n.options.nsSeparator).toBe(false);
    expect(instanceI18n.changeLanguage).toHaveBeenNthCalledWith(1, 'fr');
    expect(instanceI18n.changeLanguage).toHaveBeenNthCalledWith(2, 'de');
    expect(changeGlobalLanguage).toHaveBeenCalledTimes(1);
    expect(changeGlobalLanguage).toHaveBeenCalledWith('de');
  });
});

describe('setupCorePathsAndLoadLeanScript', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should retry loading the lean script after a failed attempt', async () => {
    loadScript.mockClear();
    loadScript.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    await setupCorePathsAndLoadLeanScript();
    await setupCorePathsAndLoadLeanScript();

    expect(loadScript).toHaveBeenCalledTimes(2);
  });
});

const createWebComponentRoot = () => {
  const host = document.createElement('apryse-webviewer');
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  const app = document.createElement('div');
  app.id = 'app';
  root.appendChild(app);
  return root;
};

const startInstance = () => {
  const instanceRootNode = createWebComponentRoot();
  const { store, persistor, instanceId } = createInstanceStoreAndPersistor(instanceRootNode);
  initializeCanvasInstance({ store, persistor, instanceI18n: createInstanceI18n(), instanceRootNode, instanceId });
  return { root: instanceRootNode, instanceId: store.getState().viewer.instanceId };
};

describe('Web Component instance lifecycle', () => {
  beforeEach(() => {
    window.isApryseWebViewerWebComponent = true;
    window.webViewerPath = '/lib/';
  });

  afterEach(() => {
    delete window.isApryseWebViewerWebComponent;
    delete window.webViewerPath;
    resetRootNode();
    resetInstances();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should give each instance its own viewer and make an instance current when the user interacts with it', () => {
    const first = startInstance();
    const second = startInstance();

    expect(first.instanceId).not.toBe(second.instanceId);
    expect(core.getDocumentViewers(first.instanceId)).toHaveLength(1);
    expect(core.getDocumentViewers(second.instanceId)).toHaveLength(1);
    expect(core.getDocumentViewer(1, first.instanceId)).not.toBe(core.getDocumentViewer(1, second.instanceId));

    first.root.getElementById('app').dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    expect(getCurrentInstanceId()).toBe(first.instanceId);
    second.root.getElementById('app').dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
    expect(getCurrentInstanceId()).toBe(second.instanceId);

    destroyUIInstance(first.root);
    destroyUIInstance(second.root);
  });

  it('should release only its own viewers when destroying one instance and leave the other instance current and usable', () => {
    const first = startInstance();
    const second = startInstance();
    const firstViewer = core.getDocumentViewer(1, first.instanceId);
    const secondViewer = core.getDocumentViewer(1, second.instanceId);
    jest.spyOn(firstViewer, 'unmountInstance').mockResolvedValue();
    jest.spyOn(secondViewer, 'unmountInstance').mockResolvedValue();
    jest.spyOn(firstViewer, 'removeEventListener');
    jest.spyOn(secondViewer, 'removeEventListener');

    destroyUIInstance(first.root);

    expect(firstViewer.unmountInstance).toHaveBeenCalled();
    expect(secondViewer.unmountInstance).not.toHaveBeenCalled();
    expect(firstViewer.removeEventListener).toHaveBeenCalled();
    expect(secondViewer.removeEventListener).not.toHaveBeenCalled();
    expect(core.getDocumentViewers(first.instanceId)).toHaveLength(0);
    expect(core.getDocumentViewers(second.instanceId)).toEqual([secondViewer]);
    expect(getCurrentInstanceId()).toBe(second.instanceId);
    first.root.getElementById('app').dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    expect(getCurrentInstanceId()).toBe(second.instanceId);

    destroyUIInstance(second.root);
  });

  it('should not reuse the id of a destroyed instance for an instance created afterwards', () => {
    const first = startInstance();
    destroyUIInstance(first.root);

    const second = startInstance();

    expect(second.instanceId).not.toBe(first.instanceId);
    expect(core.getDocumentViewers(first.instanceId)).toHaveLength(0);
    expect(core.getDocumentViewers(second.instanceId)).toHaveLength(1);

    destroyUIInstance(second.root);
  });
});
