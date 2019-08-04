import React, {
  useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';

import './ImageSignature.scss';

const propTypes = {
  setSaveSignature: PropTypes.func.isRequired,
};

const ImageSignature = ({ setSaveSignature }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const signatureTool = core.getTool('AnnotationCreateSignature');

  useEffect(() => {
    setSaveSignature(!!imageSrc);
  }, [imageSrc]);

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

      if (imageSrc.indexOf('image/png') !== -1) {
        setImageSrc(imageSrc);
        signatureTool.setSignature(imageSrc);
      }
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <div className="image-signature">
      {imageSrc ? (
        <img src={imageSrc} style={{ width: '100%', height: '100%' }} />
      ) : (
        <>
          <div className="image-signature-upload-container" onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleFileDrop} onDragExit={handleDragExit}>
            <div className="image-signature-dnd">Drag & Drop your image here</div>
            <div className="image-signature-separator">or</div>
            <div className="image-signature-upload">
              <input id="upload" type="file" accept=".png" onChange={handleFileChange} />
              <label htmlFor="upload">Upload Signature Image</label>
            </div>
          </div>
          {isDragging
            && <div className="image-signature-background" />
          }
        </>
      )}
    </div>
  );
};

ImageSignature.propTypes = propTypes;

export default ImageSignature;
