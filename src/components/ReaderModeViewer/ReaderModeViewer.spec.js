import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import core from 'core';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { registerInstance, resetInstances, setCurrentInstanceId } from 'core/documentViewers';
import ReaderModeViewer from './ReaderModeViewer';

const mockReadingMode = {
  render: jest.fn(),
  unmount: jest.fn(),
  setZoom: jest.fn(),
  setAddAnnotConfig: jest.fn(),
};
const mockReadingModeApi = { initialize: () => mockReadingMode, AnnotationType: {} };
jest.mock('@pdftron/webviewer-reading-mode', () => mockReadingModeApi, { virtual: true });

const listenedEvents = (documentViewer, method) => documentViewer[method].mock.calls.map(([event]) => event);

describe('ReaderModeViewer with two WebViewer instances', () => {
  let ambientViewer;
  let ownViewer;

  beforeEach(() => {
    window.WebViewerReadingMode = mockReadingModeApi;
    registerInstance(1);
    registerInstance(2);
    [ambientViewer, ownViewer] = [1, 2].map((instanceId) => {
      const documentViewer = new window.Core.DocumentViewer();
      jest.spyOn(documentViewer, 'addEventListener');
      jest.spyOn(documentViewer, 'removeEventListener');
      jest.spyOn(documentViewer, 'getPageWidth').mockReturnValue(0);
      jest.spyOn(documentViewer, 'getDocument').mockReturnValue({ getPDFDoc: () => `pdfDoc${instanceId}`, getType: () => 'pdf' });
      return core.setDocumentViewer(1, documentViewer, instanceId);
    });
  });

  afterEach(() => {
    delete window.WebViewerReadingMode;
    jest.restoreAllMocks();
    resetInstances();
  });

  it('should render and subscribe to its own instance\'s viewer when another instance is ambient', async () => {
    const store = configureStore({ reducer: rootReducer(), middleware: (getDefault) => getDefault({ serializableCheck: false, immutableCheck: false }) });
    setCurrentInstanceId(1);

    const { unmount } = render(
      <InstanceIdContext.Provider value={2}>
        <Provider store={store}>
          <ReaderModeViewer />
        </Provider>
      </InstanceIdContext.Provider>,
    );
    await waitFor(() => expect(mockReadingMode.render).toHaveBeenCalled());
    unmount();

    const readerModeEvents = ['documentLoaded', 'pageNumberUpdated', 'zoomUpdated', 'toolUpdated', 'toolModeUpdated'];
    expect(listenedEvents(ownViewer, 'addEventListener')).toEqual(expect.arrayContaining(readerModeEvents));
    expect(listenedEvents(ownViewer, 'removeEventListener')).toEqual(expect.arrayContaining(readerModeEvents));
    expect(ambientViewer.addEventListener).not.toHaveBeenCalled();
    expect(ambientViewer.removeEventListener).not.toHaveBeenCalled();
    expect(mockReadingMode.render).toHaveBeenCalledWith('pdfDoc2', expect.anything(), expect.anything());
  });
});
