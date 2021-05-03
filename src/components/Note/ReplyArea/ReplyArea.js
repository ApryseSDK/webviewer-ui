import React, { useState, useEffect, useRef, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import NoteContext from 'components/Note/Context';
import NoteTextarea from 'components/NoteTextarea';
import classNames from 'classnames';
import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

import './ReplyArea.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

// a component that contains the reply textarea, the reply button and the cancel button
const ReplyArea = ({ annotation, isUnread, onPendingReplyChange }) => {
  const [
    isReadOnly,
    isReplyDisabled,
    isReplyDisabledForAnnotation,
    isMentionEnabled,
    isNoteEditingTriggeredByAnnotationPopup,
  ] = useSelector(
    state => [
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
      selectors.getIsReplyDisabled(state)?.(annotation),
      selectors.getIsMentionEnabled(state),
      selectors.getIsNoteEditing(state),
    ],
    shallowEqual
  );
  const { resize, isContentEditable, isSelected, pendingReplyMap, setPendingReply, isExpandedFromSearch, scrollToSelectedAnnot } = useContext(NoteContext);
  const [isFocused, setIsFocused] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const textareaRef = useRef();

  useDidUpdate(() => {
    if (!isFocused) {
      dispatch(actions.finishNoteEditing());
      setIsPosting(false);
    }

    if (!isPosting) {
      resize();
    }
  }, [isFocused]);

  useEffect(() => {
    if (
      isNoteEditingTriggeredByAnnotationPopup &&
      isSelected &&
      !isContentEditable
    ) {
      textareaRef.current?.focus();
    }
  }, [isContentEditable, isNoteEditingTriggeredByAnnotationPopup, isSelected]);

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (textareaRef.current) {
      // when search item, should disable auto focus
      if (!isExpandedFromSearch && scrollToSelectedAnnot) {
        // use "setTimeout" to wait for element to be added before focusing to have the blinking text cursor appear
        setTimeout(() => {
          // calling focus() cause the "NotePanel" to scroll to note that being focused.
          // we don't want to jump to the selected annotation when scrolling up and down, so only focus once
          textareaRef.current?.focus();
        }, 0);
      }

      const textLength = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(textLength, textLength);
    }
  }, []);

  const postReply = e => {
    // prevent the textarea from blurring out
    e.preventDefault();
    setIsPosting(false);
    const replyText = pendingReplyMap[annotation.Id]

    if (!replyText) {
      return;
    }

    const annotationHasNoContents = annotation.getContents() === '' || annotation.getContents() === undefined;
    if (isMentionEnabled) {
      if (annotationHasNoContents && isContentEditable) {
        const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(replyText);

        annotation.setCustomData('trn-mention', {
          contents: replyText,
          ids,
        });
        core.setNoteContents(annotation, plainTextValue);
      } else {
        mentionsManager.createMentionReply(annotation, replyText);
      }
    } else {
      if (annotationHasNoContents && isContentEditable) {
        core.setNoteContents(annotation, replyText);
      } else {
        core.createAnnotationReply(annotation, replyText);
      }
    }

    setPendingReply('', annotation.Id);
  };

  const ifReplyNotAllowed =
    isReadOnly ||
    isReplyDisabled ||
    isReplyDisabledForAnnotation;

  const replyAreaClass = classNames({
    "reply-area-container": true,
    unread: isUnread,
  });

  const handleNoteTextareaChange = (value) => {
    setPendingReply(value, annotation.Id);
    onPendingReplyChange();
  }
  return ifReplyNotAllowed ? null : (
    <div
      className={replyAreaClass}
      // stop bubbling up otherwise the note will be closed
      // due to annotation deselection
      onMouseDown={e => e.stopPropagation()}
    >
      <NoteTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={pendingReplyMap[annotation.Id]}
        onChange={value => handleNoteTextareaChange(value)}
        onSubmit={postReply}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        placeholder={`${t('action.reply')}...`}
        aria-label={`${t('action.reply')}...`}
      />
      <button className={`reply-button${!pendingReplyMap[annotation.Id] ? ' disabled' : ''}`}
        disabled={!pendingReplyMap[annotation.Id]}
        onMouseDown={() => setIsPosting(true)}
        onMouseUp={e => postReply(e)}
      >
        {t('action.post')}
      </button>
    </div>
  );
};

ReplyArea.propTypes = propTypes;

export default ReplyArea;
