import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => (e, { added, removed }) => {
  if (added.length || removed.length) {
    const totalPages = core.getTotalPages();
    dispatch(actions.setTotalPages(totalPages));

    setTimeout(() => {
      // this 'onLayoutChange' handler get trigger before the 'onLayoutChange' handler on 'viewerPageManager' get fire (so page number aren't updated yet)
      // use 'setTimeout' so the annotationManager.onLayoutChange handler finish before we call 'setPageLabels'
      dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    }, 0);
  }
};
