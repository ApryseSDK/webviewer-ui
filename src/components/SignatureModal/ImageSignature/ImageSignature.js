import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'helpers/device';
import classNames from 'classnames';
import i18next from 'i18next';
import core from 'core';

import './ImageSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  isTabPanelSelected: PropTypes.bool,
  disableCreateButton: PropTypes.func,
  enableCreateButton: PropTypes.func,
  isInitialsModeEnabled: PropTypes.bool,
};

const signatureType = {
  FULL_SIGNATURE: 'fullSignature',
  INITIALS: 'initials',
};
const acceptedFileTypes = ['png', 'jpg', 'jpeg'];
let acceptedFileSize = null;

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const imageSource = event.target.result;
      const isValidType = acceptedFileTypes.some(
        (type) => imageSource.indexOf(`image/${type}`) !== -1,
      );

      if (isValidType) {
        resolve({
          imageSource,
          fileSize: file.size,
        });
      } else {
        reject(i18next.t('message.imageSignatureAcceptedFileTypes', {
          acceptedFileTypes: acceptedFileTypes.join(', '),
        }));
      }
    };

    fileReader.readAsDataURL(file);
  });
}


const ImageSignature = ({
  isModalOpen,
  isTabPanelSelected,
  disableCreateButton,
  enableCreateButton,
  isInitialsModeEnabled = false,
}) => {
  const [fullSignatureImage, setFullSignatureImage] = useState(null);
  const [fullSignatureFileSize, setFullSignatureFileSize] = useState(null);
  const [initialsImage, setInitialsImage] = useState(null);
  const [initialsFileSize, setInitialsFileSize] = useState(null);
  const [draggingSignatureType, setDraggingSignatureType] = useState('');
  const [fullSignatureErrorMessage, setFullSignatureErrorMessage] = useState(null);
  const [initialsErrorMessage, setInitialsErrorMessage] = useState(null);
  const fullSignatureInputRef = useRef();
  const initialsInputRef = useRef();
  const [t] = useTranslation();

  useEffect(() => {
    const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
    acceptedFileSize = signatureToolArray[0]['ACCEPTED_FILE_SIZE'];
    if (!isModalOpen) {
      setFullSignatureImage(null);
      setInitialsImage(null);
      setInitialsFileSize(null);
      setInitialsFileSize(null);
    } else if (isModalOpen && isTabPanelSelected) {
      signatureToolArray.forEach((signatureTool) => signatureTool.setSignature(fullSignatureImage, fullSignatureFileSize));
      signatureToolArray.forEach((signatureTool) => signatureTool.setInitials(initialsImage, initialsFileSize));
      (fullSignatureImage && (!isInitialsModeEnabled || initialsImage)) ? enableCreateButton() : disableCreateButton();
    }
  }, [fullSignatureImage, initialsImage, isTabPanelSelected, isModalOpen, initialsFileSize, fullSignatureFileSize, isInitialsModeEnabled]);

  const handleFullSignatureFileChange = (event) => {
    readFullSignatureFile(event.target.files[0]);
  };

  const handleInitialsFileChange = (event) => {
    readInitialsFile(event.target.files[0]);
  };

  const handleDragEnter = useCallback((event, signatureType) => {
    event.preventDefault();
    setDraggingSignatureType(signatureType);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();

    if (!event.target.parentNode.contains(event.relatedTarget)) {
      setDraggingSignatureType(null);
    }
  }, []);

  const handleDragExit = useCallback((event) => {
    event.preventDefault();
    setDraggingSignatureType(null);
  }, []);

  const handleFullSignatureFileDrop = (event) => {
    event.preventDefault();
    setDraggingSignatureType(null);
    const { files } = event.dataTransfer;

    if (files.length) {
      readFullSignatureFile(files[0]);
    }
  };

  const readFullSignatureFile = async (file) => {
    try {
      const result = await readImageFile(file);
      const { imageSource, fileSize } = result;
      setFullSignatureErrorMessage('');
      setFullSignatureImage(imageSource);
      setFullSignatureFileSize(fileSize);
    } catch (errorMessage) {
      setFullSignatureErrorMessage(errorMessage);
    }
  };

  const handleInitialsFileDrop = (event) => {
    event.preventDefault();
    setDraggingSignatureType(null);
    const { files } = event.dataTransfer;

    if (files.length) {
      readInitialsFile(files[0]);
    }
  };

  const readInitialsFile = async (file) => {
    try {
      const result = await readImageFile(file);
      const { imageSource, fileSize } = result;
      setInitialsErrorMessage('');
      setInitialsImage(imageSource);
      setInitialsFileSize(fileSize);
    } catch (errorMessage) {
      setInitialsErrorMessage(errorMessage);
    }
  };

  const handleFullSignatureDragEnter = useCallback((event) => {
    handleDragEnter(event, signatureType.FULL_SIGNATURE);
  }, [handleDragEnter]);

  const handleFullSignatureDragLeave = useCallback((event) => {
    handleDragLeave(event, signatureType.FULL_SIGNATURE);
  }, [handleDragLeave]);


  const handleInitialsDragEnter = useCallback((event) => {
    handleDragEnter(event, signatureType.INITIALS);
  }, [handleDragEnter]);

  const handleInitialsDragLeave = useCallback((event) => {
    handleDragLeave(event, signatureType.INITIALS);
  }, [handleDragLeave]);

  const renderPrompt = () => {
    if (isMobile()) {
      return (
        <div className="image-signature-separator">
          {t('option.signatureModal.selectImage')}
        </div>
      );
    }
    return (
      <>
        <div className="image-signature-dnd">
          {t('option.signatureModal.dragAndDrop')}
        </div>
        <div className="image-signature-separator">
          {t('option.signatureModal.or')}
        </div>
      </>
    );
  };

  const renderFullSignatureImage = () => (<img src={fullSignatureImage} style={{ maxWidth: '100%', maxHeight: '100%' }} />);

  const renderFullSignaturePicker = () => (
    <div
      className={fullSignatureContainerClass}
      onDragEnter={handleFullSignatureDragEnter}
      onDragLeave={handleFullSignatureDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleFullSignatureFileDrop}
      onDragExit={handleDragExit}
    >
      {renderPrompt()}
      <div className="image-signature-upload">
        <input
          ref={fullSignatureInputRef}
          id="upload"
          type="file"
          accept={acceptedFileTypes.map((type) => `.${type}`).join(',')}
          onChange={handleFullSignatureFileChange}
          disabled={!(isModalOpen && isTabPanelSelected)}
        />
        <div
          onClick={() => fullSignatureInputRef.current.click()}
          className="pick-image-button"
        >
          {t('option.signatureModal.pickImage')}
        </div>
      </div>
      {fullSignatureErrorMessage && (
        <div className="image-signature-error">{fullSignatureErrorMessage}</div>
      )}
    </div>
  );

  const renderInitialsImage = () => (<img src={initialsImage} style={{ maxWidth: '100%', maxHeight: '100%' }} />);

  const renderInitialsPicker = () => (
    <div
      className={initialsContainerClass}
      onDragEnter={handleInitialsDragEnter}
      onDragLeave={handleInitialsDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleInitialsFileDrop}
      onDragExit={handleDragExit}
    >
      {renderPrompt()}
      <div className="image-signature-upload">
        <input
          ref={initialsInputRef}
          id="upload"
          type="file"
          accept={acceptedFileTypes.map((type) => `.${type}`).join(',')}
          onChange={handleInitialsFileChange}
          disabled={!(isModalOpen && isTabPanelSelected)}
        />
        <div
          onClick={() => initialsInputRef.current.click()}
          className="pick-image-button"
        >
          {t('option.signatureModal.pickInitialsFile')}
        </div>
      </div>
      {initialsErrorMessage && (
        <div className="image-signature-error">{initialsErrorMessage}</div>
      )}
    </div>
  );

  const hasLimit = typeof acceptedFileSize === 'number' && acceptedFileSize > 0;
  const fullSignatureFileSizeCheck = !hasLimit || fullSignatureFileSize < acceptedFileSize;
  const initialsFileSizeCheck = !hasLimit || initialsFileSize < acceptedFileSize;
  const fullSignatureContainerClass = classNames('image-signature-upload-container', { mobile: isMobile(), dragging: draggingSignatureType === signatureType.FULL_SIGNATURE });
  const initialsContainerClass = classNames('image-signature-upload-container', { mobile: isMobile(), dragging: draggingSignatureType === signatureType.INITIALS });
  const initialsInputStyle = isInitialsModeEnabled ? {} : { display: 'none' };
  return (
    <div className="image-signature">
      <div className="signature-and-initials-container">
        <div className="signature-input image full-signature">
          {fullSignatureImage && fullSignatureFileSizeCheck ?
            renderFullSignatureImage() :
            renderFullSignaturePicker()
          }
        </div>
        <div className="signature-input image initials" style={initialsInputStyle}>
          {initialsImage && initialsFileSizeCheck ?
            renderInitialsImage() :
            renderInitialsPicker()}
        </div>
      </div>
    </div>
  );
};

ImageSignature.propTypes = propTypes;

export default ImageSignature;
