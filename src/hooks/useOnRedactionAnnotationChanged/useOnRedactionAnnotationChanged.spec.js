import React from 'react';
import * as reactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import useOnRedactionAnnotationChanged from './useOnRedactionAnnotationChanged';
import core from 'core';
import { act } from 'react-dom/test-utils';
import useCore from 'hooks/useCore';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

jest.mock('core');
jest.mock('hooks/useCore');
jest.mock('selectors');

// To test a hook with a redux dependency we need to provide a wrapper for it to run.
// The wrapper must also have a redux provider
// eslint-disable-next-line react/prop-types
const MockComponent = ({ children }) => (<div>{children}</div>);
// eslint-disable-next-line no-undef
const wrapper = withProviders(MockComponent);

describe('useOnRedactionAnnotationChanged hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCore.mockReturnValue({ core });
    core.getAnnotationsList = jest.fn(() => []);
    selectors.isElementOpen = jest.fn(() => false);
  });

  it('adds event listeners to Annotation Changed', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(() => useOnRedactionAnnotationChanged(), { wrapper });

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('annotationChanged', expect.any(Function));
  });


  it('removes event listeners to Annotation Changed when component is unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(() => useOnRedactionAnnotationChanged(), { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('annotationChanged', expect.any(Function));
  });

  it('correctly sets the redaction annotations and opens the redact panel if both the notes and search panels are closed', async () => {
    // This is a workaround to get the handler for annotationChanged so we can test it, as it is not possible (or easy) to mock an event
    let onAnnotationChangedHandler;
    core.addEventListener = (annotationManagerEvent, handler) => {
      onAnnotationChangedHandler = handler;
    };
    const mockRedactionAnnotation = new window.Core.Annotations.RedactionAnnotation();
    const mockRedactionAnnotations = [
      mockRedactionAnnotation,
    ];

    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);

    core.getAnnotationsList = () => [{ Subject: 'Polygon' }, { Subject: 'PolyLine' }, ...mockRedactionAnnotations];

    const { result } = renderHook(() => useOnRedactionAnnotationChanged(), { wrapper });

    expect(result.error).toBeUndefined();

    // The handler updates the internal state of the hook so it needs to be wrapped in act
    act(() => onAnnotationChangedHandler());
    const { redactionAnnotationsList } = result.current;
    expect(redactionAnnotationsList.length).toEqual(mockRedactionAnnotations.length);
    // In the initial state the notes and search panel are closed, so we should have called dispatch to open
    // the redaction panel
    expect(mockDispatch).toBeCalledTimes(1);
  });

  it('if a redaction annotation is added, and the notes panel is open, we do not open the redaction panel automatically', async () => {
    // This is a workaround to get the handler for annotationChanged so we can test it, as it is not possible (or easy) to mock an event
    let onAnnotationChangedHandler;
    core.addEventListener = (annotationManagerEvent, handler) => {
      onAnnotationChangedHandler = handler;
    };

    const mockRedactionAnnotation = new window.Core.Annotations.RedactionAnnotation();
    const mockRedactionAnnotationTwo = new window.Core.Annotations.RedactionAnnotation();

    const mockRedactionAnnotations = [
      mockRedactionAnnotation,
      mockRedactionAnnotationTwo,
    ];

    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);

    const isNotesPanelOpen = true;
    const isSearchPanelOpen = false;
    selectors.isElementOpen.mockImplementation((state, dataElement) => {
      if (dataElement === DataElements.NOTES_PANEL) {
        return isNotesPanelOpen;
      }
      if (dataElement === DataElements.SEARCH_PANEL) {
        return isSearchPanelOpen;
      }
      return false;
    });

    core.getAnnotationsList = () => [new window.Core.Annotations.PolygonAnnotation(), new window.Core.Annotations.LineAnnotation(), ...mockRedactionAnnotations];

    const { result } = renderHook(() => useOnRedactionAnnotationChanged(), { wrapper });

    expect(result.error).toBeUndefined();

    act(() => onAnnotationChangedHandler());
    const { redactionAnnotationsList } = result.current;
    expect(redactionAnnotationsList.length).toEqual(mockRedactionAnnotations.length);
    expect(mockDispatch).not.toBeCalled();
  });

  it('if a redaction annotation is added, and the search panel is open, we do not open the redaction panel automatically', async () => {
    // This is a workaround to get the handler for annotationChanged so we can test it, as it is not possible (or easy) to mock an event
    let onAnnotationChangedHandler;
    core.addEventListener = (annotationManagerEvent, handler) => {
      onAnnotationChangedHandler = handler;
    };

    const mockRedactionAnnotation = new window.Core.Annotations.RedactionAnnotation();
    const mockRedactionAnnotations = [
      mockRedactionAnnotation,
    ];

    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);

    const isNotesPanelOpen = false;
    const isSearchPanelOpen = true;
    selectors.isElementOpen.mockImplementation((state, dataElement) => {
      if (dataElement === DataElements.NOTES_PANEL) {
        return isNotesPanelOpen;
      }
      if (dataElement === DataElements.SEARCH_PANEL) {
        return isSearchPanelOpen;
      }
      return false;
    });

    core.getAnnotationsList = () => [{ Subject: 'Polygon' }, { Subject: 'PolyLine' }, ...mockRedactionAnnotations];

    const { result } = renderHook(() => useOnRedactionAnnotationChanged(), { wrapper });

    expect(result.error).toBeUndefined();

    act(() => onAnnotationChangedHandler());

    const { redactionAnnotationsList } = result.current;
    expect(redactionAnnotationsList.length).toEqual(mockRedactionAnnotations.length);
    expect(mockDispatch).not.toBeCalled();
  });
});
