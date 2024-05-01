import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import InlineCommentingPopup from './InlineCommentingPopup';
import core from 'core';
import { getAnnotationPopupPositionBasedOn as getPopupPosition } from 'helpers/getPopupPosition';
import { getOpenedWarningModal, getOpenedColorPicker, getDatePicker } from 'helpers/getElements';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';
import { isMobile as isPhone, isIE, isMobileDevice } from 'helpers/device';
import DataElements from 'constants/dataElement';
import getRootNode from 'helpers/getRootNode';

const InlineCommentingPopupContainer = ({ annotation, closeAndReset }) => {
  const [
    isNotesPanelOpen,
    notesInLeftPanel,
    isLeftPanelOpen,
    activeLeftPanel,
    showAnnotationNumbering,
    sortStrategy,
    isDocumentReadOnly,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.getNotesInLeftPanel(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
      selectors.isAnnotationNumberingEnabled(state),
      selectors.getSortStrategy(state),
      selectors.isDocumentReadOnly(state),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef();
  // on tablet, the behaviour will be like on desktop, except being draggable
  const isMobile = isPhone();
  const isUndraggable = isMobile || !!isMobileDevice || isIE;
  const isNotesPanelOpenOrActive = isNotesPanelOpen || (notesInLeftPanel && isLeftPanelOpen && activeLeftPanel === 'notesPanel');

  useOnClickOutside(popupRef, (e) => {
    const notesPanel = getRootNode().querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);
    const notePopupState = getRootNode().querySelector('[data-element="notePopupState"]');
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

  const isNotesPanelClosed = !isNotesPanelOpenOrActive;

  useLayoutEffect(() => {
    if (isNotesPanelClosed && popupRef.current && !isMobile) {
      setPosition(getPopupPosition(annotation, popupRef, activeDocumentViewerKey));
    }
  }, [activeDocumentViewerKey]);

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

  const contextValue = {
    searchInput: '',
    resize: () => { },
    isSelected: true,
    isContentEditable: core.canModifyContents(annotation) && !annotation.getContents(),
    pendingEditTextMap,
    setPendingEditText,
    pendingReplyMap,
    setPendingReply,
    isDocumentReadOnly,
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
      isNotesPanelClosed={isNotesPanelClosed}
      popupRef={popupRef}
      position={position}
      closeAndReset={closeAndReset}
      commentingAnnotation={annotation}
      contextValue={contextValue}
      annotationForAttachment={annotationForAttachment}
      addAttachments={addAttachments}
    />
  );
};

export default InlineCommentingPopupContainer;
