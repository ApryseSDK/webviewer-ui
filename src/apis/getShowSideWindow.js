import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import getSideWindowVisibility from './getSideWindowVisibility';

export default store => () => {
  warnDeprecatedAPI(
    'getShowSideWindow',
    `isElementOpen('leftPanel')`,
    '7.0',
  );

  return getSideWindowVisibility(store)();
};
