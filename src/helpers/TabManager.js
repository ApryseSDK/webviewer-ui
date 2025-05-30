import core from 'core';
import { workerTypes } from 'constants/types';
import loadDocument from 'helpers/loadDocument';
import { setLoadingProgress } from 'actions/internalActions';
import actions from 'actions';
import selectors from 'selectors';
import getHashParameters from 'helpers/getHashParameters';
import fireEvent from 'helpers/fireEvent';
import downloadPdf from 'helpers/downloadPdf';
import Events from 'constants/events';
import isString from 'lodash/isString';
import DataElements from 'constants/dataElement';
import getRootNode, { getInstanceNode } from 'helpers/getRootNode';

export const enableMultiTab = () => (dispatch, getState) => {
  const state = getState();
  // if already in multi-tab mode do not recreate TabManager
  if (selectors.getIsMultiTab(state) && selectors.getTabManager(state)) {
    return;
  }
  const doc = core.getDocument();
  let docArr = [];
  if (doc) {
    docArr.push(doc);
  } else {
    let initialDoc = getHashParameters('d', '');
    initialDoc = initialDoc ? JSON.parse(initialDoc) : '';
    if (initialDoc) {
      if (Array.isArray(initialDoc)) {
        docArr = docArr.concat(initialDoc);
      } else {
        docArr.push(initialDoc);
      }
    }
  }
  const tabManager = new TabManager(docArr, [], { dispatch, getState });
  dispatch(actions.setMultiTab(true));
  dispatch(actions.setTabManager(tabManager));
  // Fix for event not firing on some devices
  setTimeout(() => {
    fireEvent(Events.TAB_MANAGER_READY);
  }, 300);


  // In some cases, enabling MultiTab and calling loadDocument can result
  // in a race condition where the viewer opens an empty multi-tab message
  // page. To prevent this, we are using a timeout.
  function docLoadedEvent() {
    const doc = core.getDocument();
    const tabs = selectors.getTabs(state);
    const exist = tabs.some((item) => item.options?.filename === doc.filename);
    if (!exist) {
      doc.getFileData().then((data) => {
        try {
          tabManager.addTab(new File([data], doc.getFilename()));
        } catch (error) {
          console.error(error);
        }
      });
    }
    core.removeEventListener('documentLoaded', docLoadedEvent);
  }
  core.addEventListener('documentLoaded', docLoadedEvent);
};

export function prepareMultiTab(initialDoc, store) {
  const extensions = getHashParameters('extension', null)?.split(',');
  if (extensions && extensions.length !== 1 && extensions.length !== initialDoc.length) {
    throw new Error(`'initialDoc' array length doesn't match 'extension' array length.
          Please add an extension for each document or add one for all documents.
          ex:
          Webviewer({ initialDoc: ['pdf_doc', 'word_doc'], extension: ['pdf', 'docx'] })
          OR
          Webviewer({ initialDoc: ['pdf_doc1', 'pdf_doc2', 'pdf_doc3'], extension: ['pdf'] })`);
  }
  if (extensions && extensions.length === 1) {
    console.warn(`Extension option '${extensions[0]}' will be applied to all tabs from the constructor.`);
  }
  store.dispatch(actions.setMultiTab(true));
  const tabManager = new TabManager(initialDoc, extensions, store);
  store.dispatch(actions.setTabManager(tabManager));
  tabManager.listenForAnnotChanges();
  // Fix for event not firing on some devices
  setTimeout(() => {
    fireEvent(Events.TAB_MANAGER_READY);
  }, 300);
}

export function removeFileNameExtension(filename, shouldRemoveSpace = true) {
  if (!filename) {
    return;
  }
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    filename = filename.substring(0, lastDotIndex);
  }
  if (shouldRemoveSpace) {
    return filename.replace(/\s+/g, '').toLowerCase();
  }
  return filename;
}

async function writeToDB(db, arrBuff, tabId) {
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');
  store.put(arrBuff, tabId);
  await tx.commit();
}

export function getNextNumberForUntitledDocument(tabs) {
  const untitledTabs = tabs.filter((tab) => tab.options.filename.includes('untitled-'));
  if (untitledTabs.length === 0) {
    return 1;
  }

  const untitledNumbers = untitledTabs.map((tab) => {
    const filename = tab.options.filename;
    const untitledNumber = filename.match(/\d+/);
    return untitledNumber ? parseInt(untitledNumber[0]) : 0;
  });
  const nextUntitledNumber = Math.max(...untitledNumbers) + 1;
  return nextUntitledNumber;
}

export default class TabManager {
  db;
  store;
  useDB;

  constructor(docArr, extensionArr, store) {
    this.store = store;
    const state = this.store.getState();
    this.useDB = !state.advanced.disableIndexedDB;
    const { tabs, isMultiTab } = state.viewer;

    if (this.useDB) {
      const req = indexedDB.open('WebViewer Files', 1);
      req.onerror = TabManager.indexedDBNotSupported;
      req.onsuccess = async () => {
        this.db = req.result;
        this.db.onerror = TabManager.throwError;
      };
      req.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('files');
      };
    }

    // if already in multi-tab mode and already save created the TabManager do not recreate TabManager
    if (isMultiTab && selectors.getTabManager(state)) {
      return;
    }

    docArr.forEach((doc, index) => {
      const extension = extensionArr && isString(doc) ? extensionArr[extensionArr.length > 1 ? index : 0] : undefined;
      let filename = `Document ${tabs.length + 1}`;
      if (isString(doc)) {
        filename = doc.substring(doc.lastIndexOf('/') + 1);
      } else if (doc instanceof window.Core.Document && doc.getFilename && doc.getFilename()) {
        filename = doc.getFilename();
      }
      tabs.push(new Tab(tabs.length, doc, this, {
        filename,
        extension,
      }, this.useDB));
    });

    this.store.dispatch(actions.setTabs(tabs));
    this.prepareTabEventListeners();

    core.addEventListener('documentLoaded', async () => {
      const state = this.store.getState();
      const { tabs, activeTab } = state.viewer;
      const { dispatch } = store;
      const currentTab = tabs.find((tab) => tab.id === activeTab);
      const documentType = await core.getDocument().getType();

      if (documentType === workerTypes.PDF || documentType === workerTypes.OFFICE) {
        await writeToDB(this.db, await core.getDocument().getFileData(), currentTab.id);
        const nextUntitledDocumentNumber = getNextNumberForUntitledDocument(tabs);
        currentTab.options['filename'] = core.getDocument().getFilename() || `untitled-${nextUntitledDocumentNumber}`;
        const refreshedTab = new Tab(
          activeTab,
          core.getDocument(),
          currentTab.tabManager,
          currentTab.options,
          currentTab.useDB,
        );
        refreshedTab.saveData.docInDB = true;
        const indexOfTabToBeReplaced = tabs.findIndex((tab) => tab.id === currentTab.id);
        tabs[indexOfTabToBeReplaced] = refreshedTab;
        const newTabs = [...tabs];
        dispatch(actions.setTabs(newTabs));
      }
    });
  }

  prepareTabEventListeners() {
    const documentViewer = core.getDocumentViewer(1);

    // To control if the document was downloaded or not after any document changes
    documentViewer.addEventListener('finishedRendering', () => {
      this.listenForAnnotChanges();
      this.listenToDocumentDownloaded(documentViewer);
    }, { once: true });
  }

  async setActiveTab(id, saveCurrentActiveTabState = true) {
    this.store.dispatch(actions.openElement(DataElements.PROGRESS_MODAL));
    this.store.dispatch(setLoadingProgress(0));

    const state = this.store.getState();
    const { tabs, activeTab } = state.viewer;
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    const isEmptyPageOpen = selectors.isElementOpen(state, DataElements.MULTITABS_EMPTY_PAGE);
    this.prepareTabEventListeners();
    const newTab = tabs.find((tab) => tab.id === id);
    if (!newTab) {
      return console.error(`Tab id not found: ${id}`);
    }
    if (currentTab) {
      await core.getDocumentViewer().getAnnotationManager().exportAnnotations();
      await core.getDocumentViewer().getAnnotationsLoadedPromise();
    }
    fireEvent(Events['BEFORE_TAB_CHANGED'], {
      currentTab: currentTab ? {
        src: currentTab.src,
        options: currentTab.options,
        id: currentTab.id,
        annotationsChanged: currentTab.changes.annotations,
        hasUnsavedChanges: currentTab.changes.hasUnsavedChanges
      } : null,
      nextTab: {
        src: newTab.src,
        options: newTab.options,
        id: newTab.id,
      },
    });
    // Need this timeout because window.dispatchEvent is synchronous
    // This will cause the document to be closed if the customer exports an XFDF or runs another async call here
    // Allow a timeout of 400ms for async calls to finish before closing the document.
    setTimeout(async () => {
      if (currentTab) {
        saveCurrentActiveTabState && await currentTab.saveCurrentActiveTabState(this.db);
        core.closeDocument();
      }
      this.store.dispatch(actions.setActiveTab(id));
      isEmptyPageOpen && this.store.dispatch(actions.closeElement(DataElements.MULTITABS_EMPTY_PAGE));
      await newTab.load(this.store.dispatch, this.db, this.getViewerState(state));
    }, 400);
  }

  getViewerState = (state) => {
    const currentViewerState = {};
    const viewerState = state.viewer;

    currentViewerState.documentContainerWidth = viewerState.documentContainerWidth;
    currentViewerState.documentContainerHeight = viewerState.documentContainerHeight;
    currentViewerState.isNotesPanelOpen = selectors.isElementOpen(state, 'notesPanel');
    currentViewerState.isLeftPanelOpen = selectors.isElementOpen(state, 'leftPanel');
    currentViewerState.isSearchPanelOpen = selectors.isElementOpen(state, 'searchPanel');
    currentViewerState.activeToolName = viewerState.activeToolName;

    return currentViewerState;
  };

  showDeleteWarning(tabToDelete) {
    const title = 'warning.closeFile.title';
    const message = 'warning.closeFile.message';
    const confirmationWarning = {
      message,
      title,
      onConfirm: () => {
        downloadPdf(this.store.dispatch).then(() => {
          tabToDelete.changes.hasUnsavedChanges = false;
          this.deleteTab(tabToDelete.id);
        });
      },
      onSecondary: () => {
        tabToDelete.changes.hasUnsavedChanges = false;
        this.deleteTab(tabToDelete.id);
      },
      confirmBtnText: 'action.download',
      secondaryBtnText: 'warning.closeFile.rejectDownloadButton',
      secondaryBtnClass: 'secondary-btn-custom',
      showAskAgainCheckbox: true,
      onClose: (disableWarning) => {
        disableWarning && this.store.dispatch(actions.disableDeleteTabWarning());
      }
    };
    this.store.dispatch(actions.showWarningMessage(confirmationWarning));
  }

  deleteTab(id) {
    const state = this.store.getState();
    const { tabs, activeTab } = state.viewer;
    const tabToDelete = tabs.find((tab) => tab.id === id);
    const shouldShowWarning = selectors.getShowDeleteTabWarning(state) && tabToDelete.changes.hasUnsavedChanges;

    if (shouldShowWarning) {
      this.showDeleteWarning(tabToDelete);
    } else {
      const [deletedTab] = tabs.splice(tabs.findIndex((tab) => tab.id === id), 1);
      deletedTab.delete(this.db);
      fireEvent(Events['TAB_DELETED'], {
        src: deletedTab.src,
        options: deletedTab.options,
        id: deletedTab.id,
      });
      if (id === activeTab && tabs.length) {
        this.setActiveTab(tabs[0].id);
      } else if (!tabs.length) {
        core.closeDocument();
        this.store.dispatch(actions.setActiveTab(null));
      }
      this.store.dispatch(actions.setTabs(tabs));
    }
  }

  async addTab(src, options = {}) {
    const saveCurrentTabState = options['saveCurrentActiveTabState'] || options['saveCurrent'];
    const useDB = options['useDB'] === false ? options['useDB'] && this.useDB : this.useDB;
    const shouldLoadTab = options['setActive'] || options['load'];
    const { tabs } = this.store.getState().viewer;
    const currId = tabs.reduce((highestId, tab) => {
      return tab.id > highestId ? tab.id : highestId;
    }, 0);
    if (!('filename' in options)) {
      options['filename'] = `Document ${currId + 2}`;
      if (isString(src)) {
        options['filename'] = src.substring(src.lastIndexOf('/') + 1);
      } else if (src instanceof window.Core.Document && src.getFilename && src.getFilename()) {
        options['filename'] = src.getFilename();
      } else if (src instanceof File || Object.prototype.toString.call(src) === '[object File]') {
        options['filename'] = src['name'];
      }
    }
    const tab = new Tab(currId + 1, src, this, options, useDB);
    tabs.push(tab);
    fireEvent(Events['TAB_ADDED'], {
      src: tab.src,
      options: tab.options,
      id: tab.id,
    });
    if (shouldLoadTab) {
      await this.setActiveTab(tab.id, saveCurrentTabState);
    }
    this.store.dispatch(actions.setTabs(tabs));
    return tab.id;
  }

  moveTab(from, to) {
    const { tabs } = this.store.getState().viewer;
    const tab = tabs.splice(from, 1)[0];
    tabs.splice(to, 0, tab);
    fireEvent(Events['TAB_MOVED'], {
      src: tab.src,
      options: tab.options,
      id: tab.id,
      prevIndex: from,
      newIndex: to,
    });
    this.store.dispatch(actions.setTabs(tabs));
  }

  listenForAnnotChanges() {
    const onAnnotChange = (_, __, info) => {
      if (info.imported) {
        return;
      }
      const { tabs, activeTab } = this.store.getState().viewer;
      const tab = tabs.find((t) => t.id === activeTab);
      // if we switch between multiviewer and multitab amd have annotations being removed,
      // we can end up with a events fired for tabs that are no longer in the store
      if (tab) {
        tab.changes.annotations = true;
        tab.changes.hasUnsavedChanges = true;
      }
      removeListeners();
    };
    const onFieldChange = () => {
      const { tabs, activeTab } = this.store.getState().viewer;
      const tab = tabs.find((t) => t.id === activeTab);
      if (tab) {
        tab.changes.annotations = true;
        tab.changes.hasUnsavedChanges = true;
      }
      removeListeners();
    };

    core.addEventListener('annotationChanged', onAnnotChange);
    core.addEventListener('fieldChanged', onFieldChange, { once: true });

    const removeListeners = () => {
      core.removeEventListener('annotationChanged', onAnnotChange);
      core.removeEventListener('fieldChanged', onFieldChange);
    };
    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  }

  listenToDocumentDownloaded = async (documentViewer) => {
    const { tabs, activeTab } = this.store.getState().viewer;
    const currentTab = tabs.find((tab) => tab.id === activeTab);

    const onFileDownloaded = () => {
      currentTab.changes.hasUnsavedChanges = false;
    };

    const onPagesUpdated = (info) => {
      if (info.source !== 'refresh') {
        currentTab.changes.hasUnsavedChanges = true;
      }
    };

    getInstanceNode().addEventListener(Events.FILE_DOWNLOADED, onFileDownloaded);
    documentViewer.addEventListener('pagesUpdated', onPagesUpdated);

    const removeListeners = () => {
      getInstanceNode().removeEventListener(Events.FILE_DOWNLOADED, onFileDownloaded);
      documentViewer.removeEventListener('pagesUpdated', onPagesUpdated);
    };

    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  };

  // eslint-disable-next-line generator-star-spacing
  *[Symbol.iterator]() {
    const { tabs } = this.store.getState().viewer;
    for (const tab of tabs) {
      yield tab;
    }
  }

  map(cb) {
    const mapped = [];
    let index = 0;
    const { tabs } = this.store.getState().viewer;
    for (const tab of tabs) {
      mapped.push(cb(tab, index++));
    }
    return mapped;
  }

  static throwError() {
    console.warn('File database has encountered an error. File data will not be saved when switching tabs');
  }

  static indexedDBNotSupported() {
    console.warn('IndexedDB is not supported, file data will not be saved');
  }

  static MAX_FILE_SIZE = 2.5e8; // 250MB (in bytes)
}

export class Tab {
  disabled = false;
  saveData = {
    annotInDB: false,
    docInDB: false,
    scrollTop: undefined, // Float
    scrollLeft: undefined, // Float
    page: null, // Int
    annots: null, // XFDF String
  };
  changes = {
    annotations: false,
    hasUnsavedChanges: false
  };

  id;
  src;
  options;
  useDB;
  tabManager;

  constructor(id, src, tabManager, options = {}, useDB = true) {
    this.id = id;
    this.src = src;
    this.options = options;
    this.useDB = useDB;
    this.tabManager = tabManager;
  }

  async preLoad(db) {
    if (!this.useDB) {
      return console.error('Cant preload tab with useDB = false');
    }
    const file = await fetch(this.src);
    this.saveData.docInDB = true;
    await writeToDB(db, await file.arrayBuffer(), this.id);
  }

  async load(dispatch, db, viewerState) {
    const annotsChanged = (this.saveData.annotInDB || this.saveData.annots);
    this.options.loadAnnotations = !annotsChanged;
    core.addEventListener('documentUnloaded', async () => {
      this.restorePageDataOnLoad(viewerState, dispatch);
      annotsChanged && await this.restoreAnnotDataOnLoad(db);
    }, { once: true });
    if (this.useDB && this.saveData.docInDB) {
      const tx = db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
      const req = store.get(this.id);
      req.onsuccess = async () => {
        const doc = req.result;
        loadDocument(dispatch, doc, this.options);
      };
      tx.commit();
    } else {
      loadDocument(dispatch, this.src, this.options);
    }
  }

  async saveCurrentActiveTabState(db) {
    this.disabled = true;
    this.savePageData();
    const document = core.getDocument();
    if (this.useDB && (document?.type === workerTypes.PDF && document.arePagesAltered() || this.src instanceof window.Core.Document)) {
      await this.saveFileData(db, document);
    } else if (this.changes.annotations) {
      if (this.useDB) {
        await this.saveAnnotDataInDB(db);
      } else {
        await this.saveAnnotData();
      }
    }
    this.disabled = false;
  }

  async saveFileData(db, document) {
    this.saveData.annotInDB = false;
    const xfdfString = await core.exportAnnotations();
    const data = await document.getFileData({
      xfdfString,
      flags: window.Core.SaveOptions.LINEARIZED,
      finishedWithDocument: true,
    });
    this.saveData.docInDB = true;
    await writeToDB(db, data, this.id);
  }

  async saveAnnotData() {
    this.saveData.annotInDB = false;
    const annotData = await core.exportAnnotations({ options: { fields: true, widgets: true, links: true } });
    if (annotData) {
      this.saveData.annots = annotData;
    }
  }

  async saveAnnotDataInDB(db) {
    const annotData = await core.exportAnnotations({ options: { fields: true, widgets: true, links: true } });
    if (annotData) {
      const annots = annotData;
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.put(annots, `${this.id}-annots`);
      await tx.commit();
      this.saveData.annotInDB = true;
    }
  }

  savePageData() {
    const docContainer = getRootNode()
      .getElementById('app')
      .getElementsByClassName('DocumentContainer')[0];
    this.saveData.scrollTop = docContainer.scrollTop;
    this.saveData.scrollLeft = docContainer.scrollLeft;
    this.saveData.page = core.getCurrentPage();
    const precision = 10000;
    this.saveData.zoom = Math.floor(core.getZoom() * precision) / precision;
  }

  restorePageDataOnLoad(viewerState, dispatch) {
    const docContainer = getRootNode()
      .getElementById('app')
      .getElementsByClassName('DocumentContainer')[0];

    const updateScroll = async () => {
      await core.getDocument().getDocumentCompletePromise();
      docContainer.scrollTo({
        top: this.saveData.scrollTop,
        left: this.saveData.scrollLeft,
      });
    };

    viewerState.isNotesPanelOpen && dispatch(actions.openElement('notesPanel'));
    viewerState.isLeftPanelOpen && dispatch(actions.openElement('leftPanel'));
    viewerState.isSearchPanelOpen && dispatch(actions.openElement('searchPanel'));
    viewerState.activeToolName && core.setToolMode(viewerState.activeToolName);

    const updateViewer = async () => {
      await core.getDocument().getDocumentCompletePromise();
      this.saveData.zoom && await core.zoomTo(this.saveData.zoom);
      this.saveData.page && await core.setCurrentPage(this.saveData.page);
    };

    core.addEventListener('documentLoaded', updateViewer, { once: true });

    !isNaN(this.saveData.scrollTop) && core.addEventListener('finishedRendering', updateScroll, { once: true });
    const removeListeners = () => {
      core.removeEventListener('documentLoaded', updateViewer);
      core.removeEventListener('finishedRendering', updateScroll);
    };
    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  }

  async updateAnnotations(db) {
    const state = this.tabManager.store.getState();
    const activeTabId = selectors.getActiveTab(state);
    if (activeTabId !== this.id) {
      return selectors.getTabs(state).find((tab) => tab.id === activeTabId).updateAnnotations(db);
    }

    if (this.saveData.annotInDB) {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const annotReq = store.get(`${this.id}-annots`);
      annotReq.onsuccess = async () => {
        await core.getDocument().getDocumentCompletePromise();
        await core.getAnnotationManager().importAnnotations(annotReq.result);
      };
      await tx.commit();
    } else if (this.saveData.annots) {
      await core.getDocument().getDocumentCompletePromise();
      await core.getAnnotationManager().importAnnotations(this.saveData.annots);
    }
  }

  async restoreAnnotDataOnLoad(db) {
    const updateAnnotations = () => this.updateAnnotations(db);
    const removeListeners = () => {
      core.removeEventListener('documentLoaded', updateAnnotations);
    };
    core.addEventListener('documentLoaded', updateAnnotations, { once: true });
    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  }

  async delete(db) {
    if (this.useDB) {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.delete(this.id);
      store.delete(`${this.id}-annot-states`);
      store.delete(`${this.id}-annots`);
      await tx.commit();
    }
  }
}
