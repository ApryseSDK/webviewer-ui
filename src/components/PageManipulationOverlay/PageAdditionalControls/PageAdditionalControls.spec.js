import React from 'react';
import { fireEvent, render, getByText } from '@testing-library/react';
import PageAdditionalControls from './PageAdditionalControls';

const TestAdditionalPageControls = withProviders(PageAdditionalControls);
function noop() { }

describe('PageAdditionalControls', () => {
  describe('Component', () => {
    it('Should render component correctly with 2 buttons and one type element for header', () => {
      const { container } = render(<TestAdditionalPageControls
        moveToTop={noop}
        moveToBottom={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(2);
      expect(container.querySelectorAll('.type')).toHaveLength(1);
    });

    it('Should call moveToTop handler when the move pages to top button is clicked', () => {
      const moveToTop = jest.fn();
      const { container } = render(<TestAdditionalPageControls
        moveToTop={moveToTop}
        moveToBottom={noop}
      />);

      const moveToTopButton = container.querySelector('.Button[aria-label="Move to top"]');
      expect(moveToTopButton).toBeInTheDocument();
      fireEvent.click(moveToTopButton);
      expect(moveToTop).toBeCalled();
    });

    it('Should call moveToBottom handler when the moveToBottom button is clicked', () => {
      const moveToBottom = jest.fn();
      const { container } = render(<TestAdditionalPageControls
        moveToTop={noop}
        moveToBottom={moveToBottom}
      />);

      const moveToBottomButton = container.querySelector('.Button[aria-label="Move to bottom"]');
      expect(moveToBottomButton).toBeInTheDocument();
      fireEvent.click(moveToBottomButton);
      expect(moveToBottom).toBeCalled();
    });

  });
});