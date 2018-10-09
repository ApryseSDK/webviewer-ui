import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const state = store.getState();
  const currentPage = selectors.getCurrentPage(state);
  
  if (currentPage === selectors.getTotalPages(state)) {
    console.warn('you are at the last page');
  } else {
    const nextPage = currentPage + 1;
    core.setCurrentPage(nextPage);  
  }
};

