import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import useCore from 'hooks/useCore';
import DataElements from 'constants/dataElement';
import SnippingToolPopupContainer from './SnippingToolPopupContainer';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { Basic } from './SnippingToolPopup.stories';
// const BasicSnippingToolPopupStory = withI18n(Basic);

const BasicSnippingToolPopupStory = {};


jest.mock('core');
jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const createMockCore = (snippingMode = 'CLIPBOARD') => {
  const mockSnippingTool = {
    getSnippingMode: jest.fn(() => snippingMode),
    setSnippingMode: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getIsSnipping: jest.fn(() => false),
    reset: jest.fn(),
  };

  return {
    getTool: jest.fn(() => mockSnippingTool),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getDocument: jest.fn(() => ({})),
  };
};

// Skipped due to failing import in `createFeatureAPI.js`
// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('SnippingToolPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicSnippingToolPopupStory />);
      }).not.toThrow();
    });
  });

});

describe('SnippingToolPopupContainer', () => {
  describe('Multiviewer mode', () => {
    let store;
    let mockCore1;
    let mockCore2;
    let mockDocViewer1;
    let mockDocViewer2;

    beforeEach(() => {
      jest.clearAllMocks();

      mockDocViewer1 = { id: 'viewer-1' };
      mockDocViewer2 = { id: 'viewer-2' };

      // Create mock cores for each viewer
      mockCore1 = createMockCore('CLIPBOARD');
      mockCore2 = createMockCore('DOWNLOAD');

      store = configureStore({
        reducer: rootReducer(),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
      });

      store.dispatch(actions.setIsMultiViewerMode(true));
      store.dispatch(actions.setActiveDocumentViewerKey(1));

      // Set initial mock for viewer 1
      useCore.mockReturnValue({
        core: mockCore1,
        documentViewer: mockDocViewer1,
      });
    });

    const TestSnippingToolPopupContainer = withProviders(require('./SnippingToolPopupContainer').default);

    const renderSnippingToolPopupContainer = (store) => {
      return render(
        <Provider store={store}>
          <TestSnippingToolPopupContainer />
        </Provider>
      );
    };

    it('updates event listeners when switching viewers', () => {
      const { rerender } = renderSnippingToolPopupContainer(store);

      expect(mockCore1.addEventListener).toHaveBeenCalledWith('toolModeUpdated', expect.any(Function));

      // Switch to viewer 2
      useCore.mockReturnValue({
        core: mockCore2,
        documentViewer: mockDocViewer2,
      });
      store.dispatch(actions.setActiveDocumentViewerKey(2));

      rerender(
        <Provider store={store}>
          <TestSnippingToolPopupContainer />
        </Provider>
      );

      expect(mockCore1.removeEventListener).toHaveBeenCalledWith('toolModeUpdated', expect.any(Function));
      expect(mockCore2.addEventListener).toHaveBeenCalledWith('toolModeUpdated', expect.any(Function));
    });

    it('fetches snipping tool from correct viewer core', () => {
      const { rerender } = renderSnippingToolPopupContainer(store);


      expect(mockCore1.getTool).toHaveBeenCalledWith(window.Core.Tools.ToolNames['SNIPPING']);

      // Switch to viewer 2
      useCore.mockReturnValue({
        core: mockCore2,
        documentViewer: mockDocViewer2,
      });
      store.dispatch(actions.setActiveDocumentViewerKey(2));

      rerender(
        <Provider store={store}>
          <TestSnippingToolPopupContainer />
        </Provider>
      );

      expect(mockCore2.getTool).toHaveBeenCalledWith(window.Core.Tools.ToolNames['SNIPPING']);
    });

    it('applies popup snipping mode to all viewers', () => {
      const { rerender } = renderSnippingToolPopupContainer(store);


      const mockSnippingTool1 = mockCore1.getTool();
      // Verify viewer 1 initializes with default CLIPBOARD
      expect(mockSnippingTool1.setSnippingMode).toHaveBeenCalledWith('CLIPBOARD');

      // Switch to viewer 2 - should get the same default mode
      jest.clearAllMocks();
      useCore.mockReturnValue({
        core: mockCore2,
        documentViewer: mockDocViewer2,
      });
      store.dispatch(actions.setActiveDocumentViewerKey(2));
      rerender(
        <Provider store={store}>
          <TestSnippingToolPopupContainer />
        </Provider>
      );

      const mockSnippingTool2 = mockCore2.getTool();
      expect(mockSnippingTool2.setSnippingMode).toHaveBeenCalledWith('CLIPBOARD');

      // Switch back to viewer 1 - should still have the same mode
      jest.clearAllMocks();
      useCore.mockReturnValue({
        core: mockCore1,
        documentViewer: mockDocViewer1,
      });
      store.dispatch(actions.setActiveDocumentViewerKey(1));
      rerender(
        <Provider store={store}>
          <TestSnippingToolPopupContainer />
        </Provider>
      );

      expect(mockSnippingTool1.setSnippingMode).toHaveBeenCalledWith('CLIPBOARD');
    });

    it('resets snipping tool mode and snipping mode state when cropAndRemoveRadioButton disabled state changes', () => {
      store.dispatch({ type: 'SET_ACTIVE_TOOL_NAME', payload: { toolName: window.Core.Tools.ToolNames['SNIPPING'] } });
      store.dispatch(actions.openElement(DataElements.SNIPPING_TOOL_POPUP));

      const I18nSnippingToolPopupContainer = withI18n(SnippingToolPopupContainer);
      const { container } = render(
        <Provider store={store}>
          <I18nSnippingToolPopupContainer />
        </Provider>
      );
      const mockSnippingTool = mockCore1.getTool();
      expect(mockSnippingTool.setSnippingMode).toHaveBeenCalledWith('CLIPBOARD');

      const cropAndRemoveRadioButton = container.querySelector('input[data-element="cropAndRemoveRadioButton"]');
      fireEvent.click(cropAndRemoveRadioButton);
      expect(mockSnippingTool.setSnippingMode).toHaveBeenLastCalledWith('CROP_AND_REMOVE');

      act(() => {
        store.dispatch(actions.disableElements(['cropAndRemoveRadioButton']));
      });
      expect(mockSnippingTool.setSnippingMode).toHaveBeenLastCalledWith('CLIPBOARD');
    });
  });
});
