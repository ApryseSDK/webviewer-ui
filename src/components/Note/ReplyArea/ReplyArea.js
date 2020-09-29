import React, { useState, useEffect, useRef, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import NoteContext from 'components/Note/Context';
import NoteTextarea from 'components/NoteTextarea';

import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

// a component that contains the reply textarea, the reply button and the cancel button
const ReplyArea = ({ annotation, replyText, setReplyText }) => {
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
  const { resize, isContentEditable, isSelected } = useContext(NoteContext);
  const [isFocused, setIsFocused] = useState(false);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const textareaRef = useRef();

  useDidUpdate(() => {
    if (!isFocused) {
      dispatch(actions.finishNoteEditing());
    }

    resize();
  }, [isFocused]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (
      isNoteEditingTriggeredByAnnotationPopup &&
      isSelected &&
      !isContentEditable
    ) {
      textareaRef.current?.focus();
    }
  }, [isContentEditable, isNoteEditingTriggeredByAnnotationPopup, isSelected]);

  const postReply = e => {
    // prevent the textarea from blurring out
    e.preventDefault();

    if (!replyText) {
      return;
    }

    const annotationHasNoContents = annotation.getContents() === '' || annotation.getContents() === undefined;
    if (isMentionEnabled) {
      if (annotationHasNoContents) {
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
      if (annotationHasNoContents) {
        core.setNoteContents(annotation, replyText);
      } else {
        core.createAnnotationReply(annotation, replyText);
      }
    }

    setReplyText('');
  };

  const ifReplyNotAllowed =
    isReadOnly ||
    isReplyDisabled ||
    isReplyDisabledForAnnotation ||
    (isNoteEditingTriggeredByAnnotationPopup && isContentEditable);

  return ifReplyNotAllowed ? null : (
    <div
      className="reply-area-container"
      // stop bubbling up otherwise the note will be closed
      // due to annotation deselection
      onMouseDown={e => e.stopPropagation()}
    >
      <NoteTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={replyText}
        onChange={value => setReplyText(value)}
        onSubmit={postReply}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        placeholder={`${t('action.comment')}...`}
        aria-label={`${t('action.comment')}...`}
      />
      <button
        className="reply-button"
        onClick={e => postReply(e)}
      >
        {t('action.post')}
      </button>
    </div>
  );
};

ReplyArea.propTypes = propTypes;

export default ReplyArea;
