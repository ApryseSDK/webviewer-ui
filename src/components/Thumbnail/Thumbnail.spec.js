import Thumbnail from './Thumbnail';
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
const TestThumbnail = withProviders(Thumbnail);

function noop() { }

const mockDocument = {
  getPageInfo: () => ({
    width: 100,
    height: 100
  }),
  loadCanvas: async ({ drawComplete }) => {
    const canvas = document.createElement('canvas');
    await drawComplete(canvas);
  },
};

jest.mock('core', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getRotation: () => 1,
  getDocument: () => mockDocument,
  setCurrentPage: () => {},
}));

jest.mock('src/helpers/getRootNode', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    querySelector: jest.fn(() => ({
      getAttribute: (k) => (k === 'dir' ? 'ltr' : null),
      appendChild: jest.fn(),
      querySelector: jest.fn(() => null),
    }))
  }))
}));

describe('Thumbnail', () => {
  describe('Component', () => {
    it('Component should not throw any errors', () => {
      expect(() => {
        render(<TestThumbnail />);
      }).not.toThrow();
    });

    it('Should render document controls if enabled and role', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that container div is in the document to draw thumb canvas
      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that page label div is in the document
      expect(container.querySelector('.page-label')).toBeInTheDocument();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that thumbnail div is in the document to draw thumb canvas
      expect(container.querySelector('.thumbnail')).toBeInTheDocument();
    });
  });

  describe('Shift key Press', () => {
    it('Should set shiftKeyPivotIndex when just press a single key', () => {
      const actions = {
        setSelectedPageThumbnails: () => { },
        setShiftKeyThumbnailsPivotIndex: jest.fn(),
        setThumbnailSelectingPages: noop,
      };
      const pressedIndex = 2;
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={actions}
          index={pressedIndex}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer);
      expect(actions.setShiftKeyThumbnailsPivotIndex).toBeCalledWith(pressedIndex);
    });
    it('Should select page 3 when only click index 2', () => {
      const actions = {
        setSelectedPageThumbnails: jest.fn(),
        setShiftKeyThumbnailsPivotIndex: () => { },
        setThumbnailSelectingPages: noop,
      };
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={actions}
          index={2}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer);
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([2]);
    });
    it('Should select page1, page2 and page3 when first select page 3', () => {
      const actions = {
        setSelectedPageThumbnails: jest.fn(),
        setShiftKeyThumbnailsPivotIndex: () => { },
        setThumbnailSelectingPages: noop,
      };
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          isThumbnailMultiselectEnabled
          shiftKeyThumbnailPivotIndex={null}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={actions}
          index={2}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([0, 1, 2]);
    });
    it('Should select page2 and page3, page4 when select page 2 and page 4', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={1}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[1]}
          actions={actions}
          index={3}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([1, 2, 3]);
    });
    it('Should select page1 and page2, page3 when 2 and 3 are already selected, and I click shift + select page 1', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={2}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[2, 3]}
          actions={actions}
          index={0}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([0, 1, 2]);
    });
    it('Should select page 2 and page 1 when already selected page 2, and I shift + select page 1', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={2}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[2, 1, 0]}
          actions={actions}
          index={1}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([1, 2]);
    });
  });
  describe('Thumbnail Flickering', () => {
    const mockUpdateAnnotations = jest.fn();
    const mockOnFinishLoading = jest.fn();
    const mockOnLoad = jest.fn();
    const rerenderThumbnail = (rerender, canLoad) => {
      rerender(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={canLoad}
          updateAnnotations={mockUpdateAnnotations}
          onFinishLoading={mockOnFinishLoading}
          onLoad={mockOnLoad}
        />
      );
    };

    const checkMockCount = async (count) => {
      await waitFor(() => {
        expect(mockOnFinishLoading).toHaveBeenCalledTimes(count);
      });
      expect(mockUpdateAnnotations).toHaveBeenCalledTimes(count);
    };

    beforeEach(() => {
      mockUpdateAnnotations.mockClear();
      mockOnFinishLoading.mockClear();
      mockOnLoad.mockClear();
    });

    // This is to mock onBeginRendering to onFinishedRendering
    it('should not trigger when canLoad is false', async () => {
      const { rerender } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={false}
          updateAnnotations={mockUpdateAnnotations}
          onFinishLoading={mockOnFinishLoading}
          onLoad={mockOnLoad}
        />
      );

      // Initial render should not trigger mockUpdateAnnotations because canLoad is false
      await checkMockCount(0);

      // Subsequent rerenders should not trigger mockUpdateAnnotations
      rerenderThumbnail(rerender, true);
      await checkMockCount(0);

      rerenderThumbnail(rerender, false);
      await checkMockCount(0);
    });

    it('should trigger updateAnnotation once when canLoad is true on first render', async () => {
      const { rerender } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          updateAnnotations={mockUpdateAnnotations}
          onFinishLoading={mockOnFinishLoading}
          onLoad={mockOnLoad}
        />
      );

      // Because canLoad is true, we expect one call for mockUpdateAnnotations
      await checkMockCount(1);

      // Subsequent rerenders should not trigger mockUpdateAnnotations
      rerenderThumbnail(rerender, false);
      await checkMockCount(1);

      rerenderThumbnail(rerender, true);
      await checkMockCount(1);
    });
  });
});
