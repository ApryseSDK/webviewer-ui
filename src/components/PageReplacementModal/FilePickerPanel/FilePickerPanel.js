import React, { useState, useEffect } from 'react';
import core from 'core';
import FilePicker from 'components/FilePicker';

const FilePickerPanel = ({ onFileProcessed, shouldShowIcon }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptFormats, setAcceptFormats] = useState('');

  useEffect(() => {
    setAcceptFormats(core.getAllowedFileExtensions());
  }, []);

  const onChange = (files) => {
    onFileProcessed(files[0]);
  };

  const onDrop = async (files) => {
    let processedFile = files[0];

    if (files.length > 1) {
      processedFile = await mergeDocuments(files);
    }

    onFileProcessed(processedFile);
  };

  // recursive function with promise for merging files
  // could maybe live in a helper file
  async function mergeDocuments(sourceArray, nextCount = 1, document = null) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (!document) {
        document = await core.createDocument(sourceArray[0]);
      }
      const newDocument = await core.createDocument(sourceArray[nextCount]);
      const newDocumentPageCount = newDocument.getPageCount();
      const pages = Array.from({ length: newDocumentPageCount }, (v, k) => k + 1);
      const pageIndexToInsert = document.getPageCount() + 1;

      document.insertPages(newDocument, pages, pageIndexToInsert).then(() => {
        resolve({
          next: sourceArray.length - 1 > nextCount,
          document,
        });
      });
    }).then((response) => {
      return response.next ?
        mergeDocuments(sourceArray, nextCount + 1, response.document) :
        response.document;
    }).catch((error) => {
      setErrorMessage(error);
    });
  }

  return (
    <FilePicker
      onChange={onChange}
      onDrop={onDrop}
      shouldShowIcon={shouldShowIcon}
      acceptFormats={acceptFormats}
      allowMultiple={false}
      errorMessage={errorMessage}
    />
  );
};

export default FilePickerPanel;
