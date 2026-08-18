import pasteCopiedAnnotations from './pasteCopiedAnnotations';
import core from 'core';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

describe('pasteCopiedAnnotations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards options to AnnotationManager pasteCopiedAnnotations with default useMouseLocation=false', () => {
    const pasteCopiedAnnotationsMock = jest.fn();
    const options = { viewportRelative: true };

    core.getDocumentViewer.mockReturnValue({
      getAnnotationManager: () => ({
        pasteCopiedAnnotations: pasteCopiedAnnotationsMock,
      }),
    });

    pasteCopiedAnnotations(5, options);

    expect(core.getDocumentViewer).toHaveBeenCalledWith(5);
    expect(pasteCopiedAnnotationsMock).toHaveBeenCalledWith(false, options);
  });

  it('keeps compatibility when options are not provided', () => {
    const pasteCopiedAnnotationsMock = jest.fn();

    core.getDocumentViewer.mockReturnValue({
      getAnnotationManager: () => ({
        pasteCopiedAnnotations: pasteCopiedAnnotationsMock,
      }),
    });

    pasteCopiedAnnotations(9);

    expect(pasteCopiedAnnotationsMock).toHaveBeenCalledWith(false, undefined);
  });
});
