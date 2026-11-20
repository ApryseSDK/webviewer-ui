import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import useCore from 'hooks/useCore';
import DataElements from 'constants/dataElement';

export default function useOnFreeTextEdit(saveEditorInstance) {
  const dispatch = useDispatch();
  const { core } = useCore();

  const [annotation, setAnnotation] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const isRichTextEditableAnnotation = (annotation) => annotation instanceof window.Core.Annotations.FreeTextAnnotation &&
      !annotation.getContentEditAnnotationId() &&
      annotation.ToolName !== window.Core.Tools.ToolNames.ADD_PARAGRAPH;

    const saveEditor = (editor, annotation) => {
      setAnnotation(annotation);
      setEditor(editor);
      if (saveEditorInstance) {
        saveEditorInstance([editor, annotation]);
      }
    };

    const handleEditorFocus = (editor, annotation) => {
      // Use setTimeout to make sure Free Text annotations have time to resize before opening popup
      setTimeout(() => {
        if (isRichTextEditableAnnotation(annotation)) {
          saveEditor(editor, annotation);
          dispatch(actions.openElements(DataElements.RICH_TEXT_POPUP));
        }
      }, 0);
    };

    core.addEventListener('editorFocus', handleEditorFocus);

    // The editor may have gained focus before this hook mounted and subscribed to editorFocus
    const editBoxManager = core.getAnnotationManager().getEditBoxManager();
    const focusedAnnotation = core.getSelectedAnnotations().find((annot) => {
      return isRichTextEditableAnnotation(annot) && editBoxManager.getExistingEditor(annot)?.hasFocus();
    });
    if (focusedAnnotation) {
      saveEditor(editBoxManager.getExistingEditor(focusedAnnotation), focusedAnnotation);
    }

    return () => {
      core.removeEventListener('editorFocus', handleEditorFocus);
    };
  }, [dispatch, core]);

  return { editor, annotation };
}