import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const currentPage = selectors.getCurrentPage(store.getState());
  
  if (currentPage === 1) {
    console.warn('You are at the first page');
  } else {
    const prevPage = currentPage - 1;
    core.setCurrentPage(prevPage);  
  }
};