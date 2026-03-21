import { renderHook, act } from '@testing-library/react-hooks';
import useOnAnnotationContentOverlayOpen from './useOnAnnotationContentOverlayOpen';
import useCore from '../useCore';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('../useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('actions', () => ({
  __esModule: true,
  default: {
    openElement: jest.fn((dataElement) => ({ type: 'OPEN_ELEMENT', payload: dataElement })),
    closeElement: jest.fn((dataElement) => ({ type: 'CLOSE_ELEMENT', payload: dataElement })),
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('useOnAnnotationContentOverlayOpen', () => {
  let dispatch;
  let mockCore;
  let mouseMoveHandler;

  function createMouseEvent(overrides = {}) {
    return {
      buttons: 0,
      clientX: 120,
      clientY: 240,
      target: {},
      ...overrides,
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mouseMoveHandler = null;
    dispatch = jest.fn();

    const annotationManager = {
      getAnnotationByMouseEvent: jest.fn(() => null),
      getGroupAnnotations: jest.fn(() => []),
    };

    mockCore = {
      addEventListener: jest.fn((event, handler) => {
        if (event === 'mouseMove') {
          mouseMoveHandler = handler;
        }
      }),
      removeEventListener: jest.fn(),
      getViewerElement: jest.fn(() => ({
        contains: jest.fn(() => true),
      })),
      getAnnotationManager: jest.fn(() => annotationManager),
    };

    useCore.mockReturnValue({ core: mockCore });
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation(() => null);

    window.Core = {
      Annotations: {
        FreeTextAnnotation: function FreeTextAnnotation() {},
      },
    };
  });

  afterEach(() => {
    delete window.Core;
  });

  it('adds and removes mouseMove listener', () => {
    const { unmount } = renderHook(() => useOnAnnotationContentOverlayOpen());

    expect(mockCore.addEventListener).toHaveBeenCalledWith('mouseMove', expect.any(Function));
    const addedHandler = mockCore.addEventListener.mock.calls[0][1];
    unmount();
    expect(mockCore.removeEventListener).toHaveBeenCalledWith('mouseMove', addedHandler);
  });

  it('opens overlay and updates hook state when hovering a non-FreeText annotation', () => {
    const annotation = { id: 'annot-1' };
    const groupAnnotation = { isGrouped: () => false };
    mockCore.getAnnotationManager().getAnnotationByMouseEvent.mockReturnValue(annotation);
    mockCore.getAnnotationManager().getGroupAnnotations.mockReturnValue([groupAnnotation]);

    const { result } = renderHook(() => useOnAnnotationContentOverlayOpen());

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });

    expect(result.current.annotation).toBe(groupAnnotation);
    expect(result.current.clientXY).toEqual({ clientX: 120, clientY: 240 });
    expect(actions.openElement).toHaveBeenCalledWith(DataElements.ANNOTATION_CONTENT_OVERLAY);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'OPEN_ELEMENT',
      payload: DataElements.ANNOTATION_CONTENT_OVERLAY,
    });
  });

  it('closes overlay when mouse leaves annotation after being open', () => {
    const annotation = { id: 'annot-1' };
    mockCore.getAnnotationManager().getAnnotationByMouseEvent.mockReturnValueOnce(annotation);
    mockCore.getAnnotationManager().getGroupAnnotations.mockReturnValue([{ isGrouped: () => false }]);

    renderHook(() => useOnAnnotationContentOverlayOpen());

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });
    act(() => {
      mockCore.getAnnotationManager().getAnnotationByMouseEvent.mockReturnValue(null);
      mouseMoveHandler(createMouseEvent());
    });

    expect(actions.closeElement).toHaveBeenCalledWith(DataElements.ANNOTATION_CONTENT_OVERLAY);
  });

  it('closes overlay when mouse event target is outside viewer after overlay was open', () => {
    const annotation = { id: 'annot-1' };
    mockCore.getAnnotationManager().getAnnotationByMouseEvent.mockReturnValueOnce(annotation);
    mockCore.getAnnotationManager().getGroupAnnotations.mockReturnValue([{ isGrouped: () => false }]);

    renderHook(() => useOnAnnotationContentOverlayOpen());

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });

    actions.closeElement.mockClear();
    dispatch.mockClear();
    mockCore.getViewerElement.mockReturnValue({ contains: jest.fn(() => false) });

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });

    expect(actions.closeElement).toHaveBeenCalledWith(DataElements.ANNOTATION_CONTENT_OVERLAY);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CLOSE_ELEMENT',
      payload: DataElements.ANNOTATION_CONTENT_OVERLAY,
    });
  });

  it('does not close overlay when mouse event target is outside viewer and overlay was not open', () => {
    mockCore.getViewerElement.mockReturnValue({ contains: jest.fn(() => false) });

    renderHook(() => useOnAnnotationContentOverlayOpen());

    actions.closeElement.mockClear();
    dispatch.mockClear();

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });

    expect(actions.closeElement).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not open overlay for FreeText annotations when no custom handler is configured', () => {
    const freeTextAnnotation = new window.Core.Annotations.FreeTextAnnotation();
    mockCore.getAnnotationManager().getAnnotationByMouseEvent.mockReturnValue(freeTextAnnotation);
    mockCore.getAnnotationManager().getGroupAnnotations.mockReturnValue([]);

    renderHook(() => useOnAnnotationContentOverlayOpen());

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });

    expect(actions.openElement).not.toHaveBeenCalled();
    expect(actions.closeElement).not.toHaveBeenCalled();
  });

  it('opens overlay for FreeText annotations when custom handler exists', () => {
    useSelector.mockImplementation(() => () => null);
    const freeTextAnnotation = new window.Core.Annotations.FreeTextAnnotation();
    mockCore.getAnnotationManager().getAnnotationByMouseEvent.mockReturnValue(freeTextAnnotation);
    mockCore.getAnnotationManager().getGroupAnnotations.mockReturnValue([]);

    renderHook(() => useOnAnnotationContentOverlayOpen());

    act(() => {
      mouseMoveHandler(createMouseEvent());
    });

    expect(actions.openElement).toHaveBeenCalledWith(DataElements.ANNOTATION_CONTENT_OVERLAY);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'OPEN_ELEMENT',
      payload: DataElements.ANNOTATION_CONTENT_OVERLAY,
    });
  });
});
