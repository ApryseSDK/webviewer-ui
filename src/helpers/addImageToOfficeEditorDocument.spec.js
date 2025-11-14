import addImageToOfficeEditorDocument from './addImageToOfficeEditorDocument';
import DataElements from 'src/constants/dataElement';
import fileToBase64 from './fileToBase64';
import core from 'core';

jest.mock('./fileToBase64');
jest.mock('core', () => ({
  getOfficeEditor: jest.fn(),
}));

describe('addImageToOfficeEditorDocument', () => {
  let mockDispatch;
  let mockActions;
  let mockEvent;
  let mockInsertImageAtCursor;
  let activeFlyout;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockActions = {
      openElement: jest.fn((element) => ({ type: 'OPEN_ELEMENT', payload: element })),
      closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
      showWarningMessage: jest.fn((payload) => ({ type: 'SHOW_WARNING_MESSAGE', payload })),
    };
    mockInsertImageAtCursor = jest.fn();
    activeFlyout = 'test-flyout';

    core.getOfficeEditor.mockReturnValue({
      insertImageAtCursor: mockInsertImageAtCursor,
    });

    mockEvent = {
      target: {
        files: [
          new File(['dummy content'], 'test.png', { type: 'image/png' }),
        ],
        value: 'test-file-input-value',
      },
    };
    jest.clearAllMocks();
  });

  it('should call fileToBase64', async () => {
    fileToBase64.mockResolvedValue('base64string');
    mockInsertImageAtCursor.mockResolvedValue();

    await addImageToOfficeEditorDocument(mockDispatch, mockActions, mockEvent, activeFlyout);

    expect(fileToBase64).toHaveBeenCalledWith(mockEvent.target.files[0]);
  });

  it('should call officeEditor.insertImageAtCursor when the function is invoked', async () => {
    const base64String = 'data:image/png;base64,testBase64';
    fileToBase64.mockResolvedValue(base64String);
    mockInsertImageAtCursor.mockResolvedValue();

    await addImageToOfficeEditorDocument(mockDispatch, mockActions, mockEvent, activeFlyout);

    expect(mockInsertImageAtCursor).toHaveBeenCalledWith(base64String);
    expect(mockEvent.target.value).toBe('');
  });

  it('should call correspond actions to close elements', async () => {
    fileToBase64.mockResolvedValue('base64string');
    mockInsertImageAtCursor.mockResolvedValue();

    await addImageToOfficeEditorDocument(mockDispatch, mockActions, mockEvent, activeFlyout);

    expect(mockDispatch).toHaveBeenCalledWith(mockActions.openElement(DataElements.LOADING_MODAL));
    expect(mockDispatch).toHaveBeenCalledWith(mockActions.closeElement(DataElements.LOADING_MODAL));
    expect(mockDispatch).toHaveBeenCalledWith(mockActions.closeElement(activeFlyout));
    expect(mockEvent.target.value).toBe('');
  });

  it('when error, should show warning message and close other element', async () => {
    const error = new Error('Test error');
    fileToBase64.mockRejectedValue(error);

    await addImageToOfficeEditorDocument(mockDispatch, mockActions, mockEvent, activeFlyout);

    expect(mockDispatch).toHaveBeenCalledWith(mockActions.closeElement(DataElements.LOADING_MODAL));
    expect(mockDispatch).toHaveBeenCalledWith(mockActions.closeElement(activeFlyout));
    expect(mockDispatch).toHaveBeenCalledWith(
      mockActions.showWarningMessage({
        title: 'Error',
        message: error.toString(),
      })
    );
    expect(mockEvent.target.value).toBe('');
  });

  it('should do nothing when no file is selected but still clear input value', async () => {
    mockEvent.target.files = [];
    await addImageToOfficeEditorDocument(mockDispatch, mockActions, mockEvent, activeFlyout);

    expect(fileToBase64).not.toHaveBeenCalled();
    expect(mockInsertImageAtCursor).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockEvent.target.value).toBe('');
  });
});
