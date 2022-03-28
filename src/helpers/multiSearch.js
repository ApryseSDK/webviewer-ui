import searchTextFullFactory from '../apis/searchTextFull';
import selectors from 'selectors';
import core from 'core';


function multiSearch(store) {
  return function multiSearch({
    textSearch = [],
    creditCards = false,
    phoneNumbers = false,
    emails = false,
    //images = false, Will not be included for first release
  }) {

    const { getState } = store;
    const state = getState();
    const creditCardPattern = selectors.getRedactionSearchPattern(state, 'creditCards');
    const phoneNumbersPattern = selectors.getRedactionSearchPattern(state, 'phoneNumbers');
    const emailsPattern = selectors.getRedactionSearchPattern(state, 'emails');
    const options = {
      regex: true,
    };

    const searchArray = [...textSearch];

    if (creditCards) {
      searchArray.push(creditCardPattern);
    }

    if (phoneNumbers) {
      searchArray.push(phoneNumbersPattern);
    }

    if (emails) {
      searchArray.push(emailsPattern);
    }

    const searchString = searchArray.join('|');

    // If search string is empty we return and clear searches or we send the search logic
    // into an infinte loop
    if (searchString === '') {
      core.clearSearchResults();
      return;
    }

    const searchTextFull = searchTextFullFactory();
    searchTextFull(searchString, options);
  };
}

export default multiSearch;