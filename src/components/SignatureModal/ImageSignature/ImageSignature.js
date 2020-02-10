import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import core from 'core';
import ActionButton from 'components/ActionButton';

import './ImageSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  _setSaveSignature: PropTypes.func.isRequired,
  isTabPanelSelected: PropTypes.bool,
};

const acceptedFileTypes = ['png', 'jpg', 'jpeg'];

const ImageSignature = ({
  isModalOpen,
  _setSaveSignature,
  isTabPanelSelected,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef();
  const [t] = useTranslation();

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    if (isModalOpen && isTabPanelSelected) {
      // _setSaveSignature(!!imageSrc);
      signatureTool.setSignature(imageSrc);
    }
  }, [imageSrc, isTabPanelSelected, _setSaveSignature, isModalOpen]);

  const handleFileChange = e => {
    readFile(e.target.files[0]);
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

  const handleFileDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const { files } = e.dataTransfer;

    if (files.length) {
      readFile(files[0]);
    }
  };

  const readFile = file => {
    const fileReader = new FileReader();

    fileReader.onload = e => {
      const imageSrc = e.target.result;
      const validType = acceptedFileTypes.some(
        type => imageSrc.indexOf(`image/${type}`) !== -1,
      );

      if (validType) {
        setErrorMessage('');
        setImageSrc(imageSrc);
      } else {
        setErrorMessage(
          t('message.imageSignatureAcceptedFileTypes', {
            acceptedFileTypes: acceptedFileTypes.join(', '),
          }),
        );
      }
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <div className="image-signature">
      {imageSrc ? (
        <div className="image-signature-image-container">
          <img src={imageSrc} />
          <ActionButton
            dataElement="imageSignatureDeleteButton"
            img="ic_delete_black_24px"
            onClick={() => setImageSrc(null)}
          />
        </div>
      ) : (
        <div
          className="image-signature-upload-container"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          onDragExit={handleDragExit}
        >
          <div className="image-signature-upload">
            <input
              ref={fileInputRef}
              id="upload"
              type="file"
              accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
              onChange={handleFileChange}
            />
            <div 
              onClick={() => fileInputRef.current.click()}
              className="pick-image-button"
            >
              {t('option.signatureModal.pickImage')}
            </div>
          </div>
          {isDragging && <div className="image-signature-background" />}
          {errorMessage && (
            <div className="image-signature-error">{errorMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

ImageSignature.propTypes = propTypes;

export default ImageSignature;
