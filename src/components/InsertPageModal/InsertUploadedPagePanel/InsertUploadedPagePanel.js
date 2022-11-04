import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
/* eslint-disable-next-line no-unused-vars */
import core from 'core';
import classNames from 'classnames';

import './InsertUploadedPagePanel.scss';

const InsertUploadedPagePanel = () => {
  const [t] = useTranslation();
  /* eslint-disable-next-line no-unused-vars */
  const [isDragging, setIsDragging] = useState(false);
  /* eslint-disable-next-line no-unused-vars */
  const [errorMessage, setErrorMessage] = useState('');
  const acceptFormats = window.Core.SupportedFileFormats.CLIENT;

  const onClick = () => {
    // document.getElementById(fileInputId).click();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      // document.getElementById(fileInputId).click();
    }
  };

  const onChange = (e) => {
    const files = e.target.files;
    if (files.length) {
      // onFileProcessed(files[0]);
    }
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
  };

  const uploadBoxClass = classNames('upload-box', { dragging: isDragging });

  return (
    <div className="insert-uploaded-page-panel">
      <div className="panel-container">
        <div
          className={uploadBoxClass}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          onDragExit={handleDragExit}
        >
          <div className="file-picker-section">
            <div className="file-picker-text">{t('option.pageReplacementModal.dragAndDrop')}</div>
            <div className="file-picker-text label-separator">{t('option.pageReplacementModal.or')}</div>
            <div className="file-picker-modal-btn-file" tabIndex="0" onKeyDown={onKeyDown} onClick={onClick}>
              {t('insertPageModal.browse')}
              <input
                style={{ display: 'none' }}
                type="file"
                accept={acceptFormats.map((format) => `.${format}`).join(', ')}
                onChange={(event) => {
                  onChange(event);
                  event.target.value = null;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertUploadedPagePanel;
