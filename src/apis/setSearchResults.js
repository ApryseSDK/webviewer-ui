import core from 'core';

export default (results) => {
  core.clearSearchResults();
  core.displayAdditionalSearchResults(results);
};
