import core from 'core';
import actions from 'actions';

export default dispatch => () => {
  const totalPages = core.getTotalPages();

  dispatch(actions.setTotalPages(totalPages));
};