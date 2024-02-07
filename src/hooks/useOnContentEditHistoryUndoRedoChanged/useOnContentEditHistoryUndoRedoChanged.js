import { useEffect, useState, useCallback } from 'react';
import core from 'core';

export default function useOnContentEditHistoryUndoRedoChanged() {
  const contentEditHistoryManager = core.getDocumentViewer().getContentEditHistoryManager();

  const [isUndoEnabled, setIsUndoEnabled] = useState(false);
  const [isRedoEnabled, setIsRedoEnabled] = useState(false);

  const handleUndo = useCallback(() => {
    if (isUndoEnabled) {
      contentEditHistoryManager.undo();
    }
  }, [isUndoEnabled]);

  const handleRedo = useCallback(() => {
    if (isRedoEnabled) {
      contentEditHistoryManager.redo();
    }
  }, [isRedoEnabled]);

  useEffect(() => {
    const onUndoRedoStateChanged = () => {
      setIsUndoEnabled(contentEditHistoryManager.canUndo());
      setIsRedoEnabled(contentEditHistoryManager.canRedo());
    };

    window.Core.ContentEdit.addEventListener('undoRedoStatusChanged', onUndoRedoStateChanged);
    return () => window.Core.ContentEdit.removeEventListener('undoRedoStatusChanged', onUndoRedoStateChanged);
  }, []);

  return { canUndo: isUndoEnabled, canRedo: isRedoEnabled, handleUndo, handleRedo };
}