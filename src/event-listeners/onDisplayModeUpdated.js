import core from 'core';
import actions from 'actions';

export default dispatch => () => {
  dispatch(actions.closeElements([ 'annotationPopup', 'textPopup', 'contextMenuPopup' ]));
  dispatch(actions.setDisplayMode(core.getDisplayMode()));
  $(document).trigger('layoutModeChanged');
};