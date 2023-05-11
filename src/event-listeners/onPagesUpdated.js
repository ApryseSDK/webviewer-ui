import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default (dispatch) => ({ added, removed, moved }) => {
  const movedKeys = Object.keys(moved);
  if (added.length || removed.length || movedKeys.length) {
    const totalPages = core.getTotalPages();
    dispatch(actions.setTotalPages(totalPages));

    core.getOutlines((outlines) => {
      dispatch(actions.setOutlines(outlines));
    });

    setTimeout(() => {
      // this 'onLayoutChange' handler get trigger before the other 'onLayoutChange' event handler in core (that added by annotationManager to update page numbers) gets triggered
      // use 'setTimeout' so the other 'onLayoutChange' handler finishes before we call 'setPageLabels'
      dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    }, 0);
  }
};
