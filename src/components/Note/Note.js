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
import DataElements from 'src/constants/dataElement';

import './Note.scss';
import getRootNode from 'helpers/getRootNode';

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
}) => {
  const { isSelected, resize, pendingEditTextMap, isContentEditable, isDocumentReadOnly, isNotePanelOpen, isExpandedFromSearch } = useContext(NoteContext);
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
  ] = useSelector(
    (state) => [
      selectors.getNoteTransformFunction(state),
      selectors.getCustomNoteSelectionFunction(state),
      selectors.getUnreadAnnotationIdSet(state),
      selectors.isCommentThreadExpansionEnabled(state),
    ],
    shallowEqual,
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
    core.addEventListener('annotationChanged', annotationChangedListener);

    return () => {
      core.removeEventListener('annotationChanged', annotationChangedListener);
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
      const notesPanelElement = getRootNode().getElementsByClassName('NotesPanel')[0];
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

  const handleNoteClick = (e) => {
    // stop bubbling up otherwise the note will be closed
    // due to annotation deselection
    e && e.stopPropagation();

    if (isNotePanelOpen && unreadAnnotationIdSet.has(annotation.Id)) {
      dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: annotation.Id }));
    }

    customNoteSelectionFunction && customNoteSelectionFunction(annotation);
    if (!isSelected) {
      core.deselectAllAnnotations();

      // Need this delay to ensure all other event listeners fire before we open the line
      setTimeout(() => dispatch(actions.openElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE)), 300);
    }
    if (isInNotesPanel) {
      core.selectAnnotation(annotation);
      core.jumpToAnnotation(annotation);
      dispatch(actions.openElement(DataElements.ANNOTATION_POPUP));
    }
  };

  const hasUnreadReplies = unreadReplyIdSet.size > 0;

  const noteClass = classNames({
    Note: true,
    expanded: isSelected,
    'is-multi-selected': isMultiSelected,
    unread: unreadAnnotationIdSet.has(annotation.Id) || hasUnreadReplies,
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

  const handleNoteKeydown = (e) => {
    // Click if enter or space is pressed and is current target.
    const isNote = e.target === e.currentTarget;
    if (isNote && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); // Stop from being entered in field
      handleNoteClick();
    }
  };

  const handleReplyClicked = (reply) => {
    // set clicked reply as read
    if (unreadReplyIdSet.has(reply.Id)) {
      dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: reply.Id }));
      core.getAnnotationManager().selectAnnotation(reply);
    }
  };

  const markAllRepliesRead = () => {
    // set all replies to read state if user starts to type in reply textarea
    if (unreadReplyIdSet.size > 0) {
      const repliesSetToRead = replies.filter((r) => unreadReplyIdSet.has(r.Id));
      core.getAnnotationManager().selectAnnotations(repliesSetToRead);
      repliesSetToRead.forEach((r) => dispatch(actions.setAnnotationReadState({ isRead: true, annotationId: r.Id })));
    }
  };

  const setIsEditing = useCallback(
    (isEditing, index) => {
      setIsEditingMap((map) => ({
        ...map,
        [index]: isEditing,
      }));
    },
    [setIsEditingMap],
  );

  const groupAnnotations = core.getGroupAnnotations(annotation);
  const isGroup = groupAnnotations.length > 1;
  let isCaretAnnotation = false;
  isCaretAnnotation = groupAnnotations.some((annotation) => annotation instanceof window.Core.Annotations.CaretAnnotation);
  if (isCaretAnnotation) {
    isMultiSelectMode = false;
    isMultiSelected = false;
  }
  // apply unread reply style to replyArea if the last reply is unread
  const lastReplyId = replies.length > 0 ? replies[replies.length - 1].Id : null;

  return (
    <div
      role="button"
      tabIndex={0}
      ref={containerRef}
      className={noteClass}
      onClick={handleNoteClick}
      onKeyDown={handleNoteKeydown}
      id={`note_${annotation.Id}`}
    >
      <NoteContent
        noteIndex={0}
        annotation={annotation}
        setIsEditing={setIsEditing}
        isEditing={isEditingMap[0]}
        isNonReplyNoteRead={!unreadAnnotationIdSet.has(annotation.Id)}
        isUnread={unreadAnnotationIdSet.has(annotation.Id) || hasUnreadReplies}
        handleMultiSelect={handleMultiSelect}
        isMultiSelected={isMultiSelected}
        isMultiSelectMode={isMultiSelectMode}
      />
      {(isSelected || isExpandedFromSearch || shouldExpandCommentThread) && (
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
      {isSelected && isInNotesPanel && <AnnotationNoteConnectorLine annotation={annotation} noteContainerRef={containerRef} />}
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;
