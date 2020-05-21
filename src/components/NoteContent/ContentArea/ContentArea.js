import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import NoteTextarea from 'components/NoteTextarea';

import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import selectors from 'selectors';

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({ annotation, setIsEditing, textAreaValue, onTextAreaValueChange }) => {
  const [isMentionEnabled] = useSelector(state => [
    selectors.getIsMentionEnabled(state),
  ]);
  const [t] = useTranslation();
  const textareaRef = useRef();
  const contents = annotation.getCustomData('trn-mention')?.contents || annotation.getContents();

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();

      const textLength = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(textLength, textLength);
    }
  }, []);

  const setContents = e => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    const hasEdited = textAreaValue !== contents;
    if (!hasEdited) {
      return;
    }

    setIsEditing(false);

    if (isMentionEnabled) {
      const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(textAreaValue);

      annotation.setCustomData('trn-mention', {
        contents: textAreaValue,
        ids,
      });
      core.setNoteContents(annotation, plainTextValue);
    } else {
      core.setNoteContents(annotation, textAreaValue);
    }

    if (annotation instanceof window.Annotations.FreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }
  };

  return (
    <div className="edit-content">
      <NoteTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={textAreaValue}
        onChange={onTextAreaValueChange}
        onBlur={() => setIsEditing(false)}
        onSubmit={setContents}
        placeholder={`${t('action.comment')}...`}
      />
      <span className="buttons">
        <button
          className={classNames({
            disabled: textAreaValue === contents,
          })}
          onMouseDown={setContents}
        >
          {t('action.save')}
        </button>
        <button
          onMouseDown={() => {
            setIsEditing(false);
            onTextAreaValueChange(contents);
          }}
        >
          {t('action.cancel')}
        </button>
      </span>
    </div>
  );
};

ContentArea.propTypes = {
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
};

export default ContentArea;
