import actions from 'actions';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

export default (dispatch, documentViewerKey) => (userBookmarks) => {
  dispatch(actions.setBookmarks(userBookmarks, documentViewerKey));
  fireEvent(Events.USER_BOOKMARKS_CHANGED, userBookmarks);
};