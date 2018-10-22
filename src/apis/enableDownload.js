import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElement('downloadButton', PRIORITY_ONE));
  } else {
    store.dispatch(actions.disableElement('downloadButton', PRIORITY_ONE));
  }
};
