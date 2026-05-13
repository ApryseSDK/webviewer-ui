import React, { useState, useEffect } from 'react';
import useCore from 'hooks/useCore';
import FilePicker from 'components/FilePicker';

const CREATE_DOCUMENT_OPTIONS = { loadAsPDF: true };

const isCoreDocument = (source) => {
  const CoreDocument = window?.Core?.Document;

  return source instanceof CoreDocument;
};
const FilePickerPanel = ({
  onFileProcessed,
  shouldShowIcon,
  allowMultiple = false,
}) => {
  const { core } = useCore();
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptFormats, setAcceptFormats] = useState('');

  const loadDocumentForPageManipulation = (source) => (
    isCoreDocument(source) ? source : core.createDocument(source, CREATE_DOCUMENT_OPTIONS)
  );

  useEffect(() => {
    setAcceptFormats(core.getAllowedFileExtensions());
  }, []);

  const onFileAdded = async (files) => {
    try {
      setErrorMessage('');
      const processedFile = files.length > 1
        ? await mergeDocuments(files)
        : files[0];

      onFileProcessed(processedFile);
    } catch (error) {
      setErrorMessage(error?.message ?? String(error));
    }
  };

  async function mergeDocuments(sourceArray) {
    let mergedDocument = await loadDocumentForPageManipulation(sourceArray[0]);

    for (let index = 1; index < sourceArray.length; index++) {
      const sourceDocument = await loadDocumentForPageManipulation(sourceArray[index]);
      const pages = Array.from({ length: sourceDocument.getPageCount() }, (_, pageIndex) => pageIndex + 1);
      const pageIndexToInsert = mergedDocument.getPageCount() + 1;

      await mergedDocument.insertPages(sourceDocument, pages, pageIndexToInsert);
    }

    return mergedDocument;
  }

  return (
    <FilePicker
      onChange={onFileAdded}
      onDrop={onFileAdded}
      shouldShowIcon={shouldShowIcon}
      acceptFormats={acceptFormats}
      allowMultiple={allowMultiple}
      errorMessage={errorMessage}
    />
  );
};

export default FilePickerPanel;
