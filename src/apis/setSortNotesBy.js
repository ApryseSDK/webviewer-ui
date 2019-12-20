import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';

export default store => sortStrategy => {
  warnDeprecatedAPI(
    'setSortNotesBy',
    'setSortStrategy',
    '7.0',
  );
  store.dispatch(actions.setSortNotesBy(sortStrategy));
};