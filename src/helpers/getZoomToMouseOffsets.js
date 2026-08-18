const getZoomToMouseOffsets = (documentViewer, mouseEvent) => {
  const scrollView = documentViewer.getScrollViewElement();
  // Read the current rect because the containing page can scroll or move the Web Component between wheel events.
  const scrollViewRect = scrollView.getBoundingClientRect();
  const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
  // DisplayMode#getScale guarantees finite, positive values and falls back to 1 for either axis.
  const { scaleX, scaleY } = displayMode.getScale();

  const mouseX = (mouseEvent.clientX - scrollViewRect.left) / scaleX;
  const mouseY = (mouseEvent.clientY - scrollViewRect.top) / scaleY;

  // DocumentViewer#zoomToMouse subtracts these offsets from pageX/pageY, yielding the logical mouse position above.
  return {
    xOffset: mouseEvent.pageX - mouseX,
    yOffset: mouseEvent.pageY - mouseY,
  };
};

export default getZoomToMouseOffsets;