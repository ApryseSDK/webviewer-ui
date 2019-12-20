import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';

export default store => value => {
  warnDeprecatedAPI(
    'setSideWindowVisibility',
    `open/closeElements(['leftPanel'])`,
    '7.0',
  );

  if (value) {
    store.dispatch(actions.openElement('leftPanel'));
  } else {
    store.dispatch(actions.closeElement('leftPanel'));
  }
};