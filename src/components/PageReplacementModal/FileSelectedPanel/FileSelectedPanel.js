import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import PageNumberInput from '../PageNumberInput';
import '../PageReplacementModal.scss';
import './FileSelectedPanel.scss';
import PageThumbnailsGrid from 'src/components/PageThumbnailsGrid';
import useMedia from 'src/hooks/useMedia';

const MAX_NAME_LENGTH_BEFORE_TRUNCATION = 25;
const TRUNCATION_LENGTH = 10;
const TABLET_TRUNCATION_LENGTH = 4;

// Need to forward the ref so the FocusTrap works correctly
const FileSelectedPanel = React.forwardRef((
  {
    closeThisModal,
    clearLoadedFile,
    pageIndicesToReplace,
    sourceDocument,
    replacePagesHandler,
    documentInViewer,
    closeModalWarning,
  }, ref) => {
  const [t] = useTranslation();

  const [currentDocSelectedPageNumbers, setCurrentDocSelectedPageNumbers] = useState(pageIndicesToReplace.map((index) => index + 1));
  const [selectedThumbnails, setSelectedThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sourceDocumentName, setSourceDocumentName] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState(null);
  const [sourceDocumentPageCount, setSourceDocumentPageCount] = useState(0);
  const [pageNumberError, setPageNumberError] = useState('');

  const isTablet = useMedia(
    // Media queries
    ['(min-width: 641px) and (max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  useEffect(() => {
    if (sourceDocument) {
      const pageCount = sourceDocument.getPageCount();
      const selectedPages = {};
      for (let i = 1; i <= pageCount; i++) {
        selectedPages[i] = true;
      }
      setSelectedThumbnails(selectedPages);
    }
  }, [sourceDocument]);

  useEffect(() => {
    function getTruncatedName(documentName) {
      let truncatedName;
      if (documentName.length > MAX_NAME_LENGTH_BEFORE_TRUNCATION) {
        if (isTablet && !isMobile) {
          truncatedName = `"${documentName.slice(0, TABLET_TRUNCATION_LENGTH)}...${documentName.slice(documentName.length)}"`;
        } else {
          truncatedName = `"${documentName.slice(0, TRUNCATION_LENGTH)}...${documentName.slice(documentName.length - TRUNCATION_LENGTH)}"`;
        }
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
    if (currentDocSelectedPageNumbers.length < 1 || pageNumberError) {
      return true;
    }
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

  const handlePageNumbersChanged = (pageNumbers) => {
    setPageNumberError(null);
    setCurrentDocSelectedPageNumbers(pageNumbers);
  };

  const handlePageNumberError = (pageNumber) => {
    if (pageNumber) {
      setPageNumberError(`${t('message.errorPageNumber')} ${loadedDocumentPageCount}`);
    }
  };

  const onCloseHandler = () => {
    closeModalWarning();
  };

  const loadedDocumentPageCount = documentInViewer.getPageCount();

  return (
    <div className="fileSelectedPanel container" onMouseDown={(e) => e.stopPropagation()} ref={ref}>
      <div className="swipe-indicator" />
      <div className="header-container">
        <div className="header">
          <div className='left-header'>
            <Button
              img={'icon-arrow-back'}
              onClick={clearLoadedFile}
              dataElement={'insertFromFileBackButton'}
              title={t('action.back')}
            />
            {t('component.pageReplaceModalTitle')}
          </div>
          <Button
            img={'icon-close'}
            onClick={onCloseHandler}
            dataElement={'pageReplacementModalClose'}
            className={'closeButton'}
            aria-label="Cancel"
          />
        </div>
      </div>
      <div className="page-replacement-divider" />
      <div className="modal-body">
        <div className="replace-page-input-container">
          <div className="replace-page-input">{t('option.pageReplacementModal.pageReplaceInputLabel')}</div>
          <div className="replace-page-input-current-doc-containers">
            <PageNumberInput
              selectedPageNumbers={currentDocSelectedPageNumbers}
              pageCount={loadedDocumentPageCount}
              onBlurHandler={handlePageNumbersChanged}
              onError={handlePageNumberError}
            />
            {pageNumberError && <div className="page-number-error">{pageNumberError}</div>}
          </div>
          <div className="replace-page-input"><span className="page-replace-doc-name">{currentDocumentName}</span></div>
          <span className="page-replacement-text">{t('option.pageReplacementModal.pageReplaceInputFromSource')}</span>
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
