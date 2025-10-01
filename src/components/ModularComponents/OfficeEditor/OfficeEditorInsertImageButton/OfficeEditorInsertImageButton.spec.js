import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { createMockStore, TEST_FILES } from '../../Helpers/testCommonMocks';
import OfficeEditorInsertImageButton from './OfficeEditorInsertImageButton';
import fileToBase64 from 'helpers/fileToBase64';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

jest.mock('core', () => ({
  getOfficeEditor: jest.fn(),
}));

describe('OfficeEditorInsertImageButton', () => {
  let insertImageAtCursor;

  beforeEach(() => {
    insertImageAtCursor = jest.fn();
    core.getOfficeEditor.mockReturnValue({ insertImageAtCursor });
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
        <OfficeEditorInsertImageButton />
      </Provider>
    );

    const input = container.querySelector('#office-editor-file-picker');
    await userEvent.upload(input, fakeFile);

    await waitFor(() => {
      expect(fileToBase64).toHaveBeenCalledWith(fakeFile);
      expect(insertImageAtCursor).toHaveBeenCalledWith('base64string');
    });
  });

  it('should catch the error with the given handleFileInputChange', async () => {
    const store = createMockStore();
    const fakeFile = TEST_FILES.invalidImage();
    fileToBase64.mockResolvedValue('brokenbase64');
    insertImageAtCursor.mockRejectedValue(new Error('insert failed'));

    const { container } = render(
      <Provider store={store}>
        <OfficeEditorInsertImageButton />
      </Provider>
    );

    const input = container.querySelector('#office-editor-file-picker');
    await userEvent.upload(input, fakeFile);

    await waitFor(() => {
      expect(insertImageAtCursor).toHaveBeenCalled();
      expect(actions.showWarningMessage).toHaveBeenCalledWith({ 'message': 'Error: insert failed', 'title': 'Error' });
    });
  });
});