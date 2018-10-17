import { LOW_PRIORITY } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElement('downloadButton', LOW_PRIORITY));
  } else {
    store.dispatch(actions.disableElement('downloadButton', LOW_PRIORITY));
  }
};
