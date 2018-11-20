import actions from 'actions';

export default store => thumbnailCustomContentRenderer => {
  store.dispatch(actions.setThumbnailCustomContentRenderer(thumbnailCustomContentRenderer));
};
