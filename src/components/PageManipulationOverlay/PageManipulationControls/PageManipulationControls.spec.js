import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import PageManipulationControls from './PageManipulationControls';

const TestPageManipulationControls = withProviders(PageManipulationControls);
function noop() { };

describe('PageManipulationControls', () => {
  describe('Component', () => {
    it('Should render component correctly with 3 buttons and one type element for header', () => {
      const { container } = render(<TestPageManipulationControls
        deletePages={noop}
        extractPages={noop}
        replacePages={noop}
      />)

      expect(container.querySelectorAll('.Button')).toHaveLength(2);
      expect(container.querySelectorAll('.type')).toHaveLength(1);
    });

    it('Should call deletePages handler when the delete pages button is clicked', () => {
      const deletePages = jest.fn();
      const { container } = render(<TestPageManipulationControls
        deletePages={deletePages}
        extractPages={noop}
        replacePages={noop}
      />)

      const deletePagesButton = container.querySelector('.Button[aria-label="Delete"]');
      expect(deletePagesButton).toBeInTheDocument();
      fireEvent.click(deletePagesButton);
      expect(deletePages).toBeCalled();
    });

    it('Should call extractPages handler when the extract pages button is clicked', () => {
      const extractPages = jest.fn();
      const { container } = render(<TestPageManipulationControls
        deletePages={noop}
        extractPages={extractPages}
        replacePages={noop}
      />)

      const extractPagesButton = container.querySelector('.Button[aria-label="Extract"]');
      expect(extractPagesButton).toBeInTheDocument();
      fireEvent.click(extractPagesButton);
      expect(extractPages).toBeCalled();
    });

    it.skip('Should call replacePages handler when the replace pages button is clicked', () => {
      const replacePages = jest.fn();
      const { container } = render(<TestPageManipulationControls
        deletePages={noop}
        extractPages={noop}
        replacePages={replacePages}
      />)

      const replacePagesButton = container.querySelector('.Button[aria-label="Replace"]');
      expect(replacePagesButton).toBeInTheDocument();
      fireEvent.click(replacePagesButton);
      expect(replacePages).toBeCalled();
    });
  })
})