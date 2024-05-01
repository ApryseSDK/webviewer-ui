import { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';

export default function useOnInlineCommentPopupOpen() {
  const [
    isNotesPanelOpen,
    notesInLeftPanel,
    leftPanelOpen,
    activeLeftPanel,
    inlineCommentFilter,
    activeDocumentViewerKey,
    isOfficeEditorMode,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.getNotesInLeftPanel(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
      selectors.getInlineCommentFilter(state),
      selectors.getActiveDocumentViewerKey(state),
      selectors.getIsOfficeEditorMode(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const [annotation, setAnnotation] = useState(null);
  const [isFreeTextAnnotationAdded, setFreeTextAnnotationAdded] = useState(false);
  const { ToolNames } = window.Core.Tools;

  const isNotesPanelOpenOrActive = isNotesPanelOpen || (notesInLeftPanel && leftPanelOpen && (activeLeftPanel === 'notesPanel' || isOfficeEditorMode));

  const closeAndReset = () => {
    dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    setAnnotation(null);
    setFreeTextAnnotationAdded(false);
  };

  const isFreeTextAnnotation = (annot) => {
    return annot instanceof window.Core.Annotations.FreeTextAnnotation;
  };

  useEffect(() => {
    const onAnnotationDoubleClicked = (annot) => {
      if (isFreeTextAnnotation(annot)) {
        closeAndReset();
      }
    };

    core.addEventListener('annotationDoubleClicked', onAnnotationDoubleClicked, null, activeDocumentViewerKey);
    return () => core.removeEventListener('annotationDoubleClicked', onAnnotationDoubleClicked, null, activeDocumentViewerKey);
  }, [activeDocumentViewerKey]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      const selectedAnnotationTool = annotations[0].ToolName;
      const shouldSetCommentingAnnotation =
        action === 'selected'
        && annotations.length
        && !isFreeTextAnnotationAdded
        && selectedAnnotationTool !== ToolNames.CROP;
      if (shouldSetCommentingAnnotation) {
        setAnnotation(annotations[0]);
      }

      if (action === 'deselected' && annotations.length) {
        setFreeTextAnnotationAdded(false);
        if (annotations.some((annot) => annot === annotation)) {
          closeAndReset();
        }
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected, null, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected, null, activeDocumentViewerKey);
    };
  }, [annotation, isFreeTextAnnotationAdded, activeDocumentViewerKey]);

  useEffect(() => {
    setFreeTextAnnotationAdded(false);
    const onMouseLeftUp = (e) => {
      // WILL BE TRIGGERED ON MOBILE: happens before annotationSelected
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      const annotUnderMouse = core.getAnnotationByMouseEvent(e, activeDocumentViewerKey);

      if (annotation) {
        if (!annotUnderMouse) {
          closeAndReset();
        }

        if (core.isAnnotationSelected(annotUnderMouse) && annotUnderMouse !== annotation) {
          setAnnotation(annotUnderMouse);
        }
      }
    };

    const onAnnotationChanged = (annotations, action) => {
      setFreeTextAnnotationAdded(action === 'add' && isFreeTextAnnotation(annotations[0]));
      const isCommentingAnnotationSelected = core.isAnnotationSelected(annotation);
      if (annotation && !isCommentingAnnotationSelected) {
        closeAndReset();
      }
    };

    core.addEventListener('mouseLeftUp', onMouseLeftUp, null, activeDocumentViewerKey);
    core.addEventListener('annotationChanged', onAnnotationChanged, null, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('mouseLeftUp', onMouseLeftUp, null, activeDocumentViewerKey);
      core.removeEventListener('annotationChanged', onAnnotationChanged, null, activeDocumentViewerKey);
    };
  }, [annotation, activeDocumentViewerKey]);

  useEffect(() => {
    if (!isNotesPanelOpenOrActive && annotation && inlineCommentFilter(annotation)) {
      dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    }
  }, [annotation, inlineCommentFilter]);

  return { annotation, closeAndReset };
}