import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FileAttachmentPanel from './FileAttachmentPanel';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import TabManager from 'src/helpers/TabManager';

const noop = () => {
};

class TabManagerMock {
  addTab = jest.fn().mockResolvedValue('mockTabId');
  setActiveTab = jest.fn();
}

const initialState = {
  viewer: {
    isMultiTab: true,
    TabManager: new TabManagerMock()
  }
};


jest.mock('core', () => ({
  addEventListener: noop,
  removeEventListener: noop,
  jumpToAnnotation: noop,
  getDocumentViewer: () => ({
    getAnnotationManager: () => ({
      deselectAllAnnotations: noop,
      selectAnnotation: noop,
    })
  }),
  isFullPDFEnabled: () => true,
  setCurrentPage: () => {},
  selectAnnotation: () => {}
}));

jest.mock('actions', () => {
  return {
    openElement: () => ({
      type: 'OPEN_ELEMENT',
      payload: {
        element: 'MockPayload'
      },
    }),
    closeElement: () => ({
      type: 'CLOSE_ELEMENT',
      payload: {
        element: 'MockPayload'
      }
    })
  };
});

jest.mock('helpers/getFileAttachments', () => {
  return {
    getFileAttachments: () => ({
      embeddedFiles: [],
      fileAttachmentAnnotations: {
        1: [
          {
            filename: 'mock 1',
            getFileData: () => ({
              filename: 'mock 1'
            })
          }
        ]
      }
    }),
  };
});

describe('File attachment panel', () => {
  it('should trigger open new tab function in multi tab mode', async () => {
    await act(async () => {
      const store = configureStore({ reducer: (state = initialState) => state });
      const component = render(
        <Provider store={store}>
          <FileAttachmentPanel />
        </Provider>
      );

      await waitFor(() => component.getByText('[MOCK 1] mock 1'));

      const button = component.getByText('[MOCK 1] mock 1');
      expect(button).toBeInTheDocument();

      button.click();
      await waitFor(() => {
        expect(initialState.viewer.TabManager.setActiveTab).toHaveBeenCalledTimes(1);
        expect(initialState.viewer.TabManager.addTab).toHaveBeenCalledTimes(1);
      });
    });
  });
});