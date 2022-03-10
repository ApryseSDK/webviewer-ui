import actions from 'actions';
import core from 'core';
import overlays from '../constants/overlays';

export default dispatch => () => {
  dispatch(actions.closeElements([
    'pageNavOverlay',
    'notesPanel',
    'searchPanel',
    'leftPanel',
    'signatureValidationModal',
    'audioPlaybackPopup',
    'redactionPanel',
    ...overlays
  ]));
  dispatch(actions.setOutlines([]));
  dispatch(actions.setBookmarks({}));
  dispatch(actions.setTotalPages(0));
  dispatch(actions.setSearchValue(''));
  core.clearSearchResults();
};
