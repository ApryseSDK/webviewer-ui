import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import { useInstanceCore } from 'hooks/useCore/useCore';
import { isAnnotationInView } from 'helpers/getPopupPosition';
import DataElements from 'constants/dataElement';
import debounce from 'lodash/debounce';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import { getOverlappingOfficeEditorAnnotations } from 'helpers/inlineCommentingOfficeEditorOverlap';
import { isSpellCheckAnnotation } from 'helpers/officeEditorSpellcheckHelper';
import { isEventWithinElement } from 'helpers/getRootNode';
import findExistingSpreadsheetCommentAtCell from 'helpers/spreadsheetEditor/findExistingSpreadsheetCommentAtCell';
import useSpreadsheetActiveSheetIndex from 'hooks/useSpreadsheetActiveSheetIndex';
import useSpreadsheetCellCommentSelection from 'hooks/useSpreadsheetCellCommentSelection';

export default function useOnInlineCommentPopupOpen() {
  const core = useInstanceCore();
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
    isSpreadsheetEditorMode,
    isSpreadsheetCommentPanelOpen,
    isInlineCommentDisabled,
    activeCellTopLeftRow,
    activeCellTopLeftColumn,
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
      selectors.isSpreadsheetEditorModeEnabled(state),
      selectors.isElementOpen(state, DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL),
      selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.getActiveCellRangeTopLeftRow(state),
      selectors.getActiveCellRangeTopLeftColumn(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const [annotation, setAnnotation] = useState(null);
  const [isFreeTextAnnotationAdded, setFreeTextAnnotationAdded] = useState(false);
  const [reopenFlag, setReopenFlag] = useState(false);
  const [lastAnnotationsUnderMouse, setLastAnnotationsUnderMouse] = useState(null);
  const [spreadsheetCommentsVersion, setSpreadsheetCommentsVersion] = useState(0);
  const isPointerDownRef = useRef(false);
  const hasPendingPopupOpenRef = useRef(false);
  const wasBlockedRef = useRef(false);
  const { ToolNames } = window.Core.Tools;

  const isNotesActive = isNotesPanelOpen
    || (notesInLeftPanel && leftPanelOpen && activeLeftPanel === 'notesPanel')
    || isSpreadsheetCommentPanelOpen;
  const reviewPanelOpen = featureFlags?.customizableUI ? isReviewPanelOpen : leftPanelOpen;

  const annotationKey = annotation ? mapAnnotationToKey(annotation) : null;
  const isSpreadsheetEditorComment = annotationKey === annotationMapKeys.SPREADSHEET_EDITOR_COMMENT;

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

  const activeSheetIndex = useSpreadsheetActiveSheetIndex(isSpreadsheetEditorMode);
  const spreadsheetCommentAtActiveCell = useMemo(() => {
    if (!isSpreadsheetEditorMode) {
      return null;
    }

    const rootComments = core.getAnnotationsList(activeDocumentViewerKey)
      .filter((annot) => mapAnnotationToKey(annot) === annotationMapKeys.SPREADSHEET_EDITOR_COMMENT && annot.Listable);
    return findExistingSpreadsheetCommentAtCell({
      notes: rootComments,
      activeSheetIndex,
      topLeftRow: activeCellTopLeftRow,
      topLeftColumn: activeCellTopLeftColumn,
    }) || null;
    // spreadsheetCommentsVersion re-runs the lookup when comments are added, edited or deleted.
  }, [
    isSpreadsheetEditorMode,
    activeDocumentViewerKey,
    activeSheetIndex,
    activeCellTopLeftRow,
    activeCellTopLeftColumn,
    spreadsheetCommentsVersion,
  ]);

  useSpreadsheetCellCommentSelection({
    isEnabled: isSpreadsheetEditorMode && !isInlineCommentDisabled && !isNotesActive,
    comment: spreadsheetCommentAtActiveCell,
    documentViewerKey: activeDocumentViewerKey,
  });

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
    if (!isSpreadsheetEditorMode) {
      return;
    }

    const onSpreadsheetCommentsChanged = () => setSpreadsheetCommentsVersion((version) => version + 1);
    core.addEventListener('annotationChanged', onSpreadsheetCommentsChanged, null, activeDocumentViewerKey);
    return () => core.removeEventListener('annotationChanged', onSpreadsheetCommentsChanged, activeDocumentViewerKey);
  }, [isSpreadsheetEditorMode, activeDocumentViewerKey]);

  useEffect(() => {
    if (!isSpreadsheetEditorMode) {
      return;
    }

    // The popup opens under the cursor when a cell is selected. Opening it while the button is still down
    // sends the mouseup to the popup instead of the sheet, so the sheet keeps extending the range on mouse move.
    const onPointerDown = () => {
      isPointerDownRef.current = true;
    };
    const onPointerUp = (e) => {
      isPointerDownRef.current = false;
      // Clicking the sheet reopens the popup for the still-selected comment after it was closed by a click elsewhere.
      const clickedInSheet = isEventWithinElement(e, core.getViewerElement(activeDocumentViewerKey));
      if (clickedInSheet) {
        // The hook's annotation can be cleared while the comment is still selected, so take it from the selection.
        const selectedComment = core.getSelectedAnnotations(activeDocumentViewerKey)
          .find((annot) => mapAnnotationToKey(annot) === annotationMapKeys.SPREADSHEET_EDITOR_COMMENT);
        if (selectedComment) {
          setAnnotation(selectedComment);
        }
      }
      if (hasPendingPopupOpenRef.current || clickedInSheet) {
        hasPendingPopupOpenRef.current = false;
        setReopenFlag((flag) => !flag);
      }
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('pointercancel', onPointerUp, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointerup', onPointerUp, true);
      window.removeEventListener('pointercancel', onPointerUp, true);
      isPointerDownRef.current = false;
      hasPendingPopupOpenRef.current = false;
    };
  }, [isSpreadsheetEditorMode, activeDocumentViewerKey]);

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
      // Spell check highlights are not comments, so they are never tracked as the commenting annotation.
      const selectedAnnotation = annotations.find((annot) => !isSpellCheckAnnotation(annot));
      const shouldSetCommentingAnnotation =
        (action === 'selected')
        && selectedAnnotation
        && !isFreeTextAnnotationAdded
        && (selectedAnnotation.ToolName !== ToolNames.CROP);
      if (shouldSetCommentingAnnotation) {
        setAnnotation(selectedAnnotation);
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
      // Spreadsheet comments follow the selected cell, not the mouse position over an annotation.
      if (isSpreadsheetEditorMode) {
        return;
      }

      // WILL BE TRIGGERED ON MOBILE: happens before annotationSelected
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      const annotationsUnderMouse = core.getAnnotationsByMouseEvent(e, activeDocumentViewerKey)
        .filter((annot) => !isSpellCheckAnnotation(annot));
      const annotUnderMouse = annotationsUnderMouse[0] || null;
      setLastAnnotationsUnderMouse(annotationsUnderMouse.length ? annotationsUnderMouse : null);

      // When a spell check annotation sits on top of another annotation, core selects the spell check one.
      // Hand the selection over to the annotation underneath so that it drives the popup instead.
      const selectedSpellCheckAnnotations = core.getSelectedAnnotations(activeDocumentViewerKey).filter(isSpellCheckAnnotation);
      if (annotUnderMouse && selectedSpellCheckAnnotations.length && !core.isAnnotationSelected(annotUnderMouse, activeDocumentViewerKey)) {
        selectedSpellCheckAnnotations.forEach((annot) => core.deselectAnnotation(annot, activeDocumentViewerKey));
        core.selectAnnotation(annotUnderMouse, activeDocumentViewerKey);
      }

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
  }, [annotation, activeDocumentViewerKey, isSpreadsheetEditorMode]);

  useEffect(() => {
    const wasBlocked = wasBlockedRef.current;
    wasBlockedRef.current = shouldBlockPopup;
    // When the popup is unblocked (e.g. the comment panel closes) the cell is still selected. Wait for the user
    // to select it again instead of opening the popup on its own.
    if (wasBlocked && isSpreadsheetEditorComment) {
      return;
    }

    if (!shouldBlockPopup && annotation && inlineCommentFilter(annotation)) {
      // Spreadsheet cells have no document position to scroll out of view, so they always open.
      // Otherwise only open the popup if the annotation is within the visible scroll area.
      // Reopening it while the annotation is off-screen, could cause
      // Quill's focus to scroll ancestor containers, resulting in a blank App.
      const scrollContainer = core.getScrollViewElement(activeDocumentViewerKey);
      if (isSpreadsheetEditorComment && isPointerDownRef.current) {
        hasPendingPopupOpenRef.current = true;
      } else if (isSpreadsheetEditorComment || isAnnotationInView(annotation, scrollContainer, activeDocumentViewerKey)) {
        dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      }
    }
    // reopenFlag is needed here in order to re-open the popup on scroll
  }, [annotation, inlineCommentFilter, reopenFlag, shouldBlockPopup, activeDocumentViewerKey, isSpreadsheetEditorComment]);

  useEffect(() => {
    if (annotation && shouldBlockPopup) {
      if (isSpreadsheetEditorComment) {
        // Keep the annotation (unlike closeAndReset) so the popup can open again for the still-selected comment.
        dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
      } else {
        closeAndReset();
      }
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