import TabManager, { getNextNumberForUntitledDocument } from './TabManager';
import { getFileDataOptionsForTab } from './getFileDataOptionsForTab';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'actions';
import * as fireEvent from 'helpers/fireEvent';
import loadDocument from 'src/apis/loadDocument';


jest.mock('core', () => ({
  closeDocument: jest.fn(),
  getDocumentViewer: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
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

describe('TabManager', () => {
  let tabManager;
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    tabManager = new TabManager([], [], store);
    store.dispatch(actions.setActiveTab(1));
  });
  afterEach(() => {
    store = null;
    tabManager = null;
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

  });

  describe('updateTab', () => {
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