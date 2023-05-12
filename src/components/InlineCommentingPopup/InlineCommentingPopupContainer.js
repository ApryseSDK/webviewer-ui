import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import InlineCommentingPopup from './InlineCommentingPopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn as getPopupPosition } from 'helpers/getPopupPosition';
import { getOpenedWarningModal, getOpenedColorPicker, getDatePicker } from 'helpers/getElements';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';
import { isMobile as isPhone, isIE, isMobileDevice } from 'helpers/device';
import DataElements from 'src/constants/dataElement';

const InlineCommentingPopupContainer = () => {
  const [
    isDisabled,
    isOpen,
    isNotesPanelOpen,
    notesInLeftPanel,
    leftPanelOpen,
    activeLeftPanel,
    showAnnotationNumbering,
    sortStrategy,
    isDocumentReadOnly,
    inlineCommmentFilter,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.isElementOpen(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.getNotesInLeftPanel(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
      selectors.isAnnotationNumberingEnabled(state),
      selectors.getSortStrategy(state),
      selectors.isDocumentReadOnly(state),
      selectors.getInlineCommmentFilter(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [commentingAnnotation, setCommentingAnnotation] = useState(null);
  const [isFreeTextAnnotationAdded, setFreeTextAnnotationAdded] = useState(false);
  const popupRef = useRef();
  const { ToolNames } = window.Core.Tools;
  const isCommentingAnnotationSelected = core.isAnnotationSelected(commentingAnnotation);
  // on tablet, the behaviour will be like on desktop, except being draggable
  const isMobile = isPhone();
  const isUndraggable = isMobile || !!isMobileDevice || isIE;
  const isNotesPanelOpenOrActive = isNotesPanelOpen || (notesInLeftPanel && leftPanelOpen && activeLeftPanel === 'notesPanel');

  useOnClickOutside(popupRef, (e) => {
    const notesPanel = document.querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);
    const notePopupState = document.querySelector('[data-element="notePopupState"]');
    const clickedInNotePopupState = notePopupState?.contains(e.target);
    const datePicker = getDatePicker();
    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel && !clickedInNotePopupState && !warningModal && !colorPicker && !datePicker) {
      dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    }
  });

  const setPopupPositionAndShow = () => {
    if (popupRef.current) {
      dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      if (!isMobile) {
        setPosition(getPopupPosition(commentingAnnotation, popupRef));
      }
    }
  };

  const closeAndReset = () => {
    dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    setPosition({ left: 0, top: 0 });
    setCommentingAnnotation(null);
    setFreeTextAnnotationAdded(false);
  };

  const isNotesPanelClosed = !isNotesPanelOpenOrActive;

  const isFreeTextAnnotation = (annot) => {
    return annot instanceof window.Core.Annotations.FreeTextAnnotation;
  };

  const shouldRenderForAnnotationOnSelect = useCallback((annotation) => {
    if (!inlineCommmentFilter) {
      return true;
    }
    return inlineCommmentFilter(annotation);
  }, [inlineCommmentFilter]);

  useEffect(() => {
    setFreeTextAnnotationAdded(false);

    const onMouseLeftUp = (e) => {
      // WILL BE TRIGGERED ON MOBILE: happens before annotationSelected
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      const annotUnderMouse = core.getAnnotationByMouseEvent(e);

      if (commentingAnnotation) {
        if (!annotUnderMouse) {
          closeAndReset();
        }

        if (core.isAnnotationSelected(annotUnderMouse) && annotUnderMouse !== commentingAnnotation) {
          setCommentingAnnotation(annotUnderMouse);
        }
      }
    };

    const onAnnotationChanged = (annotations, action) => {
      setFreeTextAnnotationAdded(action === 'add' && isFreeTextAnnotation(annotations[0]));
      if (commentingAnnotation && !isCommentingAnnotationSelected) {
        closeAndReset();
      }
    };

    core.addEventListener('mouseLeftUp', onMouseLeftUp);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    return () => {
      core.removeEventListener('mouseLeftUp', onMouseLeftUp);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
    };
  }, [isNotesPanelOpen, notesInLeftPanel, leftPanelOpen, activeLeftPanel, commentingAnnotation]);

  useEffect(() => {
    // on mobile: mouseLeftUp gets called before annotationSelected so commentingAnnotation is always null
    // on desktop: move the open logic in mouseLeftUp here to simplify the code
    if (isNotesPanelClosed && commentingAnnotation && shouldRenderForAnnotationOnSelect(commentingAnnotation)) {
      setPopupPositionAndShow();
    }
  }, [commentingAnnotation, shouldRenderForAnnotationOnSelect]);

  useEffect(() => {
    // open popup when commentOnAnnotation gets triggered
    // this doesn't depend on shouldRenderForAnnotationOnSelect
    if (isNotesPanelClosed && commentingAnnotation && isOpen) {
      setPopupPositionAndShow();
    }
  }, [isOpen]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      const selectedAnnotationTool = annotations[0].ToolName;
      const shouldSetCommentingAnnotation =
        action === 'selected'
        && annotations.length
        && !isFreeTextAnnotationAdded
        && selectedAnnotationTool !== ToolNames.CROP;
      if (shouldSetCommentingAnnotation) {
        setCommentingAnnotation(annotations[0]);
      }

      if (action === 'deselected' && annotations.length) {
        setFreeTextAnnotationAdded(false);
        if (annotations.some((annot) => annot === commentingAnnotation)) {
          closeAndReset();
        }
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, [commentingAnnotation, isFreeTextAnnotationAdded]);

  useEffect(() => {
    const onAnnotationDoubleClicked = (annot) => {
      if (isFreeTextAnnotation(annot) && isOpen) {
        closeAndReset();
      }
    };

    core.addEventListener('annotationDoubleClicked', onAnnotationDoubleClicked);
    return () => core.removeEventListener('annotationDoubleClicked', onAnnotationDoubleClicked);
  }, [isOpen]);

  // TO-DO refactor: Lines 189-239 was copied from NotesPanel 228-275
  const [pendingAttachmentMap, setPendingAttachmentMap] = useState({});
  const addAttachments = (annotationID, attachments) => {
    setPendingAttachmentMap((map) => ({
      ...map,
      [annotationID]: [...(map[annotationID] || []), ...attachments]
    }));
  };

  const [annotationForAttachment, setAnnotationForAttachment] = useState(undefined);

  const [pendingEditTextMap, setPendingEditTextMap] = useState({});
  const setPendingEditText = useCallback(
    (pendingText, annotationID) => {
      setPendingEditTextMap((map) => ({
        ...map,
        [annotationID]: pendingText,
      }));
    },
    [setPendingEditTextMap],
  );

  const [pendingReplyMap, setPendingReplyMap] = useState({});
  const setPendingReply = useCallback(
    (pendingReply, annotationID) => {
      setPendingReplyMap((map) => ({
        ...map,
        [annotationID]: pendingReply,
      }));
    },
    [setPendingReplyMap],
  );

  const clearAttachments = (annotationID) => {
    setPendingAttachmentMap((map) => ({
      ...map,
      [annotationID]: []
    }));
  };
  const deleteAttachment = (annotationID, attachment) => {
    const attachmentList = pendingAttachmentMap[annotationID];
    if (attachmentList?.length > 0) {
      const index = attachmentList.indexOf(attachment);
      if (index > -1) {
        attachmentList.splice(index, 1);
        setPendingAttachmentMap((map) => ({
          ...map,
          [annotationID]: [...attachmentList]
        }));
      }
    }
  };

  if (isDisabled || !commentingAnnotation) {
    return null;
  }

  const contextValue = {
    searchInput: '',
    resize: () => { },
    isSelected: true,
    isContentEditable: core.canModifyContents(commentingAnnotation) && !commentingAnnotation.getContents(),
    pendingEditTextMap,
    setPendingEditText,
    pendingReplyMap,
    setPendingReply,
    isDocumentReadOnly,
    isNotePanelOpen: isOpen || isNotesPanelOpen || notesInLeftPanel,
    onTopNoteContentClicked: () => { },
    isExpandedFromSearch: false,
    scrollToSelectedAnnot: false,
    sortStrategy,
    showAnnotationNumbering,
    setCurAnnotId: setAnnotationForAttachment,
    pendingAttachmentMap,
    addAttachments,
    clearAttachments,
    deleteAttachment,
  };

  return (
    <InlineCommentingPopup
      isMobile={isMobile}
      isUndraggable={isUndraggable}
      isOpen={isOpen}
      isNotesPanelOpen={isNotesPanelOpenOrActive}
      isNotesPanelClosed={isNotesPanelClosed}
      popupRef={popupRef}
      position={position}
      closeAndReset={closeAndReset}
      commentingAnnotation={commentingAnnotation}
      contextValue={contextValue}
      annotationForAttachment={annotationForAttachment}
      addAttachments={addAttachments}
    />
  );
};

export default InlineCommentingPopupContainer;
