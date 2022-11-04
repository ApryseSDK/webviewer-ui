import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionSearchResultGroup from './RedactionSearchResultGroup';
import { Basic, mockSearchResults } from './RedactionSearchResultGroup.stories';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';

const RedactionSearchResultGroupWithRedux = withProviders(RedactionSearchResultGroup);

const customRenderWithContext = (component, providerProps = {}) => {
  return render(
    <RedactionPanelContext.Provider value={providerProps}>
      {component}
    </RedactionPanelContext.Provider>,
  );
};

jest.mock('core', () => ({
  getDisplayAuthor: () => 'Duncan Idaho',
  getRotation: () => 1,
  getTotalPages: () => 1,
  getPageInfo: () => ({ width: 100, height: 100 }),
  deselectAllAnnotations: () => { },
  selectAnnotation: () => { },
  jumpToAnnotation: () => { },
  setActiveSearchResult: () => { },
}));

describe('RedactionSearchResultGroup', () => {
  describe('storybook components', () => {
    it('renders storybook component correctly', () => {
      expect(() => {
        render(<Basic />);
      }).not.toThrow();
    });
  });

  describe('component', () => {
    it('renders the correct number of results and page number', () => {
      const selectedSearchResultIndexes = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
      };
      const setSelectedSearchResultIndexes = jest.fn();

      const props = {
        pageNumber: 1,
        searchResults: mockSearchResults,
        selectedSearchResultIndexes,
        setSelectedSearchResultIndexes,
      };
      customRenderWithContext(<RedactionSearchResultGroupWithRedux {...props} />);
      const redactionSearchResults = screen.getAllByRole('listitem');
      expect(redactionSearchResults.length).toEqual(mockSearchResults.length);
      screen.getByText(`Page ${props.pageNumber}`);
    });

    it('if all the result items on a page are selected, then the top level choice input should be checked', () => {
      // There are 5 mock results. This represents that all five are selected
      const selectedSearchResultIndexes = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
      };
      const setSelectedSearchResultIndexes = jest.fn();

      const props = {
        pageNumber: 1,
        searchResults: mockSearchResults,
        selectedSearchResultIndexes,
        setSelectedSearchResultIndexes,
      };
      customRenderWithContext(<RedactionSearchResultGroupWithRedux {...props} />);
      const checkBox = screen.getByLabelText('Page 1');
      expect(checkBox).toBeChecked();
    });


    it('if not the result items on a page are selected, then the top level choice input should not be checked', () => {
      const selectedSearchResultIndexes = {
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
      };
      const setSelectedSearchResultIndexes = jest.fn();

      const props = {
        pageNumber: 1,
        searchResults: mockSearchResults,
        selectedSearchResultIndexes,
        setSelectedSearchResultIndexes,
      };
      customRenderWithContext(<RedactionSearchResultGroupWithRedux {...props} />);
      const checkBox = screen.getByLabelText('Page 1');
      expect(checkBox).not.toBeChecked();
    });

    it('if check a result it calls the right handler', () => {
      const selectedSearchResultIndexes = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
      };
      const setSelectedSearchResultIndexes = jest.fn();

      const props = {
        pageNumber: 1,
        searchResults: mockSearchResults,
        selectedSearchResultIndexes,
        setSelectedSearchResultIndexes,
      };
      customRenderWithContext(<RedactionSearchResultGroupWithRedux {...props} />);
      const resultCheckBoxes = screen.getAllByRole('checkbox');
      // Expect 6 checkboxes, one for the top level "select all in the page"
      // and one for each result
      expect(resultCheckBoxes.length).toBe(mockSearchResults.length + 1);
      // Select first result
      userEvent.click(resultCheckBoxes[1]);

      // Notice first page is now selected i.e. true
      expect(setSelectedSearchResultIndexes).toBeCalledWith({
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
      });

      // Select last result
      userEvent.click(resultCheckBoxes[5]);
      expect(setSelectedSearchResultIndexes).toBeCalledWith({
        0: true,
        1: false,
        2: false,
        3: false,
        4: true,
      });
    });
  });
});