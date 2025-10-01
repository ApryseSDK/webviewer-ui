import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { createMockStore, TEST_FILES } from '../Helpers/testCommonMocks';
import SpreadsheetEditorInsertImageButton from './SpreadsheetEditorInsertImagebutton';
import fileToBase64 from 'helpers/fileToBase64';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

describe('SpreadsheetEditorInsertImageButton', () => {
  let addImage;
  let mockActiveSheet;
  let mockWorkbook;
  let mockDocument;
  let mockDocumentViewer;

  beforeEach(() => {
    addImage = jest.fn();
    mockActiveSheet = { addImage };
    mockWorkbook = {
      activeSheetIndex: 0,
      getSheetAt: jest.fn(() => mockActiveSheet)
    };
    mockDocument = {
      getSpreadsheetEditorDocument: jest.fn(() => ({
        getWorkbook: jest.fn(() => mockWorkbook)
      }))
    };
    mockDocumentViewer = {
      getDocument: jest.fn(() => mockDocument)
    };

    core.getDocumentViewer.mockReturnValue(mockDocumentViewer);
    selectors.getActiveFlyout.mockReturnValue('some-flyout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle the uploaded function with given handleFileInputChange function', async () => {
    const store = createMockStore();
    const fakeFile = TEST_FILES.validImage();
    fileToBase64.mockResolvedValue('base64string');

    const { container } = render(
      <Provider store={store}>
        <SpreadsheetEditorInsertImageButton />
      </Provider>
    );

    const input = container.querySelector('#spreadsheet-editor-insert-image-file-input');
    await userEvent.upload(input, fakeFile);

    await waitFor(() => {
      expect(fileToBase64).toHaveBeenCalledWith(fakeFile);
      expect(mockWorkbook.getSheetAt).toHaveBeenCalledWith(0);
      expect(addImage).toHaveBeenCalledWith('base64string');
    });
  });

  it('should catch the error with the given handleFileInputChange', async () => {
    const store = createMockStore();
    const fakeFile = TEST_FILES.invalidImage();
    fileToBase64.mockResolvedValue('brokenbase64');
    addImage.mockImplementation(() => {
      throw new Error('add image failed');
    });

    const { container } = render(
      <Provider store={store}>
        <SpreadsheetEditorInsertImageButton />
      </Provider>
    );

    const input = container.querySelector('#spreadsheet-editor-insert-image-file-input');
    await userEvent.upload(input, fakeFile);

    await waitFor(() => {
      expect(addImage).toHaveBeenCalled();
      expect(actions.showWarningMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          message: 'add image failed',
        })
      );
    });
  });
});