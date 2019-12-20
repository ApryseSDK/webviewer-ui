import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';

export default store => dataElement => {
  warnDeprecatedAPI(
    'closeElement(dataElement)',
    'closeElements([dataElement])',
    '7.0',
  );

  store.dispatch(actions.closeElements([dataElement]));
};