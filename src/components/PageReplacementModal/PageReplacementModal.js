import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import core from 'core';
import { useTranslation } from 'react-i18next';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import './PageReplacementModal.scss';
import FileListPanel from './FileListPanel';
import FileInputPanel from './FileInputPanel';
import FilePickerPanel from './FilePickerPanel';
import { Swipeable } from 'react-swipeable';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import Button from 'components/Button';
import FileSelectedPanel from './FileSelectedPanel';

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
  const [source, setSource] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedTabInternal, setSelectedTabInternal] = useState(null);

  useEffect(() => {
    if (isOpen && selectedTabInternal !== selectedTab) {
      setSelectedTabInternal(selectedTab);
    }
  });

  const closeThisModal = () => {
    setSelectedDoc(null);
    setIsFileSelected(false);
    const el = document.getElementById('file-picker-two');
    if (el) {
      el.value = null;
    }
    closeModal();
    setSelectedTabInternal(null);
    setSource({})
  };


  const modalClass = classNames({
    Modal: true,
    PageReplacementModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const srcString = source[selectedTabInternal];
  const handleSelection = async () => {
    setIsFileSelected(true);
    let document;
    if (srcString && selectedTabInternal === 'customFileListPanelButton') {
      if (srcString.onSelect) {
        document = await srcString.onSelect();
        setSelectedDoc(document);
      }
    } else if (srcString) {
      document = await core.createDocument(srcString, options);
      setSelectedDoc(document);
    }
  };

  // File picker can merge docs, in which case the callback gets
  // executed with a Document not a file
  const fileProcessedHandler = async (file) => {
    let document;
    if (file instanceof instance.Core.Document) {
      document = file;
    } else {
      document = await core.createDocument(file, options);
    }
    setSelectedDoc(document);
    setIsFileSelected(true);
  };

  let isSelectBtnDisabled = srcString === undefined;

  if (selectedTabInternal === 'urlInputPanelButton' && !isValidUrlRegex.test(srcString)) {
    isSelectBtnDisabled = true;
  };

  const renderFileSelectedPanel = () => {
    return (
      <FileSelectedPanel
        closeThisModal={closeThisModal}
        pageIndicesToReplace={selectedThumbnailPageIndexes}
        sourceDocument={selectedDoc}
      />
    )
  };

  const renderSelectionTabs = () => {
    const isFilePanelEnabled = selectableFiles && selectableFiles.length > 0;

    return (
      <div className="container tabs" onMouseDown={e => e.stopPropagation()}>
        <div className="swipe-indicator" />
        <div className="header">
          {t(`component.pageReplaceModalTitle`)}
          <Button
            img={"icon-close"}
            onClick={closeThisModal}
            dataElement={"pageReplacementModalClose"}
          />
        </div>
        <Tabs className="page-replacement-tabs" id="pageReplacementModal">
          <div className="tab-list">
            {isFilePanelEnabled &&
              <Tab dataElement="customFileListPanelButton">
                <button className="tab-options-button">
                  {t('component.files')}
                </button>
              </Tab>
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
                {t('option.pageReplacementModal.localFile')}
              </button>
            </Tab>
          </div>
          <div className="page-replacement-divider" />
          <TabPanel dataElement="customFileListPanel">
            <div className="panel-body">
              <FileListPanel
                onFileSelect={(selection) => {
                  setSource({ [selectedTabInternal]: selection });
                }}
                list={selectableFiles}
                defaultValue={srcString} />
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
                onFileProcessed={(file) => fileProcessedHandler(file)}
              />
            </div>
          </TabPanel>
        </Tabs>
        <div className="page-replacement-divider" />
        <div className="footer">
          <Button
            className={classNames('modal-btn', { noFile: isSelectBtnDisabled })}
            onClick={() => isSelectBtnDisabled ? null : handleSelection()}
            label={t('action.select')}
          />
        </div>
      </div>
    );
  };

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
          {isFileSelected ? renderFileSelectedPanel() : renderSelectionTabs()}
        </FocusTrap>
      </div>
    </Swipeable>
  ) : null;
};

export default PageReplacementModal;