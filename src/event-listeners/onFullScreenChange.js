import actions from 'actions';
import selectors from 'selectors';

export default ({ dispatch, getState }) => () => {
  let isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  isFullScreen = !!isFullScreen;

  if (selectors.isEmbedPrintSupported(getState()) && isFullScreen) {
    // this is to fix an issue reported in the forum https://groups.google.com/forum/?nomobile=true#!topic/pdfnet-webviewer/PH6dyTu5WVw
    // we use a <embed> element to handle printing in Chrome, and it seems that somehow when Chrome is entering the full screen mode
    // the <embed> element will trigger a print, which will make the browser exit the full screen mode immediately
    // not sure what's the correct way to fix this, it seems that setting the src to '' will work around this issue
    const printHandler = document.getElementById('print-handler');
    if (printHandler?.src) {
      printHandler.src = '';
    }
  }

  dispatch(actions.setFullScreen(isFullScreen));
};