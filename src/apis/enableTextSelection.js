import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElement('textPopup', PRIORITY_ONE));
  } else {
    core.clearSelection();
    core.setToolMode('AnnotationEdit');
    store.dispatch(actions.closeElement('textPopup'));
    store.dispatch(actions.disableElement('textPopup', PRIORITY_ONE));
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
