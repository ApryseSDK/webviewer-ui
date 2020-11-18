import actions from 'actions';
import core from 'core';

export default dispatch => () => {
  dispatch(actions.closeElements(['pageNavOverlay', 'notesPanel', 'searchPanel', 'leftPanel']));
  dispatch(actions.setOutlines([]));
  dispatch(actions.setTotalPages(0));
  core.clearSearchResults();
};
