import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import selectors from 'selectors';

export default store => () => {
  warnDeprecatedAPI(
    'goToNextPage',
    'docViewer.setCurrentPage(Math.min(instance.docViewer.getCurrentPage() + 1, instance.docViewer.getPageCount()))',
    '7.0',
  );

  const state = store.getState();
  const currentPage = selectors.getCurrentPage(state);

  if (currentPage === selectors.getTotalPages(state)) {
    console.warn('you are at the last page');
  } else {
    const nextPage = currentPage + 1;
    core.setCurrentPage(nextPage);
  }
};
