import core from 'core';
import actions from 'actions';
import fireEvent from 'helpers/fireEvent';

export default dispatch => () => {
  dispatch(actions.closeElements([ 'annotationPopup', 'textPopup', 'contextMenuPopup' ]));
  dispatch(actions.setDisplayMode(core.getDisplayMode()));

  fireEvent('layoutModeChanged', [ window.docViewer.getDisplayModeManager().getDisplayMode() ]);
};