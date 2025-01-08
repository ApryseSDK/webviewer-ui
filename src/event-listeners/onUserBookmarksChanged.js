import actions from 'actions';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

export default (dispatch) => (userBookmarks) => {
  dispatch(actions.setBookmarks(userBookmarks));
  fireEvent(Events.USER_BOOKMARKS_CHANGED, userBookmarks);
};
