import loadDocumentAPI from './loadDocument';
import loadDocumentHelper from 'helpers/loadDocument';
import selectors from 'selectors';

jest.mock('helpers/loadDocument', () => jest.fn());

jest.mock('selectors', () => ({
  getIsMultiTab: jest.fn(),
  getTabManager: jest.fn(),
  getActiveDocumentViewerKey: jest.fn(),
  getActiveTab: jest.fn(),
  getTabs: jest.fn(),
  isMultiViewerMode: jest.fn(),
}));

describe('UI.loadDocument API', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();

    store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({ viewer: {} })),
    };

    selectors.getIsMultiTab.mockReturnValue(false);
    selectors.getTabManager.mockReturnValue(null);
    selectors.getActiveDocumentViewerKey.mockReturnValue(1);
    selectors.getActiveTab.mockReturnValue(0);
    selectors.getTabs.mockReturnValue([]);
    selectors.isMultiViewerMode.mockReturnValue(false);
  });

  it('loads into the active viewer key when not in multi-tab mode', async () => {
    selectors.getActiveDocumentViewerKey.mockReturnValue(2);

    await loadDocumentAPI(store)('doc.pdf', { filename: 'doc.pdf' });

    expect(loadDocumentHelper).toHaveBeenCalledWith(store.dispatch, 'doc.pdf', { filename: 'doc.pdf' }, 2);
  });

  it('updates document2 when target viewer key is 2 in multi-tab mode', async () => {
    const tabManager = { updateTab: jest.fn() };
    selectors.getIsMultiTab.mockReturnValue(true);
    selectors.getTabManager.mockReturnValue(tabManager);
    selectors.getActiveDocumentViewerKey.mockReturnValue(2);
    selectors.getActiveTab.mockReturnValue(8);

    await loadDocumentAPI(store)('secondary.pdf');

    expect(tabManager.updateTab).toHaveBeenCalledWith(8, {
      document2: { src: 'secondary.pdf' },
    });
    expect(loadDocumentHelper).not.toHaveBeenCalled();
  });

  it('falls back to first tab when active tab is not set', async () => {
    const tabManager = { updateTab: jest.fn() };
    selectors.getIsMultiTab.mockReturnValue(true);
    selectors.getTabManager.mockReturnValue(tabManager);
    selectors.getActiveTab.mockReturnValue(undefined);
    selectors.getTabs.mockReturnValue([{ id: 11 }]);
    selectors.isMultiViewerMode.mockReturnValue(true);

    await loadDocumentAPI(store)('fallback.pdf', { extension: 'pdf' }, 1);

    expect(tabManager.updateTab).toHaveBeenCalledWith(11, {
      src: 'fallback.pdf',
      options: { extension: 'pdf' },
      isMultiViewer: true,
    });
  });

  it('adds a tab when there is no target tab to update', async () => {
    const tabManager = { updateTab: jest.fn(), addTab: jest.fn() };
    selectors.getIsMultiTab.mockReturnValue(true);
    selectors.getTabManager.mockReturnValue(tabManager);
    selectors.getActiveTab.mockReturnValue(undefined);
    selectors.getTabs.mockReturnValue([]);

    await loadDocumentAPI(store)('new-doc.pdf', { extension: 'pdf' });

    expect(tabManager.addTab).toHaveBeenCalledWith('new-doc.pdf', {
      extension: 'pdf',
      setActive: true,
      saveCurrentActiveTabState: true,
    });
  });
});
