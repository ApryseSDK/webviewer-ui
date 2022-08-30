import Thumbnail from './Thumbnail';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

const TestThumbnail = withProviders(Thumbnail);

function noop() { }

jest.mock('core');

describe('Thumbnail', () => {
  describe('Component', () => {
    it('Component should not throw any errors', () => {
      expect(() => {
        render(<TestThumbnail />);
      }).not.toThrow();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that container div is in the document to draw thumb canvas
      expect(container.querySelector('.container')).toBeInTheDocument();
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
          isMobile={false}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderMode={false}
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
          isMobile={false}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderMode={false}
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
          isMobile={false}
          isThumbnailMultiselectEnabled
          shiftKeyThumbnailPivotIndex={null}
          isReaderMode={false}
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
          isMobile={false}
          shiftKeyThumbnailPivotIndex={1}
          isThumbnailMultiselectEnabled
          isReaderMode={false}
          selectedPageIndexes={[1]}
          actions={actions}
          index={3}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([1, 2, 3]);
    });
    it('Should select page1 and page2, page3 when already selected page 3 and page 4', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          isMobile={false}
          shiftKeyThumbnailPivotIndex={2}
          isThumbnailMultiselectEnabled
          isReaderMode={false}
          selectedPageIndexes={[2, 3]}
          actions={actions}
          index={0}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([0, 1, 2]);
    });
    it('Should select page3 and page2 when already selected page 3, page 2 and page 1', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          isMobile={false}
          shiftKeyThumbnailPivotIndex={2}
          isThumbnailMultiselectEnabled
          isReaderMode={false}
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
});
