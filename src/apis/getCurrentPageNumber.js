import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import selectors from 'selectors';

export default store => () => {
  warnDeprecatedAPI(
    'getCurrentPageNumber',
    'docViewer.getCurrentPage',
    '7.0',
  );

  return selectors.getCurrentPage(store.getState());
};
