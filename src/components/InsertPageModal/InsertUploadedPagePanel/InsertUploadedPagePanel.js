import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'components/Button';

import './InsertUploadedPagePanel.scss';
import PageThumbnailsGrid from 'components/PageThumbnailsGrid';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';

const InsertUploadedPagePanel = React.forwardRef(({
  sourceDocument,
  closeModal,
  clearLoadedFile,
  insertPages,
  loadedDocumentPageCount,
  closeModalWarning,
  insertNewPageIndexes = [1],
}, ref) => {
  const [t] = useTranslation();
  const [selectedThumbnails, setSelectedThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumberToInsertAt, setPageNumberToInsertAt] = useState([insertNewPageIndexes[0]]);
  const [insertAbove, setInsertAbove] = useState(true);
  const [pageNumberError, setPageNumberError] = useState('');

  useEffect(() => {
    const pageCount = sourceDocument.getPageCount();
    const selectedPages = {};
    for (let i = 1; i <= pageCount; i++) {
      selectedPages[i] = true;
    }
    setSelectedThumbnails(selectedPages);
  }, [sourceDocument]);


  const onThumbnailSelected = (pageNumber) => {
    if (selectedThumbnails[pageNumber] === undefined) {
      selectedThumbnails[pageNumber] = true;
    } else {
      selectedThumbnails[pageNumber] = !selectedThumbnails[pageNumber];
    }
    setSelectedThumbnails({ ...selectedThumbnails });
  };

  const getSelectedPages = () => {
    const pageNumbers = Object.keys(selectedThumbnails);
    return pageNumbers.reduce((selectedPages, currentPage) => {
      if (selectedThumbnails[currentPage]) {
        selectedPages.push(parseInt(currentPage));
      }
      return selectedPages;
    }, []);
  };

  const pageInputBlurHandler = (pageNumbers) => {
    setPageNumberError(null);
    // If undefined it means user entered an invalid number
    // Use an array to force a re-render of the input component
    const pageNumber = pageNumbers[0] ? [pageNumbers[0]] : [];
    setPageNumberToInsertAt(pageNumber);
  };

  const deselectAllThumbnails = () => {
    setSelectedThumbnails({});
  };

  const onInsertChoiceChange = () => {
    setInsertAbove(!insertAbove);
  };

  const insertPagesHandler = () => {
    let insertAtPage = pageNumberToInsertAt[0];
    if (insertAtPage) {
      let insertBeforeThisPage = insertAbove ? insertAtPage : ++insertAtPage;

      if (insertBeforeThisPage > loadedDocumentPageCount) {
        insertBeforeThisPage = null;
      }

      insertPages(sourceDocument, getSelectedPages(), insertBeforeThisPage);
    }

    closeModal();
  };

  const onCloseHandler = () => {
    closeModalWarning();
  };

  const handlePageNumberError = (pageNumber) => {
    if (pageNumber) {
      setPageNumberError(`${t('message.errorPageNumber')} ${loadedDocumentPageCount}`);
    }
  };

  return (
    <div className="insert-uploaded-page-panel" onMouseDown={(e) => e.stopPropagation()} ref={ref}>
      <div className="swipe-indicator" />
      <div className="header">
        <div className='left-header'>
          <Button
            img={'icon-arrow-back'}
            onClick={clearLoadedFile}
            dataElement={'insertFromFileBackButton'}
            title={t('action.back')}
          />
          {t('insertPageModal.selectPages')} {`(${isLoading ? 0 : getSelectedPages().length})`}
        </div>
        <Button className="insertPageModalCloseButton" img="icon-close" onClick={onCloseHandler} title="action.cancel" />

      </div>
      <div className="modal-body">
        <div className="insert-blank-page-controls">
          <div className='insert-page-location-options'>
            <span className='insert-page-titles '>{t('insertPageModal.pagePlacements.header')}</span>
            <div className='insert-page-options'>
              <Choice label={t('insertPageModal.pagePlacements.above')} radio name='insertPagePosition' checked={insertAbove} onChange={onInsertChoiceChange} />
              <Choice label={t('insertPageModal.pagePlacements.below')} radio name='insertPagePosition' checked={!insertAbove} onChange={onInsertChoiceChange} />
            </div>
          </div>
          <div className='insert-page-location'>
            <span className='insert-page-titles '>{t('insertPageModal.pageLocations.specifyLocation')}</span>
            <div className='insert-page-input'>
              {t('insertPageModal.page')}:
              <PageNumberInput
                selectedPageNumbers={pageNumberToInsertAt}
                onBlurHandler={pageInputBlurHandler}
                pageCount={loadedDocumentPageCount}
                onError={handlePageNumberError} />
              {pageNumberError && <div className="page-number-error">{pageNumberError}</div>}
            </div>
          </div>

        </div>
        <div className={classNames('modal-body-thumbnail-container', { isLoading })}>
          <PageThumbnailsGrid
            document={sourceDocument}
            onThumbnailSelected={onThumbnailSelected}
            selectedThumbnails={selectedThumbnails}
            onfileLoadedHandler={setIsLoading} />
        </div>
      </div>
      <div className={classNames('insert-page-footer', { isFileSelected: !isLoading })}>
        <button className={classNames('deselect-thumbnails', { disabled: isLoading })} onClick={deselectAllThumbnails} disabled={isLoading}>
          {t('action.deselectAll')}
        </button>
        <Button
          className="modal-btn"
          onClick={insertPagesHandler}
          label={t('insertPageModal.button')}
          disabled={getSelectedPages().length === 0 || isLoading || pageNumberToInsertAt.length === 0}
        />
      </div>
    </div>
  );
});

InsertUploadedPagePanel.displayName = InsertUploadedPagePanel;
export default InsertUploadedPagePanel;
