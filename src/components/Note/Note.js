import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';

import NoteRoot from 'components/NoteRoot';
import NoteReply from 'components/NoteReply';
import NoteContext from 'components/Note/Context';

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
  const [isRootContentEditing, setIsRootContentEditing] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    if (isNoteEditing) {
      if (core.canModify(annotation) && !annotation.getContents()) {
        openRootEditing();
      }
    } else {
      setIsRootContentEditing(false);
    }
  }, [isNoteEditing]);

  useEffect(() => {
    if (isAnnotationFocused) {
      if (containerRef.current.scrollIntoViewIfNeeded) {
        containerRef.current.scrollIntoViewIfNeeded();
      } else {
        containerRef.current.scrollIntoView();
      }
    }
  }, [isAnnotationFocused]);

  const openRootEditing = () => {
    setIsRootContentEditing(true);
  };

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

  const closeRootEditing = () => {
    setIsRootContentEditing(false);
    dispatch(actions.setIsNoteEditing(false));
  };

  const renderAuthorName = annotation => {
    const name = core.getDisplayAuthor(annotation);

    if (!name) {
      return '(no name)';
    }

    return <span dangerouslySetInnerHTML={{ __html: getText(name) }} />;
  };

  const renderContents = contents => {
    if (!contents) {
      return null;
    }

    let text;
    const isContentsLinkable = Autolinker.link(contents).indexOf('<a') !== -1;
    if (isContentsLinkable) {
      const linkedContent = Autolinker.link(contents, { stripPrefix: false });
      // if searchInput is 't', replace <a ...>text</a> with
      // <a ...><span class="highlight">t</span>ext</a>
      text = linkedContent.replace(/>(.+)</i, (_, p1) => `>${getText(p1)}<`);
    } else {
      text = getText(contents);
    }

    return (
      <span className="contents" dangerouslySetInnerHTML={{ __html: text }} />
    );
  };

  const getText = text => {
    if (searchInput.trim()) {
      return text.replace(
        new RegExp(`(${searchInput})`, 'gi'),
        '<span class="highlight">$1</span>',
      );
    }

    return text;
  };

  const noteClass = classNames({
    Note: true,
    expanded: isNoteExpanded,
    hidden: !visible,
  });

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  return (
    <div ref={containerRef} className={noteClass} onClick={handleNoteClick}>
      <NoteRoot
        annotation={annotation}
        contents={annotation.getContents()}
        searchInput={searchInput}
        renderAuthorName={renderAuthorName}
        renderContents={renderContents}
        isNoteExpanded={isNoteExpanded}
        isEditing={isRootContentEditing}
        openEditing={openRootEditing}
        closeEditing={closeRootEditing}
        numberOfReplies={replies.length}
      />

      <div className={`replies ${isNoteExpanded ? 'visible' : 'hidden'}`}>
        {replies.map(reply => (
          <NoteReply
            key={reply.Id}
            reply={reply}
            searchInput={searchInput}
            renderAuthorName={renderAuthorName}
            renderContents={renderContents}
          />
        ))}
        <ReplyArea
          annotation={annotation}
          isNoteEditing={isNoteEditing}
          isRootContentEditing={isRootContentEditing}
          dispatch={dispatch}
        />
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
  const replyTextareaRef = useRef();
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
      core.createAnnotationReply(annotation, replyTextareaRef.current.value);
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
    replyTextareaRef.current.blur();
  };

  const clearReply = () => {
    setValue('');
    replyTextareaRef.current.style.height = TEXTAREA_HEIGHT;
  };

  const replyBtnClass = classNames({
    disabled: !value,
  });

  return isReadOnly || isReplyDisabled ? null : (
    <div className="reply-container" onClick={e => e.stopPropagation()}>
      <textarea
        ref={replyTextareaRef}
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
