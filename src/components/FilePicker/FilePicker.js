import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import classNames from 'classnames';
import { isMobile } from 'helpers/device';

import './FilePicker.scss';

const FilePicker = ({
  onChange = () => { },
  onDrop = () => { },
  shouldShowIcon = false,
  acceptFormats,
  allowMultiple = false,
  errorMessage = ''
}) => {
  const [t] = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const onClick = () => {
    fileInputRef?.current?.click();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    files.length > 0 && onChange(Array.from(files));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();

    if (!e.target.parentNode.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragExit = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const { files } = e.dataTransfer;
    files.length > 0 && onDrop(Array.from(files));
  };

  const renderPrompt = () => {
    if (isMobile()) {
      return (
        <div className="file-picker-separator">
          {t('filePicker.selectFile')}
        </div>
      );
    }
    return (
      <>
        <div>
          {t('filePicker.dragAndDrop')}
        </div>
        <div className="file-picker-separator">
          {t('filePicker.or')}
        </div>
      </>
    );
  };

  return (
    <div className="file-picker-component">
      <div
        className={classNames('file-picker-container', { dragging: isDragging })}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
        onDragExit={handleDragExit}
      >
        <div className="file-picker-body">
          {shouldShowIcon && <Icon glyph="icon-open-folder" />}
          {renderPrompt()}
          <div
            className="md-row modal-btn-file"
            tabIndex="0"
            onKeyDown={onKeyDown}
            onClick={onClick}
          >{t('action.browse')}
            <input
              ref={fileInputRef}
              multiple={allowMultiple}
              style={{ display: 'none' }}
              type="file"
              accept={acceptFormats}
              onChange={(event) => {
                handleChange(event);
                event.target.value = null;
              }}
            />
          </div>
        </div>
        {errorMessage && (
          <div className="file-picker-error">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default FilePicker;
