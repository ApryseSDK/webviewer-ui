import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import core from 'core';

export default function fireActiveDocumentViewerChanged(previousDocumentViewerKey, activeDocumentViewerKey) {

  const deselectAnnotationsInOtherViewers = (documentViewers, activeKey) => {
    documentViewers.forEach((viewer, index) => {
      const key = index + 1;
      if (key === activeKey) {
        return;
      }
      const toolsToReset = [
        window.Core.Tools.ToolNames['CROP'],
        window.Core.Tools.ToolNames['SNIPPING']
      ];

      toolsToReset.forEach((toolName) => {
        const tool = viewer.getTool(toolName);
        if (tool) {
          tool.reset();
        }
      });

      const annotationManager = viewer.getAnnotationManager();

      annotationManager.deselectAllAnnotations();
    });
  };

  const documentViewers = core.getDocumentViewers();
  deselectAnnotationsInOtherViewers(documentViewers, activeDocumentViewerKey);

  fireEvent(Events.ACTIVE_DOCUMENT_VIEWER_CHANGED, {
    activeDocumentViewerKey,
    previousDocumentViewerKey
  });
}