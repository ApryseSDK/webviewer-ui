import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import TabManager from 'helpers/TabManager';
import classNames from 'classnames';
import getHashParameters from 'helpers/getHashParameters';
import { Swipeable } from 'react-swipeable';
import Dropdown from 'components/Dropdown';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import './FileModal.scss';
import { Choice } from '@pdftron/webviewer-react-toolkit';

const OpenFileModal = ({ isOpen, tabManager }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [src, setSrc] = useState('');
  const [extension, setExtension] = useState('pdf');
  const [filename, setFilename] = useState();
  const [size, setSize] = useState();
  const [error, setError] = useState({ 'fileError': '', 'urlError': '', 'extensionError': '' });
  const [shouldOpen, setShouldOpen] = useState(true);
  const fileInputRef = useRef();

  const closeModal = () => {
    dispatch(actions.closeElement('OpenFileModal'));
    setSrc('');
    setError({ 'fileError': '', 'urlError': '' });
    setFilename(null);
    setExtension('pdf');
    setSize(null);
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(['printModal', 'loadingModal', 'progressModal', 'errorModal', 'Model3DModal']));
    } else {
      fileInputRef.current.value = '';
    }
  }, [dispatch, isOpen]);

  const handleAddTab = async () => {
    if (!src) {
      return setError({ 'urlError': 'URL or File must be provided' });
    }
    if (!extension || acceptFormats.indexOf(extension) === -1) {
      return setError({ 'extensionError': 'Extension must be provided' });
    }
    const useDb = !size || TabManager.MAX_FILE_SIZE > size;
    await tabManager.addTab(src, {
      extension,
      filename,
      load: shouldOpen,
      saveCurrent: true,
      useDB: useDb
    });
    closeModal();
  };

  const modalClass = classNames(
    {
      Modal: true,
      FileModal: true,
      open: isOpen,
      closed: !isOpen,
    });

  const extensionRegExp = /(?:\.([^.?]+))?$/;

  const handleFileChange = async event => {
    setError(null);
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setFilename(file.name);
    setSrc(URL.createObjectURL(file));
    setExtension(window.Core.mimeTypeToExtension[file.type] || extensionRegExp.exec(file.name)[1] || null);
    setSize(file.size);
  };

  const handleURLChange = async url => {
    setError(null);
    fileInputRef.current.value = '';
    setSrc(url.trim());
    const filename = url.substring(url.lastIndexOf('/')+1).split('?')[0];
    setFilename(filename);
    setExtension(extensionRegExp.exec(filename)[1]);
    setSize(null);
  };

  const wvServer = !!getHashParameters('webviewerServerURL', null);
  let acceptFormats = wvServer ? window.Core.SupportedFileFormats.SERVER : window.Core.SupportedFileFormats.CLIENT;
  acceptFormats = acceptFormats.reduce((uniqueArr, curr) => {
    if (uniqueArr.indexOf(curr) === -1) {
      uniqueArr.push(curr);
    }
    return uniqueArr;
  }, []);

  return (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal}>
      <div className={modalClass} data-element="OpenFileModal" onMouseDown={closeModal}>
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator"/>
          <form onSubmit={e => e.preventDefault()}>
            <div className="col">{t('OpenFile.enterUrlOrChooseFile')}</div>
            <input
              className="urlInput"
              type="url"
              value={src}
              onChange={e => handleURLChange(e.target.value)}
              placeholder={t('OpenFile.enterUrl')}
            />
            {error?.urlError && <p className="error">* {error.urlError}</p>}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={acceptFormats.map(
                format => `.${format}`,
              ).join(',')}
            />
            {error?.fileError && <p className="error">* {error.fileError}</p>}
            <div className="extension-dropdown">
              <Dropdown
                onClick={e => e.stopPropagation()}
                onClickItem={setExtension}
                items={acceptFormats}
                currentSelectionKey={extension}
              />
              <p>{t('OpenFile.extension')}</p>
            </div>
            {error?.extensionError && <p className="error">* {error.extensionError}</p>}
            <Choice label={t('action.openFile')} checked={shouldOpen} onChange={() => setShouldOpen(!shouldOpen)} />
            <Button dataElement="linkSubmitButton" label={t('OpenFile.addTab')} onClick={handleAddTab} />
          </form>
        </div>
      </div>
    </Swipeable>
  );
};

export default OpenFileModal;