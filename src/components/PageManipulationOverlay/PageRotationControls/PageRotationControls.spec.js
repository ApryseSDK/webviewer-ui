import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import PageRotationControls from './PageRotationControls';

const TestPageRotationControls = withProviders(PageRotationControls);
function noop() { };

describe('PageRotationControls', () => {
  describe('Component', () => {
    it('Should render component correctly with 2 buttons and one type element for header', () => {
      const { container } = render(<TestPageRotationControls
        rotateClockwise={noop}
        rotateCounterClockwise={noop}
      />)

      expect(container.querySelectorAll('.Button')).toHaveLength(2);
      expect(container.querySelectorAll('.type')).toHaveLength(1);
    })

    it('Should call rotateClockwise handler when rotate clockwise button is clicked', () => {
      const rotateClockWise = jest.fn();
      const { container } = render(<TestPageRotationControls
        rotateClockwise={rotateClockWise}
        rotateCounterClockwise={noop}
      />)

      const rotateClockwiseButton = container.querySelector('.Button[aria-label="Rotate Clockwise"]');
      expect(rotateClockwiseButton).toBeInTheDocument();
      fireEvent.click(rotateClockwiseButton);
      expect(rotateClockWise).toBeCalled();
    })

    it('Should call rotateCounterClockwise handler when rotate counterClockwise button is clicked', () => {
      const rotateCounterClockWise = jest.fn();
      const { container } = render(<TestPageRotationControls
        rotateClockwise={noop}
        rotateCounterClockwise={rotateCounterClockWise}
      />)

      const rotateCounterClockwiseButton = container.querySelector('.Button[aria-label="Rotate Counterclockwise"]');
      expect(rotateCounterClockwiseButton).toBeInTheDocument();
      fireEvent.click(rotateCounterClockwiseButton);
      expect(rotateCounterClockWise).toBeCalled();
    })
  })
})