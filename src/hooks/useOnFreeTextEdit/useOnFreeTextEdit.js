import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';

export default function useOnFreeTextEdit(saveEditorInstance) {
  const dispatch = useDispatch();

  const [annotation, setAnnotation] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const handleEditorFocus = (editor, annotation) => {
      // Use setTimeout to make sure Free Text annotations have time to resize before opening popup
      setTimeout(() => {
        if (
          annotation instanceof window.Core.Annotations.FreeTextAnnotation &&
          !annotation.getContentEditAnnotationId() &&
          annotation.ToolName !== window.Core.Tools.ToolNames.ADD_PARAGRAPH
        ) {
          setAnnotation(annotation);
          setEditor(editor);
          if (saveEditorInstance) {
            saveEditorInstance([editor, annotation]);
          }
          dispatch(actions.openElements(DataElements.RICH_TEXT_POPUP));
        }
      }, 0);
    };

    core.addEventListener('editorFocus', handleEditorFocus);
    return () => {
      core.removeEventListener('editorFocus', handleEditorFocus);
    };
  }, [dispatch]);

  return { editor, annotation };
}