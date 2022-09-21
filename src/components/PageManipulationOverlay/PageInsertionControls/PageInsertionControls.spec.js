import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import PageInsertionControls from './PageInsertionControls';

const TestPageInsertionControls = withProviders(PageInsertionControls);
function noop() { }

describe('PageInsertionControls', () => {
  describe('Component', () => {
    it('Should render component correctly with 2 buttons and one type element for header', () => {
      const { container } = render(<TestPageInsertionControls
        insertAbove={noop}
        insertBlow={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(2);
      expect(container.querySelectorAll('.type')).toHaveLength(1);
    });

    it('Should call insertAbove handler when the Insert blank page above pages button is clicked', () => {
      const insertAbove = jest.fn();
      const { container } = render(<TestPageInsertionControls
        insertAbove={insertAbove}
        insertBlow={noop}
      />);

      const insertAboveButton = container.querySelector('.Button[aria-label="Insert blank page above"]');
      expect(insertAboveButton).toBeInTheDocument();
      fireEvent.click(insertAboveButton);
      expect(insertAbove).toBeCalled();
    });

    it('Should call insertAbove handler when the Insert blank page below pages button is clicked', () => {
      const insertBelow = jest.fn();
      const { container } = render(<TestPageInsertionControls
        insertAbove={noop}
        insertBelow={insertBelow}
      />);

      const insertBelowButton = container.querySelector('.Button[aria-label="Insert blank page below"]');
      expect(insertBelowButton).toBeInTheDocument();
      fireEvent.click(insertBelowButton);
      expect(insertBelow).toBeCalled();
    });
  });
});