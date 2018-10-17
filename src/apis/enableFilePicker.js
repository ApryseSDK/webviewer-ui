import { LOW_PRIORITY } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElements(['filePickerHandler', 'filePickerButton'], LOW_PRIORITY));
  } else {
    store.dispatch(actions.disableElements(['filePickerHandler', 'filePickerButton'], LOW_PRIORITY));
  }
};
