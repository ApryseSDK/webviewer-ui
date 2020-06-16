import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import NoteTextarea from 'components/NoteTextarea';

import core from 'core';
import { HiveAPI } from 'helpers/hiveApi';

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({
  annotation,
  setIsEditing,
  textAreaValue,
  onTextAreaValueChange,
  attachedFiles,
  setAttachedFiles
}) => {
  const contents = annotation.getContents();
  const [t] = useTranslation();
  const textareaRef = useRef();

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

    const value = textAreaValue ? textAreaValue.trim() : '';
    const hasEdited = value !== contents || attachedFiles.length > 0;
    if (hasEdited) {
      setIsEditing(false);

      annotation.attachedFiles = attachedFiles;

      core.setNoteContents(annotation, value);
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([annotation]);
      }

      setAttachedFiles([]);
    }
    delete HiveAPI.isEditingAnnotations[annotation.Id];
  };

  const saveBtnClass = classNames({
    disabled: textAreaValue === contents,
  });

  return (
    <div className="edit-content">
      <NoteTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={textAreaValue}
        onChange={evt => {
          HiveAPI.isEditingAnnotations[annotation.Id] = true;
          onTextAreaValueChange(evt);
        }}
        onSubmit={setContents}
        placeholder={`${t('action.comment')}...`}
        attachedFiles={attachedFiles}
        onUploadFile={file => setAttachedFiles(attachedFiles.concat(file))}
      />
      <span className="buttons">
        <button className={saveBtnClass} onMouseDown={setContents}>
          {t('action.save')}
        </button>
        <button
          onMouseDown={() => {
            setIsEditing(false);
            setAttachedFiles(annotation.attachedFiles || []);
            onTextAreaValueChange(contents);
            delete HiveAPI.isEditingAnnotations[annotation.Id];
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

  attachedFiles: PropTypes.array,
  setAttachedFiles: PropTypes.func,
};

export default ContentArea;
