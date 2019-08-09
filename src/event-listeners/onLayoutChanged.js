import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => (e, { added, removed }) => {
  if (added.length || removed.length) {
    const totalPages = core.getTotalPages();
    dispatch(actions.setTotalPages(totalPages));

    setTimeout(() => {
      // this 'onLayoutChange' handler get trigger before the other 'onLayoutChange' event handler in core (that update page numbers ) get triggered
      // use 'setTimeout' so the other 'onLayoutChange' handler finishes before we call 'setPageLabels'
      dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    }, 0);
  }
};
