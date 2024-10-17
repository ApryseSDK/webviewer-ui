import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  mockSearchResults,
  StartSearch,
  SearchInProgress,
  SearchInProgressWithIncomingResults,
  SearchCompleteWithResults,
  SearchCompleteNoResults,
} from './RedactionSearchPanel.stories';
import RedactionSearchPanel from './RedactionSearchPanel';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';
import userEvent from '@testing-library/user-event';

function noop() {}

const RedactionSearchPanelWithRedux = withProviders(RedactionSearchPanel);

const customRenderWithContext = (component, providerProps = {}) => {
  return render(<RedactionPanelContext.Provider value={providerProps}>{component}</RedactionPanelContext.Provider>);
};

jest.mock('core', () => ({
  setActiveSearchResult: () => {},
}));

describe('RedactionSearchPanel', () => {
  describe('storybook components', () => {
    it('renders StartSearch story without errors', () => {
      expect(() => {
        render(<StartSearch />);
      }).not.toThrow();
    });

    it('renders SearchInProgress story without errors', () => {
      expect(() => {
        render(<SearchInProgress />);
      }).not.toThrow();
    });

    it('renders SearchInProgressWithIncomingResults story without errors', () => {
      expect(() => {
        render(<SearchInProgressWithIncomingResults />);
      }).not.toThrow();
    });

    it('renders SearchCompleteWithResults story without errors', () => {
      expect(() => {
        render(<SearchCompleteWithResults />);
      }).not.toThrow();
    });

    it('renders SearchCompleteNoResults story without errors', () => {
      expect(() => {
        render(<SearchCompleteNoResults />);
      }).not.toThrow();
    });
  });

  describe('component', () => {
    it('renders the correct number of results in appropriate pages', () => {
      const props = {
        redactionSearchResults: mockSearchResults,
        isProcessingRedactionResults: false,
        clearRedactionSearchResults: noop,
        searchStatus: 'SEARCH_DONE',
      };

      const providerProps = {
        isRedactionSearchActive: true,
        setIsRedactionSearchActive: jest.fn(),
        isTestMode: true,
      };

      customRenderWithContext(<RedactionSearchPanelWithRedux {...props} />, providerProps);
      const redactionSearchResults = screen.getAllByRole('listitem');
      expect(redactionSearchResults.length).toEqual(mockSearchResults.length);
      // Results should be across two pages
      screen.getByText(/Page 1/);
      screen.getByText(/Page 2/);

      // Renders the correct total number of results message
      screen.getAllByText((_, node) => node.textContent === `Search Results (${mockSearchResults.length})`);
    });

    it('when user clicks on Select All and Unselect, we select and deselect all results', async () => {
      const props = {
        redactionSearchResults: mockSearchResults,
        isProcessingRedactionResults: false,
        clearRedactionSearchResults: noop,
        searchStatus: 'SEARCH_DONE',
      };

      const providerProps = {
        isRedactionSearchActive: true,
        setIsRedactionSearchActive: jest.fn(),
        isTestMode: true,
      };

      customRenderWithContext(<RedactionSearchPanelWithRedux {...props} />, providerProps);
      const redactionSearchResultsCheckboxes = screen.getAllByRole('checkbox');

      redactionSearchResultsCheckboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });

      // User clicks on select all
      const selectAllButton = screen.getByText('Select all');
      userEvent.click(selectAllButton);

      for (const checkbox of redactionSearchResultsCheckboxes) {
        await waitFor(() => expect(checkbox).toBeChecked());
      }

      // Now deselect all
      const unselectAllButton = screen.getByText('Unselect');
      userEvent.click(unselectAllButton);

      for (const checkbox of redactionSearchResultsCheckboxes) {
        await waitFor(() => expect(checkbox).not.toBeChecked());
      }
    });

    it('if a user selects all results on same page, the top level checkbox also gets toggled to selected', () => {
      const props = {
        redactionSearchResults: mockSearchResults,
        isProcessingRedactionResults: false,
        clearRedactionSearchResults: noop,
        searchStatus: 'SEARCH_DONE',
      };

      const providerProps = {
        isRedactionSearchActive: true,
        setIsRedactionSearchActive: jest.fn(),
        isTestMode: true,
      };

      customRenderWithContext(<RedactionSearchPanelWithRedux {...props} />, providerProps);
      const redactionSearchResultsCheckboxes = screen.getAllByRole('checkbox');

      // Verify checkbox for `Page 1` is not selected
      const pageOneCheckbox = redactionSearchResultsCheckboxes[0];
      expect(pageOneCheckbox).not.toBeChecked();

      // Now select first result on page one (there are two total)
      const firstResultCheckbox = redactionSearchResultsCheckboxes[1];
      userEvent.click(firstResultCheckbox);

      // Verify checkbox for `Page 1` is still not selected
      expect(pageOneCheckbox).not.toBeChecked();

      // Now select second result on page one (there are two total)
      const secondResultCheckbox = redactionSearchResultsCheckboxes[2];
      userEvent.click(secondResultCheckbox);

      // Verify checkbox for `Page 1` is now selected
      expect(pageOneCheckbox).toBeChecked();

      // Now deselect first result on page one (there are two total)
      userEvent.click(firstResultCheckbox);

      // Page 1 checkbox should be deselected
      expect(pageOneCheckbox).not.toBeChecked();
    });
  });
});
