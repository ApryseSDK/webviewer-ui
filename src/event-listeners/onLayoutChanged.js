import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => (e, { added, removed }) => {
  if (added.length || removed.length) {
    const totalPages = core.getTotalPages();

    dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    dispatch(actions.setTotalPages(totalPages));
  }
};