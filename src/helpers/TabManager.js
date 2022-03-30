import core from 'core';
import { workerTypes } from 'constants/types';
import loadDocument from 'helpers/loadDocument';
import { setLoadingProgress } from 'actions/internalActions';
import actions from 'actions';
import getHashParameters from 'helpers/getHashParameters';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import { isString } from 'lodash';

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
  fireEvent('onTabManagerReady', { tabManager });
}

export default class TabManager {
  db;
  store;
  useDB;

  constructor(docArr, extensionArr, store) {
    this.store = store;
    const { tabs } = this.store.getState().viewer;
    this.useDB = !this.store.getState().advanced.disableIndexedDB;
    docArr.forEach((doc, index) => {
      const extension = extensionArr && isString(doc) ? extensionArr[extensionArr.length > 1 ? index : 0] : undefined;
      let filename =   `Document ${tabs.length + 1}`;
      if (isString(doc)) {
        filename = doc.substring(doc.lastIndexOf('/') + 1);
      } else if (doc instanceof window.Core.Document && doc.getFilename && doc.getFilename()) {
        filename = doc.getFilename();
      }
      tabs.push(new Tab(tabs.length, doc, {
        filename,
        extension,
      }, this.useDB));
    });
    if (this.useDB) {
      const req = indexedDB.open('WebViewer Files', 1);
      req.onerror = TabManager.indexedDBNotSupported;
      req.onsuccess = async () => {
        this.db = req.result;
        this.db.onerror = TabManager.throwError;
      };
      req.onupgradeneeded = function(e) {
        e.target.result.createObjectStore('files');
      };
    }
    this.store.dispatch(actions.setTabs(tabs));
  }

  async setActiveTab(id, saveCurrent = false) {
    this.store.dispatch(actions.openElement('progressModal'));
    this.store.dispatch(setLoadingProgress(0));
    const { tabs, activeTab } = this.store.getState().viewer;
    const currentTab = tabs.find(tab => tab.id === activeTab);
    core.addEventListener('documentUnloaded', () => this.listenForAnnotChanges(), { once: true });
    if (currentTab) {
      saveCurrent && await currentTab.saveCurrent(this.db);
      core.closeDocument();
    }
    const newTab = tabs.find(tab => tab.id === id);
    if (!newTab) {
      return console.error(`Tab id not found: ${id}`);
    }
    fireEvent(Events['BEFORE_TAB_CHANGED'], {
      currentTab: currentTab ? {
        src: currentTab.src,
        options: currentTab.options,
        annotationsChanged: currentTab.changes.annotations,
        id: currentTab.id,
      } : null,
      nextTab: {
        src: newTab.src,
        options: newTab.options,
        id: newTab.id,
      },
    });
    this.listenForAnnotChanges();
    this.store.dispatch(actions.setActiveTab(id));
    await newTab.load(this.store.dispatch, this.db);
  }

  deleteTab(id) {
    const { tabs, activeTab } = this.store.getState().viewer;
    const [deletedTab] = tabs.splice(tabs.findIndex(tab => tab.id === id), 1);
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

  async addTab(src, options = {}) {
    const saveCurrent = options['saveCurrent'] === false ? options['saveCurrent'] : true;
    const useDB = options['useDB'] === false ? options['useDB'] && this.useDB : this.useDB;
    const load = options['load'] === false ? options['load'] : true;
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
      }
    }
    const tab = new Tab(currId + 1, src, options, useDB);
    tabs.push(tab);
    fireEvent(Events['TAB_ADDED'], {
      src: tab.src,
      options: tab.options,
      id: tab.id,
    });
    if (load) {
      this.moveTab(tabs.length - 1, 0);
      await this.setActiveTab(tab.id, saveCurrent);
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
    const { tabs, activeTab } = this.store.getState().viewer;
    const onAnnotChange = () => {
      const tab = tabs.find(t => t.id === activeTab);
      tab.changes.annotations = true;
    };
    const addAnnotListener = () => {
      core.addEventListener('annotationChanged', onAnnotChange, { once: true });
    };
    core.addEventListener('annotationsLoaded', addAnnotListener, { once: true });

    const removeListeners = () => {
      core.removeEventListener('annotationChanged', onAnnotChange);
      core.removeEventListener('annotationsLoaded', addAnnotListener);
    };
    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  }

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
    scrollTop: null, // Float
    scrollLeft: null, // Float
    page: null, // Int
    annots: null, // XFDF String
  };
  changes = {
    annotations: false,
  };

  id;
  src;
  options;
  useDB;

  constructor(id, src, options = {}, useDB = true) {
    this.id = id;
    this.src = src;
    this.options = options;
    this.useDB = useDB;
  }

  async preLoad(db) {
    if (!this.useDB) {
      return console.error('Cant preload tab with useDB = false');
    }
    const file = await fetch(this.src);
    await this.writeToDB(db, await file.arrayBuffer());
  }

  async load(dispatch, db) {
    core.addEventListener('documentUnloaded', async () => {
      this.restorePageDataOnLoad();
      this.saveData.annotInDB ? await this.restoreAnnotDataFromDBOnLoad(db) : this.restoreAnnotDataOnLoad();
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

  async saveCurrent(db) {
    this.disabled = true;
    this.savePageData();
    const document = core.getDocument();
    if (this.useDB && document?.type === workerTypes.PDF && document.doc?.arePagesAltered) {
      await this.saveFileData(db, document);
    } else if (this.useDB) {
      this.changes.annotations && await this.saveAnnotDataInDB(db);
    } else {
      this.changes.annotations && await this.saveAnnotData();
    }
    this.disabled = false;
  }

  async saveFileData(db, document) {
    const xfdfString = await core.exportAnnotations();
    const data = await document.getFileData({
      xfdfString,
      flags: window.Core.SaveOptions.LINEARIZED,
      finishedWithDocument: true,
    });
    await this.writeToDB(db, data);
  }

  async saveAnnotData() {
    this.saveData.annotInDB = false;
    const annotList = core.getAnnotationsList();
    if (annotList.length > 0) {
      this.saveData.annots = await core.exportAnnotations({ annotList });
    }
  }

  async saveAnnotDataInDB(db) {
    const annotList = core.getAnnotationsList();
    if (annotList.length > 0) {
      const annots = await core.exportAnnotations({ annotList });
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.put(annots, `${this.id}-annots`);
      await tx.commit();
      this.saveData.annotInDB = true;
    }
  }

  savePageData() {
    const docContainer = document.getElementsByClassName('DocumentContainer')[0];
    this.saveData.scrollTop = docContainer.scrollTop;
    this.saveData.scrollLeft = docContainer.scrollLeft;
    this.saveData.page = core.getCurrentPage();
    const precision = 10000;
    this.saveData.zoom = Math.floor(core.getZoom() * precision) / precision;
  }

  restorePageDataOnLoad() {
    const docContainer = document.getElementsByClassName('DocumentContainer')[0];

    const updateScroll = async () => {
      await core.getDocument().getDocumentCompletePromise();
      docContainer.scrollTop = this.saveData.scrollTop;
      docContainer.scrollLeft =  this.saveData.scrollLeft;
    };
    const updateZoom = async () => {
      await core.getDocument().getDocumentCompletePromise();
      core.zoomTo(this.saveData.zoom);
    };
    const updatePage = async () => {
      await core.getDocument().getDocumentCompletePromise();
      core.setCurrentPage(this.saveData.page);
    };

    this.saveData.scrollTop && core.addEventListener('finishedRendering', updateScroll, { once: true });
    this.saveData.zoom && core.addEventListener('documentLoaded', updateZoom, { once: true });
    this.saveData.page && core.addEventListener('documentLoaded', updatePage, { once: true });

    const removeListeners = () => {
      core.removeEventListener('documentLoaded', updatePage);
      core.removeEventListener('documentLoaded', updateZoom);
      core.removeEventListener('finishedRendering', updateScroll);
    };
    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  }

  restoreAnnotDataOnLoad() {
    const updateAnnotations = async () => {
      await core.getDocument().getDocumentCompletePromise();
      await core.getAnnotationManager().importAnnotations(this.saveData.annots);
      core.removeEventListener('annotationsLoaded', updateAnnotations);
    };
    this.saveData.annots && core.addEventListener('annotationsLoaded', updateAnnotations);

    const removeListeners = () => {
      core.removeEventListener('annotationsLoaded', updateAnnotations);
    };
    core.addEventListener('documentUnloaded', removeListeners, { once: true });
  }

  async restoreAnnotDataFromDBOnLoad(db) {
    if (this.saveData.annotInDB) {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      let annots;
      const annotReq = store.get(`${this.id}-annots`);
      annotReq.onsuccess = () => {
        annots = annotReq.result;
      };
      await tx.commit();
      const updateAnnotations = async () => {
        await core.getDocument().getDocumentCompletePromise();
        await core.getAnnotationManager().importAnnotations(annots);
        core.removeEventListener('annotationsLoaded', updateAnnotations);
      };
      core.addEventListener('annotationsLoaded', updateAnnotations);

      const removeListeners = () => {
        core.removeEventListener('annotationsLoaded', updateAnnotations);
      };
      core.addEventListener('documentUnloaded', removeListeners, { once: true });
    }
  }

  async writeToDB(db, arrBuff) {
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    store.put(arrBuff, this.id);
    this.saveData.docInDB = true;
    await tx.commit();
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