import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useOnContentEditHistoryUndoRedoChanged from './useOnContentEditHistoryUndoRedoChanged';
import core from 'core';

jest.mock('core');

const mockContentEdit = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

describe('useOnContentEditHistoryUndoRedoChanged hook', () => {
  beforeAll(() => {
    window.Core = {
      ContentEdit: mockContentEdit,
    };

    core.addEventListener = jest.fn();
    core.getDocumentViewer = jest.fn().mockReturnValue({
      getContentEditHistoryManager: jest.fn().mockReturnValue({
        undo: jest.fn(),
        redo: jest.fn(),
        canUndo: jest.fn().mockReturnValue(true),
        canRedo: jest.fn().mockReturnValue(true),
      }),

    });
  });
  afterAll(() => {
    delete window.Core;
  });
  it('adds event listeners to Undo Redo Status Changed', () => {
    // Mocking addEventListener
    const { result } = renderHook(function() {
      return useOnContentEditHistoryUndoRedoChanged();
    }, { wrapper });

    expect(result.error).toBeUndefined();
    expect(mockContentEdit.addEventListener).toBeCalledWith('undoRedoStatusChanged', expect.any(Function));
  });

  it('removes event listeners to Undo Redo Status Changed when component is unmounted', () => {
    const { result, unmount } = renderHook(function() {
      return useOnContentEditHistoryUndoRedoChanged();
    }, { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expect(mockContentEdit.removeEventListener).toBeCalledWith('undoRedoStatusChanged', expect.any(Function));
  });
});
