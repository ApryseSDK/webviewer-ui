import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import InlineCommentingPopup from './InlineCommentingPopup';
import InlineCommentingOfficeEditorPopupContainer from './InlineCommentingOfficeEditorPopupContainer';
import useCore from 'hooks/useCore';
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
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';

const propTypes = {
  annotation: PropTypes.object,
  closeAndReset: PropTypes.func,
  lastAnnotationsUnderMouse: PropTypes.arrayOf(PropTypes.object),
};


const InlineCommentingPopupContainer = ({ annotation, closeAndReset, lastAnnotationsUnderMouse }) => {
  const { core } = useCore();
  const [
    isNotesPanelOpen,
    notesInLeftPanel,
    isLeftPanelOpen,
    activeLeftPanel,
    showAnnotationNumbering,
    sortStrategy,
    isDocumentReadOnly,
    activeDocumentViewerKey,
    isOfficeEditorMode,
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
      selectors.getIsOfficeEditorMode(state),
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

  const buildFlyoutSelector = (prefix, suffix) => `[data-element^="${prefix}-"][data-element$="-${suffix}"]`;
  const noteFlyoutIdSuffix = 'inlineCommentPopup';

  useOnClickOutside(popupRef, (e) => {
    const root = getRootNode();
    const notesPanel = root.querySelector('[data-element="notesPanel"]');
    const reviewPanel = root.querySelector('[data-element="officeEditorReviewPanel"]');
    const commentPanel = root.querySelector('[data-element="officeEditorCommentPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);
    const clickedInReviewPanel = reviewPanel?.contains(e.target);
    const clickedInCommentPanel = commentPanel?.contains(e.target);
    const clickedInNoteStateFlyout = !!e.target?.closest(
      buildFlyoutSelector('noteStateFlyout', noteFlyoutIdSuffix),
    );
    const clickedInNotePopupFlyout = !!e.target?.closest(
      buildFlyoutSelector('notePopupFlyout', noteFlyoutIdSuffix),
    );

    const hasOpenModal = getOpenedWarningModal();
    const hasOpenColorPicker = getOpenedColorPicker();
    const hasOpenDatePicker = getDatePicker();

    const clickedInProtectedArea =
      clickedInNotesPanel ||
      clickedInReviewPanel ||
      clickedInCommentPanel ||
      clickedInNoteStateFlyout ||
      clickedInNotePopupFlyout ||
      hasOpenModal ||
      hasOpenColorPicker ||
      hasOpenDatePicker;

    // Avoid closing when interacting with panels/flyouts that manage this popup state themselves (e.g., notes panel mousedown handlers)
    if (!clickedInProtectedArea) {
      dispatch(actions.closeElement(DataElements.INLINE_COMMENT_POPUP));
    }
  });

  const isNotesPanelClosed = !isNotesPanelOpenOrActive;

  const annotationKey = annotation ? mapAnnotationToKey(annotation) : null;
  const shouldUseOfficeEditorPopup = isOfficeEditorMode && (
    annotationKey === annotationMapKeys.TRACKED_CHANGE ||
    annotationKey === annotationMapKeys.OFFICE_EDITOR_COMMENT
  );

  const setPopupPosition = () => {
    if (!annotation) {
      return;
    }
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

  if (!annotation) {
    return null;
  }

  const isOfficeEditorCommentAnnotation = annotationKey === annotationMapKeys.OFFICE_EDITOR_COMMENT;

  const contextValue = {
    searchInput: '',
    noteFlyoutIdSuffix,
    resize: () => {
      if (core.getDocument()?.getType() === workerTypes.OFFICE_EDITOR) {
        setPosition(getPopupPosition(annotation, popupRef, activeDocumentViewerKey));
      }
    },
    isSelected: true,
    isContentEditable: core.canModifyContents(annotation) && !annotation.getContents(),
    isOfficeEditorCommentAnnotation,
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

  const popupProps = {
    isMobile,
    isUndraggable,
    isNotesPanelClosed,
    popupRef,
    position,
    closeAndReset,
    commentingAnnotation: annotation,
    contextValue,
    annotationForAttachment,
    addAttachments,
  };

  return shouldUseOfficeEditorPopup ? (
    <InlineCommentingOfficeEditorPopupContainer
      {...popupProps}
      annotationsUnderMouse={lastAnnotationsUnderMouse}
    />
  ) : (
    <InlineCommentingPopup {...popupProps} />
  );
};

InlineCommentingPopupContainer.propTypes = propTypes;

export default InlineCommentingPopupContainer;
