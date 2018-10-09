import core from 'core';
import actions from 'actions';

export default dispatch => () => {
  const totalPages = core.getTotalPages();
  const currentPage = core.getCurrentPage();
  
  if (totalPages > 500) {
    core.setDisplayMode(window.CoreControls.DisplayModes.Single);
  }

  dispatch(actions.setTotalPages(totalPages));
  dispatch(actions.setCurrentPage(currentPage));
};