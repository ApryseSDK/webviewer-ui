import core from 'core';

export default (nextPageNumber, documentViewerKey = 1) => {
  const totalPageNumber = core.getTotalPages(documentViewerKey);
  const currPageNumber = core.getCurrentPage(documentViewerKey);

  let nextPage = Math.min(totalPageNumber, nextPageNumber);
  nextPage = Math.max(1, nextPage);

  if (nextPage !== currPageNumber) {
    core.setCurrentPage(nextPage, documentViewerKey);
  }
};
