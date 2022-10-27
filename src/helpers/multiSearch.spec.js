import multiSearchFactory from './multiSearch';

const mockStore = {
  getState: () => (
    {
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

const noop = () => { };

jest.mock('core', () => ({
  clearSearchResults: noop,
  textSearchInit: noop,
  addEventListener: noop,
  getSearchMode: () => ({
    SearchMode: {}
  })
}));

describe('multiSearch', () => {
  it('does not throw any errors when initializing', () => {
    const multiSearch = multiSearchFactory(mockStore);
    multiSearch({
      textSearch: ['hello world']
    });
  });
});