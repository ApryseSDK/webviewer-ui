import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDraggablePosition, { DEFAULTS, clampOffsetToContainer } from './useDraggablePosition';
import { useSelector } from 'react-redux';
import core from 'core';
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('core', () => ({
  getViewerElement: jest.fn(),
  getScrollViewElement: jest.fn(),
  getDocument: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

const wrapper = ({ children }) => <div>{children}</div>;

describe('useDraggablePosition', () => {
  let mockState;
  let mockDocumentElement;
  let mockContainerElement;

  beforeEach(() => {
    mockState = {
      viewer: {
        documentContainerWidth: 1000,
        documentContainerHeight: 800,
      },
    };

    mockDocumentElement = {
      offsetLeft: 100,
      offsetWidth: 600,
      offsetTop: 50,
    };

    mockContainerElement = {
      offsetLeft: 0,
      offsetWidth: mockState.viewer.documentContainerWidth,
      offsetTop: 0,
    };

    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    core.getViewerElement.mockImplementation(() => mockDocumentElement);
    core.getScrollViewElement.mockImplementation(() => mockContainerElement);
    core.getDocument.mockImplementation(() => ({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('freezes the initial offset after first measurement (scale overlay behavior)', () => {
    const overlayBox = {
      getBoundingClientRect: () => ({ width: 100, height: 40 }),
    };

    const { result, rerender } = renderHook(
      ({ position }) => useDraggablePosition(position),
      { initialProps: { position: 'top-right' }, wrapper }
    );

    act(() => {
      result.current.setOverlayRef(overlayBox);
    });

    const firstOffset = result.current.initialOffset;

    // Simulate a zoom that changes document metrics
    mockDocumentElement = { offsetLeft: 200, offsetWidth: 400, offsetTop: 50 };
    core.getViewerElement.mockImplementation(() => mockDocumentElement);

    act(() => {
      rerender({ position: 'top-right' });
    });

    expect(result.current.initialOffset).toEqual(firstOffset);
  });

  it('refreezes when container size changes (e.g. panel opens)', () => {
    const overlayBox = {
      getBoundingClientRect: () => ({ width: 100, height: 40 }),
    };

    const { result, rerender } = renderHook(
      ({ position }) => useDraggablePosition(position),
      { initialProps: { position: 'top-right' }, wrapper }
    );

    act(() => {
      result.current.setOverlayRef(overlayBox);
    });

    const firstOffset = result.current.initialOffset;

    // Simulate container resize (e.g., panel open)
    mockState.viewer.documentContainerWidth = 800;
    mockState.viewer.documentContainerHeight = 700;
    core.getScrollViewElement.mockImplementation(() => ({
      offsetLeft: 0,
      offsetTop: 0,
      offsetWidth: mockState.viewer.documentContainerWidth,
      offsetHeight: mockState.viewer.documentContainerHeight,
    }));

    act(() => {
      rerender({ position: 'top-right' });
    });

    expect(result.current.initialOffset).not.toEqual(firstOffset);
  });

  it('falls back to container metrics when document is missing', () => {
    const overlayBox = {
      getBoundingClientRect: () => ({ width: 100, height: 40 }),
    };

    core.getViewerElement.mockImplementation(() => null);
    core.getDocument.mockImplementation(() => null);

    const { result } = renderHook(
      ({ position }) => useDraggablePosition(position),
      { initialProps: { position: 'top-right' }, wrapper }
    );

    act(() => {
      result.current.setOverlayRef(overlayBox);
    });

    expect(result.current.initialOffset.left).toBeGreaterThanOrEqual(DEFAULTS.DISTANCE);
    expect(result.current.initialOffset.top).toBeGreaterThanOrEqual(DEFAULTS.DISTANCE);
    expect(result.current.initialOffset.left).toBeLessThanOrEqual(
      mockState.viewer.documentContainerWidth - overlayBox.getBoundingClientRect().width - DEFAULTS.DISTANCE
    );
  });

  it.each(['top-left', 'top-right', 'bottom-left', 'bottom-right'])('positions overlay for %s', (position) => {
    const overlayBox = {
      getBoundingClientRect: () => ({ width: 100, height: 40 }),
    };

    const doc = core.getViewerElement();
    const containerWidth = mockState.viewer.documentContainerWidth;
    const containerHeight = mockState.viewer.documentContainerHeight;
    const overlayRect = overlayBox.getBoundingClientRect();
    const expectedTop = position.startsWith('top')
      ? (doc?.offsetTop ?? 0) + DEFAULTS.DISTANCE
      : containerHeight - DEFAULTS.DISTANCE - overlayRect.height;
    const expectedLeft = position.endsWith('left')
      ? DEFAULTS.DISTANCE
      : (doc?.offsetLeft ?? 0) + (doc?.offsetWidth ?? containerWidth) + DEFAULTS.DISTANCE;

    const { result } = renderHook(
      () => useDraggablePosition(position),
      { wrapper }
    );

    act(() => {
      result.current.setOverlayRef(overlayBox);
    });

    // Offsets are clamped, so we assert they are at least as expected and within container bounds.
    expect(result.current.initialOffset.left).toBeGreaterThanOrEqual(expectedLeft);
    expect(result.current.initialOffset.top).toBeGreaterThanOrEqual(expectedTop);
    expect(result.current.initialOffset.left).toBeLessThanOrEqual(
      containerWidth - overlayRect.width - DEFAULTS.DISTANCE
    );
    expect(result.current.initialOffset.top).toBeLessThanOrEqual(
      containerHeight - overlayRect.height - DEFAULTS.DISTANCE
    );
  });

  describe('clampOffsetToContainer', () => {
    const metrics = {
      containerLeft: 10,
      containerTop: 20,
      containerWidth: 300,
      containerHeight: 200,
      overlayWidth: 50,
      overlayHeight: 40,
    };

    it('returns the same offset when already within bounds', () => {
      const offset = { left: 30, top: 40 };
      expect(clampOffsetToContainer(offset, metrics)).toEqual(offset);
    });

    it('clamps when proposed offset is outside on the top/left', () => {
      const offset = { left: -100, top: -50 };
      const clamped = clampOffsetToContainer(offset, metrics);
      expect(clamped.left).toBe(metrics.containerLeft + DEFAULTS.DISTANCE);
      expect(clamped.top).toBe(metrics.containerTop + DEFAULTS.DISTANCE);
    });

    it('clamps when proposed offset is outside on the bottom/right', () => {
      const offset = { left: 1000, top: 1000 };
      const clamped = clampOffsetToContainer(offset, metrics);
      const maxLeft = metrics.containerLeft + (metrics.containerWidth - metrics.overlayWidth - DEFAULTS.DISTANCE);
      const maxTop = metrics.containerTop + (metrics.containerHeight - metrics.overlayHeight - DEFAULTS.DISTANCE);
      expect(clamped.left).toBe(maxLeft);
      expect(clamped.top).toBe(maxTop);
    });

    it('handles zero overlay size without throwing and clamps inside container', () => {
      const offset = { left: 5, top: 5 };
      const clamped = clampOffsetToContainer(offset, { ...metrics, overlayWidth: 0, overlayHeight: 0 });
      expect(clamped.left).toBe(metrics.containerLeft + DEFAULTS.DISTANCE);
      expect(clamped.top).toBe(metrics.containerTop + DEFAULTS.DISTANCE);
    });
  });
});
