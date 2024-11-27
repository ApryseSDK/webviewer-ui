import fireEvent from './fireEvent';
import Events from 'constants/events';
import isFullscreen from './isFullscreen';
import getRootNode from './getRootNode';

export default () => {
  const rootNode = getRootNode();
  const targetElement = rootNode instanceof ShadowRoot ? rootNode.host : rootNode.documentElement;
  if (isFullscreen()) {
    if (targetElement.exitFullscreen) {
      targetElement.exitFullscreen();
    } else if (targetElement.msExitFullscreen) {
      targetElement.msExitFullscreen();
    } else if (targetElement.mozCancelFullScreen) {
      targetElement.mozCancelFullScreen();
    } else if (targetElement.webkitExitFullscreen) {
      targetElement.webkitExitFullscreen();
    }
    fireEvent(Events.FULLSCREEN_MODE_TOGGLED, { isInFullscreen: false });
  } else {
    if (targetElement.requestFullscreen) {
      targetElement.requestFullscreen();
    } else if (targetElement.msRequestFullscreen) {
      targetElement.msRequestFullscreen();
    } else if (targetElement.mozRequestFullScreen) {
      targetElement.mozRequestFullScreen();
    } else if (targetElement.webkitRequestFullScreen) {
      targetElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      setTimeout(() => {
        if (!document.webkitCurrentFullScreenElement) {
          targetElement.webkitRequestFullScreen();
        }
      }, 200);
    }
    fireEvent(Events.FULLSCREEN_MODE_TOGGLED, { isInFullscreen: true });
  }
};
