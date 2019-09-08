import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import setSideWindowVisibility from './setSideWindowVisibility';

export default store => value => {
  warnDeprecatedAPI(
    'setShowSideWindow',
    `open/closeElements(['leftPanel'])`,
    '7.0',
  );
  setSideWindowVisibility(store)(value);
};
