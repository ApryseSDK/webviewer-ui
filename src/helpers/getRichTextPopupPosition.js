import { calcPopupLeft, calcPopupTop } from 'helpers/getPopupPosition';
import core from 'core';

export default (annotation, popup) => {
  const pageIndex = annotation.PageNumber - 1;
  const editorContainer = document.querySelector(
    `#pageWidgetContainer${pageIndex} [id="freetext-editor-${annotation.Id}"]`
  );
  const scrollContainer = core.getScrollViewElement();
  const padding = 2 * parseFloat(annotation.StrokeThickness) * core.getZoom();
  let cBox = editorContainer.getBoundingClientRect();
  cBox = {
    topLeft: {
      x: cBox.left + scrollContainer.scrollLeft - padding,
      y: cBox.top + scrollContainer.scrollTop - padding,
    },
    bottomRight: {
      x: cBox.right + scrollContainer.scrollLeft + padding,
      y: cBox.bottom + scrollContainer.scrollTop + padding,
    },
  };
  const pBox = popup.current.getBoundingClientRect();
  const approximateHeight = 200;

  return {
    left: calcPopupLeft(cBox, pBox),
    top: calcPopupTop(cBox, pBox, approximateHeight),
  };
};
