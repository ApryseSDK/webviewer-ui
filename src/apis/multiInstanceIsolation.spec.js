import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import defineWebViewerInstanceUIAPIs from 'src/apis';
import { createHotkeysManager, setHotkeysManagerForStore } from 'helpers/hotkeysManager';
import * as rootNodeHelpers from 'helpers/getRootNode';
import { registerInstance, unregisterInstance, resetInstances, runWithInstance, setCurrentInstanceId } from 'core/documentViewers';
import fireEvent, { fireError } from 'helpers/fireEvent';
import { mergeDocument, mergeExternalWebViewerDocument } from 'helpers/pageManipulation';
import setLanguage from './setLanguage';
import searchTextFullFactory from './searchTextFull';
import { zoomIn, zoomOut } from 'helpers/zoom';
import { enableMultiTab, prepareMultiTab } from 'helpers/TabManager';
import { scheduleViewerLoadedEvent } from 'components/App/appLifecycle';
import toggleReaderMode from './toggleReaderMode';

jest.mock('helpers/readerMode', () => ({ enterReaderMode: jest.fn(), exitReaderMode: jest.fn() }));

const createDocumentViewer = () => {
  const viewer = new window.Core.DocumentViewer();
  let zoom = 1;
  jest.spyOn(viewer, 'zoomTo').mockImplementation((level) => {
    zoom = level;
  });
  jest.spyOn(viewer, 'getZoomLevel').mockImplementation(() => zoom);
  return viewer;
};

const mockMergeTarget = (documentViewer, mergeResults) => {
  const merge = jest.fn(() => Promise.resolve(mergeResults));
  jest.spyOn(documentViewer, 'getDocument').mockReturnValue({ mergeDocument: merge });
  jest.spyOn(documentViewer, 'setCurrentPage').mockImplementation(() => {});
  jest.spyOn(documentViewer, 'getScrollViewElement').mockReturnValue(document.createElement('div'));
  jest.spyOn(documentViewer, 'getViewerElement').mockReturnValue(document.createElement('div'));
  return merge;
};

const createInstance = (instanceId) => {
  const store = configureStore({
    reducer: rootReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
  });
  setHotkeysManagerForStore(store, createHotkeysManager());
  registerInstance(instanceId);
  store.dispatch(actions.setInstanceId(instanceId));
  const documentViewer = core.setDocumentViewer(1, createDocumentViewer(), instanceId);

  const host = {};
  jest.spyOn(rootNodeHelpers, 'getInstanceNode').mockReturnValue(host);
  defineWebViewerInstanceUIAPIs(store, 1);
  return { store, documentViewer, instance: host.instance };
};

// prepareMultiTab schedules a delayed TAB_MANAGER_READY. Dropping it keeps it from firing into a later test on a slow machine.
const prepareMultiTabWithoutReadyTimer = (srcs, store) => {
  jest.useFakeTimers();
  try {
    prepareMultiTab(srcs, store);
    jest.clearAllTimers();
  } finally {
    jest.useRealTimers();
  }
};

// Identity checks keep Jest from serializing real DocumentViewers (circular) in failure output.
const isOnly = (viewers, expected) => viewers.length === 1 && viewers[0] === expected;

describe('two WebViewer instances on the same page', () => {
  let first;
  let second;

  beforeEach(() => {
    first = createInstance(1);
    second = createInstance(2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetInstances();
  });

  it('should resolve only its own document viewers for each instance', () => {
    setCurrentInstanceId(2);

    expect(first.instance.Core.documentViewer === first.documentViewer).toBe(true);
    expect(isOnly(first.instance.Core.getDocumentViewers(), first.documentViewer)).toBe(true);
    expect(isOnly(second.instance.Core.getDocumentViewers(), second.documentViewer)).toBe(true);
    expect(first.instance.UI.getDocumentViewer() === first.documentViewer).toBe(true);
    expect(second.instance.UI.getDocumentViewer() === second.documentViewer).toBe(true);
  });

  it('should apply UI calls to the calling instance even when the user last interacted with the other one', () => {
    setCurrentInstanceId(2);

    first.instance.UI.setZoomLevel(1.5);

    expect(first.documentViewer.zoomTo).toHaveBeenCalledWith(1.5, undefined, undefined);
    expect(second.documentViewer.zoomTo).not.toHaveBeenCalled();
  });

  it('should deliver UI events only to listeners of the instance that fired them', async () => {
    const firstListener = jest.fn();
    const secondListener = jest.fn();
    first.instance.UI.addEventListener(first.instance.UI.Events.TOOLBAR_GROUP_CHANGED, firstListener);
    second.instance.UI.addEventListener(second.instance.UI.Events.TOOLBAR_GROUP_CHANGED, secondListener);
    setCurrentInstanceId(2);

    first.instance.UI.setToolbarGroup('toolbarGroup-Shapes', false);
    await Promise.resolve();

    expect(firstListener).toHaveBeenCalledWith('toolbarGroup-Shapes');
    expect(secondListener).not.toHaveBeenCalled();
  });

  it('should report a load error only to the instance that loaded the document', async () => {
    const firstListener = jest.fn();
    const secondListener = jest.fn();
    first.instance.UI.addEventListener(first.instance.UI.Events.LOAD_ERROR, firstListener);
    second.instance.UI.addEventListener(second.instance.UI.Events.LOAD_ERROR, secondListener);
    jest.spyOn(first.documentViewer, 'loadDocument').mockImplementation((src, options) => Promise.resolve().then(() => options.onError('invalid PDF')));

    const load = first.instance.UI.loadDocument('invalid.pdf', { extension: 'pdf' });
    setCurrentInstanceId(2);
    await load;
    await Promise.resolve();

    expect(firstListener).toHaveBeenCalledWith('invalid PDF');
    expect(secondListener).not.toHaveBeenCalled();
  });

  it('should report a page merge to the receiving instance when the drag started in the other one', async () => {
    const mergedListener = jest.fn();
    const sourceListener = jest.fn();
    second.instance.UI.addEventListener(second.instance.UI.Events.DOCUMENT_MERGED, mergedListener);
    first.instance.UI.addEventListener(first.instance.UI.Events.DOCUMENT_MERGED, sourceListener);
    mockMergeTarget(second.documentViewer, { filename: 'merged.pdf', pages: [1] });
    const merge = second.store.dispatch(mergeDocument({}, 1));
    setCurrentInstanceId(1);

    await merge;
    await Promise.resolve();

    expect(mergedListener).toHaveBeenCalledWith('merged.pdf', [1]);
    expect(sourceListener).not.toHaveBeenCalled();
  });

  it('should merge a page dragged from another WebViewer into the receiving instance and report it there', async () => {
    const mergedListener = jest.fn();
    const sourceListener = jest.fn();
    second.instance.UI.addEventListener(second.instance.UI.Events.DOCUMENT_MERGED, mergedListener);
    first.instance.UI.addEventListener(first.instance.UI.Events.DOCUMENT_MERGED, sourceListener);
    const targetMerge = mockMergeTarget(second.documentViewer, { filename: 'merged.pdf', pages: [3] });
    const sourceMerge = mockMergeTarget(first.documentViewer, {});
    const sourceFrame = document.createElement('iframe');
    sourceFrame.id = 'leftViewer';
    document.body.appendChild(sourceFrame);
    sourceFrame.contentWindow.extractedDataPromise = Promise.resolve('extracted');
    sourceFrame.contentWindow.pagesExtracted = [2];

    try {
      const merge = second.store.dispatch(mergeExternalWebViewerDocument('leftViewer', 3));
      setCurrentInstanceId(1);

      await expect(merge).resolves.toEqual({ filename: 'merged.pdf', pages: [3] });
      await Promise.resolve();
    } finally {
      sourceFrame.remove();
    }

    expect(targetMerge).toHaveBeenCalledWith('extracted', 3);
    expect(sourceMerge).not.toHaveBeenCalled();
    expect(mergedListener).toHaveBeenCalledWith('merged.pdf', [2]);
    expect(sourceListener).not.toHaveBeenCalled();
  });

  it('should reject a failed page merge and close the receiving instance\'s loading modal', async () => {
    const error = new Error('merge failed');
    jest.spyOn(second.documentViewer, 'getDocument').mockReturnValue({ mergeDocument: () => Promise.reject(error) });

    await expect(second.store.dispatch(mergeDocument({}, 1))).rejects.toBe(error);

    expect(second.store.getState().viewer.openElements.loadingModal).toBeFalsy();
  });

  it('should track zoom step history per instance', () => {
    [first, second].forEach(({ documentViewer }) => {
      jest.spyOn(documentViewer, 'getDocument').mockReturnValue({ getType: () => 'pdf' });
      jest.spyOn(documentViewer, 'getScrollViewElement').mockReturnValue(document.createElement('div'));
      jest.spyOn(documentViewer, 'getViewerElement').mockReturnValue(document.createElement('div'));
    });
    const inInstance = (instanceId, fn) => {
      setCurrentInstanceId(instanceId);
      fn();
    };

    inInstance(1, () => {
      first.documentViewer.zoomTo(0.8);
      zoomOut();
    });
    inInstance(2, () => {
      second.documentViewer.zoomTo(0.8);
      zoomIn();
    });
    inInstance(1, () => zoomIn());

    expect(first.documentViewer.getZoomLevel()).toBeCloseTo(0.8);
    expect(second.documentViewer.getZoomLevel()).toBeCloseTo(1.05);
  });

  it('should reset zoom steps only in the instance whose zoom changed outside the zoom helper', () => {
    [first, second].forEach(({ documentViewer }) => {
      jest.spyOn(documentViewer, 'getDocument').mockReturnValue({ getType: () => 'pdf' });
      jest.spyOn(documentViewer, 'getScrollViewElement').mockReturnValue(document.createElement('div'));
      jest.spyOn(documentViewer, 'getViewerElement').mockReturnValue(document.createElement('div'));
    });
    const inInstance = (instanceId, fn) => {
      setCurrentInstanceId(instanceId);
      fn();
    };

    inInstance(2, () => {
      second.documentViewer.zoomTo(0.8);
      zoomIn();
    });
    inInstance(1, () => {
      first.documentViewer.zoomTo(0.8);
      zoomIn();
      first.documentViewer.zoomTo(3);
      zoomOut();
    });
    inInstance(2, () => zoomOut());

    expect(first.documentViewer.getZoomLevel()).toBeLessThan(3);
    expect(second.documentViewer.getZoomLevel()).toBeCloseTo(0.8);
  });

  it('should keep search results and search listeners with the instance that started the search', async () => {
    jest.useFakeTimers();
    const firstSearchListener = jest.fn();
    const secondSearchListener = jest.fn();
    first.instance.UI.addSearchListener(firstSearchListener);
    second.instance.UI.addSearchListener(secondSearchListener);
    const result = { pageNum: 1, resultStr: 'term' };
    jest.spyOn(first.documentViewer, 'search').mockImplementation(async function* () {
      setCurrentInstanceId(2);
      yield result;
      first.documentViewer.trigger('searchInProgress', [false]);
    });
    jest.spyOn(first.documentViewer, 'getPageSearchResults').mockReturnValue([result]);
    jest.spyOn(first.documentViewer, 'displayAdditionalSearchResults').mockImplementation(() => {});
    jest.spyOn(first.documentViewer, 'setActiveSearchResult').mockImplementation(() => {});
    jest.spyOn(second.documentViewer, 'displayAdditionalSearchResults').mockImplementation(() => {});

    try {
      await first.instance.UI.searchTextFull('term', {}, false);
      jest.advanceTimersByTime(100);
    } finally {
      jest.useRealTimers();
    }

    expect(first.documentViewer.displayAdditionalSearchResults).toHaveBeenCalledWith([result]);
    expect(second.documentViewer.displayAdditionalSearchResults).not.toHaveBeenCalled();
    expect(firstSearchListener).toHaveBeenCalledWith('term', expect.objectContaining({ caseSensitive: false }), [result]);
    expect(secondSearchListener).not.toHaveBeenCalled();
  });

  it('should apply and report a language change only to the instance that changed language', async () => {
    const firstListener = jest.fn();
    const secondListener = jest.fn();
    first.instance.UI.addEventListener(first.instance.UI.Events.LANGUAGE_CHANGED, firstListener);
    second.instance.UI.addEventListener(second.instance.UI.Events.LANGUAGE_CHANGED, secondListener);

    const change = first.instance.UI.setLanguage('fr');
    setCurrentInstanceId(2);
    await change;

    expect(second.store.getState().viewer.currentLanguage).not.toBe('fr');
  });

  it('should not cancel the pending language change of the other instance', async () => {
    // A superseded call never settles, so only the calls that win are awaited.
    first.instance.UI.setLanguage('fr');
    const secondChange = second.instance.UI.setLanguage('fr');
    const firstChange = first.instance.UI.setLanguage('fr');

    await Promise.all([secondChange, firstChange]);

    expect(first.store.getState().viewer.currentLanguage).toBe('fr');
    expect(second.store.getState().viewer.currentLanguage).toBe('fr');
  });

  it('should apply startup setLanguage to the store\'s own viewer, not the ambient one', async () => {
    const setDefaultMeasurementLabelsHandler = jest.fn();
    window.Core.Tools.ArcMeasurementCreateTool = { setDefaultMeasurementLabelsHandler };
    const i18n = { changeLanguage: jest.fn(() => Promise.resolve((key) => key)), dir: () => 'ltr' };

    const change = setLanguage(first.store, i18n)('fr');
    setCurrentInstanceId(2);
    await change;

    expect(setDefaultMeasurementLabelsHandler.mock.calls.map(([, viewer]) => viewer === first.documentViewer)).toEqual([true]);
  });

  it('should run a search started from the store against that store\'s viewer even when another instance is ambient', async () => {
    jest.spyOn(first.documentViewer, 'search').mockImplementation(async function* () {});
    jest.spyOn(second.documentViewer, 'search').mockImplementation(async function* () {});
    setCurrentInstanceId(2);

    await searchTextFullFactory(first.store)('term', {}, false, { shouldDispatchUIActions: false });

    expect(first.documentViewer.search).toHaveBeenCalledTimes(1);
    expect(second.documentViewer.search).not.toHaveBeenCalled();
  });

  it('should restore the display mode saved by the store\'s own instance when another instance is ambient', () => {
    jest.useFakeTimers();
    jest.spyOn(core, 'getDisplayMode').mockReturnValue('Continuous');
    const setDisplayMode = jest.spyOn(core, 'setDisplayMode').mockImplementation(() => {});
    jest.spyOn(selectors, 'isReaderMode').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const toggle = toggleReaderMode(first.store);

    setCurrentInstanceId(1);
    toggle();
    setCurrentInstanceId(2);
    toggle();
    jest.runAllTimers();
    jest.useRealTimers();

    expect(setDisplayMode).toHaveBeenCalledWith('Continuous');
  });

  it('should keep the other instance\'s viewer and APIs working after disposing one instance', () => {
    unregisterInstance(1);

    expect(first.instance.Core.getDocumentViewers()).toHaveLength(0);
    expect(isOnly(second.instance.Core.getDocumentViewers(), second.documentViewer)).toBe(true);
    second.instance.UI.setZoomLevel(2);
    expect(second.documentViewer.zoomTo).toHaveBeenCalledWith(2, undefined, undefined);
  });

  it('should add and remove fonts only in the instance that changed them', () => {
    first.instance.UI.Fonts.addAnnotationFont('Instance1Font');
    first.instance.UI.Fonts.addSignatureFont('Instance1Signature');

    expect(second.instance.UI.Fonts.getAnnotationFonts()).not.toContain('Instance1Font');
    expect(second.instance.UI.Fonts.getSignatureFonts()).not.toContain('Instance1Signature');

    first.instance.UI.Fonts.removeAnnotationFont('Helvetica');
    first.instance.UI.Fonts.removeSignatureFont('Satisfy');

    expect(second.instance.UI.Fonts.getAnnotationFonts()).toContain('Helvetica');
    expect(second.instance.UI.Fonts.getSignatureFonts()).toContain('Satisfy');
  });

  it('should set page dimension presets only in the instance that changed them', () => {
    first.instance.UI.setPresetCropDimensions('Instance1Crop', { yOffset: 0, height: 1, xOffset: 0, width: 1 });
    first.instance.UI.setPresetNewPageDimensions('Instance1Page', { height: 1, width: 1 });

    expect(second.store.getState().viewer.presetCropDimensions).not.toHaveProperty('Instance1Crop');
    expect(second.store.getState().viewer.presetNewPageDimensions).not.toHaveProperty('Instance1Page');
  });

  it('should add and remove measurement scale presets only in the instance that changed them', () => {
    const secondPresetCount = second.instance.UI.getMeasurementScalePreset('metric').length;

    first.instance.UI.addMeasurementScalePreset({ measurementSystem: 'metric', displayName: 'Instance1Scale', presetScale: [[1, 'cm'], [1, 'cm']] });
    expect(second.instance.UI.getMeasurementScalePreset('metric')).toHaveLength(secondPresetCount);

    first.instance.UI.removeMeasurementScalePreset('metric', 0);
    expect(second.instance.UI.getMeasurementScalePreset('metric')).toHaveLength(secondPresetCount);
  });

  it('should track unread annotations only in the instance that changed them', () => {
    first.store.dispatch(actions.setAnnotationReadState({ isRead: false, annotationId: 'instance1-annotation' }));

    expect(first.store.getState().viewer.unreadAnnotationIdSet.has('instance1-annotation')).toBe(true);
    expect(second.store.getState().viewer.unreadAnnotationIdSet.has('instance1-annotation')).toBe(false);
  });

  it('should delete and update panels only in the instance that changed them', () => {
    const [firstPanel] = first.instance.UI.getPanels();
    const secondPanelCount = second.store.getState().viewer.genericPanels.length;
    const secondLocation = second.instance.UI.getPanels()[0].location;

    firstPanel.location = secondLocation === 'left' ? 'right' : 'left';
    expect(second.instance.UI.getPanels()[0].location).toBe(secondLocation);

    firstPanel.delete();
    expect(second.store.getState().viewer.genericPanels).toHaveLength(secondPanelCount);
  });

  it('should deliver viewerLoaded only to the instance that scheduled it when another instance is current by then', async () => {
    jest.useFakeTimers();
    const firstListener = jest.fn();
    const secondListener = jest.fn();
    first.instance.UI.addEventListener(first.instance.UI.Events.VIEWER_LOADED, firstListener);
    second.instance.UI.addEventListener(second.instance.UI.Events.VIEWER_LOADED, secondListener);

    try {
      scheduleViewerLoadedEvent(1);
      setCurrentInstanceId(2);
      await jest.advanceTimersByTimeAsync(300);
    } finally {
      jest.useRealTimers();
    }

    expect(firstListener).toHaveBeenCalledTimes(1);
    expect(secondListener).not.toHaveBeenCalled();
  });

  it('should send tab manager events to the instance whose store created it when another instance is current', async () => {
    jest.useFakeTimers();
    const originalIndexedDB = window.indexedDB;
    window.indexedDB = { open: jest.fn(() => ({})) };
    const firstListener = jest.fn();
    const secondListener = jest.fn();
    first.instance.UI.addEventListener(first.instance.UI.Events.TAB_MANAGER_READY, firstListener);
    second.instance.UI.addEventListener(second.instance.UI.Events.TAB_MANAGER_READY, secondListener);

    try {
      setCurrentInstanceId(2);
      prepareMultiTab(['a.pdf', 'b.pdf'], first.store);
      await jest.advanceTimersByTimeAsync(300);
    } finally {
      jest.useRealTimers();
      window.indexedDB = originalIndexedDB;
    }

    expect(firstListener).toHaveBeenCalledTimes(1);
    expect(secondListener).not.toHaveBeenCalled();
  });

  it('should load a document into the instance that asked when a tab switch finishes after another instance became current', async () => {
    const originalIndexedDB = window.indexedDB;
    window.indexedDB = { open: jest.fn(() => ({})) };
    jest.spyOn(first.documentViewer, 'loadDocument').mockResolvedValue();
    jest.spyOn(second.documentViewer, 'loadDocument').mockResolvedValue();
    prepareMultiTabWithoutReadyTimer(['a.pdf', 'b.pdf'], first.store);
    first.store.dispatch(actions.setActiveTab(0));

    try {
      const load = first.instance.UI.loadDocument('c.pdf');
      setCurrentInstanceId(2);
      await load;
    } finally {
      window.indexedDB = originalIndexedDB;
    }

    expect(first.documentViewer.loadDocument).toHaveBeenCalledWith('c.pdf', expect.anything());
    expect(second.documentViewer.loadDocument).not.toHaveBeenCalled();
  });

  describe('multi-tab', () => {
    let originalIndexedDB;
    let documentContainer;

    beforeEach(() => {
      originalIndexedDB = window.indexedDB;
      window.indexedDB = { open: jest.fn(() => ({})) };
      // Tab.savePageData reads the scroll position from the first #app's document container.
      documentContainer = Object.assign(document.createElement('div'), { className: 'DocumentContainer' });
      const app = document.getElementById('app') ?? document.body.appendChild(Object.assign(document.createElement('div'), { id: 'app' }));
      app.prepend(documentContainer);
    });

    afterEach(() => {
      window.indexedDB = originalIndexedDB;
      documentContainer.remove();
    });

    const prepareFirstInstanceTabs = (srcs) => {
      prepareMultiTabWithoutReadyTimer(srcs, first.store);
      const tabs = selectors.getTabs(first.store.getState());
      tabs.forEach((tab) => {
        tab.useDB = false;
      });
      return { tabManager: selectors.getTabManager(first.store.getState()), tabs };
    };

    const waitUntil = async (condition) => {
      for (let attempt = 0; attempt < 200 && !condition(); attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      expect(condition()).toBe(true);
    };

    it('should send tab added, moved and deleted events only to the instance whose manager changed its tabs', async () => {
      const { tabManager } = prepareFirstInstanceTabs(['a.pdf', 'b.pdf']);
      const heard = { first: [], second: [] };
      ['TAB_ADDED', 'TAB_MOVED', 'BEFORE_TAB_DELETED', 'TAB_DELETED'].forEach((name) => {
        first.instance.UI.addEventListener(first.instance.UI.Events[name], () => heard.first.push(name));
        second.instance.UI.addEventListener(second.instance.UI.Events[name], () => heard.second.push(name));
      });

      setCurrentInstanceId(2);
      const addedTabId = await tabManager.addTab('c.pdf', { useDB: false });
      tabManager.moveTab(0, 1);
      await tabManager.deleteTab(addedTabId);

      expect(heard.first.sort()).toEqual(['BEFORE_TAB_DELETED', 'TAB_ADDED', 'TAB_DELETED', 'TAB_MOVED']);
      expect(heard.second).toEqual([]);
    });

    it('should save, close and load a tab switch in the instance that started it when another instance is current', async () => {
      const { tabManager, tabs: [currentTab, nextTab] } = prepareFirstInstanceTabs(['a.pdf', 'b.pdf']);
      first.store.dispatch(actions.setActiveTab(currentTab.id));
      currentTab.changes.annotations = true;
      const documents = { first: { type: 'pdf', arePagesAltered: () => false }, second: { type: 'pdf', arePagesAltered: () => false } };
      jest.spyOn(first.documentViewer, 'getDocument').mockReturnValue(documents.first);
      jest.spyOn(second.documentViewer, 'getDocument').mockReturnValue(documents.second);
      const spies = [first, second].map(({ documentViewer }) => ({
        exportAnnotations: jest.spyOn(documentViewer.getAnnotationManager(), 'exportAnnotations').mockResolvedValue('<xfdf/>'),
        closeDocument: jest.spyOn(documentViewer, 'closeDocument').mockResolvedValue(),
        loadDocument: jest.spyOn(documentViewer, 'loadDocument').mockResolvedValue(),
      }));

      const switching = tabManager.setActiveTab(nextTab.id);
      setCurrentInstanceId(2);
      await switching;

      expect(spies[0].exportAnnotations).toHaveBeenCalledTimes(1);
      expect(spies[0].closeDocument).toHaveBeenCalledTimes(1);
      expect(spies[0].loadDocument).toHaveBeenCalledWith('b.pdf', expect.anything());
      expect(spies[1].exportAnnotations).not.toHaveBeenCalled();
      expect(spies[1].closeDocument).not.toHaveBeenCalled();
      expect(spies[1].loadDocument).not.toHaveBeenCalled();
    });

    it('should send before and after tab changed events only to the instance whose tab switch finished loading while another instance is current', async () => {
      const { tabManager, tabs: [currentTab, nextTab] } = prepareFirstInstanceTabs(['a.pdf', 'b.pdf']);
      first.store.dispatch(actions.setActiveTab(currentTab.id));
      jest.spyOn(first.documentViewer, 'getDocument').mockReturnValue({
        type: 'pdf',
        arePagesAltered: () => false,
        getType: () => Promise.resolve('image'),
        getDocumentCompletePromise: () => Promise.resolve(),
      });
      jest.spyOn(first.documentViewer, 'closeDocument').mockResolvedValue();
      jest.spyOn(first.documentViewer, 'loadDocument').mockResolvedValue();
      const heard = { first: [], second: [] };
      ['BEFORE_TAB_CHANGED', 'AFTER_TAB_CHANGED'].forEach((name) => {
        first.instance.UI.addEventListener(first.instance.UI.Events[name], () => heard.first.push(name));
        second.instance.UI.addEventListener(second.instance.UI.Events[name], () => heard.second.push(name));
      });

      const switching = tabManager.setActiveTab(nextTab.id);
      setCurrentInstanceId(2);
      await switching;
      first.documentViewer.trigger('documentLoaded');
      await waitUntil(() => heard.first.includes('AFTER_TAB_CHANGED'));

      expect(heard.first).toEqual(['BEFORE_TAB_CHANGED', 'AFTER_TAB_CHANGED']);
      expect(heard.second).toEqual([]);
    });

    it('should clear unsaved changes only when the instance that owns the tab downloads its file', async () => {
      const { tabManager, tabs: [openTab] } = prepareFirstInstanceTabs(['a.pdf']);
      first.store.dispatch(actions.setActiveTab(openTab.id));
      openTab.changes.hasUnsavedChanges = true;

      setCurrentInstanceId(2);
      tabManager.listenToDocumentDownloaded(1);
      await runWithInstance(2, () => fireEvent('fileDownloaded'));
      expect(openTab.changes.hasUnsavedChanges).toBe(true);

      await runWithInstance(1, () => fireEvent('fileDownloaded'));
      expect(openTab.changes.hasUnsavedChanges).toBe(false);
    });

    it('should finish the next tab switch after the first instance cancels a password prompt while another instance is current', async () => {
      const { tabManager, tabs: [firstTab, secondTab] } = prepareFirstInstanceTabs(['a.pdf', 'b.pdf']);
      first.store.dispatch(actions.setActiveTab(firstTab.id));
      jest.spyOn(first.documentViewer, 'closeDocument').mockResolvedValue();
      jest.spyOn(first.documentViewer, 'loadDocument')
        .mockReturnValueOnce(new Promise(() => {}))
        .mockResolvedValue();

      // The password prompt never settles the load, so only the load error can release the tab switch.
      tabManager.setActiveTab(secondTab.id);
      setCurrentInstanceId(2);
      await waitUntil(() => first.documentViewer.loadDocument.mock.calls.length > 0);
      await runWithInstance(1, () => fireError({ type: 'PasswordUserCancelled' }, ''));
      await tabManager.setActiveTab(firstTab.id);

      expect(first.documentViewer.loadDocument).toHaveBeenLastCalledWith('a.pdf', expect.anything());
    });

    it('should close the document in the instance whose last tab was deleted when another instance is current', async () => {
      const { tabManager, tabs: [onlyTab] } = prepareFirstInstanceTabs(['a.pdf']);
      first.store.dispatch(actions.setActiveTab(onlyTab.id));
      const closeFirst = jest.spyOn(first.documentViewer, 'closeDocument').mockResolvedValue();
      const closeSecond = jest.spyOn(second.documentViewer, 'closeDocument').mockResolvedValue();

      const deleting = tabManager.deleteTab(onlyTab.id);
      setCurrentInstanceId(2);
      await deleting;

      expect(closeFirst).toHaveBeenCalledTimes(1);
      expect(closeSecond).not.toHaveBeenCalled();
    });

    it('should enable multi-tab with the first instance\'s document and notify only the first instance when another instance is current', async () => {
      jest.useFakeTimers();
      const firstDocument = { type: 'pdf', filename: 'first.pdf', getFilename: () => 'first.pdf' };
      jest.spyOn(first.documentViewer, 'getDocument').mockReturnValue(firstDocument);
      jest.spyOn(second.documentViewer, 'getDocument').mockReturnValue({ type: 'pdf', filename: 'second.pdf', getFilename: () => 'second.pdf' });
      const firstListener = jest.fn();
      const secondListener = jest.fn();
      first.instance.UI.addEventListener(first.instance.UI.Events.TAB_MANAGER_READY, firstListener);
      second.instance.UI.addEventListener(second.instance.UI.Events.TAB_MANAGER_READY, secondListener);

      try {
        setCurrentInstanceId(2);
        first.store.dispatch(enableMultiTab());
        await jest.advanceTimersByTimeAsync(300);
      } finally {
        jest.useRealTimers();
      }

      expect(selectors.getTabs(first.store.getState()).map((tab) => tab.src)).toEqual([firstDocument]);
      expect(selectors.getTabs(second.store.getState())).toHaveLength(0);
      expect(firstListener).toHaveBeenCalledTimes(1);
      expect(secondListener).not.toHaveBeenCalled();
    });
  });
});
