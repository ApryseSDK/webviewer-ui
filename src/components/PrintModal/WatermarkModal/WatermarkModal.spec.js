import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import core from 'core';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { registerInstance, resetInstances, setCurrentInstanceId } from 'core/documentViewers';
import WatermarkModal from './WatermarkModal';

describe('WatermarkModal with two WebViewer instances', () => {
  let ambientViewer;
  let ownViewer;

  beforeEach(() => {
    registerInstance(1);
    registerInstance(2);
    [ambientViewer, ownViewer] = [1, 2].map((instanceId) => {
      const documentViewer = new window.Core.DocumentViewer();
      jest.spyOn(documentViewer, 'getWatermark').mockResolvedValue({});
      jest.spyOn(documentViewer, 'setWatermark').mockImplementation(() => {});
      jest.spyOn(documentViewer, 'getPageHeight').mockReturnValue(100);
      jest.spyOn(documentViewer, 'getPageWidth').mockReturnValue(100);
      jest.spyOn(documentViewer, 'getDocument').mockReturnValue({ loadCanvas: jest.fn(), getType: () => 'pdf' });
      return core.setDocumentViewer(1, documentViewer, instanceId);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetInstances();
  });

  it('should preview the watermark on its own instance\'s document when another instance is ambient', async () => {
    const store = configureStore({ reducer: rootReducer(), middleware: (getDefault) => getDefault({ serializableCheck: false, immutableCheck: false }) });
    const renderModal = (isVisible) => (
      <InstanceIdContext.Provider value={2}>
        <Provider store={store}>
          <WatermarkModal isVisible={isVisible} activeDocumentViewerKey={1} pageIndexToView={0} />
        </Provider>
      </InstanceIdContext.Provider>
    );
    setCurrentInstanceId(1);

    const { rerender } = render(renderModal(false));
    rerender(renderModal(true));

    await waitFor(() => expect(ownViewer.getDocument().loadCanvas).toHaveBeenCalled());
    expect(ownViewer.getWatermark).toHaveBeenCalled();
    expect(ownViewer.setWatermark).toHaveBeenCalled();
    expect(ambientViewer.getWatermark).not.toHaveBeenCalled();
    expect(ambientViewer.setWatermark).not.toHaveBeenCalled();
  });
});
