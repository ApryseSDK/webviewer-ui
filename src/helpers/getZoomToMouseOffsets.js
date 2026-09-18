export const getScrollViewPointerPosition = (documentViewer, pointerEvent) => {
  const scrollView = documentViewer.getScrollViewElement();
  // Read the current rect because the containing page can scroll or move the Web Component between pointer events.
  const scrollViewRect = scrollView.getBoundingClientRect();
  const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
  // DisplayMode#getScale guarantees finite, positive values and falls back to 1 for either axis.
  const { scaleX, scaleY } = displayMode.getScale();

  return {
    x: (pointerEvent.clientX - scrollViewRect.left) / scaleX,
    y: (pointerEvent.clientY - scrollViewRect.top) / scaleY,
  };
};

const getZoomToMouseOffsets = (documentViewer, mouseEvent) => {
  const { x: mouseX, y: mouseY } = getScrollViewPointerPosition(documentViewer, mouseEvent);

  // DocumentViewer#zoomToMouse subtracts these offsets from pageX/pageY, yielding the logical mouse position above.
  return {
    xOffset: mouseEvent.pageX - mouseX,
    yOffset: mouseEvent.pageY - mouseY,
  };
};

export default getZoomToMouseOffsets;
