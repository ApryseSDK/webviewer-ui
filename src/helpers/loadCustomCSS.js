import getRootNode from 'helpers/getRootNode';

export default (CSSFile) => {
  if (CSSFile) {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = CSSFile;
    if (window.isApryseWebViewerWebComponent) {
      getRootNode().appendChild(link);
    } else {
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }
};