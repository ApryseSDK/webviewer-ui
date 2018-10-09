import actions from 'actions';

export default dispatch => () => {
  const isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  dispatch(actions.setFullScreen(!!isFullScreen));
};