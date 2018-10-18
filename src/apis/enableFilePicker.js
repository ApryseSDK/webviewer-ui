import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElements(['filePickerHandler', 'filePickerButton'], PRIORITY_ONE));
  } else {
    store.dispatch(actions.disableElements(['filePickerHandler', 'filePickerButton'], PRIORITY_ONE));
  }
};
