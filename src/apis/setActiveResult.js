import core from 'core';

export default (result, index) => {
  if (!result && index >= 0) {
    // core doesn't have concept of active result index. In previous implementation,
    // there is theoretically a case where not setting result, but passing index and that should have worked
    // To have backward compatibility here, we check if user didn't give result and then try to use index
    // to retrieve result object from all current search results and set that as new active search result
    const searchResults = core.getPageSearchResults();
    const newActiveResult = searchResults[index];
    if (newActiveResult) {
      core.setActiveSearchResult(newActiveResult);
    }
  } else {
    core.setActiveSearchResult(result);
  }
};
