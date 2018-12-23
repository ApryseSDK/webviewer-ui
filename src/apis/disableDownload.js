import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElement('downloadButton', PRIORITY_ONE));
};
