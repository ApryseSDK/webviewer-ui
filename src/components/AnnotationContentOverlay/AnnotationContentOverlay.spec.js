import React from 'react';
import { render, waitFor } from '@testing-library/react';
import AnnotationContentOverlay from './AnnotationContentOverlay';
import getRootNode, { getShadowRootFromNode } from 'src/helpers/getRootNode';


const mockInitialState = {
  viewer: {
    openElements: {
      'annotationContentOverlay': true,
    },
  },
};

const TestAnnotationContentOverlay= withProviders(AnnotationContentOverlay, mockInitialState);
jest.mock('core', () => ({
  getDisplayAuthor: () => 'Duncan Idaho',
  getFormFieldCreationManager: () => ({
    isInFormFieldCreationMode: () => false,
  }),
  getDocumentViewer: () => ({
    getAnnotationManager: () => ({})
  }),
}));

jest.mock('src/helpers/getRootNode', () => ({
  __esModule: true,
  default: jest.fn(),
  getShadowRootFromNode: jest.fn(),
}));

describe('AnnotationContentOverlay - offset calculations', () => {
  let originalGetBoundingClientRect;

  beforeEach(() => {
    originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 100,
      top: 50,
      left: 50,
      right: 250,
      bottom: 150,
    }));

    window.isApryseWebViewerWebComponent = true;
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should correctly compute offsets for overlay positioning', async () => {
    // Mock annotation and clientXY
    const annotation = {
      getContents: () => 'This is a sample content',
      getReplies: () => [],
    };
    const clientXY = { clientX: 500, clientY: 500 };

    render(
      <TestAnnotationContentOverlay annotation={annotation} clientXY={clientXY} />
    );

    // Use waitFor to wait until the overlay element's style has been updated
    await waitFor(() => {
      const overlayElement = document.querySelector('.AnnotationContentOverlay');
      const computedStyle = window.getComputedStyle(overlayElement);
      const left = computedStyle.left;
      const top = computedStyle.top;

      // Check that offsets are calculated as expected
      expect(parseInt(left, 10)).toBeGreaterThan(0); // Ensure it's within the correct bounds
      expect(parseInt(top, 10)).toBeGreaterThan(0);
    });
  });

  it('should adjust for WebViewer web component offsets correctly relative to the host', async () => {
    const annotation = {
      getContents: () => 'This is another test content',
      getReplies: () => [],
    };
    const clientXY = { clientX: 800, clientY: 600 };
    // Gap between the overlay and the mouse, matching the component's own `gap` constant.
    const GAP = 20;
    const hostLeft = 100;
    const hostTop = 50;

    // The component resolves the host via getShadowRootFromNode(overlayRef.current), not the
    // module-level getRootNode() singleton (see AnnotationContentOverlay.js).
    getShadowRootFromNode.mockImplementation(() => ({
      host: {
        scrollLeft: 0,
        scrollTop: 0,
        getBoundingClientRect: () => ({
          left: hostLeft,
          top: hostTop,
        }),
      },
    }));

    render(
      <TestAnnotationContentOverlay annotation={annotation} clientXY={clientXY} />
    );

    // Use waitFor to wait until the overlay element has the updated styles
    await waitFor(() => {
      const overlayElement = document.querySelector('.AnnotationContentOverlay');
      // Verify that the offsets are adjusted based on the web component's host
      const computedStyle = window.getComputedStyle(overlayElement);
      const left = computedStyle.left;
      const top = computedStyle.top;

      // Deriving the expected values from clientXY, GAP, and the mocked host rect (rather than
      // hard-coded pixel constants) documents the intended relationship and keeps the assertion
      // resilient to changes in the positioning formula that don't affect this behavior.
      expect(parseInt(left, 10)).toBe(clientXY.clientX + GAP - hostLeft);
      expect(parseInt(top, 10)).toBe(clientXY.clientY + GAP - hostTop);
    });
  });

  it('should position the overlay relative to its own instance root, not a stale getRootNode() from another WebViewer instance', async () => {
    const annotation = {
      getContents: () => 'Content rendered in the correct instance',
      getReplies: () => [],
    };
    const clientXY = { clientX: 800, clientY: 600 };
    // Gap between the overlay and the mouse, matching the component's own `gap` constant.
    const GAP = 20;
    const instanceHostLeft = 300;
    const instanceHostTop = 200;

    // getShadowRootFromNode represents the correct root for THIS rendered overlay
    // (e.g. resolved from the overlay's own DOM node in a multi-instance setup).
    getShadowRootFromNode.mockImplementation(() => ({
      host: {
        scrollLeft: 0,
        scrollTop: 0,
        getBoundingClientRect: () => ({
          left: instanceHostLeft,
          top: instanceHostTop,
        }),
      },
    }));

    // getRootNode() is the stale, module-level singleton that would point at a
    // DIFFERENT (wrong) WebViewer instance that was constructed/activated last.
    getRootNode.mockImplementation(() => ({
      host: {
        scrollLeft: 0,
        scrollTop: 0,
        getBoundingClientRect: () => ({
          left: 100,
          top: 50,
        }),
      },
    }));

    render(
      <TestAnnotationContentOverlay annotation={annotation} clientXY={clientXY} />
    );

    await waitFor(() => {
      const overlayElement = document.querySelector('.AnnotationContentOverlay');
      const computedStyle = window.getComputedStyle(overlayElement);
      const left = computedStyle.left;
      const top = computedStyle.top;

      // Offsets must be computed from the instance-specific root (instanceHostLeft/Top),
      // not the stale getRootNode() singleton (100, 50). Deriving the expected values from
      // clientXY, GAP, and the mocked host rect (rather than hard-coded pixel constants)
      // documents the intended relationship and keeps the assertion resilient to changes
      // in the positioning formula that don't affect this behavior.
      expect(parseInt(left, 10)).toBe(clientXY.clientX + GAP - instanceHostLeft);
      expect(parseInt(top, 10)).toBe(clientXY.clientY + GAP - instanceHostTop);
    });
  });

  describe('host caching', () => {
    // These tests use a host getBoundingClientRect mock whose return value changes on every
    // call. That's essential: if the mock returned a fixed rect (as the tests above do), a
    // caching-the-rect implementation and a recompute-every-time implementation would produce
    // identical positions and pass identically. Varying the return value lets us assert which
    // rect actually fed into the rendered position (was it recomputed or a stale cached value?).
    const GAP = 20;

    beforeEach(() => {
      // getShadowRootFromNode is a shared jest.fn() across the whole spec file and its call
      // count isn't reset automatically, so clear it to isolate each test's assertions.
      getShadowRootFromNode.mockClear();
    });

    const mockAnnotation = (contents) => ({
      getContents: () => contents,
      getReplies: () => [],
    });

    const mockHostWithChangingRect = () => {
      const rects = [];
      const getBoundingClientRect = jest.fn(() => {
        const rect = { left: 100 + rects.length * 1000, top: 50 + rects.length * 1000 };
        rects.push(rect);
        return rect;
      });
      getShadowRootFromNode.mockImplementation(() => ({
        host: { scrollLeft: 0, scrollTop: 0, getBoundingClientRect },
      }));
      return { getBoundingClientRect, rects };
    };

    const expectOverlayPosition = async (overlayElement, clientX, clientY, rect) => {
      await waitFor(() => {
        const computedStyle = window.getComputedStyle(overlayElement);
        expect(parseInt(computedStyle.left, 10)).toBe(clientX + GAP - rect.left);
        expect(parseInt(computedStyle.top, 10)).toBe(clientY + GAP - rect.top);
      });
    };

    it('resolves the host element only once across repositions', async () => {
      const { getBoundingClientRect } = mockHostWithChangingRect();

      const { rerender } = render(
        <TestAnnotationContentOverlay annotation={mockAnnotation('a')} clientXY={{ clientX: 300, clientY: 300 }} />
      );

      await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalledTimes(1));
      expect(getShadowRootFromNode).toHaveBeenCalledTimes(1);

      // Reposition (simulating mouse move) several times.
      rerender(<TestAnnotationContentOverlay annotation={mockAnnotation('a')} clientXY={{ clientX: 350, clientY: 350 }} />);
      rerender(<TestAnnotationContentOverlay annotation={mockAnnotation('a')} clientXY={{ clientX: 400, clientY: 400 }} />);

      await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalledTimes(3));
      // The resolved host element itself is cached for the lifetime of the mounted component,
      // even though its bounding rect is recomputed on every reposition below.
      expect(getShadowRootFromNode).toHaveBeenCalledTimes(1);
    });

    it('recomputes the host rect on every reposition rather than caching it', async () => {
      const { getBoundingClientRect, rects } = mockHostWithChangingRect();

      const { rerender } = render(
        <TestAnnotationContentOverlay annotation={mockAnnotation('a')} clientXY={{ clientX: 300, clientY: 300 }} />
      );

      await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalledTimes(1));
      const overlayElement = document.querySelector('.AnnotationContentOverlay');
      await expectOverlayPosition(overlayElement, 300, 300, rects[0]);

      // No resize/scroll here: the host's on-screen position can still shift for other reasons
      // (e.g. sibling content on the consuming page reflowing) while a tooltip stays
      // continuously open, so the rect must be recomputed on every reposition, not cached.
      rerender(<TestAnnotationContentOverlay annotation={mockAnnotation('a')} clientXY={{ clientX: 350, clientY: 350 }} />);

      await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalledTimes(2));
      await expectOverlayPosition(overlayElement, 350, 350, rects[1]);
    });
  });
});
