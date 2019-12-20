import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import core from 'core';
import selectors from 'selectors';

export default store => () => {
  warnDeprecatedAPI(
    'goToLastPage',
    'docViewer.setCurrentPage(instance.docViewer.getPageCount())',
    '7.0',
  );

  core.setCurrentPage(selectors.getTotalPages(store.getState()));
};
