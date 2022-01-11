import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import ThumbnailCard from '../ThumbnailCard';
import PageNumberInput from '../PageNumberInput';
import '../PageReplacementModal.scss';
import './FileSelectedPanel.scss'

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

  const [currentDocSelectedPageNumbers, setCurrentDocSelectedPageNumbers] = useState(pageIndicesToReplace.map(index => index + 1));
  const [selectedThumbnails, setSelectedThumbnails] = useState({});
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedPages, setCompletedPagesCount] = useState(0);
  const [sourceDocumentName, setSourceDocumentName] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState(null);
  const [sourceDocumentPageCount, setSourceDocumentPageCount] = useState(0);

  useEffect(() => {
    async function generateThumbnails() {
      const thumbnails = [];
      const pageCount = sourceDocument.getPageCount();
      setSourceDocumentPageCount(pageCount);

      const thumbnailPromises = [];
      for (let i = 1; i <= pageCount; i++) {
        const thumbnailPromise = new Promise(resolve => {
          sourceDocument.loadThumbnail(i, (result) => {
            let thumbnail;
            // If we get an embedded thumbnail we set the currentSrc prop
            // otherwise we set the URl to avoid having to call this repeatedly every time the thumbnail card is rendered
            if (result.currentSrc) {
              thumbnail = {
                pageNumber: i,
                currentSrc: result.currentSrc,
              };
            } else {
              thumbnail = {
                pageNumber: i,
                url: result.toDataURL(),
              };
            }
            thumbnails.push(thumbnail);
            setCompletedPagesCount(i);
            resolve();
          })
        });
        thumbnailPromises.push(thumbnailPromise);
      }

      await Promise.all(thumbnailPromises)
      const sortedThumbnails = thumbnails.sort((a, b) => a.pageNumber - b.pageNumber);
      setThumbnails(sortedThumbnails)
      setIsLoading(false);
    };

    function getTruncatedName(documentName) {
      let truncatedName;
      if (documentName.length > 25) {
        truncatedName = `"${documentName.slice(0, 10)}...${documentName.slice(documentName.length - 10)}"`
      } else {
        truncatedName = `"${documentName}"`
      }

      return truncatedName;
    };

    if (sourceDocument) {
      generateThumbnails();
      setSourceDocumentName(getTruncatedName(sourceDocument.getFilename()));
      setCurrentDocumentName(getTruncatedName(documentInViewer.getFilename()))
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
        selectedPageNumbers.push(parseInt(pageNumber))
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

  const renderContent = () => {
    if (thumbnails.length > 0) {
      return thumbnails.map((thumbnail, index) => {
        const pageNumber = index + 1;
        return (
          <ThumbnailCard key={pageNumber}
            onChange={() => onThumbnailSelected(pageNumber)}
            checked={!!selectedThumbnails[pageNumber]}
            index={index}
            thumbnail={thumbnail}
          />
        )
      })
    } else {
      const pageCount = sourceDocument ? sourceDocument.getPageCount() : 0;
      const processText = `${completedPages}/${pageCount}`;
      return (<div>{t('message.processing')} {processText}</div>)
    }
  };

  const isReplaceButtonDisabled = () => {
    for (const pageIndex in selectedThumbnails) {
      if (selectedThumbnails[pageIndex]) {
        return false;
      }
    }
    return true;
  }

  const onSourceDocumentNumberInputChange = (selectedPageNumbers) => {
    const selectedPagesMap = selectedPageNumbers.reduce((map, pageNumber) => ({ ...map, [pageNumber]: true }), {});
    setSelectedThumbnails({ ...selectedPagesMap });
  };


  const loadedDocumentPageCount = documentInViewer.getPageCount();

  return (
    <div className="container" onMouseDown={e => e.stopPropagation()} ref={ref}>
      <div className="swipe-indicator" />
      <div className="header">
        {t(`component.pageReplaceModalTitle`)}
        <Button
          img={"icon-close"}
          onClick={() => closeThisModal()}
          dataElement={"pageReplacementModalClose"}
        />
      </div>
      <div className="page-replacement-divider" />
      <div className="modal-body">
        <div className="replace-page-input-container">
          <div className="replace-page-input">{t('option.pageReplacementModal.pageReplaceInputLabel')}</div>
          <PageNumberInput
            selectedPageNumbers={currentDocSelectedPageNumbers}
            pageCount={loadedDocumentPageCount}
            onSelectedPageNumbersChange={setCurrentDocSelectedPageNumbers}
          />
          <div className="replace-page-input"><span className="page-replace-doc-name">{currentDocumentName}</span> {t('option.pageReplacementModal.pageReplaceInputFromSource')}</div>
          <PageNumberInput
            selectedPageNumbers={getPageNumbersFromSelectedThumbnails()}
            pageCount={sourceDocumentPageCount}
            onSelectedPageNumbersChange={onSourceDocumentNumberInputChange}
          />
          <div className="replace-page-input"><span className="page-replace-doc-name">{sourceDocumentName}</span></div>
        </div>
        <div className={classNames("modal-body-container", { isLoading })}>
          {renderContent()}
        </div>
      </div>
      <div className="page-replacement-divider" />
      <div className={classNames("footer", { isFileSelected: !isLoading })}>
        <button className={classNames("deselect-thumbnails", { disabled: isLoading })} onClick={deselectAllThumbnails} disabled={isLoading}>
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

export default FileSelectedPanel;