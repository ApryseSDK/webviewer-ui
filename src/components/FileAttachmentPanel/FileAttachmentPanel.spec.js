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
            filename: 'C:\\Windows\\TEMP\\mock 1.pdf',
            getFileData: () => ({
              filename: 'C:\\Windows\\TEMP\\mock 1.pdf'
            })
          },
          {
            filename: 'C:/Windows/TEMP/mock 2.docx',
            getFileData: () => ({
              filename: 'C:/Windows/TEMP/mock 2.docx'
            })
          }
        ]
      }
    }),
  };
});

describe('File attachment panel', () => {
  it('should rener file names correctly', async () => {
    await act(async () => {
      const store = configureStore({ reducer: (state = initialState) => state });
      const component = render(
        <Provider store={store}>
          <FileAttachmentPanel />
        </Provider>
      );

      await waitFor(() => component.getByText('[PDF] mock 1.pdf'));

      const button = component.getByText('[PDF] mock 1.pdf');
      expect(button).toBeInTheDocument();

      await waitFor(() => component.getByText('[DOCX] mock 2.docx'));

      const button2 = component.getByText('[DOCX] mock 2.docx');
      expect(button2).toBeInTheDocument();
    });
  });
  it('should trigger open new tab function in multi tab mode', async () => {
    await act(async () => {
      const store = configureStore({ reducer: (state = initialState) => state });
      const component = render(
        <Provider store={store}>
          <FileAttachmentPanel />
        </Provider>
      );

      await waitFor(() => component.getByText('[PDF] mock 1.pdf'));

      const button = component.getByText('[PDF] mock 1.pdf');
      expect(button).toBeInTheDocument();

      button.click();
      await waitFor(() => {
        expect(initialState.viewer.TabManager.setActiveTab).toHaveBeenCalledTimes(1);
        expect(initialState.viewer.TabManager.addTab).toHaveBeenCalledTimes(1);
      });
    });
  });
});