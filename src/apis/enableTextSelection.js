import core from 'core';
import { LOW_PRIORITY } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElement('textPopup', LOW_PRIORITY));
  } else {
    core.clearSelection();
    core.setToolMode('AnnotationEdit');
    store.dispatch(actions.closeElement('textPopup'));
    store.dispatch(actions.disableElement('textPopup', LOW_PRIORITY));
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
