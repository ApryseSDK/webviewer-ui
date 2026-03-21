import handleFreeTextAutoSizeToggle from './handleFreeTextAutoSizeToggle';
import core from 'core';

jest.mock('core', () => ({
  getAnnotationManager: jest.fn(),
}));

const createMockAnnotationManager = () => ({
  trigger: jest.fn(),
  redrawAnnotation: jest.fn(),
});

const createMockAnnotation = () => ({
  switchToAutoFontSize: jest.fn(),
  switchOutFromAutoFontSize: jest.fn(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('handleFreeTextAutoSizeToggle', () => {
  describe('when isAutoSizeFont is true (switching off auto size)', () => {
    it('calls switchOutFromAutoFontSize on the annotation', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), true);

      expect(annotation.switchOutFromAutoFontSize).toHaveBeenCalledTimes(1);
      expect(annotation.switchToAutoFontSize).not.toHaveBeenCalled();
    });
  });

  describe('when isAutoSizeFont is false (switching on auto size)', () => {
    it('calls switchToAutoFontSize on the annotation', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false);

      expect(annotation.switchToAutoFontSize).toHaveBeenCalledTimes(1);
      expect(annotation.switchOutFromAutoFontSize).not.toHaveBeenCalled();
    });
  });

  describe('documentViewerKey routing', () => {
    it('uses documentViewerKey 1 by default', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false);

      expect(core.getAnnotationManager).toHaveBeenCalledWith(1);
    });

    it('passes the provided documentViewerKey to getAnnotationManager', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false, 2);

      expect(core.getAnnotationManager).toHaveBeenCalledWith(2);
    });

    it('does not call getAnnotationManager with the wrong viewer key', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false, 2);

      expect(core.getAnnotationManager).not.toHaveBeenCalledWith(1);
    });
  });

  describe('annotation manager calls', () => {
    it('triggers annotationChanged with the annotation wrapped in an array', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false, 1);

      expect(mockAnnotationManager.trigger).toHaveBeenCalledWith(
        'annotationChanged',
        [[annotation], 'modify', {}],
      );
    });

    it('calls redrawAnnotation with the annotation', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);

      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false, 1);

      expect(mockAnnotationManager.redrawAnnotation).toHaveBeenCalledWith(annotation);
    });

    it('uses the same annotation manager instance for both trigger and redrawAnnotation', () => {
      const annotation = createMockAnnotation();
      const managerForKey2 = createMockAnnotationManager();
      const managerForKey1 = createMockAnnotationManager();
      core.getAnnotationManager.mockImplementation((key) => (key === 2 ? managerForKey2 : managerForKey1));
      handleFreeTextAutoSizeToggle(annotation, jest.fn(), false, 2);
      // Both trigger and redrawAnnotation should be called on the manager for key 2
      expect(managerForKey2.trigger).toHaveBeenCalled();
      expect(managerForKey2.redrawAnnotation).toHaveBeenCalledWith(annotation);
      // No calls should be made on managers for other keys
      expect(managerForKey1.trigger).not.toHaveBeenCalled();
      expect(managerForKey1.redrawAnnotation).not.toHaveBeenCalled();
    });
  });

  describe('setAutoSizeFont callback', () => {
    it('calls setAutoSizeFont with true when isAutoSizeFont is false', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);
      const setAutoSizeFont = jest.fn();

      handleFreeTextAutoSizeToggle(annotation, setAutoSizeFont, false);

      expect(setAutoSizeFont).toHaveBeenCalledWith(true);
    });

    it('calls setAutoSizeFont with false when isAutoSizeFont is true', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);
      const setAutoSizeFont = jest.fn();

      handleFreeTextAutoSizeToggle(annotation, setAutoSizeFont, true);

      expect(setAutoSizeFont).toHaveBeenCalledWith(false);
    });

    it('calls setAutoSizeFont exactly once', () => {
      const annotation = createMockAnnotation();
      const mockAnnotationManager = createMockAnnotationManager();
      core.getAnnotationManager.mockReturnValue(mockAnnotationManager);
      const setAutoSizeFont = jest.fn();

      handleFreeTextAutoSizeToggle(annotation, setAutoSizeFont, false);

      expect(setAutoSizeFont).toHaveBeenCalledTimes(1);
    });
  });
});
