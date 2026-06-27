import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import NoteContext from 'components/Note/Context';
import NoteTextarea from 'components/NoteTextarea';
import ReplyAttachmentList from 'components/ReplyAttachmentList';
import Button from 'components/Button';
import classNames from 'classnames';
import useCore from 'hooks/useCore';
import mentionsManager from 'helpers/MentionsManager';
import setAnnotationRichTextStyle from 'helpers/setAnnotationRichTextStyle';
import { setAnnotationAttachments } from 'helpers/ReplyAttachmentManager';
import useDidUpdate from 'hooks/useDidUpdate';
import useReplyAutosave from 'hooks/useReplyAutosave/useReplyAutosave'; // Only used for non-office annotations
import actions from 'actions';
import selectors from 'selectors';
import { isMobile } from 'src/helpers/device';
import DataElements from 'src/constants/dataElement';
import Events from 'constants/events';
import { OFFICE_EDITOR_COMMENT_KEY, OfficeEditorEditMode } from 'src/constants/officeEditor';
import fireEvent from 'helpers/fireEvent';

import './ReplyArea.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

// a component that contains the reply textarea, the reply button and the cancel button
const ReplyArea = ({ annotation, isUnread, onPendingReplyChange }) => {
  const { core } = useCore();
  const [
    autoFocusNoteOnAnnotationSelectionEnabled,
    isDocumentReadOnly,
    isReplyDisabled,
    isReplyDisabledForAnnotation,
    isMentionEnabled,
    isNoteEditingTriggeredByAnnotationPopup,
    isInlineCommentDisabled,
    isInlineCommentOpen,
    activeDocumentViewerKey,
    officeEditorEditMode,
    autosaveEnabled,
  ] = useSelector(
    (state) => [
      selectors.getAutoFocusNoteOnAnnotationSelection(state),
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
      selectors.getIsReplyDisabled(state)?.(annotation),
      selectors.getIsMentionEnabled(state),
      selectors.getIsNoteEditing(state),
      selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.isElementOpen(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.getActiveDocumentViewerKey(state),
      selectors.getOfficeEditorEditMode(state),
      selectors.getAutosaveEnabled(state),
    ],
    shallowEqual
  );
  const {
    isContentEditable,
    isSelected,
    pendingReplyMap,
    setPendingReply,
    isExpandedFromSearch,
    scrollToSelectedAnnot,
    setCurAnnotId,
    pendingAttachmentMap,
    clearAttachments,
    deleteAttachment,
    isOfficeEditorCommentAnnotation,
  } = useContext(NoteContext) || {};
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const textareaRef = useRef();
  const autoFocusNoteOnAnnotationSelection =
    autoFocusNoteOnAnnotationSelectionEnabled && (!isOfficeEditorCommentAnnotation || isNoteEditingTriggeredByAnnotationPopup);
  // State for non-office comments (with autosave)
  const {
    localReplyValue,
    setLocalReplyValue,
    showAutosaved,
    isSubmitClickRef,
    clearDraft,
  } = useReplyAutosave({ annotation, textareaRef });

  const shouldNotFocusOnInput = !isInlineCommentDisabled && isInlineCommentOpen && isMobile();
  // Only dispatch autosave event for non-office comments
  useEffect(() => {
    if (isOfficeEditorCommentAnnotation) {
      return;
    }
    if (!autosaveEnabled || !showAutosaved) {
      return;
    }
    fireEvent(Events.NOTE_AUTOSAVED, { annotationId: annotation.Id });
  }, [annotation.Id, autosaveEnabled, showAutosaved, isOfficeEditorCommentAnnotation]);

  useDidUpdate(() => {
    if (!isFocused) {
      dispatch(actions.finishNoteEditing());
    }
  }, [isFocused]);

  useEffect(() => {
    if (shouldNotFocusOnInput) {
      return;
    }

    if (
      isNoteEditingTriggeredByAnnotationPopup &&
      isSelected &&
      !isContentEditable &&
      autoFocusNoteOnAnnotationSelection &&
      textareaRef &&
      textareaRef.current
    ) {
      textareaRef.current.focus();
    }
  }, [isContentEditable, isNoteEditingTriggeredByAnnotationPopup, isSelected, shouldNotFocusOnInput]);

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    // when search item, should disable auto focus
    if (!isExpandedFromSearch && scrollToSelectedAnnot) {
      // use "setTimeout" to wait for element to be added before focusing to have the blinking text cursor appear
      setTimeout(() => {
        // calling focus() cause the "NotePanel" to scroll to note that being focused.
        // we don't want to jump to the selected annotation when scrolling up and down, so only focus once
        if (textareaRef && textareaRef.current && autoFocusNoteOnAnnotationSelection) {
          textareaRef.current.focus();
        }
      }, 100);
    }
    if (textareaRef && textareaRef.current) {
      if (shouldNotFocusOnInput || !autoFocusNoteOnAnnotationSelection) {
        return;
      }

      setTimeout(() => {
        const editor = textareaRef.current?.getEditor?.();
        if (!editor) {
          return;
        }
        const lastNewLineCharacterLength = 1;
        const textLength = Math.max(editor.getLength() - lastNewLineCharacterLength, 0);
        editor.setSelection(textLength, 0);
      }, 100);
    }
  }, []);

  const postReply = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOfficeEditorCommentAnnotation) {
      const editor = textareaRef.current.getEditor();
      const replyText = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
      if (!replyText.trim()) {
        return;
      }
      try {
        const officeEditorCommentId = annotation.getCustomData(OFFICE_EDITOR_COMMENT_KEY);
        const resolvedCommentId = parseInt(officeEditorCommentId, 10);
        if (isNaN(resolvedCommentId)) {
          console.warn('Failed to post reply to office editor comment', new Error('Invalid comment id'));
          return;
        }
        await core.getOfficeEditor().getCommentManager().addCommentReply(resolvedCommentId, replyText);
        setPendingReply('', annotation.Id);
        clearAttachments(annotation.Id);
      } catch (error) {
        console.warn('Failed to post reply', error);
      }
      return;
    }
    // Non-office: autosave logic
    isSubmitClickRef.current = true;
    const editor = textareaRef.current.getEditor();
    const replyText = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
    if (!replyText.trim()) {
      isSubmitClickRef.current = false;
      return;
    }
    try {
      if (isMentionEnabled) {
        const replyAnnotation = mentionsManager.createMentionReply(annotation, replyText);
        setAnnotationRichTextStyle(editor, replyAnnotation);
        await setAnnotationAttachments(replyAnnotation, pendingAttachmentMap[annotation.Id]);
        core.addAnnotations([replyAnnotation], activeDocumentViewerKey);
      } else {
        const replyAnnotation = core.createAnnotationReply(annotation, replyText);
        setAnnotationRichTextStyle(editor, replyAnnotation);
        await setAnnotationAttachments(replyAnnotation, pendingAttachmentMap[annotation.Id]);
        core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [[replyAnnotation], 'modify', {}]);
      }
      clearDraft();
      setPendingReply('', annotation.Id);
      textareaRef.current?.getEditor()?.setText('');
      clearAttachments(annotation.Id);
    } catch (error) {
      console.warn('Failed to post reply', error);
    } finally {
      isSubmitClickRef.current = false;
    }
  };

  const isOfficeEditorViewOnly = isOfficeEditorCommentAnnotation && (
    officeEditorEditMode === OfficeEditorEditMode.VIEW_ONLY ||
    officeEditorEditMode === OfficeEditorEditMode.PREVIEW
  );

  const ifReplyNotAllowed =
    isDocumentReadOnly ||
    isReplyDisabled ||
    isReplyDisabledForAnnotation ||
    isOfficeEditorViewOnly;

  const replyAreaClass = classNames({
    'reply-area': true,
    unread: isUnread,
  });

  const handleNoteTextareaChange = (value) => {
    if (isOfficeEditorCommentAnnotation) {
      setPendingReply(value, annotation.Id);
      onPendingReplyChange?.();
      return;
    }
    // Non-office
    if (isSubmitClickRef.current) {
      return;
    }
    const editor = textareaRef.current?.getEditor?.();
    const pendingReplyText = editor
      ? mentionsManager.getFormattedTextFromDeltas(editor.getContents())
      : value;
    const normalizedPendingReplyText = pendingReplyText.trim().length ? pendingReplyText : '';
    setLocalReplyValue(value);
    setPendingReply(normalizedPendingReplyText, annotation.Id);
    onPendingReplyChange?.();
  };

  const onBlur = () => {
    // Commit is intentionally handled on unmount (e.g. panel exit), not generic blur.
    setIsFocused(false);
    setCurAnnotId(undefined);
  };

  const onFocus = () => {
    setIsFocused(true);
    setCurAnnotId(annotation.Id);
  };

  const pendingAttachments = pendingAttachmentMap[annotation.Id] || [];

  return (ifReplyNotAllowed || !isSelected) ? null : (
    <form onSubmit={postReply} className="reply-area-container">
      {pendingAttachments.length > 0 && (
        <ReplyAttachmentList
          files={pendingAttachments}
          isEditing={true}
          fileDeleted={(file) => deleteAttachment(annotation.Id, file)}
        />
      )}
      <div className="reply-area-with-button">
        <div
          className={replyAreaClass}
          // stop bubbling up otherwise the note will be closed
          // due to annotation deselection
          onMouseDown={(e) => e.stopPropagation()}
        >
          <NoteTextarea
            ref={(el) => {
              textareaRef.current = el;
            }}
            value={isOfficeEditorCommentAnnotation ? pendingReplyMap[annotation.Id] : localReplyValue}
            onChange={handleNoteTextareaChange}
            onSubmit={postReply}
            onBlur={onBlur}
            onFocus={onFocus}
            isReply
          />
        </div>
        <div
          className="reply-button-container"
          role="none"
          onMouseDownCapture={() => {
            if (!isOfficeEditorCommentAnnotation) {
              if (localReplyValue) {
                isSubmitClickRef.current = true;
              }
            }
          }}
          onMouseUp={() => {
            if (!isOfficeEditorCommentAnnotation) {
              isSubmitClickRef.current = false;
            }
          }}
          onMouseLeave={() => {
            if (!isOfficeEditorCommentAnnotation) {
              isSubmitClickRef.current = false;
            }
          }}
        >
          <Button
            img="icon-post-reply"
            className='reply-button'
            title={'action.submit'}
            disabled={isOfficeEditorCommentAnnotation ? !pendingReplyMap[annotation.Id] : !localReplyValue}
            onClick={postReply}
            isSubmitType
          />
        </div>
      </div>
    </form>
  );
};

ReplyArea.propTypes = propTypes;

export default ReplyArea;
