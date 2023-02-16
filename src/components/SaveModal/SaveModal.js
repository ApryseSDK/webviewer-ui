import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './SaveModal.scss';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import { FocusTrap, Choice } from '@pdftron/webviewer-react-toolkit';
import { Swipeable } from 'react-swipeable';
import core from 'core';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import pageNumberPlaceholder from 'constants/pageNumberPlaceholder';
import downloadPdf from 'helpers/downloadPdf';
import { workerTypes } from 'constants/types';
import { range } from 'lodash';

const PAGE_RANGES = {
  ALL: 'all',
  CURRENT_PAGE: 'currentPage',
  CURRENT_VIEW: 'currentView',
  SPECIFY: 'specify'
};
const FILE_TYPES = {
  OFFICE: { label: 'OFFICE (*.pptx,*.docx,*.xlsx)', extension: 'office' },
  PDF: { label: 'PDF (*.pdf)', extension: 'pdf', },
  IMAGE: { label: 'PNG (*.png)', extension: 'png', },
};
// These legacy office extensions return corrupted file data from the workers if downloaded as OFFICE
const CORRUPTED_OFFICE_EXTENSIONS = ['.ppt', '.xls'];

const SaveModal = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOpen, activeDocumentViewerKey] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements.SAVE_MODAL),
    selectors.getActiveDocumentViewerKey(state),
  ]);

  const initalFileTypes = [FILE_TYPES.PDF, FILE_TYPES.IMAGE];
  const [fileTypes, setFileTypes] = useState(initalFileTypes);
  const [filename, setFilename] = useState('');
  const [filetype, setFiletype] = useState(fileTypes[0]);
  const [pageRange, setPageRange] = useState(PAGE_RANGES.ALL);
  const [specifiedPages, setSpecifiedPages] = useState();
  const [includeAnnotations, setIncludeAnnotations] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const updateFile = async () => {
      const document = core.getDocument(activeDocumentViewerKey);
      if (document) {
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
        } else {
          setFileTypes(initalFileTypes);
          setFiletype(FILE_TYPES.PDF);
        }
        setPageCount(core.getTotalPages(activeDocumentViewerKey));
      }
    };
    updateFile();
    core.addEventListener('documentLoaded', updateFile, undefined, activeDocumentViewerKey);
    return () => core.removeEventListener('documentLoaded', updateFile, activeDocumentViewerKey);
  }, [activeDocumentViewerKey]);

  const closeModal = () => dispatch(actions.closeElement(DataElements.SAVE_MODAL));
  const preventDefault = (e) => e.preventDefault();
  const onFilenameChange = (e) => setFilename(e?.target?.value);
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
    if (errorText) {
      setHasTyped(false);
      clearError();
    }
  };
  const onIncludeAnnotationsChanged = () => setIncludeAnnotations(!includeAnnotations);
  const onIncludeCommentsChanged = () => setIncludeComments(!includeComments);
  const clearError = () => setErrorText('');
  const onError = () => setErrorText(t('saveModal.pageError') + pageCount);
  const onSpecifiedPagesChanged = () => {
    if (!hasTyped) {
      setHasTyped(true);
    }
    clearError();
  };
  const onSave = () => {
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
      filename: filename || 'untitled',
      downloadType: filetype.extension,
      pages,
      store,
    }, activeDocumentViewerKey);
  };

  const [hasTyped, setHasTyped] = useState(false);
  const saveDisabled = (errorText || !hasTyped) && pageRange === PAGE_RANGES.SPECIFY;
  const optionsDisabled = filetype.extension === 'office';

  return (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div className={classNames('SaveModal', { open: isOpen, closed: !isOpen })} data-element={DataElements.SAVE_MODAL}>
          <div className='container'>
            <div className='header'>
              <div className='header-text' >{t('saveModal.saveAs')}</div>
              <Button className='close-button' onClick={closeModal} img='ic_close_black_24px' title='action.close' />
            </div>
            <div className='modal-body'>
              <div className='title'>{t('saveModal.general')}</div>
              <div className='input-container'>
                <div className='label'>{t('saveModal.fileName')}</div>
                <input type='text' placeholder={t('saveModal.fileName')} defaultValue={filename} onChange={onFilenameChange} />
              </div>
              <div className='input-container'>
                <div className='label'>{t('saveModal.fileType')}</div>
                <Dropdown
                  items={fileTypes.map((i) => i.label)}
                  onClickItem={onFiletypeChange}
                  currentSelectionKey={filetype.label}
                />
              </div>
              {!optionsDisabled && (<>
                <div className='title'>{t('saveModal.pageRange')}</div>
                <form className='radio-container' onChange={onPageRangeChange} onSubmit={preventDefault}>
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
                  {/* Temporarily commented out */}
                  {/* <Choice */}
                  {/*  checked={pageRange === PAGE_RANGES.CURRENT_VIEW} */}
                  {/*  radio */}
                  {/*  name='page-range-option' */}
                  {/*  label={t('saveModal.currentView')} */}
                  {/*  value={PAGE_RANGES.CURRENT_VIEW} */}
                  {/* /> */}
                  <Choice
                    checked={pageRange === PAGE_RANGES.SPECIFY}
                    radio
                    name='page-range-option'
                    label={t('saveModal.specifyPage')}
                    value={PAGE_RANGES.SPECIFY}
                  />

                  {pageRange === PAGE_RANGES.SPECIFY && (
                    <div className={classNames('page-number-input-container', { error: !!errorText })}>
                      <PageNumberInput
                        selectedPageNumbers={specifiedPages}
                        pageCount={pageCount}
                        onBlurHandler={setSpecifiedPages}
                        onSelectedPageNumbersChange={onSpecifiedPagesChanged}
                        placeHolder={pageNumberPlaceholder}
                        onError={onError}
                      />
                      {errorText && <div className="error-text">{errorText}</div>}
                    </div>
                  )}
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
              <button disabled={saveDisabled} onClick={onSave}>{t('saveModal.save')}</button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

export default SaveModal;
