import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import NoteContent from 'components/NoteContent';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  searchInput: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

const Note = ({ annotation, searchInput, visible }) => {
  const [isNoteExpanded, isNoteEditing, isAnnotationFocused] = useSelector(
    state => [
      selectors.isNoteExpanded(state, annotation.Id),
      selectors.isNoteEditing(state, annotation.Id),
      selectors.isAnnotationFocused(state, annotation.Id),
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const containerRef = useRef();

  // useEffect(() => {
  //   if (isNoteEditing) {
  //     if (core.canModify(annotation) && !annotation.getContents()) {
  //       openRootEditing();
  //     }
  //   } else {
  //     setIsRootContentEditing(false);
  //   }
  // }, [isNoteEditing]);

  useEffect(() => {
    if (isAnnotationFocused) {
      if (containerRef.current.scrollIntoViewIfNeeded) {
        containerRef.current.scrollIntoViewIfNeeded();
      } else {
        containerRef.current.scrollIntoView();
      }
    }
  }, [isAnnotationFocused]);

  const handleNoteClick = e => {
    e.stopPropagation();

    if (isNoteExpanded) {
      core.deselectAnnotation(annotation);
    } else {
      core.deselectAllAnnotations();
      core.selectAnnotation(annotation);
      core.jumpToAnnotation(annotation);
    }
  };

  const noteClass = classNames({
    Note: true,
    expanded: isNoteExpanded,
    hidden: !visible,
  });

  const repliesClass = classNames({
    replies: true,
    hidden: !isNoteExpanded,
  });

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  return (
    <div ref={containerRef} className={noteClass} onClick={handleNoteClick}>
      <NoteContent
        annotation={annotation}
        searchInput={searchInput}
        isNoteExpanded={isNoteExpanded}
      />

      <div className={repliesClass}>
        {replies.map(reply => (
          <NoteContent
            key={reply.Id}
            annotation={reply}
            searchInput={searchInput}
            isNoteExpanded={isNoteExpanded}
          />
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
  const [isReadOnly, isReplyDisabled] = useSelector(
    state => [
      selectors.isDocumentReadOnly(state),
      selectors.isElementDisabled(state, 'noteReply'),
    ],
    shallowEqual,
  );
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [t] = useTranslation();
  const textareaRef = useRef();
  const TEXTAREA_HEIGHT = '30px';

  const handleInputChange = e => {
    setValue(e.target.value);

    // for auto-resize the height of the textarea
    // https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
    // 1. make the height small enough so that we know the scroll bar height
    // 2. make the height a bit bigger than the scroll bar height to finish resizing
    e.target.style.height = TEXTAREA_HEIGHT;
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  const handleKeyDown = e => {
    // (Cmd/Ctrl + Enter)
    if ((e.metaKey || e.ctrlKey) && e.which === 13) {
      postReply(e);
    }
  };

  const postReply = e => {
    e.stopPropagation();

    if (value) {
      core.createAnnotationReply(annotation, textareaRef.current.value);
      clearReply();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleCancelClick = () => {
    clearReply();
    textareaRef.current.blur();
  };

  const clearReply = () => {
    setValue('');
    textareaRef.current.style.height = TEXTAREA_HEIGHT;
  };

  const replyBtnClass = classNames({
    disabled: !value,
  });

  return isReadOnly || isReplyDisabled ? null : (
    <div className="reply-container" onClick={e => e.stopPropagation()}>
      <textarea
        ref={textareaRef}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={value}
        placeholder={`${t('action.reply')}...`}
      />
      {isFocused && (
        <div className="buttons" onMouseDown={e => e.preventDefault()}>
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
