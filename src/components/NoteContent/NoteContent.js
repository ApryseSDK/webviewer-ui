import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';

import NotePopup from 'components/NotePopup';
import Icon from 'components/Icon';

import core from 'core';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import selectors from 'selectors';

import './NoteContent.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  isNoteExpanded: PropTypes.bool.isRequired,
  searchInput: PropTypes.string,
};

const NoteContent = ({ isNoteExpanded, annotation, searchInput }) => {
  const [sortStrategy, noteDateFormat, iconColor] = useSelector(
    state => [
      selectors.getSortStrategy(state),
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
    ],
    shallowEqual,
  );
  const [isEditing, setIsEditing] = useState(false);
  const isReply = annotation.isReply();

  const renderAuthorName = annotation => {
    const name = core.getDisplayAuthor(annotation);

    if (!name) {
      return '(no name)';
    }

    return <span dangerouslySetInnerHTML={{ __html: getText(name) }} />;
  };

  const renderContents = () => {
    const contents = annotation.getContents();

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

  const handleNoteContentsClick = e => {
    // we stop propagation when we are editing the contents to
    // prevent note components from receiving this event and collapsing the note
    if (isEditing) {
      e.stopPropagation();
    }
  };

  let header;
  if (isReply) {
    header = (
      <div className="title">
        {renderAuthorName(annotation)}
        <span className="spacer" />
        <span className="time">
          {` ${dayjs(annotation.DateCreated).format(noteDateFormat)}`}
        </span>
        {isNoteExpanded && (
          <NotePopup annotation={annotation} setIsEditing={setIsEditing} />
        )}
      </div>
    );
  } else {
    const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
    const color = annotation[iconColor]?.toHexString();
    const numberOfReplies = annotation.getReplies().length;

    header = (
      <div className="title">
        <div className="type">
          {icon ? (
            <Icon className="icon" glyph={icon} color={color} />
          ) : (
            annotation.Subject
          )}
        </div>
        {renderAuthorName(annotation)}
        {(sortStrategy !== 'time' || isNoteExpanded || numberOfReplies > 0) && (
          <span className="spacer" />
        )}
        <div className="time">
          {(sortStrategy !== 'time' || isNoteExpanded) &&
            dayjs(annotation.DateCreated || new Date()).format(noteDateFormat)}
          {numberOfReplies > 0 && ` (${numberOfReplies})`}
        </div>
        {isNoteExpanded && (
          <NotePopup annotation={annotation} setIsEditing={setIsEditing} />
        )}
      </div>
    );
  }

  return (
    <div className="NoteContent">
      {header}
      <div className="content-container" onClick={handleNoteContentsClick}>
        {isEditing ? (
          <ContentArea annotation={annotation} setIsEditing={setIsEditing} />
        ) : (
          <div className="container">{renderContents()}</div>
        )}
      </div>
    </div>
  );
};

NoteContent.propTypes = propTypes;

export default NoteContent;

const ContentArea = ({ annotation, setIsEditing }) => {
  const contents = annotation.getContents();
  const [value, setValue] = useState(contents);
  const [t] = useTranslation();
  const textareaRef = useRef();
  const TEXTAREA_HEIGHT = '30px';

  useEffect(() => {
    if (textareaRef.current) {
      // TODO: duplicate
      textareaRef.current.style.height = TEXTAREA_HEIGHT;
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight +
        2}px`;
      textareaRef.current.focus();
    }
  }, []);

  // TODO: duplicate
  const handleInputChange = e => {
    setValue(e.target.value);

    // for auto-resize the height of the textarea
    // https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
    // 1. make the height small enough so that we know the scroll bar height
    // 2. make the height a bit bigger than the scroll bar height to finish resizing
    e.target.style.height = TEXTAREA_HEIGHT;
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  // TODO: duplicate
  const handleKeyDown = e => {
    // (Cmd/Ctrl + Enter)
    if ((e.metaKey || e.ctrlKey) && e.which === 13) {
      setContents(e);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const setContents = e => {
    e.preventDefault();

    if (value) {
      core.setNoteContents(annotation, value);
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([annotation]);
      }

      setIsEditing(false);
    }
  };

  const saveBtnClass = classNames({
    disabled: !value,
  });

  return (
    <div className="edit-content">
      <textarea
        ref={textareaRef}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        value={value}
        placeholder={`${t('action.comment')}...`}
      />
      <span className="buttons">
        <button className={saveBtnClass} onMouseDown={setContents}>
          {t('action.save')}
        </button>
        <button onMouseDown={() => setIsEditing(false)}>
          {t('action.cancel')}
        </button>
      </span>
    </div>
  );
};
