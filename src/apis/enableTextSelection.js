import disableTextSelection from './disableTextSelection';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElement('textPopup', PRIORITY_ONE));
  } else {
    console.warn('enableTextSelection(false) is going to be deprecated, please use disableTextSelection() instead');
    disableTextSelection(store)();
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
