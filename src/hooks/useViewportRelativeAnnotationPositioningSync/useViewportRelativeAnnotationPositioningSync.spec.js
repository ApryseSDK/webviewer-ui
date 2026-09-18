import { renderHook } from '@testing-library/react-hooks';
import useViewportRelativeAnnotationPositioningSync from '../useViewportRelativeAnnotationPositioningSync';
import core from 'core';
import * as reactRedux from 'react-redux';

describe('useViewportRelativeAnnotationPositioningSync', () => {
  let annotationManager;
  let useSelectorMock;
  let state;

  beforeEach(() => {
    useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    state = {
      viewer: {
        viewportRelativeAnnotationPositioningEnabled: true,
      },
    };
    useSelectorMock.mockImplementation((selector) => selector(state));
    annotationManager = {
      setViewportRelativeAnnotationPositioning: jest.fn(),
    };
    core.getDocumentViewers = jest.fn(() => [
      { getAnnotationManager: jest.fn(() => annotationManager) },
    ]);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not resync when the Redux state is unchanged across rerenders', () => {
    const { rerender } = renderHook(() => useViewportRelativeAnnotationPositioningSync());
    expect(annotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledTimes(1);
    annotationManager.setViewportRelativeAnnotationPositioning.mockClear();

    rerender();

    expect(annotationManager.setViewportRelativeAnnotationPositioning).not.toHaveBeenCalled();
  });

  it('syncs every active document viewer', () => {
    const secondAnnotationManager = { setViewportRelativeAnnotationPositioning: jest.fn() };
    core.getDocumentViewers = jest.fn(() => [
      { getAnnotationManager: jest.fn(() => annotationManager) },
      { getAnnotationManager: jest.fn(() => secondAnnotationManager) },
    ]);

    renderHook(() => useViewportRelativeAnnotationPositioningSync());

    expect(annotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledWith(true);
    expect(secondAnnotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledWith(true);
  });

  it('resyncs when the Redux viewport-relative positioning state changes', () => {
    const { rerender } = renderHook(() => useViewportRelativeAnnotationPositioningSync());
    annotationManager.setViewportRelativeAnnotationPositioning.mockClear();

    state.viewer.viewportRelativeAnnotationPositioningEnabled = false;
    rerender();

    expect(annotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledTimes(1);
    expect(annotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledWith(false);
  });
});
