import actions from 'actions';
import { PRIORITY_THREE } from '../constants/actionPriority';

export default store => dataElement => {
  store.dispatch(actions.enableElement(dataElement, PRIORITY_THREE));
};