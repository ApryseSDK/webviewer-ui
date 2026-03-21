import multiSearchFactory from './multiSearch';

const mockSearchTextFull = jest.fn();
const mockClearSearchResults = jest.fn();

jest.mock('core', () => ({
  clearSearchResults: () => mockClearSearchResults(),
}));
jest.mock('../apis/searchTextFull', () => jest.fn(() => mockSearchTextFull));

const mockStore = {
  getState: () => (
    {
      viewer: {
        isMultiViewerMode: false,
      },
      search: {
        redactionSearchPatterns: {
          creditCards: {
            label: 'redactionPanel.search.creditCards',
            icon: 'redact-icons-credit-card',
            type: 'creditCard',
            regex: /\b(?:\d[ -]*?){13,16}\b/,
          }
        }
      }
    })
};

describe('multiSearch', () => {
  beforeEach(() => {
    mockSearchTextFull.mockClear();
    mockClearSearchResults.mockClear();
  });

  it('does not throw any errors when initializing', () => {
    const multiSearch = multiSearchFactory(mockStore);
    multiSearch({
      textSearch: ['hello world'],
      caseSensitive: false,
    });
    expect(mockSearchTextFull).toHaveBeenCalledTimes(1);
  });

  it('pipes multiple terms and preset patterns into a regex search', () => {
    const multiSearch = multiSearchFactory(mockStore);
    multiSearch({
      textSearch: ['hello', 'world'],
      creditCard: true,
      caseSensitive: false,
    });

    expect(mockSearchTextFull).toHaveBeenCalledWith(
      'hello|world|\\b(?:\\d[ -]*?){13,16}\\b',
      { regex: true, caseSensitive: false },
      true,
      { shouldDispatchUIActions: false },
    );
  });

  it('clears results when search terms are empty', () => {
    const multiSearch = multiSearchFactory(mockStore);
    multiSearch({
      textSearch: [],
      caseSensitive: true,
    });
    expect(mockSearchTextFull).not.toHaveBeenCalled();
    expect(mockClearSearchResults).toHaveBeenCalledTimes(1);
  });
});
