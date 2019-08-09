import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default dispatch => (e, { added, removed }) => {
  if (added.length || removed.length) {
    const totalPages = core.getTotalPages();
    dispatch(actions.setTotalPages(totalPages));

    setTimeout(() => {
      // this handler 'onLayoutChange' in the UI get binded before the annotationManager.onLayoutChange handler
      // so use 'setTimeout' so the annotationManager.onLayoutChange handler finish before we call 'setPageLabels'
      dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    }, 0);
  }
};
