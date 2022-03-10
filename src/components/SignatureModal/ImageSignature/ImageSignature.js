import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import core from 'core';

import './ImageSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  isTabPanelSelected: PropTypes.bool,
  createSignature: PropTypes.func.isRequired,
};

const acceptedFileTypes = ['png', 'jpg', 'jpeg'];
let fileSize = null;
let acceptedFileSize = null;
const ImageSignature = ({
  isModalOpen,
  isTabPanelSelected,
  createSignature,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef();
  const [t] = useTranslation();
  
  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    acceptedFileSize = signatureTool['ACCEPTED_FILE_SIZE'];
    if (!isModalOpen) {
      setImageSrc(null);
    } else if (isModalOpen && isTabPanelSelected) {
      signatureTool.setSignature(imageSrc, fileSize);
    }
  }, [imageSrc, isTabPanelSelected, isModalOpen]);

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
    fileSize = file.size;

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

  const hasLimit = typeof acceptedFileSize === 'number' && acceptedFileSize > 0 && fileSize > 0;
  const fileSizeCheck = !hasLimit ||  fileSize < acceptedFileSize;

  let isMobileDevice = false;
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobileDevice = true;
  }
  let containerClass = isMobileDevice ? "image-signature-upload-container mobile" : "image-signature-upload-container";
  containerClass = isDragging ? "image-signature-upload-container dragging" : "image-signature-upload-container";
  return (
    <React.Fragment>
      <div className="image-signature">
        {imageSrc && fileSizeCheck ? (
          <div className="image-signature-image-container">
            <img src={imageSrc} />
          </div>
        ) : (
        <>
          <div 
            className="image-signature-overlay"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleFileDrop}
            onDragExit={handleDragExit}
          />
          { isDragging &&
            <div 
              className="image-signature-modal-overlay"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleFileDrop}
              onDragExit={handleDragExit}
            /> }
          <div
            className={containerClass}
          >
            {!isMobileDevice && 
            <div className="image-signature-dnd">
              {t('option.signatureModal.dragAndDrop')}
            </div>} 
            {!isMobileDevice && 
            <div className="image-signature-separator">
              {t('option.signatureModal.or')}
            </div>}
            {isMobileDevice && 
            <div className="image-signature-separator">
              {t('option.signatureModal.selectImage')}
            </div>}
            <div className="image-signature-upload">
              <input
                ref={fileInputRef}
                id="upload"
                type="file"
                accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
                onChange={handleFileChange}
                disabled={!(isModalOpen && isTabPanelSelected)}
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="pick-image-button"
              >
                {t('option.signatureModal.pickImage')}
              </div>
            </div>
            {errorMessage && (
              <div className="image-signature-error">{errorMessage}</div>
            )}
          </div>
        </>
        )}
      </div>
      <div
        className="footer"
      >
        <button className="signature-create" onClick={createSignature} disabled={!(isModalOpen && isTabPanelSelected) || imageSrc === null || !fileSizeCheck}>
          {t('action.create')}
        </button>
      </div>
    </React.Fragment>
  );
};

ImageSignature.propTypes = propTypes;

export default ImageSignature;
