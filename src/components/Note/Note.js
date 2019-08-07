import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import AutoResizeTextarea from 'components/AutoResizeTextarea';
import NoteContent from 'components/NoteContent';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  searchInput: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

const Note = ({ annotation, searchInput, visible, isSelected }) => {
  // const [isNoteEditing] = useSelector(
  //   state => [
  //     selectors.isNoteEditing(state, annotation.Id),
  //   ],
  //   shallowEqual,
  // );
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
    if (isSelected) {
      if (containerRef.current.scrollIntoViewIfNeeded) {
        containerRef.current.scrollIntoViewIfNeeded();
      } else {
        containerRef.current.scrollIntoView();
      }
    }
  }, [isSelected]);

  const handleNoteClick = e => {
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
    hidden: !visible,
  });

  const repliesClass = classNames({
    replies: true,
    hidden: !isSelected,
  });

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  return (
    <div ref={containerRef} className={noteClass} onClick={handleNoteClick}>
      <NoteContent
        annotation={annotation}
        searchInput={searchInput}
        isSelected={isSelected}
      />

      <div className={repliesClass}>
        {replies.map(reply => (
          <NoteContent
            key={reply.Id}
            annotation={reply}
            searchInput={searchInput}
            isSelected={isSelected}
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

  const postReply = e => {
    e.stopPropagation();

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

  return isReadOnly || isReplyDisabled ? null : (
    <div className="reply-container" onClick={e => e.stopPropagation()}>
      <AutoResizeTextarea
        ref={textareaRef}
        value={value}
        onChange={value => setValue(value)}
        onSubmit={e => postReply(e)}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
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
