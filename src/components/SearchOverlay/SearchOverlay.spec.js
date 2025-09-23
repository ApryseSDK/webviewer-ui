import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SearchOverlay from './SearchOverlay';
import { Basic } from './SearchOverlay.stories';
import { executeSearch, selectNextResult, selectPreviousResult } from './SearchOverlayContainer';
import core from 'core';
import { Provider } from 'react-redux';
import Flyout from '../ModularComponents/Flyout/Flyout';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'actions';
import { configureStore } from '@reduxjs/toolkit';


// To create mocks of something that executeSearch uses we need to first import them
// and then call jest.mock them.
import { getOverrideSearchExecution } from 'helpers/search';
import searchTextFullFactory from '../../apis/searchTextFull';

// wrap story component with i18n provider, so component can use useTranslation()
const BasicSearchOverlayStory = withI18n(Basic);
// wrap base component with i81n provider and mock redux
const TestSearchOverlay = withProviders(SearchOverlay);

// This file is meant to be example how to implement unit testing for our components
// thus having excessive comments

function noop() {}
jest.mock('../../apis/searchTextFull');
// To override something else that default export, we need to use factory function
jest.mock('helpers/search', () => {
  return {
    getOverrideSearchExecution: jest.fn(),
    addSearchListener: jest.fn(),
    removeSearchListener: jest.fn(),
  };
});

jest.mock('helpers/officeEditor', () => ({
  isOfficeEditorMode: jest.fn(() => false),
  isSpreadsheetEditorMode: jest.fn(() => false),
}));

jest.mock('constants/types', () => ({
  workerTypes: {
    PDF: 'pdf',
    OFFICE_EDITOR: 'officeEditor',
    SPREADSHEET_EDITOR: 'spreadsheetEditor',
  }
}));

jest.mock('core', () => {
  const mockGetDocument = () => {
    const mockDocument = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getType: jest.fn(() => 'pdf'),
      getOfficeEditor: jest.fn(() => ({
        updateSearchData: jest.fn(() => Promise.resolve()),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }))
    };
    return mockDocument;
  };

  return {
    clearSearchResults: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getDocument: mockGetDocument
  };
});

const createMockStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

const ConditionalFlyout = ({ store }) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const activeFlyout = state.viewer.activeFlyout;
      const flyoutExists = activeFlyout && state.viewer.flyoutMap[activeFlyout];
      const isElementOpen = state.viewer.openElements[activeFlyout];

      const hasValidItems = flyoutExists &&
                            flyoutExists.items &&
                            Array.isArray(flyoutExists.items);

      setShouldRender(!!(flyoutExists && isElementOpen && hasValidItems));
    });

    const state = store.getState();
    const activeFlyout = state.viewer.activeFlyout;
    const flyoutExists = activeFlyout && state.viewer.flyoutMap[activeFlyout];
    const isElementOpen = state.viewer.openElements[activeFlyout];
    const hasValidItems = flyoutExists &&
                          flyoutExists.items &&
                          Array.isArray(flyoutExists.items);

    setShouldRender(!!(flyoutExists && isElementOpen && hasValidItems));

    return unsubscribe;
  }, [store]);

  return shouldRender ? <Flyout /> : null;
};

const createTestSearchOverlayWithStore = () => {
  const customStore = createMockStore();

  const TestSearchOverlayWithCustomStore = (props) => {
    const [, setStateUpdate] = React.useState(0);

    const handleStoreChange = React.useCallback(() => {
      setStateUpdate((prev) => prev + 1);
    }, []);

    React.useEffect(() => {
      const unsubscribe = customStore.subscribe(handleStoreChange);
      return unsubscribe;
    }, [handleStoreChange]);

    const state = customStore.getState();

    return (
      <Provider store={customStore}>
        <div>
          <SearchOverlay
            {...props}
            isCaseSensitive={state.search.isCaseSensitive}
            isWholeWord={state.search.isWholeWord}
            isWildcard={state.search.isWildcard}
          />
          <ConditionalFlyout store={customStore} />
        </div>
      </Provider>
    );
  };

  return { TestSearchOverlayWithCustomStore, customStore };
};

const createMockHandlers = (customStore) => {
  return {
    executeSearch: jest.fn(),
    setCaseSensitive: jest.fn((value) => {
      customStore.dispatch(actions.setCaseSensitive(value));
    }),
    setWholeWord: jest.fn((value) => {
      customStore.dispatch(actions.setWholeWord(value));
    }),
    setWildcard: jest.fn((value) => {
      customStore.dispatch(actions.setWildcard(value));
    }),
    setSearchStatus: jest.fn(),
  };
};

describe('SearchOverlay', () => {
  beforeEach(() => {
    searchTextFullFactory.mockReset();
    getOverrideSearchExecution.mockReset();

    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.runOnlyPendingTimers();
  });

  const openFlyoutAndGetCheckbox = async (screen, container, checkboxId) => {
    const searchOptionsButton = await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Toggle search options' });
      expect(button).toBeInTheDocument();
      return button;
    });

    fireEvent.click(searchOptionsButton);

    await waitFor(() => {
      const flyoutContainer = container.querySelector('.FlyoutContainer');
      expect(flyoutContainer).toBeInTheDocument();
    });

    const checkbox = await waitFor(() => {
      const target = screen.getByRole('checkbox', { name: checkboxId });
      expect(target).toBeInTheDocument();
      return target;
    });

    return checkbox;
  };

  describe('Component', () => {
    // It's good practice to test that all stories of current component work without throwing errors.
    // In some cases when changing code (or configuration), we forget to make necessary changes to
    // storybook stories or its configuration. Rendering test case in unit tests makes sure we don't
    // break storybook by accident.
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicSearchOverlayStory />);
      }).not.toThrow();
    });

    it('Should not render component if disabled', () => {
      // render component with isSearchOverlayDisabled which should cause component to not render anything
      const { container } = render(
        <TestSearchOverlay
          setSearchValue={noop}
          setCaseSensitive={noop}
          setSearchStatus={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={noop}
          setReplaceValue={noop}
          isSearchOverlayDisabled
        />
      );
      // Verify that SearchPanel div is not in the document
      expect(container.querySelector('.SearchPanel')).not.toBeInTheDocument();
    });

    it('Should execute search on input text enter', async () => {
      const executeSearch = jest.fn();
      render(
        <TestSearchOverlay
          setSearchValue={noop}
          setSearchStatus={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeSearch={executeSearch}
          setIsSearchInProgress={noop}
          isPanelOpen={true}
          isCaseSensitive={false}
          isWholeWord={false}
          isWildcard={false}
        />
      );
      const searchInput = screen.getByRole('textbox', { name: 'Search document' });
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'test search' } });

      await waitFor(() => {
        expect(executeSearch).toHaveBeenCalled();
      });
    });

    // Helper function to test checkbox interactions that trigger search
    const testCheckboxTriggerSearch = async (checkboxId, additionalValidations = []) => {
      const { TestSearchOverlayWithCustomStore, customStore } = createTestSearchOverlayWithStore();
      const handlers = createMockHandlers(customStore);

      const searchValue = 'more';
      const { container } = render(
        <TestSearchOverlayWithCustomStore
          searchValue={searchValue}
          setSearchValue={noop}
          setReplaceValue={noop}
          isPanelOpen={true}
          {...handlers}
        />
      );

      const searchInput = screen.getByRole('textbox', { name: 'Search document' });
      expect(searchInput).toBeInTheDocument();
      expect(searchInput.value).toBe(searchValue);

      // Wait for the panel to be fully initialized
      await new Promise((resolve) => setTimeout(resolve, 400));

      const checkbox = await openFlyoutAndGetCheckbox(screen, container, checkboxId);

      for (const validation of additionalValidations) {
        await validation(container, checkbox);
      }

      fireEvent.click(checkbox);

      await new Promise((resolve) => setTimeout(resolve, 500));

      await waitFor(() => {
        expect(handlers.executeSearch).toHaveBeenCalled();
      }, { timeout: 5000 });
    };

    it('Should execute search when case sensitive checkbox changed', async () => {
      await testCheckboxTriggerSearch(/Case Sensitive/i);
    });

    it('Should execute search when whole word checkbox changed', async () => {
      await testCheckboxTriggerSearch(/Whole word/i);
    });

    it('Should render wild card checkbox and execute search when checkbox changed', async () => {
      await testCheckboxTriggerSearch(/Wildcard/i);
    });

    it('Should not be focused on mount', () => {
      const { container } = render(
        <TestSearchOverlay
          setSearchValue={noop}
          setCaseSensitive={noop}
          setSearchStatus={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeSearch={noop}
        />
      );

      const searchInput = container.querySelector('#SearchPanel__input');
      expect(searchInput === document.activeElement).toBe(false);
    });

    it('Should have aria-live attribute even without search results', () => {
      const { container } = render(
        <TestSearchOverlay
          searchValue="xyz"
          searchResults={[]}
          searchStatus="SEARCH_DONE"
          isProcessingSearchResults={false}
          isSearchInProgress={false}
          setSearchStatus={noop}
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeSearch={noop}
        />
      );
      const resultLabel = container.querySelector('p[aria-live]');
      expect(resultLabel).toBeInTheDocument();
      expect(resultLabel.textContent).toBe('0 results found');
    });

    it('Should have aria-live attribute even with search results', () => {
      const { container } = render(
        <TestSearchOverlay
          searchValue="Update"
          searchResults={[{ first: true }, { second: true }, { third: true }, { fourth: true }]}
          searchStatus="SEARCH_DONE"
          isProcessingSearchResults={false}
          isSearchInProgress={false}
          setSearchStatus={noop}
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          setReplaceValue={noop}
          executeSearch={noop}
        />
      );
      const resultLabel = container.querySelector('p[aria-live]');
      expect(resultLabel.textContent).toBe('4 results found');
    });
  });

  describe('Functionality', () => {
    it('Should execute text search with correct arguments', () => {
      const searchValue = 'abc';
      const searchOptions = {
        caseSensitive: true,
      };
      // as implementation uses searchOptions and add regex: false to search options
      // we create here object that we are expecting to be called.
      const expectedSearchOptions = {
        ...searchOptions,
        regex: false,
      };
      const searchTextFullMock = jest.fn();
      // factory to return mock value of our searchTextFull function
      searchTextFullFactory.mockReturnValue(searchTextFullMock);
      executeSearch(searchValue, searchOptions);
      // verify that searchTextFull function got called with 'abc' and object that is similar to expectedSearchOptions
      expect(searchTextFullMock).toHaveBeenCalledWith(searchValue, expectedSearchOptions, false);
    });

    it('Should call overrideSearchExecution if given', () => {
      const searchValue = 'abc';
      const searchOptions = {
        caseSensitive: true,
      };
      const expectedSearchOptions = {
        ...searchOptions,
        regex: false,
      };
      // Make sure that when getOverrideSearchExecution is called it returns a function that represents function
      // that user would set when they want to override default search execution function.
      const overrideSearchExecutionFnMock = jest.fn();
      getOverrideSearchExecution.mockReturnValue(overrideSearchExecutionFnMock);
      const searchTextFullMock = jest.fn();
      searchTextFullFactory.mockReturnValue(searchTextFullMock);
      // execute code that is tested
      executeSearch(searchValue, searchOptions);
      // make sure default search implementation is not called
      expect(searchTextFullMock).not.toHaveBeenCalled();
      // verify that the custom search function is called with correct arguments
      expect(overrideSearchExecutionFnMock).toHaveBeenCalledWith(searchValue, expectedSearchOptions);
    });

    it('Should call search when search value is empty', () => {
      const searchTextFullMock = jest.fn();
      searchTextFullFactory.mockReturnValue(searchTextFullMock);
      // When we call executeSearch with empty string, search should be initiated.
      executeSearch('', {});
      expect(searchTextFullMock).toHaveBeenCalled();
    });

    it('Should not call search when search value null or undefined', () => {
      const overrideSearchExecutionFnMock = jest.fn();
      getOverrideSearchExecution.mockReturnValue(overrideSearchExecutionFnMock);
      const searchTextFullMock = jest.fn();
      searchTextFullFactory.mockReturnValue(searchTextFullMock);
      // When we call executeSearch without searchValue, search should not be initiated.
      executeSearch(null, {});
      executeSearch(undefined, {});
      expect(searchTextFullMock).not.toHaveBeenCalled();
      expect(overrideSearchExecutionFnMock).not.toHaveBeenCalled();
    });

    it('Should select next result', () => {
      // create search results. As we mock the core, we can just pass any objects here and we can test
      // that the selection logic works correctly. In real code these object are SearchResult objects
      const searchResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = 0;
      const setActiveSearchResultMock = jest.fn();
      // set mock for setActiveSearchResult so we can verify that it gets called correctly
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectNextResult(searchResults, activeResultIndex);
      expect(setActiveSearchResultMock).toHaveBeenCalledWith(searchResults[1]);
    });

    it('Should go back to first result when last is selected and next button is clicked', () => {
      const searchResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = searchResults.length - 1;
      const setActiveSearchResultMock = jest.fn();
      // set mock for setActiveSearchResult so we can verify that it gets called correctly
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectNextResult(searchResults, activeResultIndex);
      expect(setActiveSearchResultMock).toHaveBeenCalledWith(searchResults[0]);
    });

    it('selectNextResult should not call core if search results not available', () => {
      const setActiveSearchResultMock = jest.fn();
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectNextResult();
      // make sure setActiveSearchResult was not called
      expect(setActiveSearchResultMock).not.toHaveBeenCalled();
    });

    it('Should select previous result', () => {
      const searchResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = 3;
      const setActiveSearchResultMock = jest.fn();
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectPreviousResult(searchResults, activeResultIndex);
      expect(setActiveSearchResultMock).toHaveBeenCalledWith(searchResults[2]);
    });

    it('Should go back to last result when first is selected and previous is clicked', () => {
      const searchResults = [{ first: true }, { second: true }, { third: true }, { fourth: true }];
      const activeResultIndex = 0;
      const setActiveSearchResultMock = jest.fn();
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectPreviousResult(searchResults, activeResultIndex);
      expect(setActiveSearchResultMock).toHaveBeenCalledWith(searchResults[searchResults.length - 1]);
    });

    it('selectPreviousResult should not call core if search results not available', () => {
      const setActiveSearchResultMock = jest.fn();
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectPreviousResult();
      expect(setActiveSearchResultMock).not.toHaveBeenCalledWith();
    });
  });
});
