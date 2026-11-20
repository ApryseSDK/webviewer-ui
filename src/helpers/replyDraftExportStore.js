import { createInstanceScopedState } from 'core/documentViewers';

const replyDraftsByInstance = createInstanceScopedState(() => new Map());

// `instanceId` is optional and defaults to the ambient instance. Callers that run from timers or other unbound continuations must pass it.
const getViewerDrafts = (documentViewerKey, instanceId) => {
  const replyDraftsByViewer = replyDraftsByInstance.get(instanceId);
  if (!replyDraftsByViewer.has(documentViewerKey)) {
    replyDraftsByViewer.set(documentViewerKey, new Map());
  }

  return replyDraftsByViewer.get(documentViewerKey);
};

export const setReplyDraftForExport = (documentViewerKey, parentAnnotationId, payload, instanceId) => {
  getViewerDrafts(documentViewerKey, instanceId).set(parentAnnotationId, {
    parentAnnotationId,
    ...payload,
  });
};

export const clearReplyDraftForExport = (documentViewerKey, parentAnnotationId, instanceId) => {
  const replyDraftsByViewer = replyDraftsByInstance.get(instanceId);
  const viewerDrafts = replyDraftsByViewer.get(documentViewerKey);
  if (!viewerDrafts) {
    return;
  }

  viewerDrafts.delete(parentAnnotationId);
  if (!viewerDrafts.size) {
    replyDraftsByViewer.delete(documentViewerKey);
  }
};

export const getReplyDraftsForExport = (documentViewerKey, instanceId) => {
  const viewerDrafts = replyDraftsByInstance.get(instanceId).get(documentViewerKey);
  if (!viewerDrafts) {
    return [];
  }

  return Array.from(viewerDrafts.values());
};

export const clearAllReplyDraftsForExport = (documentViewerKey, instanceId) => {
  replyDraftsByInstance.get(instanceId).delete(documentViewerKey);
};
