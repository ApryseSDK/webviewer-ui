import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchResult } from './SearchResult';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';

jest.mock('core', () => {
  return {
    getDocument: () => ({
      getType: () => 'PDF',
    }),
  };
});

describe('SearchResult', () => {
  const createMockProps = (searchResults = []) => {
    const props = {
      width: 100,
      height: 500,
      activeResultIndex: 0,
      searchStatus: 'SEARCH_DONE',
      searchResults: searchResults,
      t: (key) => key,
      onClickResult: () => {},
      pageLabels: [],
      activeDocumentViewerKey: 1,
    };
    return props;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no errors', () => {
    const props = createMockProps();
    const store = configureStore({ reducer: rootReducer });
    expect(() => {
      render(
        <Provider store={store}>
          <SearchResult {...props} />
        </Provider>
      );
    }).not.toThrow();
  });

  it('should render search results with correct ARIA attributes', () => {
    const searchResults = [
      {
        'ambientStr': 'Supplier Document Cover Sheet (Source: 113-TP-10 Quality',
        'resultStr': 'Doc',
        'resultStrStart': 9,
        'resultStrEnd': 12,
        'pageNum': 1,
      },
      {
        'ambientStr': 'Document Title',
        'resultStr': 'Doc',
        'resultStrStart': 1,
        'resultStrEnd': 4,
        'pageNum': 1,
      }
    ];
    const props = createMockProps(searchResults);
    const store = configureStore({ reducer: rootReducer });
    render(
      <Provider store={store}>
        <SearchResult {...props} />
      </Provider>
    );

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(searchResults.length);
    for (let i = 0; i < listItems.length; i++) {
      expect(listItems[i]).toHaveTextContent(searchResults[i].ambientStr);
    }
  });
});