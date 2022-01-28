import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './FilePickerPanel.scss';

const FilePickerPanel = ({defaultValue, onFileSelect}) => {
  const [t] = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const acceptFormats =  window.Core.SupportedFileFormats.CLIENT;

  const onClick = () => {
    document.getElementById('file-picker-two').click();
  };

  const onChange = (e) => {
    const files = e.target.files;
    if (files.length) {
      readFile(files[0]);
      onFileSelect(files[0]);
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

  const handleFileDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const { files } = e.dataTransfer;

    if (files.length <= 1) {
      readFile(files[0]);
    } else {
      mergeDocuments(files).then(mergedPdf => {
        processDocument(mergedPdf)
        onFileSelect(mergedPdf);
      });
    }
  };

  function processDocument(doc) {
    const promise = new Promise((resolve) => {
      // Load page canvas
      const pageNumber = 1;
      return doc.requirePage(pageNumber).then(() => {
        return doc.loadCanvasAsync({
          pageNumber,
          drawComplete: (canvas, index) => {
            resolve(canvas.toDataURL());
          },
          'isInternalRender': true,
        });
      });
    });
    promise.then((imageSrc) => {
      setImageSrc(imageSrc);
    });
    promise.catch((error) => {
      setErrorMessage(error);
    })
  };

  const readFile = fileData => {
    setFile(fileData);
    const options = { l: window.sampleL /* license key here */ };

    window.Core.createDocument(fileData, options).then((doc) => {
      processDocument(doc)
    }).catch((error) => {
      setErrorMessage(error);
    });

    onFileSelect(fileData);
  };

  useEffect(() => {
    if (!defaultValue && defaultValue !== file) {
      setFile(defaultValue);
      setImageSrc(defaultValue);
    }
  });

  return (
    <React.Fragment>
      <div className="image-signature">
        {imageSrc ? (
          <div className="image-signature-image-container">
            <img src={imageSrc} />
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
            <div className="FilePickerPanel">
              <div className="md-row">
                  {t('option.pageReplacementModal.dragAndDrop')}
              </div>
              <div className="md-row label-separator">
                  {t('option.pageReplacementModal.or')}
              </div>
              <div
                className="md-row modal-btn-file"
                onClick={onClick}>{t('option.pageReplacementModal.chooseFile')}
                <input
                  id="file-picker-two"
                  style={{display: 'none'}}
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
        )}
      </div>
    </React.Fragment>
  );
};

// recursive function with promise for merging files
async function mergeDocuments(sourceArray, nextCount = 1, doc = null) {
  return new Promise(async function(resolve, reject) {
    if (!doc) {
      doc = await window.CoreControls.createDocument(sourceArray[0]);
    }
    const newDoc = await window.CoreControls.createDocument(sourceArray[nextCount]);
    const newDocPageCount = newDoc.getPageCount();

    // create an array containing 1…N
    const pages = Array.from({ length: newDocPageCount }, (v, k) => k + 1);
    const pageIndexToInsert = doc.getPageCount() + 1;
    // in this example doc.getPageCount() returns 3

    doc.insertPages(newDoc, pages, pageIndexToInsert)
      .then(result => resolve({
        next: sourceArray.length - 1 > nextCount,
        doc: doc,
      })
    );
    // end Promise
  }).then(res => {
    return res.next ?
      mergeDocuments(sourceArray, nextCount + 1, res.doc) :
      res.doc;
  });
}

export default FilePickerPanel;