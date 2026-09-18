const getDocumentViewerId = (documentViewer) => documentViewer?.getID?.() || documentViewer?.id;

const hasDocumentViewerId = (documentViewers, documentViewerId) => documentViewers.some((documentViewer) => {
  const currentDocumentViewerId = getDocumentViewerId(documentViewer);
  return `${currentDocumentViewerId || ''}` === `${documentViewerId}`;
});

export const shouldHandleLoadError = (documentViewerId, core, documentViewerKey) => {
  if (!documentViewerId) {
    return true;
  }

  if (documentViewerKey !== undefined) {
    return hasDocumentViewerId([core.getDocumentViewer?.(documentViewerKey)], documentViewerId);
  }

  const documentViewers = core.getDocumentViewers?.();
  if (documentViewers?.length) {
    return hasDocumentViewerId(documentViewers, documentViewerId);
  }

  const currentDocumentViewer = core.getDocumentViewer?.();
  return hasDocumentViewerId([currentDocumentViewer], documentViewerId);
};