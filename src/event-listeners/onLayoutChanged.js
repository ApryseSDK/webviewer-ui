import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => (e, { added, removed }) => {
  if (added.length || removed.length) {
    const totalPages = core.getTotalPages();
    dispatch(actions.setTotalPages(totalPages));

    setTimeout(() => {
      // this 'onLayoutChange' handler get trigger before the 'onLayoutChange' handler on 'viewerPageManager' get trigger (so page numbers aren't updated yet)
      // use 'setTimeout' so the other 'onLayoutChange' handler finishs before we call 'setPageLabels'
      dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    }, 0);
  }
};
