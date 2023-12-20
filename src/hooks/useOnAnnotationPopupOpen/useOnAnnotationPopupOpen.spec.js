import React from 'react';
import core from 'core';
import useOnAnnotationPopupOpen from './useOnAnnotationPopupOpen';

import { useSelector, Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';

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

const lineAnnot = new window.Core.Annotations.LineAnnotation();

function getMockOnAnnotationChangedHandler(state) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: state,
  });

  useSelector.mockImplementation((callback) => callback(state));

  let onAnnotationChangedHandler;
  core.addEventListener = (event, handler) => {
    if (event === 'annotationChanged') {
      onAnnotationChangedHandler = handler;
    }
  };

  const { result } = renderHook(() => useOnAnnotationPopupOpen(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

  expect(result.error).toBeUndefined();
  return onAnnotationChangedHandler;
}

describe('useOnAnnotationPopupOpen hook', () => {
  let reduxState;

  beforeEach(() => {
    reduxState = {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        openElements: {
          ...initialState.viewer.openElements,
        }
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Modify annotationChanged event opens AnnotationPopup if ScaleOverlayContainer is closed', () => {
    reduxState.viewer.openElements.scaleOverlayContainer = false;
    const onAnnotationChangedHandler = getMockOnAnnotationChangedHandler(reduxState);
    act(() => onAnnotationChangedHandler([lineAnnot], 'modify'));
    expect(mockDispatch.mock.calls.length).toBe(1);
  });

  it('Modify annotationChanged event does not open AnnotationPopup if ScaleOverlayContainer is open', () => {
    reduxState.viewer.openElements.scaleOverlayContainer = true;
    const onAnnotationChangedHandler = getMockOnAnnotationChangedHandler(reduxState);
    act(() => onAnnotationChangedHandler([lineAnnot], 'modify'));
    expect(mockDispatch.mock.calls.length).toBe(0);
  });
});