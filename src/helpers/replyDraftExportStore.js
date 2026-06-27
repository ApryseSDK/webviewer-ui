const replyDraftsByViewer = new Map();

const getViewerDrafts = (documentViewerKey) => {
  if (!replyDraftsByViewer.has(documentViewerKey)) {
    replyDraftsByViewer.set(documentViewerKey, new Map());
  }

  return replyDraftsByViewer.get(documentViewerKey);
};

export const setReplyDraftForExport = (documentViewerKey, parentAnnotationId, payload) => {
  getViewerDrafts(documentViewerKey).set(parentAnnotationId, {
    parentAnnotationId,
    ...payload,
  });
};

export const clearReplyDraftForExport = (documentViewerKey, parentAnnotationId) => {
  const viewerDrafts = replyDraftsByViewer.get(documentViewerKey);
  if (!viewerDrafts) {
    return;
  }

  viewerDrafts.delete(parentAnnotationId);
  if (!viewerDrafts.size) {
    replyDraftsByViewer.delete(documentViewerKey);
  }
};

export const getReplyDraftsForExport = (documentViewerKey) => {
  const viewerDrafts = replyDraftsByViewer.get(documentViewerKey);
  if (!viewerDrafts) {
    return [];
  }

  return Array.from(viewerDrafts.values());
};

export const clearAllReplyDraftsForExport = (documentViewerKey) => {
  replyDraftsByViewer.delete(documentViewerKey);
};
