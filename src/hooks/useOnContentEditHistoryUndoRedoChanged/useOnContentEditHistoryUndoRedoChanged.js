import { useEffect, useState, useCallback } from 'react';
import core from 'core';

export default function useOnContentEditHistoryUndoRedoChanged() {
  const contentEditHistoryManager = core.getDocumentViewer().getContentEditHistoryManager();
  const contentEditManager = core.getDocumentViewer().getContentEditManager();

  const [isUndoEnabled, setIsUndoEnabled] = useState(false);
  const [isRedoEnabled, setIsRedoEnabled] = useState(false);

  const handleUndo = useCallback(async () => {
    if (isUndoEnabled) {
      await contentEditManager.undo?.();
    }
  }, [isUndoEnabled, contentEditManager]);

  const handleRedo = useCallback(async () => {
    if (isRedoEnabled) {
      await contentEditManager.redo?.();
    }
  }, [isRedoEnabled, contentEditManager]);

  useEffect(() => {
    const onUndoRedoStateChanged = () => {
      setIsUndoEnabled(contentEditHistoryManager.canUndo());
      setIsRedoEnabled(contentEditHistoryManager.canRedo());
    };

    window.Core.ContentEdit.addEventListener('undoRedoStatusChanged', onUndoRedoStateChanged);
    return () => window.Core.ContentEdit.removeEventListener('undoRedoStatusChanged', onUndoRedoStateChanged);
    // contentEditHistoryManager is included to satisfy the exhaustive-deps lint rule.
    // It is a stable reference (created once on DocumentViewer construction) so this
    // effect never actually re-runs because of it. onUndoRedoStateChanged closes over
    // it at render time and reads canUndo/canRedo() directly when the event fires.
  }, [contentEditHistoryManager]);

  return { canUndo: isUndoEnabled, canRedo: isRedoEnabled, handleUndo, handleRedo };
}