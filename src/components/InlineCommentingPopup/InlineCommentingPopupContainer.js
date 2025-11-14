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
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { workerTypes } from 'constants/types';

const propTypes = {
  annotation: PropTypes.object,
  closeAndReset: PropTypes.func,
};

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
      selectors.isViewOnly(state),
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
  const sixtyFramesPerSecondIncrement = 16;

  useOnClickOutside(popupRef, (e) => {
    const notesPanel = getRootNode().querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);
    const noteStateFlyout = getRootNode().querySelector(`[data-element="noteStateFlyout-${annotation.Id}"]`);
    const clickedInNoteStateFlyout = noteStateFlyout?.contains(e.target);
    const datePicker = getDatePicker();
    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel && !clickedInNoteStateFlyout && !warningModal && !colorPicker && !datePicker) {
      dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    }
  });

  const isNotesPanelClosed = !isNotesPanelOpenOrActive;

  const setPopupPosition = () => {
    if (isNotesPanelClosed && popupRef.current && !isMobile) {
      setPosition(getPopupPosition(annotation, popupRef, activeDocumentViewerKey));
    }
  };

  useLayoutEffect(() => {
    setPopupPosition();
  }, [activeDocumentViewerKey, annotation]);

  const handleResize = debounce(() => {
    setPopupPosition();
  }, sixtyFramesPerSecondIncrement, { 'trailing': true, 'leading': false });

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    resize: () => {
      if (core.getDocument()?.getType() === workerTypes.OFFICE_EDITOR) {
        setPosition(getPopupPosition(annotation, popupRef, activeDocumentViewerKey));
      }
    },
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

InlineCommentingPopupContainer.propTypes = propTypes;

export default InlineCommentingPopupContainer;
