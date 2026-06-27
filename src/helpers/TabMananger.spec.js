import TabManager, { getNextNumberForUntitledDocument } from './TabManager';
import { getFileDataOptionsForTab } from './getFileDataOptionsForTab';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'actions';
import * as fireEvent from 'helpers/fireEvent';
import { setupMultiViewer, cleanUpMultiViewer, finalizeMultiViewerSetup } from 'helpers/multiViewerHelper';
import loadDocument from 'src/apis/loadDocument';
import core from 'core';


jest.mock('core', () => ({
  closeDocument: jest.fn(),
  loadDocument: jest.fn(() => Promise.resolve()),
  getDocumentViewer: jest.fn(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
  getDocumentViewers: jest.fn(() => []),
  getDocument: jest.fn(),
  getCurrentPage: jest.fn(),
  getZoom: jest.fn(),
  exportAnnotations: jest.fn(),
  getAnnotationManager: jest.fn(),
  zoomTo: jest.fn(),
  setCurrentPage: jest.fn(),
  setToolMode: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
jest.mock('helpers/loadDocument', () => {
  const coreModule = require('core');
  return jest.fn((dispatch, src, options, viewerKey) => {
    coreModule.loadDocument(src, options, viewerKey);
    return Promise.resolve();
  });
});
jest.mock('helpers/multiViewerHelper', () => {
  const actions = require('actions').default;
  return {
    __esModule: true,
    setupMultiViewer: jest.fn((store) => {
      store.dispatch(actions.setIsMultiViewerMode(true));
    }),
    cleanUpMultiViewer: jest.fn((store) => {
      store.dispatch(actions.setIsMultiViewerMode(false));
    }),
    finalizeMultiViewerSetup: jest.fn(),
  };
});
jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  getEventHandler: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
}));
jest.mock('helpers/getHashParameters', () => ({
  __esModule: true,
  default: jest.fn((param, defaultVal) => param === 'disableIndexedDB' ? true : defaultVal),
}));

function noop() {}

describe('getNextNumberForUntitledDocument', () => {
  it('should return 1 when there is no untitled document', () => {
    const tabs = [
      {
        options: {
          filename: 'sample-1',
        },
      },
      {
        options: {
          filename: 'sample-2',
        },
      },
    ];
    const nextNumber = getNextNumberForUntitledDocument(tabs);
    expect(nextNumber).toEqual(1);
  });
  it('should return the next number for an untitled document', () => {
    const tabs = [
      {
        options: {
          filename: 'untitled-1',
        },
      },
      {
        options: {
          filename: 'sample-1',
        },
      },
      {
        options: {
          filename: 'untitled-2',
        },
      },
    ];
    const nextNumber = getNextNumberForUntitledDocument(tabs);
    expect(nextNumber).toEqual(3);
  });
});

const tabProps = {
  changes: {},
  delete: noop,
};
const mockTabs = [
  { id: 1, options: { filename: 'doc1.pdf' }, src: 'doc1.pdf', ...tabProps },
  { id: 2, options: { filename: 'doc2.pdf' }, src: 'doc2.pdf', ...tabProps },
  { id: 3, options: { filename: 'doc3.pdf' }, src: 'doc3.pdf', ...tabProps },
  { id: 4, options: { filename: 'doc4.pdf' }, src: 'doc4.pdf', ...tabProps },
];

const createActiveMultiViewerTab = (overrides = {}) => ({
  ...mockTabs[0],
  isMultiViewer: true,
  viewerDocuments: {
    2: {
      id: '1-secondary',
      src: 'secondary.pdf',
      options: { filename: 'secondary.pdf' },
      changes: {},
    },
  },
  ...overrides,
});

const setupDocumentContainers = () => {
  document.body.innerHTML = `
    <div id="app">
      <div class="DocumentContainer"></div>
      <div class="DocumentContainer"></div>
    </div>
  `;
  const [primaryContainer, secondaryContainer] = document.getElementsByClassName('DocumentContainer');
  primaryContainer.scrollTo = jest.fn();
  secondaryContainer.scrollTo = jest.fn();
  return { primaryContainer, secondaryContainer };
};

const createListenerStore = () => {
  const listeners = {};
  const removeListener = (event, handler, key = 1) => {
    if (!listeners[key]?.[event]) {
      return;
    }
    listeners[key][event] = listeners[key][event]?.filter((listener) => listener.handler !== handler) || [];
  };
  core.addEventListener.mockImplementation((event, handler, options, key = 1) => {
    listeners[key] = listeners[key] || {};
    listeners[key][event] = listeners[key][event] || [];
    listeners[key][event].push({ handler, once: options?.once });
  });
  core.removeEventListener.mockImplementation(removeListener);

  return {
    trigger: async (key, event) => {
      const listenersToTrigger = [...(listeners[key]?.[event] || [])];
      for (const listener of listenersToTrigger) {
        await listener.handler();
        listener.once && removeListener(event, listener.handler, key);
      }
      await Promise.resolve();
    },
  };
};

const createMultiViewerTabs = async (tabManager, store) => {
  store.dispatch(actions.setActiveTab(null));
  await tabManager.addTab('doc1.pdf', { filename: 'doc1.pdf', useDB: false });
  await tabManager.updateTab(1, {
    isMultiViewer: true,
    document2: {
      src: 'doc2.pdf',
      options: { filename: 'doc2.pdf' },
    },
  });
  await tabManager.addTab('doc3.pdf', { filename: 'doc3.pdf', useDB: false });

  const [multiViewerTab, otherTab] = store.getState().viewer.tabs;
  store.dispatch(actions.setActiveTab(multiViewerTab.id));

  return { multiViewerTab, secondaryTab: multiViewerTab.document2, otherTab };
};

describe('TabManager', () => {
  let tabManager;
  let store;
  let originalWindowCore;
  beforeEach(() => {
    jest.clearAllMocks();
    core.getDocumentViewer.mockImplementation(() => ({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    core.getDocumentViewers.mockReturnValue([]);
    core.getDocument.mockReturnValue(null);
    core.getCurrentPage.mockReturnValue(1);
    core.getZoom.mockReturnValue(1);
    core.exportAnnotations.mockResolvedValue('');
    core.getAnnotationManager.mockReturnValue({ importAnnotations: jest.fn() });
    core.zoomTo.mockResolvedValue();
    core.setCurrentPage.mockResolvedValue();
    core.addEventListener.mockImplementation(() => {});
    core.removeEventListener.mockImplementation(() => {});
    fireEvent.default.mockImplementation(() => Promise.resolve());
    originalWindowCore = window.Core;
    window.Core.Document = function MockDocument() {};
    // Recreate #app with DocumentContainer children (afterEach clears document.body)
    document.body.innerHTML = '';
    const appEl = document.createElement('div');
    appEl.id = 'app';
    for (let i = 0; i < 2; i++) {
      const c = document.createElement('div');
      c.className = 'DocumentContainer';
      appEl.appendChild(c);
    }
    document.body.appendChild(appEl);
    store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    tabManager = new TabManager([], [], store);
    store.dispatch(actions.setActiveTab(1));
  });
  afterEach(() => {
    store = null;
    tabManager = null;
    window.Core = originalWindowCore;
    document.body.innerHTML = '';
  });

  describe('getFileDataOptionsForActiveTab', () => {
    it('should return the correct file data options for the active tab and create a new one if none exists', () => {
      // Set the password for tab 1
      const password = 'xyz';
      let options1 = getFileDataOptionsForTab(1);
      options1.password = password;

      // Check that the password was only updated for tab 1
      options1 = getFileDataOptionsForTab(1);
      const options2 = getFileDataOptionsForTab(2);
      expect(options1.password).toEqual(password);
      expect(options2.password).toBeUndefined();
    });
  });

  describe('Events', () => {
    it('should trigger beforeDocumentDeleted event before deleting a tab', async () => {
      const eventOrder = [];
      const mockedCloseDocument = jest.fn(() => eventOrder.push('closeDocument'));
      const mockedFireEvent = jest.fn(() => eventOrder.push('fireEvent'));
      fireEvent.default.mockImplementation(mockedFireEvent);
      mockTabs[1].delete = mockedCloseDocument;

      store.dispatch(actions.setTabs(mockTabs));

      await tabManager.deleteTab(2);
      // Verify the order of events
      expect(eventOrder[0]).toBe('fireEvent'); // beforeTabDeleted
      expect(eventOrder[1]).toBe('closeDocument');
    });

    it('should exit multi-viewer mode when deleting the last active tab', async () => {
      const activeMultiViewerTab = {
        ...createActiveMultiViewerTab(),
        changes: { annotations: false, hasUnsavedChanges: false },
        delete: jest.fn(async () => Promise.resolve()),
      };

      core.getDocumentViewers.mockReturnValue([{}, {}]);
      store.dispatch(actions.setTabs([activeMultiViewerTab]));
      store.dispatch(actions.setActiveTab(1));
      store.dispatch(actions.setIsMultiViewerMode(true));

      await tabManager.deleteTab(1);

      expect(store.getState().viewer.tabs).toHaveLength(0);
      expect(store.getState().viewer.activeTab).toBeNull();
      expect(store.getState().viewer.isMultiViewerMode).toBe(false);
    });

  });

  describe('MultiViewer tab state', () => {
    const clearMultiViewerTransitionMocks = ({ primaryContainer, secondaryContainer, annotationManagers } = {}) => {
      core.zoomTo.mockClear();
      core.setCurrentPage.mockClear();
      cleanUpMultiViewer.mockClear();
      setupMultiViewer.mockClear();
      primaryContainer?.scrollTo.mockClear();
      secondaryContainer?.scrollTo.mockClear();
      annotationManagers?.[1].importAnnotations.mockClear();
      annotationManagers?.[2].importAnnotations.mockClear();
    };

    const setupMultiViewerTabContext = async ({ hasAnnotationChanges = false } = {}) => {
      const containers = setupDocumentContainers();
      const coreEvents = createListenerStore();
      core.getDocumentViewers.mockReturnValue([
        { closeDocument: jest.fn(() => Promise.resolve()) },
        { closeDocument: jest.fn(() => Promise.resolve()) },
      ]);
      const annotationManagers = {
        1: { importAnnotations: jest.fn(() => Promise.resolve()) },
        2: { importAnnotations: jest.fn(() => Promise.resolve()) },
      };
      const { multiViewerTab, secondaryTab, otherTab } = await createMultiViewerTabs(tabManager, store);

      core.getAnnotationManager.mockImplementation((key) => annotationManagers[key]);
      const mockDocuments = {
        1: { type: 'type-1', getDocumentCompletePromise: jest.fn(() => Promise.resolve()) },
        2: { type: 'type-2', getDocumentCompletePromise: jest.fn(() => Promise.resolve()) },
      };
      core.getDocument.mockImplementation((key) => mockDocuments[key] ?? null);
      core.getCurrentPage.mockImplementation((key) => key === 2 ? 7 : 3);
      core.getZoom.mockImplementation((key) => key === 2 ? 2.34567 : 1.23456);
      core.exportAnnotations.mockImplementation((options, key) => Promise.resolve(`xfdf-${key}`));
      const { primaryContainer, secondaryContainer } = containers;
      primaryContainer.scrollTop = 12;
      primaryContainer.scrollLeft = 34;
      secondaryContainer.scrollTop = 56;
      secondaryContainer.scrollLeft = 78;

      if (hasAnnotationChanges) {
        multiViewerTab.changes.annotations = true;
        secondaryTab.changes.annotations = true;
      }

      const context = {
        ...containers,
        annotationManagers,
        coreEvents,
        multiViewerTab,
        secondaryTab,
        otherTab,
      };
      clearMultiViewerTransitionMocks(context);
      return context;
    };

    it('should set up multi-viewer when switching to a multi-viewer tab', async () => {
      const { multiViewerTab, otherTab } = await setupMultiViewerTabContext();

      store.dispatch(actions.setActiveTab(otherTab.id));

      await tabManager.setActiveTab(multiViewerTab.id);

      expect(store.getState().viewer.activeTab).toBe(multiViewerTab.id);
      expect(setupMultiViewer).toHaveBeenCalledWith(store, true, true);
      expect(cleanUpMultiViewer).not.toHaveBeenCalled();
    });

    it('should clean up multi-viewer when switching to a regular tab', async () => {
      const { otherTab } = await setupMultiViewerTabContext();

      await tabManager.setActiveTab(otherTab.id);

      expect(store.getState().viewer.activeTab).toBe(otherTab.id);
      expect(cleanUpMultiViewer).toHaveBeenCalledWith(store);
      expect(setupMultiViewer).not.toHaveBeenCalled();
    });

    it('should save page data and annotation changes when switching away from a multi-viewer tab', async () => {
      const { multiViewerTab, secondaryTab, otherTab } = await setupMultiViewerTabContext({
        hasAnnotationChanges: true,
      });

      await tabManager.setActiveTab(otherTab.id);

      expect(multiViewerTab.saveData).toMatchObject({
        scrollTop: 12,
        scrollLeft: 34,
        page: 3,
        zoom: 1.2345,
        annots: 'xfdf-1',
      });
      expect(secondaryTab.saveData).toMatchObject({
        scrollTop: 56,
        scrollLeft: 78,
        page: 7,
        zoom: 2.3456,
        annots: 'xfdf-2',
      });
    });

    it('should restore saved multi-viewer tab changes when switching back', async () => {
      const context = await setupMultiViewerTabContext({
        hasAnnotationChanges: true,
      });
      const {
        annotationManagers,
        coreEvents,
        multiViewerTab,
        otherTab,
        primaryContainer,
        secondaryContainer,
      } = context;

      await tabManager.setActiveTab(otherTab.id);

      await coreEvents.trigger(1, 'documentLoaded');
      await coreEvents.trigger(1, 'finishedRendering');
      clearMultiViewerTransitionMocks(context);

      await tabManager.setActiveTab(multiViewerTab.id);

      expect(store.getState().viewer.activeTab).toBe(multiViewerTab.id);

      await coreEvents.trigger(1, 'documentLoaded');
      await coreEvents.trigger(2, 'documentLoaded');
      await coreEvents.trigger(1, 'finishedRendering');
      await coreEvents.trigger(2, 'finishedRendering');

      expect(core.zoomTo).toHaveBeenCalledWith(1.2345, undefined, undefined, 1);
      expect(core.zoomTo).toHaveBeenCalledWith(2.3456, undefined, undefined, 2);
      expect(core.setCurrentPage).toHaveBeenCalledWith(3, 1);
      expect(core.setCurrentPage).toHaveBeenCalledWith(7, 2);
      expect(primaryContainer.scrollTo).toHaveBeenCalledWith({ top: 12, left: 34 });
      expect(secondaryContainer.scrollTo).toHaveBeenCalledWith({ top: 56, left: 78 });
      expect(annotationManagers[1].importAnnotations).toHaveBeenCalledWith('xfdf-1');
      expect(annotationManagers[2].importAnnotations).toHaveBeenCalledWith('xfdf-2');
    });
  });

  describe('updateTab', () => {
    it('should register primary-viewer-only documentLoaded capture', () => {
      expect(core.addEventListener).toHaveBeenCalledWith(
        'documentLoaded',
        expect.any(Function),
        undefined,
        1,
      );
    });

    it('should be able to update the src of a tab', async () => {
      store.dispatch(actions.setTabs(mockTabs));
      await tabManager.updateTab(2, { src: 'updatedDoc2.pdf' });
      const newTabs = store.getState().viewer.tabs;
      expect(newTabs.find((tab) => tab.id === 2).src).toBe('updatedDoc2.pdf');
    });
    it('should be able to update the options of a tab', async () => {
      store.dispatch(actions.setTabs(mockTabs));
      await tabManager.updateTab(2, { options: { filename: 'updatedDoc2.pdf' } });
      const newTabs = store.getState().viewer.tabs;
      expect(newTabs.find((tab) => tab.id === 2).options.filename).toBe('updatedDoc2.pdf');
    });
    it('should call update tab from UI.loadDocument calls', () => {
      tabManager.setActiveTab = noop;
      store.dispatch(actions.setMultiTab(true));
      store.dispatch(actions.setTabManager(tabManager));
      store.dispatch(actions.setTabs(mockTabs));
      loadDocument(store)('newDoc.pdf', { filename: 'New Doc' });
      const newTab = store.getState().viewer.tabs.find((tab) => tab.id === 1);
      expect(newTab.src).toBe('newDoc.pdf');
      expect(newTab.options.filename).toBe('New Doc');
    });

    it('should preserve multiViewer mode when updating tab without explicit isMultiViewer', async () => {
      tabManager.setActiveTab = noop;
      const multiViewerTabs = [createActiveMultiViewerTab()];
      store.dispatch(actions.setTabs(multiViewerTabs));

      await tabManager.updateTab(1, { src: 'updatedDoc1.pdf' });

      const newTab = store.getState().viewer.tabs.find((tab) => tab.id === 1);
      expect(newTab.isMultiViewer).toBe(true);
      expect(newTab.document2.src).toBe('secondary.pdf');
    });

    it('should not reload the active tab when only toggling isMultiViewer', async () => {
      const setActiveTabSpy = jest.spyOn(tabManager, 'setActiveTab').mockResolvedValue();
      const activeMultiViewerTab = createActiveMultiViewerTab({ isMultiViewer: false });

      store.dispatch(actions.setTabs([activeMultiViewerTab]));
      store.dispatch(actions.setActiveTab(1));

      await tabManager.updateTab(1, { isMultiViewer: true });

      expect(setActiveTabSpy).not.toHaveBeenCalled();
      const updatedTab = store.getState().viewer.tabs.find((tab) => tab.id === 1);
      expect(updatedTab.isMultiViewer).toBe(true);
      expect(updatedTab.document2.src).toBe('secondary.pdf');
    });

    it('should not reload secondary viewer when updating only primary document on active multi-viewer tab', async () => {
      const setActiveTabSpy = jest.spyOn(tabManager, 'setActiveTab').mockResolvedValue();
      const activeMultiViewerTab = createActiveMultiViewerTab();

      store.dispatch(actions.setTabs([activeMultiViewerTab]));
      store.dispatch(actions.setActiveTab(1));
      core.loadDocument.mockClear();

      await tabManager.updateTab(1, {
        src: 'updatedPrimary.pdf',
        options: { filename: 'updatedPrimary.pdf' },
        isMultiViewer: true,
      });

      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(core.loadDocument).toHaveBeenCalledWith(
        'updatedPrimary.pdf',
        expect.any(Object),
        1,
      );
      expect(core.loadDocument).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Object),
        2,
      );
    });

    it('should not call setActiveTab when updating only document2 on active tab', async () => {
      const setActiveTabSpy = jest.spyOn(tabManager, 'setActiveTab').mockResolvedValue();
      core.closeDocument.mockClear();
      core.getDocumentViewers.mockReturnValue([{}, {}]);
      const activeMultiViewerTab = createActiveMultiViewerTab();

      store.dispatch(actions.setTabs([activeMultiViewerTab]));
      store.dispatch(actions.setActiveTab(1));

      await tabManager.updateTab(1, {
        document2: {
          src: 'updatedSecondary.pdf',
          options: { filename: 'updatedSecondary.pdf' },
        },
        isMultiViewer: true,
      });

      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(core.closeDocument).not.toHaveBeenCalled();
      expect(core.loadDocument).toHaveBeenCalledWith(
        'updatedSecondary.pdf',
        expect.any(Object),
        2,
      );
    });

    it('should clear document2 without calling setActiveTab', async () => {
      const setActiveTabSpy = jest.spyOn(tabManager, 'setActiveTab').mockResolvedValue();
      core.closeDocument.mockClear();
      const activeMultiViewerTab = createActiveMultiViewerTab();

      store.dispatch(actions.setTabs([activeMultiViewerTab]));
      store.dispatch(actions.setActiveTab(1));

      await tabManager.updateTab(1, {
        isMultiViewer: true,
        clearDocument2: true,
      });

      const updatedTab = store.getState().viewer.tabs.find((tab) => tab.id === 1);
      expect(updatedTab.isMultiViewer).toBe(true);
      expect(updatedTab.document2).toBeUndefined();
      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(core.closeDocument).not.toHaveBeenCalled();
    });

    it('should clear primary src without calling setActiveTab', async () => {
      const setActiveTabSpy = jest.spyOn(tabManager, 'setActiveTab').mockResolvedValue();
      core.closeDocument.mockClear();
      const activeMultiViewerTab = createActiveMultiViewerTab();

      store.dispatch(actions.setTabs([activeMultiViewerTab]));
      store.dispatch(actions.setActiveTab(1));

      await tabManager.updateTab(1, {
        isMultiViewer: true,
        clearPrimaryDocument: true,
      });

      const updatedTab = store.getState().viewer.tabs.find((tab) => tab.id === 1);
      expect(updatedTab.src).toBeNull();
      expect(updatedTab.document2.src).toBe('secondary.pdf');
      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(core.closeDocument).not.toHaveBeenCalled();
    });

    it('should load into the active document viewer when documentViewerKey is omitted', () => {
      tabManager.setActiveTab = noop;
      store.dispatch(actions.setMultiTab(true));
      store.dispatch(actions.setTabManager(tabManager));
      store.dispatch(actions.setActiveDocumentViewerKey(2));
      store.dispatch(actions.setIsMultiViewerMode(true));
      store.dispatch(actions.setTabs(mockTabs));

      loadDocument(store)('newSecondaryDoc.pdf', { filename: 'New Secondary Doc' });

      const newTab = store.getState().viewer.tabs.find((tab) => tab.id === 1);
      expect(newTab.isMultiViewer).toBe(true);
      expect(newTab.document2.src).toBe('newSecondaryDoc.pdf');
      expect(newTab.document2.options.filename).toBe('New Secondary Doc');
    });

    it('should update an existing tab even when activeTab is not initialized', () => {
      tabManager.setActiveTab = noop;
      store.dispatch(actions.setMultiTab(true));
      store.dispatch(actions.setTabManager(tabManager));
      store.dispatch(actions.setTabs(mockTabs));
      store.dispatch(actions.setActiveTab(undefined));

      loadDocument(store)('newDocWithoutActiveTab.pdf', { filename: 'Doc Without Active Tab' }, 1);

      const tabs = store.getState().viewer.tabs;
      expect(tabs).toHaveLength(mockTabs.length);
      const updatedTab = tabs.find((tab) => tab.id === mockTabs[0].id);
      expect(updatedTab.src).toBe('newDocWithoutActiveTab.pdf');
      expect(updatedTab.options.filename).toBe('Doc Without Active Tab');
    });


    it('should reset activeDocumentViewerKey to 1 when viewer 2 does not exist', async () => {
      core.getDocumentViewers.mockReturnValue([{}]);
      store.dispatch(actions.setIsMultiViewerMode(true));
      store.dispatch(actions.setActiveDocumentViewerKey(2));

      await tabManager.addTab('newDoc.pdf');

      expect(store.getState().viewer.activeDocumentViewerKey).toBe(1);
    });


    it('should reset activeDocumentViewerKey to 1 when switching tabs removes viewer 2', async () => {
      const currentTab = {
        id: 1,
        src: 'doc1.pdf',
        options: { filename: 'doc1.pdf' },
        changes: { annotations: false, hasUnsavedChanges: false },
        saveCurrentActiveTabState: jest.fn(() => Promise.resolve()),
        load: jest.fn(() => Promise.resolve()),
      };
      const nextTab = {
        id: 2,
        src: 'doc2.pdf',
        options: { filename: 'doc2.pdf' },
        changes: { annotations: false, hasUnsavedChanges: false },
        saveCurrentActiveTabState: jest.fn(() => Promise.resolve()),
        load: jest.fn(() => {
          core.getDocumentViewers.mockReturnValue([{}]);
          return Promise.resolve();
        }),
      };

      core.getDocumentViewers.mockReturnValue([{}, {}]);
      store.dispatch(actions.setTabs([currentTab, nextTab]));
      store.dispatch(actions.setActiveTab(1));
      store.dispatch(actions.setIsMultiViewerMode(true));
      store.dispatch(actions.setActiveDocumentViewerKey(2));

      await tabManager.setActiveTab(2);

      expect(store.getState().viewer.activeDocumentViewerKey).toBe(1);
    });

    it('should close both viewer documents when switching tabs in multiviewer', async () => {
      const currentTab = {
        id: 1,
        src: 'doc1.pdf',
        options: { filename: 'doc1.pdf' },
        isMultiViewer: true,
        changes: { annotations: false, hasUnsavedChanges: false },
        saveCurrentActiveTabState: jest.fn(() => Promise.resolve()),
        load: jest.fn(() => Promise.resolve()),
      };
      const nextTab = {
        id: 2,
        src: 'doc2.pdf',
        options: { filename: 'doc2.pdf' },
        isMultiViewer: true,
        changes: { annotations: false, hasUnsavedChanges: false },
        saveCurrentActiveTabState: jest.fn(() => Promise.resolve()),
        load: jest.fn(() => Promise.resolve()),
      };

      core.closeDocument.mockClear();
      core.getDocumentViewers.mockReturnValue([{}, {}]);
      store.dispatch(actions.setTabs([currentTab, nextTab]));
      store.dispatch(actions.setActiveTab(1));

      await tabManager.setActiveTab(2);

      expect(core.closeDocument).toHaveBeenCalledWith();
      expect(core.closeDocument).toHaveBeenCalledWith(2);
    });

    it('should close progress modal and skip loading when active tab has no primary or secondary document', async () => {
      const currentTab = {
        id: 1,
        src: 'doc1.pdf',
        options: { filename: 'doc1.pdf' },
        changes: { annotations: false, hasUnsavedChanges: false },
        saveCurrentActiveTabState: jest.fn(() => Promise.resolve()),
        load: jest.fn(() => Promise.resolve()),
      };
      const emptyTab = {
        id: 2,
        src: null,
        options: { filename: 'doc2.pdf' },
        isMultiViewer: true,
        viewerDocuments: {},
        changes: { annotations: false, hasUnsavedChanges: false },
        saveCurrentActiveTabState: jest.fn(() => Promise.resolve()),
        load: jest.fn(() => Promise.resolve()),
      };

      store.dispatch(actions.setTabs([currentTab, emptyTab]));
      store.dispatch(actions.setActiveTab(1));

      await tabManager.setActiveTab(2);

      expect(emptyTab.load).not.toHaveBeenCalled();
      expect(store.getState().viewer.openElements.progressModal).toBe(false);
      expect(store.getState().viewer.activeTab).toBe(2);
      expect(store.getState().viewer.isMultiViewerMode).toBe(true);
    });
  });
});

const initialState = {
  viewer: {
    isMultiTab: true,
  },
  advanced: {
    disableI18n: false,
  },
};
describe('MultiTab IndexedDB', () => {
  it('indexedDB should get a unique id for each instance of WebViewer', () => {
    const originalDB = window.indexedDB;
    const mockIndexedDB = {
      open: jest.fn(() => ({})),
    };
    window.indexedDB = mockIndexedDB;
    const store = configureStore({ reducer: () => initialState });
    new TabManager([], [], store);
    expect(mockIndexedDB.open).toHaveBeenCalled();
    expect(mockIndexedDB.open.mock.calls[0][0]).toMatch(/WebViewer Files-0.\d+/);
    window.indexedDB = originalDB;
  });
});
