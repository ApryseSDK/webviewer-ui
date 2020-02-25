import actions from 'actions';

export default ({ dispatch }) => () => {
  let isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  isFullScreen = !!isFullScreen;

  dispatch(actions.setFullScreen(isFullScreen));
};