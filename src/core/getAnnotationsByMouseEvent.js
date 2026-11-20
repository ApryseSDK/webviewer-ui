import core from 'core';

const getAnnotationsByMouseEvent = (event, documentViewerKey) => {
  return core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationsByMouseEvent(event);
};

export default getAnnotationsByMouseEvent;
