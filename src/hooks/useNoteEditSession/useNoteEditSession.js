import { useEffect } from 'react';
import useCore from 'hooks/useCore';
import {
  captureEditSessionBaseline,
  clearEditSessionBaseline,
  cancelPendingBaselineCleanup,
  scheduleEditSessionBaselineCleanup,
  clearAllBaselinesForViewer,
} from 'components/NoteContent/NoteContentEditSession';

// Owns the lifecycle of a note's edit-session baseline, which Cancel uses to restore the pre-edit value.
const useNoteEditSession = ({ annotation, isEditing, isSelected, activeDocumentViewerKey, instanceId }) => {
  const { core } = useCore();

  useEffect(() => {
    if (isEditing && isSelected) {
      captureEditSessionBaseline(activeDocumentViewerKey, annotation, instanceId);
    }
  }, [isEditing, isSelected, annotation, activeDocumentViewerKey, instanceId]);

  useEffect(() => {
    cancelPendingBaselineCleanup(activeDocumentViewerKey, annotation.Id, instanceId);

    return () => {
      scheduleEditSessionBaselineCleanup(activeDocumentViewerKey, annotation.Id, instanceId);
    };
  }, [annotation.Id, activeDocumentViewerKey, instanceId]);

  useEffect(() => {
    if (!isEditing) {
      clearEditSessionBaseline(activeDocumentViewerKey, annotation.Id, instanceId);
    }
  }, [annotation.Id, isEditing, activeDocumentViewerKey, instanceId]);

  useEffect(() => {
    const onDocumentTeardown = () => clearAllBaselinesForViewer(activeDocumentViewerKey, instanceId);
    core.addEventListener('beforeDocumentLoaded', onDocumentTeardown, undefined, activeDocumentViewerKey);
    core.addEventListener('documentUnloaded', onDocumentTeardown, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('beforeDocumentLoaded', onDocumentTeardown, activeDocumentViewerKey);
      core.removeEventListener('documentUnloaded', onDocumentTeardown, activeDocumentViewerKey);
    };
  }, [core, activeDocumentViewerKey, instanceId]);
};

export default useNoteEditSession;
