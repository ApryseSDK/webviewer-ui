import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import NoteContext from 'components/Note/Context';

import core from 'core';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';
import AtMentionsReplyBox from '../../AtMentionsReplyBox/AtMentionsReplyBox';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

// a component that contains the reply textarea, the reply button and the cancel button
const ReplyArea = ({ annotation }) => {
  const [
    isReadOnly,
    isReplyDisabled,
    isReplyDisabledForAnnotation,
    isNoteEditingTriggeredByAnnotationPopup,
  ] = useSelector(
    state => [
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
      selectors.getIsReplyDisabled(state)?.(annotation),
      selectors.getIsNoteEditing(state),
    ],
    shallowEqual,
  );
  const { resize, isContentEditable, isSelected } = useContext(NoteContext);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const textareaRef = useRef();
  const [attachedFiles, setAttachedFiles] = useState([]);

  useDidUpdate(() => {
    if (!isFocused) {
      dispatch(actions.finishNoteEditing());
    }

    resize();
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

  const trimmedValue = value ? value.trim() : '';

  const postReply = e => {
    // prevent the textarea from blurring out
    e.preventDefault();

    if (trimmedValue || attachedFiles.length > 0) {
      textareaRef.current.handleMentions();
      core.createAnnotationReply(annotation, trimmedValue);
      const replies = annotation.getReplies();
      if (replies.length > 0) {
        replies[replies.length - 1].attachedFiles = attachedFiles;
      }
      setValue('');
      setAttachedFiles([]);
      textareaRef.current.setText('');
      setIsFocused(false);
    }
  };

  const handleCancelClick = () => {
    setValue('');
    setIsFocused(false);
    setAttachedFiles([]);
    textareaRef.current.blur();
  };

  const replyBtnClass = classNames({
    disabled: !trimmedValue,
  });

  const ifReplyNotAllowed =
    isReadOnly ||
    isReplyDisabled ||
    isReplyDisabledForAnnotation ||
    (isNoteEditingTriggeredByAnnotationPopup && isContentEditable);

  return ifReplyNotAllowed ? null : (
    <div
      className="reply-container"
      // stop bubbling up otherwise the note will be closed
      // due to annotation deselection
      onMouseDown={e => e.stopPropagation()}
    >
      <AtMentionsReplyBox
        ref={el => {
          textareaRef.current = el;
        }}
        onChange={value => setValue(value)}
        onSubmit={postReply}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        placeholder={`${t('action.reply')}...`}
        attachedFiles={attachedFiles}
        onUploadFile={file => setAttachedFiles(attachedFiles.concat(file))}
      />

      {isFocused && (
        <div className="buttons">
          <button className={replyBtnClass} onMouseDown={postReply}>
            {t('action.reply')}
          </button>
          <button onMouseDown={handleCancelClick}>{t('action.cancel')}</button>
        </div>
      )}
    </div>
  );
};

ReplyArea.propTypes = propTypes;

export default ReplyArea;
