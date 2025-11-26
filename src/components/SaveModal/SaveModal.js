import React, { useEffect, useState, } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import Choice from 'components/Choice';
import Input from 'components/Input';
import core from 'core';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import downloadPdf from 'helpers/downloadPdf';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import { workerTypes } from 'constants/types';
import range from 'lodash/range';
import ModalWrapper from 'components/ModalWrapper';
import useFocusOnClose from 'hooks/useFocusOnClose';

import './SaveModal.scss';

const PAGE_RANGES = {
  ALL: 'all',
  CURRENT_PAGE: 'currentPage',
  CURRENT_VIEW: 'currentView',
  SPECIFY: 'specify'
};
const FILE_TYPES = {
  OFFICE: { label: 'OFFICE (*.pptx,*.docx,*.xlsx)', extension: workerTypes.OFFICE },
  PDF: { label: 'PDF (*.pdf)', extension: workerTypes.PDF },
  IMAGE: { label: 'PNG (*.png)', extension: 'png' },
  OFFICE_EDITOR: { label: 'Word Document (*.docx)', extension: workerTypes.OFFICE },
  SPREADSHEET_EDITOR: { label: 'Excel Document (*.xlsx)', extension: workerTypes.SPREADSHEET_EDITOR },
};
// These legacy office extensions return corrupted file data from the workers if downloaded as OFFICE
const CORRUPTED_OFFICE_EXTENSIONS = ['.ppt', '.xls'];

const SaveModal = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.SAVE_MODAL));
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const isSpreadsheetEditorMode = useSelector(selectors.isSpreadsheetEditorModeEnabled);

  const initalFileTypes = [FILE_TYPES.PDF, FILE_TYPES.IMAGE];
  const [fileTypes, setFileTypes] = useState(initalFileTypes);
  const [filename, setFilename] = useState('');
  const [filetype, setFiletype] = useState(fileTypes[0]);
  const [pageRange, setPageRange] = useState(PAGE_RANGES.ALL);
  const [specifiedPages, setSpecifiedPages] = useState();
  const [includeAnnotations, setIncludeAnnotations] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [hasPageNumberError, setHasPageNumberError] = useState(false);

  useEffect(() => {
    const updateFile = async () => {
      const document = core.getDocument(activeDocumentViewerKey);
      if (document) {
        setFiletype(FILE_TYPES.PDF);
        setFileTypes(initalFileTypes);
        const filename = document.getFilename();
        const newFilename = filename.substring(0, filename.lastIndexOf('.')) || filename;
        setFilename(newFilename);
        const type = document.getType();
        if (type === workerTypes.OFFICE) {
          const array = filename.split('.');
          const extension = `.${array[array.length - 1]}`;
          if (!CORRUPTED_OFFICE_EXTENSIONS.includes(extension)) {
            setFileTypes([...initalFileTypes, FILE_TYPES.OFFICE]);
          }
          await document.getDocumentCompletePromise();
        } else if (type === workerTypes.OFFICE_EDITOR) {
          setFileTypes([
            FILE_TYPES.OFFICE_EDITOR,
            FILE_TYPES.PDF
          ]);
          setFiletype(FILE_TYPES.OFFICE_EDITOR);
        } else if (type === workerTypes.SPREADSHEET_EDITOR) {
          setFileTypes([
            FILE_TYPES.SPREADSHEET_EDITOR,
            FILE_TYPES.PDF
          ]);
          setFiletype(FILE_TYPES.SPREADSHEET_EDITOR);
        }
        setPageCount(core.getTotalPages(activeDocumentViewerKey));
      }
    };
    const documentUnloaded = () => {
      setFilename('');
      setPageCount(0);
      setFileTypes(initalFileTypes);
      setFiletype(initalFileTypes[0]);
      dispatch(actions.closeElement(DataElements.SAVE_MODAL));
    };
    updateFile();
    core.addEventListener('documentUnloaded', documentUnloaded, undefined, activeDocumentViewerKey);
    core.addEventListener('documentLoaded', updateFile, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('documentUnloaded', documentUnloaded, activeDocumentViewerKey);
      core.removeEventListener('documentLoaded', updateFile, activeDocumentViewerKey);
    };
  }, [activeDocumentViewerKey]);

  useEffect(() => {
    const document = core.getDocument(activeDocumentViewerKey);

    if (isOfficeEditorMode() && document) {
      setFiletype(FILE_TYPES.OFFICE_EDITOR);
      const filename = document.getFilename();
      const newFilename = filename.substring(0, filename.lastIndexOf('.')) || filename;
      setFilename(newFilename);
    }
  }, [isOpen]);

  // One is passed to the modalWrapper which uses onFocusClose
  const closeModal = () => dispatch(actions.closeElement(DataElements.SAVE_MODAL));
  // One is used when we close the modal after save, we want to transfer focus back
  const closeModalWithOnFocusClose = useFocusOnClose(closeModal);
  const preventDefault = (e) => e.preventDefault();
  const onFilenameChange = (e) => {
    setFilename(e?.target?.value);
  };
  const onFiletypeChange = (e) => {
    setFiletype(fileTypes.find((i) => i.label === e));
    if (e === FILE_TYPES.OFFICE.label) {
      setPageRange(PAGE_RANGES.ALL);
    }
  };
  const onPageRangeChange = (e) => {
    if (e.target.classList.contains('page-number-input')) {
      return;
    }
    setPageRange(e.target.value);
    if (hasPageNumberError) {
      setHasTyped(false);
      clearError();
    }
  };
  const onIncludeAnnotationsChanged = () => setIncludeAnnotations(!includeAnnotations);
  const onIncludeCommentsChanged = () => setIncludeComments(!includeComments);
  const clearError = () => setHasPageNumberError(false);
  const onError = () => setHasPageNumberError(true);
  const onSpecifiedPagesChanged = (pageNumbers) => {
    if (!hasTyped) {
      setHasTyped(true);
    }

    if (pageNumbers.length > 0) {
      clearError();
    }
  };
  const onSave = () => {
    let doc = core.getDocument(activeDocumentViewerKey);

    if (!doc) {
      console.warn('Document is not loaded');
      return;
    }

    if (!filename) {
      return;
    }

    let pages;
    if (pageRange === PAGE_RANGES.SPECIFY) {
      pages = specifiedPages?.length ? specifiedPages : [core.getCurrentPage(activeDocumentViewerKey)];
    } else if (pageRange === PAGE_RANGES.CURRENT_PAGE) {
      pages = [core.getCurrentPage(activeDocumentViewerKey)];
    } else if (pageRange === PAGE_RANGES.CURRENT_VIEW) {
      pages = [core.getCurrentPage(activeDocumentViewerKey)];
    } else {
      pages = range(1, core.getTotalPages(activeDocumentViewerKey) + 1, 1);
    }

    downloadPdf(dispatch, {
      includeAnnotations,
      includeComments,
      useDisplayAuthor: true,
      filename: filename || 'untitled',
      downloadType: filetype.extension,
      pages,
      store,
    }, activeDocumentViewerKey);

    closeModalWithOnFocusClose();
  };

  const [hasTyped, setHasTyped] = useState(false);
  const saveDisabled = (hasPageNumberError || !hasTyped) && pageRange === PAGE_RANGES.SPECIFY || !filename;

  const optionsDisabled = filetype.extension === 'office' || isOfficeEditorMode() || isSpreadsheetEditorMode;

  const customPagesLabelElement = (
    <div className={classNames('page-number-input-container', { error: hasPageNumberError })}>
      <label className={'specifyPagesChoiceLabel'}>
        <span>
          {t('option.print.specifyPages')}
        </span>
        {pageRange === PAGE_RANGES.SPECIFY && <span className='specifyPagesExampleLabel'>
          - {t('option.thumbnailPanel.multiSelectPagesExample')}
        </span>}
      </label>
      {pageRange === PAGE_RANGES.SPECIFY &&
        <PageNumberInput
          selectedPageNumbers={specifiedPages}
          pageCount={pageCount}
          onBlurHandler={setSpecifiedPages}
          onSelectedPageNumbersChange={onSpecifiedPagesChanged}
          onError={onError}
        />
      }
    </div>
  );

  return (
    <div className={classNames('SaveModal', { open: isOpen, closed: !isOpen })} data-element={DataElements.SAVE_MODAL}>
      <ModalWrapper
        isOpen={isOpen}
        title={t('saveModal.saveAs')}
        closeHandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose>
        <div className='modal-body'>
          <div className='title'>{t('saveModal.general')}</div>
          <div className='input-container'>
            <label htmlFor='fileNameInput' className='label'>{t('saveModal.fileName')}</label>
            <Input
              type='text'
              id='fileNameInput'
              data-testid="fileNameInput"
              onChange={onFilenameChange}
              value={filename}
              fillWidth={true}
              padMessageText={true}
              messageText={filename === '' ? t('saveModal.fileNameCannotBeEmpty') : ''}
              message={filename === '' ? 'warning' : 'default'}
            />
          </div>
          <div className='input-container'>
            <div className='label' id="file-type-dropdown-label">{t('saveModal.fileType')}</div>
            <Dropdown
              id="fileTypeDropdown"
              labelledById='file-type-dropdown-label'
              items={fileTypes.map((i) => i.label)}
              onClickItem={onFiletypeChange}
              currentSelectionKey={filetype.label}
            />
          </div>
          {!optionsDisabled && (<>
            <div className='title'>{t('saveModal.pageRange')}</div>
            <form className='radio-container' onChange={onPageRangeChange} onSubmit={preventDefault}>
              <div className='page-range-column'>
                <Choice
                  checked={pageRange === PAGE_RANGES.ALL}
                  radio
                  name='page-range-option'
                  label={t('saveModal.all')}
                  value={PAGE_RANGES.ALL}
                />
                <Choice
                  checked={pageRange === PAGE_RANGES.CURRENT_PAGE}
                  radio
                  name='page-range-option'
                  label={t('saveModal.currentPage')}
                  value={PAGE_RANGES.CURRENT_PAGE}
                />
              </div>
              <div className='page-range-column custom-page-ranges'>
                <Choice
                  checked={pageRange === PAGE_RANGES.SPECIFY}
                  radio
                  name='page-range-option'
                  label={customPagesLabelElement}
                  value={PAGE_RANGES.SPECIFY}
                />
              </div>
            </form>
            <div className='title'>{t('saveModal.properties')}</div>
            <div className='checkbox-container'>
              <Choice
                checked={includeAnnotations}
                name='include-annotation-option'
                label={t('saveModal.includeAnnotation')}
                onChange={onIncludeAnnotationsChanged}
              />
              <Choice
                checked={includeComments}
                name='include-comment-option'
                label={t('saveModal.includeComments')}
                onChange={onIncludeCommentsChanged}
              />
            </div>
          </>)}
        </div>
        <div className='footer'>
          <Button disabled={saveDisabled} onClick={onSave} label={t('saveModal.save')} />
        </div>
      </ModalWrapper>
    </div >
  );
};

export default SaveModal;
