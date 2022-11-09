import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import PageManipulationControls from './PageManipulationControls';

const TestPageManipulationControls = withProviders(PageManipulationControls);
function noop() { }

describe('PageManipulationControls', () => {
  describe('Component', () => {
    it('Should render component correctly with 4 buttons and one type element for header', () => {
      const { container } = render(<TestPageManipulationControls
        deletePages={noop}
        extractPages={noop}
        insertPages={noop}
        replacePages={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(4);
      expect(container.querySelectorAll('.type')).toHaveLength(1);
    });

    it('Should call deletePages handler when the delete pages button is clicked', () => {
      const deletePages = jest.fn();
      const { container } = render(<TestPageManipulationControls
        deletePages={deletePages}
        extractPages={noop}
        insertPages={noop}
        replacePages={noop}
      />);

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
        insertPages={noop}
        replacePages={noop}
      />);

      const extractPagesButton = container.querySelector('.Button[aria-label="Extract"]');
      expect(extractPagesButton).toBeInTheDocument();
      fireEvent.click(extractPagesButton);
      expect(extractPages).toBeCalled();
    });

    it('Should call replacePages handler when the replace pages button is clicked', () => {
      const replacePages = jest.fn();
      const { container } = render(<TestPageManipulationControls
        deletePages={noop}
        extractPages={noop}
        insertPages={noop}
        replacePages={replacePages}
      />);

      const replacePagesButton = container.querySelector('.Button[aria-label="Replace"]');
      expect(replacePagesButton).toBeInTheDocument();
      fireEvent.click(replacePagesButton);
      expect(replacePages).toBeCalled();
    });

    it('Should call insertPages handler when the insert pages button is clicked', () => {
      const insertPages = jest.fn();
      const { container } = render(<TestPageManipulationControls
        deletePages={noop}
        extractPages={noop}
        insertPages={insertPages}
        replacePages={noop}
      />);

      const insertPagesButton = container.querySelector('.Button[aria-label="Insert"]');
      expect(insertPagesButton).toBeInTheDocument();
      fireEvent.click(insertPagesButton);
      expect(insertPages).toBeCalled();
    });
  });
});