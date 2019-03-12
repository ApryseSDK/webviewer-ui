import disableTextSelection from './disableTextSelection';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElements(['textPopup', 'textSelectButton'], PRIORITY_ONE));
  } else {
    console.warn('enableTextSelection(false) is deprecated, please use disableTextSelection() instead');
    disableTextSelection(store)();
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
