import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NoteContext from 'components/Note/Context';
import NoteTextarea from 'components/NoteTextarea';
import classNames from 'classnames';
import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import setAnnotationRichTextStyle from 'helpers/setAnnotationRichTextStyle';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';
import Button from 'src/components/Button';

import './ReplyArea.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

// a component that contains the reply textarea, the reply button and the cancel button
const ReplyArea = ({ annotation, isUnread, onPendingReplyChange }) => {
  const [
    autoFocusNoteOnAnnotationSelection,
    isReadOnly,
    isReplyDisabled,
    isReplyDisabledForAnnotation,
    isMentionEnabled,
    isNoteEditingTriggeredByAnnotationPopup,
  ] = useSelector(
    (state) => [
      selectors.getAutoFocusNoteOnAnnotationSelection(state),
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
      selectors.getIsReplyDisabled(state)?.(annotation),
      selectors.getIsMentionEnabled(state),
      selectors.getIsNoteEditing(state),
    ],
    shallowEqual
  );
  const { isContentEditable, isSelected, pendingReplyMap, setPendingReply, isExpandedFromSearch, scrollToSelectedAnnot } = useContext(NoteContext);
  const [isFocused, setIsFocused] = useState(false);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const textareaRef = useRef();

  useDidUpdate(() => {
    if (!isFocused) {
      dispatch(actions.finishNoteEditing());
    }
  }, [isFocused]);

  useEffect(() => {
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
  }, [isContentEditable, isNoteEditingTriggeredByAnnotationPopup, isSelected]);

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
      }, 0);
    }
    if (textareaRef && textareaRef.current) {
      const editor = textareaRef.current.getEditor();
      const lastNewLineCharacterLength = 1;
      const textLength = editor.getLength() - lastNewLineCharacterLength;
      textareaRef.current.editor.setSelection(textLength, textLength);
    }
  }, []);

  const postReply = (e) => {
    // prevent the textarea from blurring out
    e.preventDefault();
    const editor = textareaRef.current.getEditor();
    const replyText = mentionsManager.getFormattedTextFromDeltas(editor.getContents());

    if (!replyText.trim()) {
      return;
    }

    const annotationHasNoContents = annotation.getContents() === '' || annotation.getContents() === undefined;
    if (isMentionEnabled) {
      if (annotationHasNoContents && isContentEditable) {
        const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(replyText);

        annotation.setCustomData('trn-mention', JSON.stringify({
          contents: replyText,
          ids,
        }));
        core.setNoteContents(annotation, plainTextValue);
      } else {
        const replyAnnotation = mentionsManager.createMentionReply(annotation, replyText);
        setAnnotationRichTextStyle(editor, replyAnnotation);
      }
    } else {
      if (annotationHasNoContents && isContentEditable) {
        core.setNoteContents(annotation, replyText);
        setAnnotationRichTextStyle(editor, annotation);
      } else {
        const replyAnnotation = core.createAnnotationReply(annotation, replyText);
        setAnnotationRichTextStyle(editor, replyAnnotation);
      }
    }

    setPendingReply('', annotation.Id);
  };

  const ifReplyNotAllowed =
    isReadOnly ||
    isReplyDisabled ||
    isReplyDisabledForAnnotation;

  const replyAreaClass = classNames({
    'reply-area': true,
    unread: isUnread,
  });

  const handleNoteTextareaChange = (value) => {
    setPendingReply(value, annotation.Id);
    onPendingReplyChange && onPendingReplyChange();
  };
  return ifReplyNotAllowed || !isSelected ? null : (
    <form onSubmit={postReply} className="reply-area-container">
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
          value={pendingReplyMap[annotation.Id]}
          onChange={(value) => handleNoteTextareaChange(value)}
          onSubmit={postReply}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          placeholder={`${t('action.reply')}...`}
          aria-label={`${t('action.reply')}...`}
        />
      </div>
      <div className="reply-button-container">
        <Button
          img="icon-post-reply"
          className={`reply-button${!pendingReplyMap[annotation.Id] ? ' disabled' : ''}`}
          onMouseUp={(e) => postReply(e)}
          isSubmitType
        />
      </div>
    </form>
  );
};

ReplyArea.propTypes = propTypes;

export default ReplyArea;
