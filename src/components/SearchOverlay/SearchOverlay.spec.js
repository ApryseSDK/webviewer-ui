import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchOverlay from "./SearchOverlay";
import { Basic } from "./SearchOverlay.stories";
import { executeSearch, selectNextResult, selectPreviousResult } from "./SearchOverlayContainer";
import core from 'core';

// wrap story component with i18n provider, so component can use useTranslation()
const BasicSearchOverlayStory = withI18n(Basic);
// wrap base component with i81n provider and mock redux
const TestSearchOverlay = withProviders(SearchOverlay);

// This file is meant to be example how to implement unit testing for our components
// thus having excessive comments

function noop() {}


// To create mocks of something that executeSearch uses we need to first import them
// and then call jest.mock them.
import { getOverrideSearchExecution } from "helpers/search";
import searchTextFullFactory from '../../apis/searchTextFull';
jest.mock('../../apis/searchTextFull');
// To override something else that default export, we need to use factory function
jest.mock('helpers/search', () => {
  return {
    getOverrideSearchExecution: jest.fn(),
  };
});

jest.mock('core');


describe('SearchOverlay', () => {
  beforeEach(() => {
    searchTextFullFactory.mockReset();
    getOverrideSearchExecution.mockReset();
  });

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
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={noop}
          isSearchOverlayDisabled
        />
      );
      // Verify that SearchPanel div is not in the document
      expect(container.querySelector('.SearchPanel')).not.toBeInTheDocument();
    });

    it('Should execute search on input text enter', () => {
      // Create jest mock function, so we can verify that this function was called after click.
      const executeSearch = jest.fn();
      const { container } = render(
        <TestSearchOverlay
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={executeSearch}
        />
      );
      const searchInput = container.querySelector('#SearchPanel__input');
      expect(searchInput).toBeInTheDocument();
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      expect(executeSearch).toHaveBeenCalled();
    });

    it('Should execute search when search button clicked', () => {
      const executeSearch = jest.fn();
      const { container } = render(
        <TestSearchOverlay
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={executeSearch}
        />
      );

      const searchButton = container.querySelector('.input-button');
      expect(searchButton).toBeInTheDocument();
      fireEvent.click(searchButton);
      expect(executeSearch).toHaveBeenCalled();
    });

    it('Should execute search when case sensitive checkbox changed', () => {
      const executeSearch = jest.fn();
      const searchValue = 'more';
      const { container } = render(
        <TestSearchOverlay
          searchValue={searchValue}
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={executeSearch}
        />
      );

      const checkbox = container.querySelector('#case-sensitive-option');
      expect(checkbox).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(executeSearch).not.toBeCalled();
    });

    it('Should execute search when whole word checkbox changed', () => {
      const executeSearch = jest.fn();
      const searchValue = 'more';
      const { container } = render(
        <TestSearchOverlay
          searchValue={searchValue}
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={executeSearch}
        />
      );

      const checkbox = container.querySelector('#whole-word-option');
      expect(checkbox).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(executeSearch).not.toBeCalled();
    });

    it('Should render wild card checkbox and execute search when checkbox changed', () => {
      const executeSearch = jest.fn();
      const searchValue = 'more';
      const { container } = render(
        <TestSearchOverlay
          searchValue={searchValue}
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={executeSearch}
        />
      );

      const checkbox = container.querySelector('#wild-card-option');
      expect(checkbox).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(executeSearch).not.toBeCalled();
    });

    it('Should not be focused on mount', () => {
      const { container } = render(
        <TestSearchOverlay
          setSearchValue={noop}
          setCaseSensitive={noop}
          setWholeWord={noop}
          setWildcard={noop}
          executeSearch={noop}
        />
      );

      const searchInput = container.querySelector('#SearchPanel__input');
      expect(searchInput === document.activeElement).toBe(false);
    })
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
      expect(searchTextFullMock).toHaveBeenCalledWith(searchValue, expectedSearchOptions);
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
      const searchResults = [{ first:true }, { second:true }, { third:true }, { fourth:true }];
      const activeResultIndex = 0;
      const setActiveSearchResultMock = jest.fn();
      // set mock for setActiveSearchResult so we can verify that it gets called correctly
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectNextResult(searchResults, activeResultIndex);
      expect(setActiveSearchResultMock).toHaveBeenCalledWith(searchResults[1]);
    });

    it('Should go back to first result when last is selected and next button is clicked', () => {
      const searchResults = [{ first:true }, { second:true }, { third:true }, { fourth:true }];
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
      const searchResults = [{ first:true }, { second:true }, { third:true }, { fourth:true }];
      const activeResultIndex = 3;
      const setActiveSearchResultMock = jest.fn();
      core.setActiveSearchResult = setActiveSearchResultMock;
      selectPreviousResult(searchResults, activeResultIndex);
      expect(setActiveSearchResultMock).toHaveBeenCalledWith(searchResults[2]);
    });

    it('Should go back to last result when first is selected and previous is clicked', () => {
      const searchResults = [{ first:true }, { second:true }, { third:true }, { fourth:true }];
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
