import setViewportRelativeAnnotationPositioning from './setViewportRelativeAnnotationPositioning';
import core from 'core';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

describe('setViewportRelativeAnnotationPositioning', () => {
  let annotationManager;
  let state;

  beforeEach(() => {
    annotationManager = {
      setViewportRelativeAnnotationPositioning: jest.fn(),
    };
    state = {
      viewer: {
        viewportRelativeAnnotationPositioningEnabled: true,
      },
    };
    core.getDocumentViewer.mockReturnValue({
      getAnnotationManager: jest.fn(() => annotationManager),
    });
  });

  it('sets viewport-relative annotation positioning for the requested document viewer', () => {
    setViewportRelativeAnnotationPositioning(state, 2);

    expect(core.getDocumentViewer).toHaveBeenCalledWith(2);
    expect(annotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledWith(true);
  });

  it('uses the disabled value from Redux state', () => {
    state.viewer.viewportRelativeAnnotationPositioningEnabled = false;

    setViewportRelativeAnnotationPositioning(state, 2);

    expect(annotationManager.setViewportRelativeAnnotationPositioning).toHaveBeenCalledWith(false);
  });
});