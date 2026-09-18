import core from 'core';

const getFreeTextTool = (documentViewer) => {
  const { ToolNames } = window.Core.Tools;
  const freeTextToolNames = new Set([
    ToolNames.FREETEXT,
    ToolNames.FREETEXT2,
    ToolNames.FREETEXT3,
    ToolNames.FREETEXT4,
  ]);
  const activeTool = documentViewer.getToolMode();
  return freeTextToolNames.has(activeTool?.name) ? activeTool : documentViewer.getTool(ToolNames.FREETEXT);
};

export default function pasteClipboardText(event, documentViewerKey, clipboardText) {
  const text = clipboardText ?? event.clipboardData?.getData?.('text/plain');
  if (!text) {
    return false;
  }

  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const annotationManager = documentViewer.getAnnotationManager();
  if (annotationManager.isReadOnlyModeEnabled()) {
    return false;
  }

  const pageCoordinates = documentViewer.getViewerCoordinatesFromMouseLocation();
  if (!pageCoordinates) {
    return false;
  }

  const freeTextTool = getFreeTextTool(documentViewer);
  const annotation = freeTextTool.createAnnotation(text, pageCoordinates);
  if (!annotation) {
    return false;
  }

  event.preventDefault();
  annotationManager.deselectAllAnnotations();
  annotationManager.selectAnnotation(annotation);
  return true;
}