import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { isAnnotationInView } from 'helpers/getPopupPosition';
import DataElements from 'constants/dataElement';
import debounce from 'lodash/debounce';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import { getOverlappingOfficeEditorAnnotations } from 'helpers/inlineCommentingOfficeEditorOverlap';

export default function useOnInlineCommentPopupOpen() {
  const [
    isNotesPanelOpen,
    notesInLeftPanel,
    leftPanelOpen,
    activeLeftPanel,
    inlineCommentFilter,
    activeDocumentViewerKey,
    isOfficeEditorMode,
    isReviewPanelOpen,
    isCommentPanelOpen,
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.getNotesInLeftPanel(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
      selectors.getInlineCommentFilter(state),
      selectors.getActiveDocumentViewerKey(state),
      selectors.getIsOfficeEditorMode(state),
      selectors.isElementOpen(state, DataElements.OFFICE_EDITOR_REVIEW_PANEL),
      selectors.isElementOpen(state, DataElements.OFFICE_EDITOR_COMMENT_PANEL),
      selectors.getFeatureFlags(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const [annotation, setAnnotation] = useState(null);
  const [isFreeTextAnnotationAdded, setFreeTextAnnotationAdded] = useState(false);
  const [reopenFlag, setReopenFlag] = useState(false);
  const [lastAnnotationsUnderMouse, setLastAnnotationsUnderMouse] = useState(null);
  const { ToolNames } = window.Core.Tools;

  const isNotesActive = isNotesPanelOpen || (notesInLeftPanel && leftPanelOpen && activeLeftPanel === 'notesPanel');
  const reviewPanelOpen = featureFlags?.customizableUI ? isReviewPanelOpen : leftPanelOpen;

  const annotationKey = annotation ? mapAnnotationToKey(annotation) : null;

  const hasRequiredOverlap = useMemo(() => {
    if (!annotation || !isOfficeEditorMode) {
      return true;
    }

    const isTrackedChange = annotationKey === annotationMapKeys.TRACKED_CHANGE;
    const isOfficeEditorComment = annotationKey === annotationMapKeys.OFFICE_EDITOR_COMMENT;
    if (!isTrackedChange && !isOfficeEditorComment) {
      return true;
    }

    if (isTrackedChange && !reviewPanelOpen) {
      return true;
    }

    if (isOfficeEditorComment && !isCommentPanelOpen) {
      return true;
    }

    const overlapping = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation: annotation,
      annotations: core.getAnnotationsList(),
      documentViewerKey: activeDocumentViewerKey,
      annotationsUnderMouse: lastAnnotationsUnderMouse,
      mapAnnotationToKeyFn: mapAnnotationToKey,
    });

    return Boolean(overlapping);
  }, [
    annotation,
    isOfficeEditorMode,
    reviewPanelOpen,
    isCommentPanelOpen,
    activeDocumentViewerKey,
    lastAnnotationsUnderMouse,
  ]);

  const shouldBlockPopup = isNotesActive || !hasRequiredOverlap;
  const closeAndReset = () => {
    dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    setAnnotation(null);
    setFreeTextAnnotationAdded(false);
    setLastAnnotationsUnderMouse(null);
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
    return () => core.removeEventListener('annotationDoubleClicked', onAnnotationDoubleClicked, activeDocumentViewerKey);
  }, [activeDocumentViewerKey]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      const selectedAnnotationTool = annotations[0].ToolName;
      const shouldSetCommentingAnnotation =
        (action === 'selected')
        && annotations.length
        && !isFreeTextAnnotationAdded
        && (selectedAnnotationTool !== ToolNames.CROP);
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
      core.removeEventListener('annotationSelected', onAnnotationSelected, activeDocumentViewerKey);
    };
  }, [annotation, isFreeTextAnnotationAdded, activeDocumentViewerKey]);

  useEffect(() => {
    setFreeTextAnnotationAdded(false);
    const onMouseLeftUp = (e) => {
      // WILL BE TRIGGERED ON MOBILE: happens before annotationSelected
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
      const annotationsUnderMouse = annotationManager.getAnnotationsByMouseEvent(e);
      const annotUnderMouse = annotationsUnderMouse[0] || null;
      setLastAnnotationsUnderMouse(annotationsUnderMouse.length ? annotationsUnderMouse : null);
      if (annotation) {
        if (!annotUnderMouse) {
          closeAndReset();
          return;
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
      core.removeEventListener('mouseLeftUp', onMouseLeftUp, activeDocumentViewerKey);
      core.removeEventListener('annotationChanged', onAnnotationChanged, activeDocumentViewerKey);
    };
  }, [annotation, activeDocumentViewerKey]);

  useEffect(() => {
    if (!shouldBlockPopup && annotation && inlineCommentFilter(annotation)) {
      // Only open the popup if the annotation is within the visible scroll area.
      // Reopening it while the annotation is off-screen, could cause
      // Quill's focus to scroll ancestor containers, resulting in a blank App.
      const scrollContainer = core.getScrollViewElement(activeDocumentViewerKey);
      if (isAnnotationInView(annotation, scrollContainer, activeDocumentViewerKey)) {
        dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      }
    }
    // reopenFlag is needed here in order to re-open the popup on scroll
  }, [annotation, inlineCommentFilter, reopenFlag, shouldBlockPopup, activeDocumentViewerKey]);

  useEffect(() => {
    if (annotation && shouldBlockPopup) {
      closeAndReset();
    }
  }, [annotation, shouldBlockPopup]);

  useEffect(() => {
    const scrollViewElement = core.getScrollViewElement(activeDocumentViewerKey);
    const onScroll = debounce(() => {
      setReopenFlag((flag) => !flag);
    }, 100);

    scrollViewElement?.addEventListener('scroll', onScroll);
    return () => scrollViewElement?.removeEventListener('scroll', onScroll);
  }, [activeDocumentViewerKey]);

  return { annotation, closeAndReset, lastAnnotationsUnderMouse };
}