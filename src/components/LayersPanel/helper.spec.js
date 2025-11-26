import * as helper from './helper';

jest.mock('core', () => ({
  getDocument: jest.fn(),
  getAnnotationManager: jest.fn(),
}));

describe('LayersPanel helper functions', () => {
  const originalWindowCore = window.Core;

  beforeEach(() => {
    jest.clearAllMocks();
    window.Core = {
      Math: {
        Rect: function Rect(x1, y1, x2, y2) {
          this.x1 = x1;
          this.y1 = y1;
          this.x2 = x2;
          this.y2 = y2;
        }
      }
    };
  });

  afterEach(() => {
    window.Core = originalWindowCore;
  });

  describe('isEqualThreshold', () => {
    it('returns true when differences are within threshold', () => {
      const rect = { x1: 10, x2: 20, y1: 30, y2: 40 };
      const slightlyDifferent = { x1: 11.5, x2: 21, y1: 29.5, y2: 38 };
      expect(helper.isEqualThreshold(rect, slightlyDifferent)).toBe(true);
    });

    it('returns false when any coordinate difference exceeds the threshold', () => {
      const rect = { x1: 10, x2: 20, y1: 30, y2: 40 };
      const tooDifferent = { x1: 13.5, x2: 20, y1: 30, y2: 40 };
      expect(helper.isEqualThreshold(rect, tooDifferent)).toBe(false);
    });

    it('returns true when coordinates are exactly at the threshold boundary', () => {
      const rect = { x1: 10, x2: 20, y1: 30, y2: 40 };
      const atBoundary = { x1: 12, x2: 22, y1: 32, y2: 42 }; // exactly 2 units away
      expect(helper.isEqualThreshold(rect, atBoundary)).toBe(true);
    });

    it('handles negative coordinates correctly', () => {
      const rect = { x1: -10, x2: -5, y1: -20, y2: -15 };
      const similar = { x1: -11, x2: -6, y1: -21, y2: -16 };
      expect(helper.isEqualThreshold(rect, similar)).toBe(true);
    });

    it('handles zero coordinates', () => {
      const rect = { x1: 0, x2: 0, y1: 0, y2: 0 };
      const similar = { x1: 1, x2: 1, y1: 1, y2: 1 };
      expect(helper.isEqualThreshold(rect, similar)).toBe(true);
    });
  });

  describe('compareWebViewerPDFNetAnnotation', () => {
    it('returns true when both type and rect match', () => {
      const annotation = {
        elementName: 'rectangle',
        getRect: jest.fn(() => ({ x1: 10, y1: 10, x2: 20, y2: 20 }))
      };
      const pdfCoords = {
        x1y1: { x: 10, y: 10 },
        x2y2: { x: 20, y: 20 },
      };

      expect(helper.compareWebViewerPDFNetAnnotation(annotation, 'Rectangle', pdfCoords)).toBe(true);
    });

    it('returns false when element name differs', () => {
      const annotation = {
        elementName: 'ellipse',
        getRect: jest.fn(() => ({ x1: 10, y1: 10, x2: 20, y2: 20 }))
      };
      const pdfCoords = {
        x1y1: { x: 10, y: 10 },
        x2y2: { x: 20, y: 20 },
      };

      expect(helper.compareWebViewerPDFNetAnnotation(annotation, 'Rectangle', pdfCoords)).toBe(false);
    });

    it('returns false when rects differ beyond the threshold', () => {
      const annotation = {
        elementName: 'rectangle',
        getRect: jest.fn(() => ({ x1: 10, y1: 10, x2: 20, y2: 20 }))
      };
      const pdfCoords = {
        x1y1: { x: 10, y: 10 },
        x2y2: { x: 60, y: 60 },
      };

      expect(helper.compareWebViewerPDFNetAnnotation(annotation, 'Rectangle', pdfCoords)).toBe(false);
    });
  });
});
