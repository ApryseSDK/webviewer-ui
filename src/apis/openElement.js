import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';

export default store => dataElement => {
  warnDeprecatedAPI(
    'openElement(dataElement)',
    'openElements([dataElement])',
    '7.0',
  );
  store.dispatch(actions.openElement(dataElement));
};