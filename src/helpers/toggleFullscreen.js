import fireEvent from './fireEvent';
import Events from 'constants/events';
import isFullscreen from './isFullscreen';

export default () => {
  if (isFullscreen()) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    fireEvent(Events.FULLSCREEN_MODE_TOGGLED, { isInFullscreen: false });
  } else {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      setTimeout(() => {
        if (!document.webkitCurrentFullScreenElement) {
          docElm.webkitRequestFullScreen();
        }
      }, 200);
    }
    fireEvent(Events.FULLSCREEN_MODE_TOGGLED, { isInFullscreen: true });
  }
};
