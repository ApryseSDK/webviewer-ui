import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FileAttachmentPanel from './FileAttachmentPanel';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

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
  const renderComponent = () => {
    const store = configureStore({ reducer: (state = initialState) => state });
    const component = render(
      <Provider store={store}>
        <FileAttachmentPanel />
      </Provider>
    );
    return component;
  };

  it('should render file attachment panel with proper labels', async () => {
    await act(async () => {
      const store = configureStore({ reducer: (state = initialState) => state });
      const component = render(
        <Provider store={store}>
          <FileAttachmentPanel />
        </Provider>
      );
      await waitFor(() => component.getByText('[PDF] mock 1.pdf'));
      const headers = screen.getAllByRole('heading');
      expect(headers.length).toBe(1);
    });
  });

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
  it('should have role attribute attached to the file attachment item', async () => {
    await act(async () => {
      const store = configureStore({ reducer: (state = initialState) => state });
      const component = render(
        <Provider store={store}>
          <FileAttachmentPanel />
        </Provider>
      );

      await waitFor(() => component.getByText('[PDF] mock 1.pdf'));
      await waitFor(() => component.getByText('[DOCX] mock 2.docx'));

      component.getAllByRole('button').forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });
  });
  it('Should have h2 on header', async () => {
    await act(async () => {
      const store = configureStore({ reducer: (state = initialState) => state });
      const component = render(
        <Provider store={store}>
          <FileAttachmentPanel />
        </Provider>
      );

      await waitFor(() => component.getByText('[PDF] mock 1.pdf'));
      await waitFor(() => component.getByText('[DOCX] mock 2.docx'));

      const element = component.getByText('Page 1');
      expect(element.tagName.toLocaleLowerCase()).toEqual('h2');
    });
  });
  it('should trigger open new tab function on keypress', async () => {
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

      fireEvent.focus(button);
      fireEvent.keyDown(button, { key: 'Enter', code: 13 });
      await waitFor(() => {
        expect(initialState.viewer.TabManager.setActiveTab).toHaveBeenCalledTimes(1);
        expect(initialState.viewer.TabManager.addTab).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('should be accessed by keyboard', async () => {
    await act(async () => {
      const component = renderComponent();

      await waitFor(() => component.getByRole('heading').click());
      userEvent.tab();
      await waitFor(() => {
        expect(component.getByText('[PDF] mock 1.pdf')).toHaveFocus();
      });
      userEvent.tab();
      await waitFor(() => {
        expect(component.getByText('[DOCX] mock 2.docx')).toHaveFocus();
      });
    });
  });
});