import actions from 'actions';
import { PRIORITY_THREE } from '../constants/actionPriority';

export default store => dataElement => {
  store.dispatch(actions.disableElement(dataElement, PRIORITY_THREE));
};