export default () => {
  if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    // this is to fix an issue reported in the forum https://groups.google.com/forum/?nomobile=true#!topic/pdfnet-webviewer/PH6dyTu5WVw
    // set the src to '' to prevent the <embed> element from printing the document, which will exit the full screen mode immediately
    const printHandler = document.getElementById('print-handler');
    if (printHandler?.src) {
      printHandler.src = '';
    }

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
  }
};
