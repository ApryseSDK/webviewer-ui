import core from 'core';

export default nextPageNumber => {
  const totalPageNumber = core.getTotalPages();
  const currPageNumber = core.getCurrentPage();

  let nextPage = Math.min(totalPageNumber, nextPageNumber);
  nextPage = Math.max(1, nextPageNumber);

  if (nextPage !== currPageNumber) {
    core.setCurrentPage(nextPage);
  }
};
