import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';
import { PRIORITY_THREE } from '../constants/actionPriority';

export default store => dataElement => {
  warnDeprecatedAPI(
    'enableElement(dataElement)',
    'enableElements([dataElement])',
    '7.0',
  );
  store.dispatch(actions.enableElement(dataElement, PRIORITY_THREE));
};