import TabManager, { getNextNumberForUntitledDocument } from './TabManager';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'actions';
import * as fireEvent from 'helpers/fireEvent';

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
    store = configureStore({ reducer: rootReducer });
    tabManager = new TabManager([], [], store);
    store.dispatch(actions.setActiveTab(1));
  });
  afterEach(() => {
    store = null;
    tabManager = null;
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
  }) ;
});