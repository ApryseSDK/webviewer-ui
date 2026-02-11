import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilePickerHandler from './FilePickerHandler';
import * as loadDocumentHelper from 'helpers/loadDocument';

jest.mock('helpers/loadDocument', () => jest.fn());

const createMockState = (overrides = {}) => ({
  viewer: {
    disabledElements: {},
    customPanels: [],
    genericPanels: [],
    activeDocumentViewerKey: 1,
    ...overrides.viewer,
  },
  featureFlags: {
    customizableUI: false,
    ...overrides.featureFlags,
  },
});

const renderFilePickerHandler = (mockState) => {
  const Component = withProviders(FilePickerHandler, mockState);
  const { container } = render(<Component />);
  return container.querySelector('#file-picker');
};

const selectFile = (fileInput, file) => {
  fireEvent.change(fileInput, { target: { files: [file], value: '' } });
};

describe('FilePickerHandler', () => {
  const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows selecting the same file multiple times by clearing the input value', () => {
    const fileInput = renderFilePickerHandler(createMockState());

    selectFile(fileInput, mockFile);
    expect(loadDocumentHelper).toHaveBeenCalledTimes(1);

    selectFile(fileInput, mockFile);
    expect(loadDocumentHelper).toHaveBeenCalledTimes(2);
  });

  it('does not call loadDocument when no file is selected', () => {
    const fileInput = renderFilePickerHandler(createMockState());

    fireEvent.change(fileInput, { target: { files: [] } });
    expect(loadDocumentHelper).not.toHaveBeenCalled();
  });

  it('handles files with different types', () => {
    const mockDocxFile = new File(['test content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const fileInput = renderFilePickerHandler(createMockState());

    selectFile(fileInput, mockDocxFile);
    expect(loadDocumentHelper).toHaveBeenCalledWith(expect.anything(), mockDocxFile, {}, 1);
  });

  it('calls loadDocument with activeDocumentViewerKey when file is selected', () => {
    const mockActiveDocumentViewerKey = 2;
    const mockState = createMockState({
      viewer: {
        isMultiViewerMode: true,
        activeDocumentViewerKey: mockActiveDocumentViewerKey
      },
    });
    const fileInput = renderFilePickerHandler(mockState);

    selectFile(fileInput, mockFile);

    expect(loadDocumentHelper).toHaveBeenCalledWith(
      expect.anything(),
      mockFile,
      {},
      mockActiveDocumentViewerKey
    );
  });

  describe('multi-tab mode', () => {
    let mockTabManager;
    let mockState;

    beforeEach(() => {
      mockTabManager = { addTab: jest.fn().mockResolvedValue(undefined) };
      mockState = createMockState({
        viewer: { isMultiTab: true, TabManager: mockTabManager },
      });
    });

    it('allows selecting the same file multiple times by clearing the input value', () => {
      const fileInput = renderFilePickerHandler(mockState);

      selectFile(fileInput, mockFile);
      expect(mockTabManager.addTab).toHaveBeenCalledTimes(1);
      expect(mockTabManager.addTab).toHaveBeenCalledWith(mockFile, {
        saveCurrentActiveTabState: true,
        load: true,
      });

      selectFile(fileInput, mockFile);
      expect(mockTabManager.addTab).toHaveBeenCalledTimes(2);
    });

    it('does not call addTab when no file is selected', () => {
      const fileInput = renderFilePickerHandler(mockState);

      fireEvent.change(fileInput, { target: { files: [] } });
      expect(mockTabManager.addTab).not.toHaveBeenCalled();
    });
  });
});
