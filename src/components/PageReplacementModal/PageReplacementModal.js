import React, { useState, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import core from 'core';
import { useTranslation } from 'react-i18next';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import ThumbnailCard from './ThumbnailCard';
import './PageReplacementModal.scss';
import FileListPanel from './FileListPanel';
import FileInputPanel from './FileInputPanel';
import FilePickerPanel from './FilePickerPanel';
import { Swipeable } from 'react-swipeable';
import { Tabs, Tab, TabPanel } from 'components/Tabs';

const isValidUrlRegex = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/, 'm');
const options = { loadAsPDF: true, l: window.sampleL /* license key here */ };

const PageReplacementModal = ({
  closeModal,
  selectableFiles,
  isOpen,
  selectedThumbnailPageIndexes,
  selectedTab,
}) => {
  const [t] = useTranslation();
  const [showSpinner, setShowSpinner] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const [source, setSource] = useState({});
  const [compeletedCount, setCompeletedCount] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [checkedState, setCheckedState] = useState(new Array(0).fill(false));
  const [selectedPages, selectThumb] = useState([]);
  const [selectedTabInternal, setSelectedTabInternal] = useState(null);

  useEffect(() => {
    if (isOpen && selectedTabInternal !== selectedTab) {
      setSelectedTabInternal(selectedTab);
    }
  });

  const closeThisModal = () => {
    setSelectedDoc(null);
    setThumbnails([]);
    setShowSpinner(true);
    setIsFileSelected(false);
    const el = document.getElementById('file-picker-two');
    if (el) {
      el.value = null;
    }
    closeModal();
    setCheckedState(new Array(0).fill(false));
    selectThumb([]);
    setSelectedTabInternal(null);
    setSource({})
  };

  const handlePageReplaceBtn = async (sourcePages, sourceDoc ) => {
    const doc = core.getDocument();
    const targetDocPageCount = doc.getPageCount();
    const pages = sourcePages || selectedPages.map(i => i + 1);
    const pageNumbersForRemove = selectedThumbnailPageIndexes.map(i => i + 1);
    const _source = sourceDoc || selectedDoc;

    if (targetDocPageCount === 1) {
      const newLastPageNumber = 1 - pageNumbersForRemove.length + 1;
      await doc.insertPages(_source, pages, newLastPageNumber);
      await doc.removePages([doc.getPageCount()]);
    } else {
      const lastPage = pageNumbersForRemove[pageNumbersForRemove.length - 1];
      await doc.removePages(pageNumbersForRemove);
      const newLastPageNumber = lastPage - pageNumbersForRemove.length + 1;
      await doc.insertPages(_source, pages, newLastPageNumber);
    }

    closeThisModal();
  }

  const fetchRequest = useCallback((sourceDoc) => {
    function processDocument(doc) {
      setSelectedDoc(doc);
      setIsFileSelected(true);
      setShowSpinner(true);

      const pageCount = doc.getPageCount();
      if (pageCount === 1) {
        selectThumb([1]);
        handlePageReplaceBtn([1], doc);
        return;
      }

      const promises = [];
      let count = 0;

      for (let i = 0; i < pageCount; i++) {
        promises.push(
          new Promise((resolve) => {
            // Load page canvas
            const pageNumber = i + 1;
            return doc.requirePage(pageNumber).then(() => {
              return doc.loadCanvasAsync({
                pageNumber,
                drawComplete: (canvas, index) => {
                  const response = { index, url: canvas.toDataURL() }
                  count++;
                  setCompeletedCount(count);
                  resolve(response);
                },
                'isInternalRender': true,
              });
            });
          })
        )
      }

      Promise.all(promises).then((results) => {
        setThumbnails(results);
        setShowSpinner(false);
        setCheckedState(new Array(pageCount).fill(false))
      });
    }

    function fetchDocument() {
      if (sourceDoc instanceof instance.Core.Document) {
        processDocument(sourceDoc);
      } else {
        window.Core.createDocument(sourceDoc, options).then((doc) => {
          processDocument(doc)
        });
      }
    }
    fetchDocument();
  }, [selectedThumbnailPageIndexes]);

  const modalClass = classNames({
    Modal: true,
    PageReplacementModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const handleThumbCheckbox = (index) => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === index ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const isChecked = updatedCheckedState[index];
    if (isChecked) {
      if (selectedPages.indexOf(index) === -1) {
        selectedPages.push(index)
      }
    } else {
      if (selectedPages.indexOf(index) > -1) {
        selectedPages.splice(index, 1);
      }
    }

    selectThumb(selectedPages);
  }

  const handleDeselectAll = () => {
    const pageCount = selectedDoc ? selectedDoc.getPageCount() : 0;
    for (let index = 0; index < pageCount; index++) {
      checkedState[index] = false;
    }

    selectThumb([]);
    setCheckedState(checkedState);
  }



  const thumbs = [];
  const pageCount = selectedDoc ? selectedDoc.getPageCount() : 0;
  for (let index = 0; index < pageCount; index++) {
    thumbs.push(
      <ThumbnailCard key={index}
        onChange={() => handleThumbCheckbox(index)}
        checked={(checkedState[index] !== undefined) ? checkedState[index] : false}
        index={index}
        thumbnail={thumbnails[index]}
      />
    );
  }

  let bodyContent = null;
  if (showSpinner) {
    const txt = (pageCount) ? `${compeletedCount + 1}/${pageCount}` : null;
    bodyContent = <div style={{ textAlign: 'center' }}>{t('message.processing')} {txt}</div>
  } else {
    bodyContent = thumbs
  }

  const srcString = source[selectedTabInternal];
  const handleSelection = () => {
    if (srcString && selectedTabInternal === 'customFileListPanelButton') {
      if (srcString.onSelect) {
        var promise = srcString.onSelect();
        promise.then((src) => fetchRequest(src));
      }
    } else if (srcString) {
      fetchRequest(srcString);
    }
  }

  let isSelectBtnDisabled = srcString === undefined;

  if (selectedTabInternal === 'urlInputPanelButton' && !isValidUrlRegex.test(srcString)) {
    isSelectBtnDisabled = true;
  }

  const isTabEnabled = selectableFiles && selectableFiles.length > 0;
  return isOpen ? (
    <Swipeable
        onSwipedUp={closeThisModal}
        onSwipedDown={closeThisModal}
        preventDefaultTouchmoveEvent
    >
      <div
        className={modalClass}
        data-element="pageReplacementModal"
        onMouseDown={closeThisModal}
        id="pageReplacementModal"
      >
        <FocusTrap locked={isOpen}>
        {
          (isFileSelected)
            ? <div className="container" onMouseDown={e => e.stopPropagation()}>
                <div className="swipe-indicator" />
                <div className="header">
                  {t(`component.pageReplaceModalTitle`)}
                </div>
                <div className="modal-body">
                  <div style={{ marginBottom: 15 }}>
                    {t('message.selectPageToReplace')}
                  </div>
                  <div className="modal-body-container">
                    {bodyContent}
                  </div>
                </div>
                <div className="footer">
                  <button className="modal-close" onClick={handleDeselectAll}>
                    {t('action.deselectAll')}
                  </button>
                  <div
                    className="modal-btn replace-btn"
                    onClick={() => handlePageReplaceBtn()}
                  >
                    {t('action.replace')}
                  </div>
                </div>
              </div>
            : <div className="container tabs" onMouseDown={e => e.stopPropagation()}>
                <div className="swipe-indicator" />
                <div className="header">
                  {t(`component.pageReplaceModalTitle`)}
                </div>
                <Tabs id="pageReplacementModal">
                  <div className="tab-list">
                    { (isTabEnabled)
                      ? <Tab dataElement="customFileListPanelButton">
                          <button className="tab-options-button">
                            {t('component.files')}
                          </button>
                        </Tab>
                      : <button disabled style={{ cursor: 'not-allowed', background: '#e7e7e7'}}
                          className="tab-options-button">
                          {t('component.files')}
                        </button>
                    }
                    <div className="tab-options-divider" />
                    <Tab dataElement="urlInputPanelButton">
                      <button className="tab-options-button">
                      {t('link.url')}
                      </button>
                    </Tab>
                    <div className="tab-options-divider" />
                    <Tab dataElement="filePickerPanelButton">
                      <button className="tab-options-button">
                        {t('action.upload')}
                      </button>
                    </Tab>
                  </div>
                  <TabPanel dataElement="customFileListPanel">
                    <div className="panel-body">
                      <FileListPanel
                        onFileSelect={(selection) => {
                          setSource({ [selectedTabInternal]: selection });
                        }}
                        list={selectableFiles}
                        defaultValue={srcString}/>
                    </div>
                  </TabPanel>
                  <TabPanel dataElement="urlInputPanel">
                    <div className="panel-body">
                      <FileInputPanel
                        onFileSelect={(url) => {
                          setSource({ [selectedTabInternal]: url });
                        }}
                        defaultValue={source['urlInputPanelButton']}
                        />
                    </div>
                  </TabPanel>
                  <TabPanel dataElement="filePickerPanel">
                    <div className="panel-body">
                      <FilePickerPanel
                        onFileSelect={(file) => {
                          setSource({ [selectedTabInternal]: file });
                        }}
                        defaultValue={source['filePickerPanelButton']}/>
                    </div>
                  </TabPanel>
                </Tabs>
                <div className="footer">
                  {
                    (isSelectBtnDisabled)
                      ? <div className="modal-btn disabled">{t('action.select')}</div>
                      : <div className="modal-btn" onClick={handleSelection}>{t('action.select')}</div>
                  }
                </div>
            </div>
        }
        </FocusTrap>
      </div>
    </Swipeable>
  ) : null;
}

export default PageReplacementModal;