import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import './FilePickerPanel.scss';

const FilePickerPanel = ({ onFileProcessed }) => {
  const [t] = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const acceptFormats = window.Core.SupportedFileFormats.CLIENT;

  const onClick = () => {
    document.getElementById('file-picker-two').click();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      document.getElementById('file-picker-two').click();
    }
  }

  const onChange = (e) => {
    const files = e.target.files;
    if (files.length) {
      onFileProcessed(files[0]);
    }
  };

  const handleDragEnter = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDragLeave = e => {
    e.preventDefault();

    if (!e.target.parentNode.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragExit = e => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const { files } = e.dataTransfer;

    let processedFile = files[0];

    if (files.length > 1) {
      processedFile = await mergeDocuments(files);
    }

    onFileProcessed(processedFile);
  };

  // recursive function with promise for merging files
  // could maybe live in a helper file
  async function mergeDocuments(sourceArray, nextCount = 1, document = null) {
    return new Promise(async function (resolve, reject) {
      if (!document) {
        document = await core.createDocument(sourceArray[0]);
      }
      const newDocument = await core.createDocument(sourceArray[nextCount]);
      const newDocumentPageCount = newDocument.getPageCount();
      const pages = Array.from({ length: newDocumentPageCount }, (v, k) => k + 1);
      const pageIndexToInsert = document.getPageCount() + 1;

      document.insertPages(newDocument, pages, pageIndexToInsert)
        .then(result => resolve({
          next: sourceArray.length - 1 > nextCount,
          document: document,
        })
        );
    }).then(response => {
      return response.next ?
        mergeDocuments(sourceArray, nextCount + 1, response.document) :
        response.document;
    }).catch(error => {
      setErrorMessage(error)
    });
  }

  return (
    <React.Fragment>
      <div className="image-signature">
        <div
          className="image-signature-upload-container"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          onDragExit={handleDragExit}
        >
          <div className="FilePickerPanel">
            <div className="md-row">
              {t('option.pageReplacementModal.dragAndDrop')}
            </div>
            <div className="md-row label-separator">
              {t('option.pageReplacementModal.or')}
            </div>
            <div
              className="md-row modal-btn-file"
              tabIndex="0"
              onKeyDown={onKeyDown}
              onClick={onClick}>{t('option.pageReplacementModal.chooseFile')}
              <input
                id="file-picker-two"
                style={{ display: 'none' }}
                type="file"
                accept={acceptFormats.map(format => `.${format}`,).join(', ')}
                onChange={onChange}
              />
            </div>
          </div>
          {isDragging && <div className="image-signature-background" />}
          {errorMessage && (
            <div className="image-signature-error">{errorMessage}</div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default FilePickerPanel;