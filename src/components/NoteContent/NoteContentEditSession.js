import { createInstanceScopedState } from 'core/documentViewers';

// Keep edit-session baselines outside component lifecycle so autosave-triggered remounts
// do not lose the pre-autosave value used by Cancel. State is kept per WebViewer instance, and the
// keys include the viewer key to isolate annotations with the same ID in different document viewers.
const editSessionState = createInstanceScopedState(() => ({
  baselineByAnnotationId: new Map(),
  pendingCleanupTimeoutByAnnotationId: new Map(),
}));

const makeBaselineKey = (viewerKey, annotationId) => `${viewerKey}:${annotationId}`;

export const getEditSessionBaseline = (viewerKey, annotationId, instanceId) =>
  editSessionState.get(instanceId).baselineByAnnotationId.get(makeBaselineKey(viewerKey, annotationId));

export const captureEditSessionBaseline = (viewerKey, annotation, instanceId) => {
  const { baselineByAnnotationId } = editSessionState.get(instanceId);
  const key = makeBaselineKey(viewerKey, annotation.Id);
  if (baselineByAnnotationId.has(key)) {
    return;
  }

  baselineByAnnotationId.set(key, {
    contents: annotation.getContents() || '',
    mentionData: annotation.getCustomData('trn-mention'),
  });
};

export const cancelPendingBaselineCleanup = (viewerKey, annotationId, instanceId) => {
  const { pendingCleanupTimeoutByAnnotationId } = editSessionState.get(instanceId);
  const key = makeBaselineKey(viewerKey, annotationId);
  const pendingCleanupTimeout = pendingCleanupTimeoutByAnnotationId.get(key);
  if (pendingCleanupTimeout) {
    clearTimeout(pendingCleanupTimeout);
    pendingCleanupTimeoutByAnnotationId.delete(key);
  }
};

export const clearEditSessionBaseline = (viewerKey, annotationId, instanceId) => {
  cancelPendingBaselineCleanup(viewerKey, annotationId, instanceId);
  editSessionState.get(instanceId).baselineByAnnotationId.delete(makeBaselineKey(viewerKey, annotationId));
};

export const scheduleEditSessionBaselineCleanup = (viewerKey, annotationId, instanceId) => {
  cancelPendingBaselineCleanup(viewerKey, annotationId, instanceId);
  const { baselineByAnnotationId, pendingCleanupTimeoutByAnnotationId } = editSessionState.get(instanceId);
  const key = makeBaselineKey(viewerKey, annotationId);
  // A same-turn unmount/remount can cancel this macrotask and keep the session.
  const cleanupTimeout = setTimeout(() => {
    pendingCleanupTimeoutByAnnotationId.delete(key);
    baselineByAnnotationId.delete(key);
  }, 0);
  pendingCleanupTimeoutByAnnotationId.set(key, cleanupTimeout);
};

export const clearAllBaselinesForViewer = (viewerKey, instanceId) => {
  const { baselineByAnnotationId, pendingCleanupTimeoutByAnnotationId } = editSessionState.get(instanceId);
  const prefix = `${viewerKey}:`;
  for (const key of pendingCleanupTimeoutByAnnotationId.keys()) {
    if (key.startsWith(prefix)) {
      clearTimeout(pendingCleanupTimeoutByAnnotationId.get(key));
      pendingCleanupTimeoutByAnnotationId.delete(key);
    }
  }
  for (const key of baselineByAnnotationId.keys()) {
    if (key.startsWith(prefix)) {
      baselineByAnnotationId.delete(key);
    }
  }
};
