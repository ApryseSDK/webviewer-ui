import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import PageNumberInput from '../PageNumberInput';
import '../PageReplacementModal.scss';
import './FileSelectedPanel.scss';
import PageThumbnailsGrid from 'src/components/PageThumbnailsGrid';

// Need to forward the ref so the FocusTrap works correctly
const FileSelectedPanel = React.forwardRef((
  {
    closeThisModal,
    pageIndicesToReplace,
    sourceDocument,
    replacePagesHandler,
    documentInViewer,
  }, ref) => {
  const [t] = useTranslation();

  const [currentDocSelectedPageNumbers, setCurrentDocSelectedPageNumbers] = useState(pageIndicesToReplace.map((index) => index + 1));
  const [selectedThumbnails, setSelectedThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sourceDocumentName, setSourceDocumentName] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState(null);
  const [sourceDocumentPageCount, setSourceDocumentPageCount] = useState(0);

  useEffect(() => {
    function getTruncatedName(documentName) {
      let truncatedName;
      if (documentName.length > 25) {
        truncatedName = `"${documentName.slice(0, 10)}...${documentName.slice(documentName.length - 10)}"`;
      } else {
        truncatedName = `"${documentName}"`;
      }

      return truncatedName;
    }

    if (sourceDocument) {
      const pageCount = sourceDocument.getPageCount();
      setSourceDocumentPageCount(pageCount);
      setSourceDocumentName(getTruncatedName(sourceDocument.getFilename()));
      setCurrentDocumentName(getTruncatedName(documentInViewer.getFilename()));
    }
  }, [sourceDocument]);

  const replacePages = () => {
    const pagesToReplaceIntoDocument = getPageNumbersFromSelectedThumbnails();
    replacePagesHandler(sourceDocument, currentDocSelectedPageNumbers, pagesToReplaceIntoDocument);
    closeThisModal();
  };

  const deselectAllThumbnails = () => {
    setSelectedThumbnails({});
  };

  const getPageNumbersFromSelectedThumbnails = () => {
    const selectedPageNumbers = [];

    for (const pageNumber in selectedThumbnails) {
      if (selectedThumbnails[pageNumber]) {
        selectedPageNumbers.push(parseInt(pageNumber));
      }
    }
    return selectedPageNumbers;
  };


  const onThumbnailSelected = (pageNumber) => {
    if (selectedThumbnails[pageNumber] === undefined) {
      selectedThumbnails[pageNumber] = true;
    } else {
      selectedThumbnails[pageNumber] = !selectedThumbnails[pageNumber];
    }
    setSelectedThumbnails({ ...selectedThumbnails });
  };

  const isReplaceButtonDisabled = () => {
    for (const pageIndex in selectedThumbnails) {
      if (selectedThumbnails[pageIndex]) {
        return false;
      }
    }
    return true;
  };

  const onSourceDocumentNumberInputChange = (selectedPageNumbers) => {
    const selectedPagesMap = selectedPageNumbers.reduce((map, pageNumber) => ({ ...map, [pageNumber]: true }), {});
    setSelectedThumbnails({ ...selectedPagesMap });
  };


  const loadedDocumentPageCount = documentInViewer.getPageCount();

  return (
    <div className="container" onMouseDown={(e) => e.stopPropagation()} ref={ref}>
      <div className="swipe-indicator" />
      <div className="header">
        {t('component.pageReplaceModalTitle')}
        <Button
          img={'icon-close'}
          onClick={() => closeThisModal()}
          dataElement={'pageReplacementModalClose'}
        />
      </div>
      <div className="page-replacement-divider" />
      <div className="modal-body">
        <div className="replace-page-input-container">
          <div className="replace-page-input">{t('option.pageReplacementModal.pageReplaceInputLabel')}</div>
          <PageNumberInput
            selectedPageNumbers={currentDocSelectedPageNumbers}
            pageCount={loadedDocumentPageCount}
            onBlurHandler={setCurrentDocSelectedPageNumbers}
          />
          <div className="replace-page-input"><span className="page-replace-doc-name">{currentDocumentName}</span> {t('option.pageReplacementModal.pageReplaceInputFromSource')}</div>
          <PageNumberInput
            selectedPageNumbers={getPageNumbersFromSelectedThumbnails()}
            pageCount={sourceDocumentPageCount}
            onBlurHandler={onSourceDocumentNumberInputChange}
          />
          <div className="replace-page-input"><span className="page-replace-doc-name">{sourceDocumentName}</span></div>
        </div>
        <div className={classNames('modal-body-container', { isLoading })}>
          <PageThumbnailsGrid
            document={sourceDocument}
            onThumbnailSelected={onThumbnailSelected}
            selectedThumbnails={selectedThumbnails}
            onfileLoadedHandler={setIsLoading}
          />
        </div>
      </div>
      <div className="page-replacement-divider" />
      <div className={classNames('footer', { isFileSelected: !isLoading })}>
        <button className={classNames('deselect-thumbnails', { disabled: isLoading })} onClick={deselectAllThumbnails} disabled={isLoading}>
          {t('action.deselectAll')}
        </button>
        <Button
          className="modal-btn replace-btn"
          onClick={() => replacePages()}
          label={t('action.replace')}
          disabled={isReplaceButtonDisabled()}
        />
      </div>
    </div >
  );
});

FileSelectedPanel.displayName = 'FileSelectedPanel';

export default FileSelectedPanel;
