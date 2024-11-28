import React from 'react';
import { render, waitFor } from '@testing-library/react';
import AnnotationContentOverlay from './AnnotationContentOverlay';
import getRootNode from 'src/helpers/getRootNode';


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
}));

jest.mock('src/helpers/getRootNode', () => jest.fn());

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
      const { left, top } = overlayElement.style;

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

    // Mock the return value of getRootNode function
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

    // Use waitFor to wait until the overlay element has the updated styles
    await waitFor(() => {
      const overlayElement = document.querySelector('.AnnotationContentOverlay');

      // Verify that the offsets are adjusted based on the web component's host
      const left = overlayElement.style.left;
      const top = overlayElement.style.top;

      // Computation is based on the clientXY values and the gap which is 20
      // So for example if the clientXY is 800, the left is 800 + 20, minus 100 for the host offsetLeft
      // The top is 600 + 20, minus 50 for the host offsetTop
      expect(parseInt(left, 10)).toBe(720);
      expect(parseInt(top, 10)).toBe(570);
    });
  });
});
