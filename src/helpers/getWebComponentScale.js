import getRootNode from './getRootNode';

export const getWebComponentScale = () => {
  if (window.isApryseWebViewerWebComponent) {
    const hostContainer = getRootNode().host;
    const containerBox = hostContainer.getBoundingClientRect();
    return {
      scaleX: containerBox.width / hostContainer.offsetWidth,
      scaleY: containerBox.height / hostContainer.offsetHeight,
    };
  }
  return {
    scaleX: 1,
    scaleY: 1,
  };
};