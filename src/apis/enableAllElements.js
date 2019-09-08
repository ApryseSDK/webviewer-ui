import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';

export default store => () => {
  warnDeprecatedAPI(
    'enableAllElements',
    'enableElements([referenceToDisabledDataElements])',
    '7.0',
  );
  store.dispatch(actions.enableAllElements());
};