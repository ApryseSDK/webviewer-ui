import core from 'core';
import actions from 'actions';
import { isIOS } from 'helpers/device';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => () => {
  // if we are opening an password-protected pdf,
  // this event will only be trigger after we enter the correct password, so it's safe to close this modal here
  dispatch(actions.closeElement('passwordModal'));

  const totalPages = core.getTotalPages();

  if (isIOS) {
    window.CoreControls.SetCachingLevel(0);
    window.CoreControls.SetPreRenderLevel(2);
    core.setDisplayMode(window.CoreControls.DisplayModes.Single);
    dispatch(actions.disableElements([ 'pageTransitionButtons' ]));
  } else if (totalPages > 500) {
    core.setDisplayMode(window.CoreControls.DisplayModes.Single);
  }

  dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
  dispatch(actions.setTotalPages(totalPages));
  
  const currentPage = core.getCurrentPage();
  dispatch(actions.setCurrentPage(currentPage));
};
