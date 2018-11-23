import core from 'core';
import actions from 'actions';

export default dispatch => (e, { added, removed }) => {
  if (added.length || removed.length) {
    const totalPages = core.getTotalPages();

    dispatch(actions.setTotalPages(totalPages));
  }
};