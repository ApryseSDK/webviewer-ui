import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import selectors from 'selectors';

export default store => () => {
  warnDeprecatedAPI(
    'goToPrevPage',
    'docViewer.setCurrentPage(Math.max(instance.docViewer.getCurrentPage() - 1, 1))',
    '7.0',
  );

  const currentPage = selectors.getCurrentPage(store.getState());

  if (currentPage === 1) {
    console.warn('You are at the first page');
  } else {
    const prevPage = currentPage - 1;
    core.setCurrentPage(prevPage);
  }
};