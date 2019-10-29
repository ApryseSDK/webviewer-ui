import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import AutoResizeTextarea from 'components/AutoResizeTextarea';
import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';

import core from 'core';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const Note = ({ annotation }) => {
  const { isSelected, resize } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();

  useEffect(() => {
    const prevHeight = containerHeightRef.current;
    const currHeight = window.getComputedStyle(containerRef.current).height;

    if (!prevHeight || prevHeight !== currHeight) {
      containerHeightRef.current = currHeight;
      resize();
    }
  });

  const handleNoteClick = e => {
    // stop bubbling up otherwise the note will be closed
    // due to annotation deselection
    e.stopPropagation();

    if (isSelected) {
      core.deselectAnnotation(annotation);
    } else {
      core.deselectAllAnnotations();
      core.selectAnnotation(annotation);
      core.jumpToAnnotation(annotation);
    }
  };

  const noteClass = classNames({
    Note: true,
    expanded: isSelected,
  });

  const repliesClass = classNames({
    replies: true,
    hidden: !isSelected,
  });

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  return (
    <div ref={containerRef} className={noteClass} onMouseDown={handleNoteClick}>
      <NoteContent annotation={annotation} />

      <div className={repliesClass}>
        {replies.map(reply => (
          <NoteContent key={reply.Id} annotation={reply} />
        ))}
        <ReplyArea annotation={annotation} />
      </div>
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;

// a component that contains the reply textarea, the reply button and the cancel button
const ReplyArea = ({ annotation }) => {
  const [
    isReadOnly,
    isReplyDisabled,
    isNoteEditingTriggeredByAnnotationPopup,
  ] = useSelector(
    state => [
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
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


  const postReply = e => {
    // prevent the textarea from blurring out
    e.preventDefault();

    if (value) {
      core.createAnnotationReply(annotation, value);
      setValue('');
    }
  };

  const handleCancelClick = () => {
    setValue('');
    textareaRef.current.blur();
  };

  const replyBtnClass = classNames({
    disabled: !value,
  });

  return isReadOnly || isReplyDisabled || (isNoteEditingTriggeredByAnnotationPopup && isContentEditable) ? null : (
    <div
      className="reply-container"
      // stop bubbling up otherwise the note will be closed
      // due to annotation deselection
      onMouseDown={e => e.stopPropagation()}
    >
      <AutoResizeTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={value}
        onChange={value => setValue(value)}
        onSubmit={e => postReply(e)}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        placeholder={`${t('action.reply')}...`}
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

ReplyArea.propTypes = {
  annotation: PropTypes.object.isRequired,
};
