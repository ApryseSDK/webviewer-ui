import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import core from 'core';
import AtMentionsReplyBox from '../../AtMentionsReplyBox/AtMentionsReplyBox';

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
    if (!textareaRef.current) return;
    textareaRef.current.setText(contents || '')
  }, [contents]);

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const setContents = e => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    const trimmedValue = textAreaValue.trim();
    const hasEdited = trimmedValue !== contents || attachedFiles.length > 0;
    if (hasEdited) {
      textareaRef.current.handleMentions();
      annotation.attachedFiles = attachedFiles;
      core.setNoteContents(annotation, trimmedValue);
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([annotation]);
      }

      setIsEditing(false);
      setAttachedFiles([]);
    }
  };
  const saveBtnClass = classNames({
    disabled: textAreaValue === contents,
  });

  return (
    <div className="edit-content">
      <AtMentionsReplyBox
        ref={el => {
          textareaRef.current = el;
        }}
        onChange={onTextAreaValueChange}
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
