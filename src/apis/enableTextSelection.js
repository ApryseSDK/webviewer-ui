import core from 'core';
import actions from 'actions';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElement('textPopup'));
  } else {
    core.clearSelection();
    core.setToolMode('AnnotationEdit');
    store.dispatch(actions.closeElement('textPopup'));
    store.dispatch(actions.disableElement('textPopup'));
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
