import core from 'core';
import actions from 'actions';

export default dispatch => () => {
  // if we are opening an password-protected pdf,
  // this event will only be trigger after we enter the correct password, so it's safe to close this modal here
  dispatch(actions.closeElement('passwordModal'));

  const totalPages = core.getTotalPages();
  const currentPage = core.getCurrentPage();
  
  if (totalPages > 500) {
    core.setDisplayMode(window.CoreControls.DisplayModes.Single);
  }

  dispatch(actions.setTotalPages(totalPages));
  dispatch(actions.setCurrentPage(currentPage));
};