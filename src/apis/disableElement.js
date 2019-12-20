import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import actions from 'actions';
import { PRIORITY_THREE } from '../constants/actionPriority';

export default store => dataElement => {
  warnDeprecatedAPI(
    'disableElement(dataElement)',
    'disableElements([dataElement])',
    '7.0',
  );

  store.dispatch(actions.disableElement(dataElement, PRIORITY_THREE));
};