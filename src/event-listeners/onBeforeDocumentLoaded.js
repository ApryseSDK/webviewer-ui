import core from 'core';
import actions from 'actions';

import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => () => {
  // if we are opening an password-protected pdf,
  // this event will only be trigger after we enter the correct password, so it's safe to close this modal here
  dispatch(actions.closeElement('passwordModal'));

  const totalPages = core.getTotalPages();
  if (totalPages > 500) {
    core.setDisplayMode(window.CoreControls.DisplayModes.Single);
  }

  //totalPages is 1 for '.docX' and '.pptx' at this point, will use use 'setPageLabels' again later during 'onLayoutChanged' to set correct value
  dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages))); 
  dispatch(actions.setTotalPages(totalPages));
  
  const currentPage = core.getCurrentPage();
  dispatch(actions.setCurrentPage(currentPage));
};