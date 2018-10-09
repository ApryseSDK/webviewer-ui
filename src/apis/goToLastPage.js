import core from 'core';
import selectors from 'selectors';

export default store => () => {
  core.setCurrentPage(selectors.getTotalPages(store.getState()));  
};
