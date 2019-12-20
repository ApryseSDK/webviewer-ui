import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import selectors from 'selectors';

export default store => () => {
  warnDeprecatedAPI(
    'getSideWindowVisibility',
    `isElementOpen('leftPanel')`,
    '7.0',
  );

  return !!selectors.isElementOpen(store.getState(), 'leftPanel');
};
