import core from 'core';
import {
  calcPopupLeft,
  calcPopupTop,
  getAnnotationPopupPositionBasedOn,
  getAnnotationPosition,
  getTextPopupPositionBasedOn,
  isAnnotationInView,
} from './getPopupPosition';
import { getWebComponentScale } from './getWebComponentScale';

jest.mock('core');
jest.mock('./getWebComponentScale', () => ({
  getWebComponentScale: jest.fn(() => ({ scaleX: 1, scaleY: 1 })),
}));

describe('getPopupPosition', () => {
  const originalCore = global.window && global.window.Core;
  const createAnnotation = (overrides = {}) => ({
    NoZoom: true,
    PageNumber: 1,
    getPageNumber: () => 1,
    getRect: () => ({
      x1: 10,
      y1: 20,
      x2: 40,
      y2: 60,
      getWidth: () => 30,
      getHeight: () => 40,
    }),
    ...overrides,
  });

  beforeAll(() => {
    window.Core = window.Core || {};
    window.Core.Annotations = window.Core.Annotations || {};
    window.Core.Annotations.StickyAnnotation = window.Core.Annotations.StickyAnnotation || function StickyAnnotation() {};
    window.Core.Annotations.WidgetAnnotation = window.Core.Annotations.WidgetAnnotation || function WidgetAnnotation() {};
  });

  afterAll(() => {
    if (originalCore === undefined) {
      delete window.Core;
    } else {
      window.Core = originalCore;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.innerWidth = 1200;
  });

  it('returns null bounds when converted coordinates are invalid for no-zoom annotation', () => {
    const annotation = createAnnotation();

    core.getDocumentViewers.mockReturnValue([{ getPageCount: () => 1 }]);
    core.getDisplayModeObject.mockReturnValue({
      pageToWindow: jest.fn()
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce({ x: 200, y: 250 }),
    });
    core.getCompleteRotation.mockReturnValue(0);

    expect(getAnnotationPosition(annotation)).toEqual({ topLeft: null, bottomRight: null });
  });

  it('returns fallback position when annotation bounds are invalid', () => {
    const annotation = createAnnotation();

    core.getDocumentViewers.mockReturnValue([{ getPageCount: () => 1 }]);
    core.getDisplayModeObject.mockReturnValue({
      pageToWindow: jest.fn().mockReturnValue(undefined),
    });
    core.getCompleteRotation.mockReturnValue(0);

    const position = getAnnotationPopupPositionBasedOn(annotation, {
      current: { getBoundingClientRect: jest.fn() },
    });

    expect(position).toEqual({ left: 0, top: 0 });
  });

  it('calcPopupLeft returns fallback left for invalid bounds', () => {
    const left = calcPopupLeft({ topLeft: null, bottomRight: { x: 10, y: 20 } }, { width: 100 }, 1);
    expect(left).toBe(0);
  });

  it('calcPopupTop returns fallback top for invalid bounds', () => {
    const top = calcPopupTop({ topLeft: null, bottomRight: { x: 10, y: 20 } }, { height: 80 }, 1);
    expect(top).toBe(0);
  });

  it('returns null bounds when document viewer is unavailable', () => {
    core.getDocumentViewers.mockReturnValue([]);
    const bounds = getAnnotationPosition(createAnnotation());
    expect(bounds).toEqual({ topLeft: null, bottomRight: null });
  });

  it('returns fallback position for malformed text quads', () => {
    const position = getTextPopupPositionBasedOn(undefined, {
      current: { getBoundingClientRect: jest.fn() },
    });
    expect(position).toEqual({ left: 0, top: 0 });
  });

  it('uses fallback popup dimensions when popup ref is missing', () => {
    const annotation = createAnnotation({ NoZoom: false });
    core.getDocumentViewers.mockReturnValue([{ getPageCount: () => 1 }]);
    core.getDisplayModeObject.mockReturnValue({
      pageToWindow: jest.fn()
        .mockReturnValueOnce({ x: 100, y: 200 })
        .mockReturnValueOnce({ x: 200, y: 260 }),
    });
    core.getCompleteRotation.mockReturnValue(0);
    core.getScrollViewElement.mockReturnValue({
      scrollLeft: 0,
      scrollTop: 0,
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }),
    });

    const position = getAnnotationPopupPositionBasedOn(annotation, undefined);
    expect(position).toEqual({ left: 150, top: 277 });
  });

  it('calcPopupTop returns fallback top when scroll container is unavailable', () => {
    core.getScrollViewElement.mockReturnValue(null);
    const top = calcPopupTop({ topLeft: { x: 10, y: 20 }, bottomRight: { x: 30, y: 40 } }, { height: 80 }, 1);
    expect(top).toBe(0);
  });

  it('calcPopupLeft tolerates invalid scaleX values', () => {
    core.getScrollViewElement.mockReturnValue({ scrollLeft: 0 });
    getWebComponentScale.mockReturnValue({ scaleX: 0, scaleY: 1 });

    const left = calcPopupLeft({ topLeft: { x: 100, y: 20 }, bottomRight: { x: 300, y: 40 } }, { width: 100 }, 1);
    expect(left).toBe(150);
  });

  describe('isAnnotationInView', () => {
    const createScrollContainer = ({ scrollTop = 0, scrollLeft = 0 } = {}) => ({
      getBoundingClientRect: () => ({
        top: 0,
        bottom: 600,
        left: 0,
        right: 800,
      }),
      scrollTop,
      scrollLeft,
    });

    const setupAnnotationPosition = (topLeft, bottomRight) => {
      core.getDocumentViewers.mockReturnValue([{ getPageCount: () => 5 }]);
      core.getDisplayModeObject.mockReturnValue({
        pageToWindow: jest.fn()
          .mockReturnValueOnce(topLeft)
          .mockReturnValueOnce(bottomRight),
      });
      core.getCompleteRotation.mockReturnValue(0);
    };

    it('returns true when annotation is fully within the visible area', () => {
      setupAnnotationPosition({ x: 100, y: 200 }, { x: 200, y: 300 });
      const scrollContainer = createScrollContainer();
      const annotation = createAnnotation({ NoZoom: false });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(true);
    });

    it('returns true when annotation is partially visible', () => {
      const scrollContainer = createScrollContainer();
      const annotation = createAnnotation({ NoZoom: false });

      // Partially visible at the bottom
      setupAnnotationPosition({ x: 100, y: 550 }, { x: 200, y: 650 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(true);

      // Partially visible at the top
      setupAnnotationPosition({ x: 100, y: -50 }, { x: 200, y: 50 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(true);

      // Partially visible at the right
      setupAnnotationPosition({ x: 750, y: 200 }, { x: 850, y: 300 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(true);

      // Partially visible at the left
      setupAnnotationPosition({ x: -50, y: 200 }, { x: 50, y: 300 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(true);
    });

    it('returns false when annotation is completely outside the visible area', () => {
      const scrollContainer = createScrollContainer();
      const annotation = createAnnotation({ NoZoom: false });

      // Completely above
      setupAnnotationPosition({ x: 100, y: -200 }, { x: 100, y: -100 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(false);

      // Completely below
      setupAnnotationPosition({ x: 100, y: 700 }, { x: 100, y: 800 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(false);

      // Completely to the right
      setupAnnotationPosition({ x: 900, y: 200 }, { x: 1000, y: 300 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(false);

      // Completely to the left
      setupAnnotationPosition({ x: -200, y: 200 }, { x: -100, y: 300 });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(false);
    });

    it('accounts for scroll offsets', () => {
      const annotation = createAnnotation({ NoZoom: false });

      // Scrolled down — annotation above visible area
      const scrolledDown = createScrollContainer({ scrollTop: 500 });
      setupAnnotationPosition({ x: 100, y: 200 }, { x: 200, y: 300 });
      expect(isAnnotationInView(annotation, scrolledDown)).toBe(false);

      // Scrolled right — annotation to the left of visible area
      const scrolledRight = createScrollContainer({ scrollLeft: 500 });
      setupAnnotationPosition({ x: 100, y: 200 }, { x: 200, y: 300 });
      expect(isAnnotationInView(annotation, scrolledRight)).toBe(false);
    });

    it('returns false for invalid inputs', () => {
      // getAnnotationPosition returns invalid bounds
      const scrollContainer = createScrollContainer();
      const annotation = createAnnotation({ NoZoom: false });
      expect(isAnnotationInView(annotation, scrollContainer)).toBe(false);

      // Null scrollContainer
      setupAnnotationPosition({ x: 100, y: 200 }, { x: 200, y: 300 });
      expect(isAnnotationInView(annotation, null)).toBe(false);
    });
  });
});
