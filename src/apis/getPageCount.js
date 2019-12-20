import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import selectors from 'selectors';

export default store => () => {
  warnDeprecatedAPI(
    'getPageCount',
    'docViewer.getPageCount',
    '7.0',
  );

  return selectors.getTotalPages(store.getState());
};
