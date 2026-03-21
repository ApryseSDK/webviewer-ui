import core from 'core';
import useOnAnnotationPopupOpen from './useOnAnnotationPopupOpen';
import actions from 'actions';

import { useSelector } from 'react-redux';
import initialState from 'src/redux/initialState';

import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

core.isAnnotationSelected = () => true;
core.getScrollViewElement = () => {};
core.getSelectedAnnotations = () => [];
core.canModify = () => true;
core.getDocumentViewer = () => ({
  getContentEditManager: () => {},
  getAnnotationHistoryManager: () => {},
  getMeasurementManager: () => {},
  getAnnotationManager: () => ({
    deselectAllAnnotations: () => {},
    selectAnnotation: () => {},
    getEditBoxManager: () => {},
    getFormFieldCreationManager: () => {},
  }),
});

const highlightAnnot = new window.Core.Annotations.TextHighlightAnnotation();

function getMockOnAnnotationSelectedHandler() {
  const officeEditorState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isOfficeEditorMode: true,
    },
  };
  useSelector.mockImplementation((callback) => callback(officeEditorState));

  let handler;
  core.addEventListener = (event, cb) => {
    if (event === 'annotationSelected') {
      handler = cb;
    }
  };
  core.removeEventListener = () => {};

  const { result } = renderHook(() => useOnAnnotationPopupOpen());

  expect(result.error).toBeUndefined();
  return handler;
}

describe('useOnAnnotationPopupOpen - Office Editor note editing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Dispatches finishNoteEditing when an annotation is selected from the canvas', () => {
    const onAnnotationSelectedHandler = getMockOnAnnotationSelectedHandler();
    act(() => onAnnotationSelectedHandler([highlightAnnot], 'selected'));

    expect(mockDispatch).toHaveBeenCalledWith(actions.finishNoteEditing());
  });

  it('Does not dispatch triggerNoteEditing when an annotation is selected from the canvas', () => {
    const onAnnotationSelectedHandler = getMockOnAnnotationSelectedHandler();
    act(() => onAnnotationSelectedHandler([highlightAnnot], 'selected'));

    expect(mockDispatch).not.toHaveBeenCalledWith(actions.triggerNoteEditing());
  });
});
