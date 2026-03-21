import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default (dispatch, documentViewerKey) => ({ added, removed, moved }) => {
  const movedKeys = Object.keys(moved);
  if (added.length || removed.length || movedKeys.length) {
    const totalPages = core.getTotalPages(documentViewerKey);
    dispatch(actions.setTotalPages(totalPages, documentViewerKey));

    core.getOutlines((outlines, key) => {
      dispatch(actions.setOutlines(outlines, key));
    }, documentViewerKey);

    const defaultPageLabels = getDefaultPageLabels(totalPages);
    dispatch(actions.setPageLabels(defaultPageLabels, documentViewerKey));
    dispatch(actions.disableCustomPageLabels(documentViewerKey));
  }
};
