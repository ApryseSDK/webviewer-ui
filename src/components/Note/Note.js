import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';
import ReplyArea from 'components/Note/ReplyArea';
import NoteGroupSection from 'components/Note/NoteGroupSection';
import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import AnnotationNoteConnectorLine from 'components/AnnotationNoteConnectorLine';
import useDidUpdate from 'hooks/useDidUpdate';
import DataElements from 'constants/dataElement';
import getRootNode from 'helpers/getRootNode';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import { OfficeEditorEditMode, OFFICE_EDITOR_TRACKED_CHANGE_KEY } from 'constants/officeEditor';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  isMultiSelected: PropTypes.bool,
  isMultiSelectMode: PropTypes.bool,
  isInNotesPanel: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
};

let currId = 0;

const Note = ({
  annotation,
  isMultiSelected,
  isMultiSelectMode,
  isInNotesPanel,
  handleMultiSelect,
  isCustomPanelOpen,
  shouldHideConnectorLine,
}) => {
  const {
    isSelected,
    resize,
    pendingEditTextMap,
    isContentEditable,
    isDocumentReadOnly,
    isExpandedFromSearch,
    // documentViewerKey,
    setCurAnnotId,
  } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();
  const [isEditingMap, setIsEditingMap] = useState({});
  const ids = useRef([]);
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const unreadReplyIdSet = new Set();

  const [
    noteTransformFunction,
    customNoteSelectionFunction,
    unreadAnnotationIdSet,
    shouldExpandCommentThread,
    isRightClickAnnotationPopupEnabled,
    documentViewerKey,
    isOfficeEditorMode,
    officeEditorEditMode,
  ] = useSelector(
    (state) => [
      selectors.getNoteTransformFunction(state),
      selectors.getCustomNoteSelectionFunction(state),
      selectors.getUnreadAnnotationIdSet(state),
      selectors.isCommentThreadExpansionEnabled(state),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.getActiveDocumentViewerKey(state),
      selectors.getIsOfficeEditorMode(state),
      selectors.getOfficeEditorEditMode(state),
    ],
    shallowEqual,
  );

  const setIsEditing = useCallback(
    (isEditing, index) => {
      setIsEditingMap((map) => ({
        ...map,
        [index]: isEditing,
      }));
    },
    [setIsEditingMap],
  );

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  replies.filter((r) => unreadAnnotationIdSet.has(r.Id)).forEach((r) => unreadReplyIdSet.add(r.Id));

  useEffect(() => {
    const annotationChangedListener = (annotations, action) => {
      if (action === 'delete') {
        annotations.forEach((annot) => {
          if (unreadAnnotationIdSet.has(annot.Id)) {
            dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: annot.Id }));
          }
        });
      }
    };
    core.addEventListener('annotationChanged', annotationChangedListener, undefined, documentViewerKey);

    return () => {
      core.removeEventListener('annotationChanged', annotationChangedListener, documentViewerKey);
    };
  }, [unreadAnnotationIdSet]);

  useEffect(() => {
    const prevHeight = containerHeightRef.current;
    const currHeight = containerRef.current.getBoundingClientRect().height;
    containerHeightRef.current = currHeight;

    // have a prevHeight check here because we don't want to call resize on mount
    // use Math.round because in some cases in IE11 these two numbers will differ in just 0.00001
    // and we don't want call resize in this case
    if (prevHeight && Math.round(prevHeight) !== Math.round(currHeight)) {
      resize();
    }
  });

  useEffect(() => {
    if (noteTransformFunction) {
      const notesPanelElement = getRootNode().querySelectorAll('.NotesPanel')[0];
      ids.current.forEach((id) => {
        const child = notesPanelElement.querySelector(`[data-webviewer-custom-element=${id}]`);
        if (child) {
          child.parentNode.removeChild(child);
        }
      });

      ids.current = [];

      const state = {
        annotation,
        isSelected,
      };

      noteTransformFunction(containerRef.current, state, (...params) => {
        const element = document.createElement(...params);
        const id = `custom-element-${currId}`;
        currId++;
        ids.current.push(id);
        element.setAttribute('data-webviewer-custom-element', id);
        element.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        });

        return element;
      });
    }
  });

  useEffect(() => {
    // If this is not a new one, rebuild the isEditing map
    const pendingText = pendingEditTextMap[annotation.Id];
    if (pendingText !== '' && isContentEditable && !isDocumentReadOnly) {
      setIsEditing(true, 0);
    }
  }, [isDocumentReadOnly, isContentEditable, setIsEditing, annotation, isMultiSelectMode]);

  useDidUpdate(() => {
    if (isDocumentReadOnly || !isContentEditable) {
      setIsEditing(false, 0);
    }
  }, [isDocumentReadOnly, isContentEditable, setIsEditing]);

  const handleNoteClick = async (e) => {
    // stop bubbling up otherwise the note will be closed
    // due to annotation deselection
    e && e.stopPropagation();

    if (isMultiSelectMode) {
      handleMultiSelect(!isMultiSelected);
      return;
    }
    if (unreadAnnotationIdSet.has(annotation.Id)) {
      dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: annotation.Id }));
    }

    customNoteSelectionFunction && customNoteSelectionFunction(annotation);
    if (!isSelected) {
      core.deselectAllAnnotations(documentViewerKey);

      // Need this delay to ensure all other event listeners fire before we open the line
      setTimeout(() => dispatch(actions.openElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE)), 300);
    }
    if (isInNotesPanel && !(isOfficeEditorMode && officeEditorEditMode === OfficeEditorEditMode.PREVIEW)) {
      core.selectAnnotation(annotation, documentViewerKey);
      setCurAnnotId(annotation.Id);
      core.jumpToAnnotation(annotation, documentViewerKey);
      if (!isRightClickAnnotationPopupEnabled) {
        dispatch(actions.openElement(DataElements.ANNOTATION_POPUP));
      }
      if (isOfficeEditorMode) {
        const trackedChangeId = annotation.getCustomData(OFFICE_EDITOR_TRACKED_CHANGE_KEY);
        await core.getOfficeEditor().moveCursorToTrackedChange(trackedChangeId);
        core.getOfficeEditor().freezeMainCursor();
      }
    }
  };

  const hasUnreadReplies = unreadReplyIdSet.size > 0;

  const noteClass = classNames({
    Note: true,
    expanded: isSelected,
    'is-multi-selected': isMultiSelected,
    unread: unreadAnnotationIdSet.has(annotation.Id) || hasUnreadReplies,
    'disabled': isOfficeEditorMode && officeEditorEditMode === OfficeEditorEditMode.PREVIEW,
  });

  const repliesClass = classNames({
    replies: true,
    hidden: !isSelected,
  });

  useEffect(() => {
    // Must also restore the isEdit for  any replies, in case someone was editing a
    // reply when a comment was placed above
    if (!isMultiSelectMode) {
      replies.forEach((reply, index) => {
        const pendingText = pendingEditTextMap[reply.Id];
        if ((pendingText !== '' && typeof pendingText !== 'undefined') && isSelected) {
          setIsEditing(true, 1 + index);
        }
      });
    }
  }, [isSelected, isMultiSelectMode]);

  useEffect(() => {
    if (isMultiSelectMode) {
      setIsEditing(false, 0);
    }
  }, [isMultiSelectMode]);

  const showReplyArea = !Object.values(isEditingMap).some((val) => val);

  const handleReplyClicked = (reply) => {
    // set clicked reply as read
    if (unreadReplyIdSet.has(reply.Id)) {
      dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: reply.Id }));
      core.getAnnotationManager(documentViewerKey).selectAnnotation(reply);
    }
  };

  const markAllRepliesRead = () => {
    // set all replies to read state if user starts to type in reply textarea
    if (unreadReplyIdSet.size > 0) {
      const repliesSetToRead = replies.filter((r) => unreadReplyIdSet.has(r.Id));
      core.getAnnotationManager(documentViewerKey).selectAnnotations(repliesSetToRead);
      repliesSetToRead.forEach((r) => dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: r.Id })));
    }
  };

  const groupAnnotations = core.getGroupAnnotations(annotation, documentViewerKey);
  const isGroup = groupAnnotations.length > 1;
  const isTrackedChange = mapAnnotationToKey(annotation) === annotationMapKeys.TRACKED_CHANGE;
  // apply unread reply style to replyArea if the last reply is unread
  const lastReplyId = replies.length > 0 ? replies[replies.length - 1].Id : null;

  return (
    <div
      ref={containerRef}
      className={noteClass}
      id={`note_${annotation.Id}`}
    >
      <Button
        className='note-button'
        onClick={(e) => handleNoteClick(e)}
        ariaLabelledby={`note_${annotation.Id}`}
        ariaCurrent={isSelected}
        dataElement="expandNoteButton"
      />
      <NoteContent
        noteIndex={0}
        annotation={annotation}
        setIsEditing={setIsEditing}
        handleNoteClick={handleNoteClick}
        isEditing={isEditingMap[0]}
        isNonReplyNoteRead={!unreadAnnotationIdSet.has(annotation.Id)}
        isUnread={unreadAnnotationIdSet.has(annotation.Id) || hasUnreadReplies}
        handleMultiSelect={(e) => {
          setCurAnnotId(annotation.Id);
          handleMultiSelect(e);
        }}
        isMultiSelected={isMultiSelected}
        isMultiSelectMode={isMultiSelectMode}
      />
      {(isSelected || isExpandedFromSearch || shouldExpandCommentThread) && !isTrackedChange && (
        <>
          {replies.length > 0 && (
            <div className={repliesClass}>
              {hasUnreadReplies && (
                <Button
                  dataElement="markAllReadButton"
                  className="mark-all-read-button"
                  label={t('action.markAllRead')}
                  onClick={markAllRepliesRead}
                />
              )}
              {replies.map((reply, i) => (
                <div className="reply" id={`note_reply_${reply.Id}`} key={`note_reply_${reply.Id}`}>
                  <NoteContent
                    noteIndex={i + 1}
                    key={reply.Id}
                    annotation={reply}
                    setIsEditing={setIsEditing}
                    isEditing={isEditingMap[i + 1]}
                    onReplyClicked={handleReplyClicked}
                    isUnread={unreadAnnotationIdSet.has(reply.Id)}
                    handleMultiSelect={handleMultiSelect}
                    isMultiSelected={isMultiSelected}
                    isMultiSelectMode={isMultiSelectMode}
                    handleNoteClick={handleNoteClick}
                  />
                </div>
              ))}
            </div>
          )}
          {isGroup &&
            <NoteGroupSection
              groupAnnotations={groupAnnotations}
              isMultiSelectMode={isMultiSelectMode}
            />}
          {showReplyArea && !isMultiSelectMode && (
            <ReplyArea
              isUnread={lastReplyId && unreadAnnotationIdSet.has(lastReplyId)}
              onPendingReplyChange={markAllRepliesRead}
              annotation={annotation}
            />
          )}
        </>
      )}
      {isSelected && (isInNotesPanel || isCustomPanelOpen) && !shouldHideConnectorLine && (
        <AnnotationNoteConnectorLine
          annotation={annotation}
          noteContainerRef={containerRef}
          isCustomPanelOpen={isCustomPanelOpen}
        />
      )}
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;
