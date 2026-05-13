import core from 'core';
import actions from 'actions';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default (dispatch, documentViewerKey) => ({ added, removed, moved, rotationChanged }) => {
  const movedKeys = Object.keys(moved);
  const hasRotationChanged = rotationChanged && rotationChanged.length > 0;
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
  if (hasRotationChanged) {
    // Page rotation changes how the worker interprets bookmark destination coordinates,
    // so we need to re-fetch outlines to get updated offsets.
    core.getOutlines((outlines, key) => {
      dispatch(actions.setOutlines(outlines, key));
    }, documentViewerKey);
  }
};
