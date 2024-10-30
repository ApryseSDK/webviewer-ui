import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import FilePicker from 'components/FilePicker';
import PortfolioItemGrid from './PortfolioItemGrid';
import { createPortfolio } from 'helpers/portfolio';
import loadDocument from 'helpers/loadDocument';
import ModalWrapper from 'components/ModalWrapper';
import useFocusOnClose from 'hooks/useFocusOnClose';

import './CreatePortfolioModal.scss';

const CreatePortfolioModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [
    isDisabled,
    isOpen,
    isMultiTab,
    tabManager,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.CREATE_PORTFOLIO_MODAL),
    selectors.isElementOpen(state, DataElements.CREATE_PORTFOLIO_MODAL),
    selectors.getIsMultiTab(state),
    selectors.getTabManager(state),
  ], shallowEqual);

  const [items, setItems] = useState([]);

  const fileInputRef = useRef(null);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.CREATE_PORTFOLIO_MODAL));
  };

  const closeCreatePortfolioModalAfterCreate = useFocusOnClose(closeModal);

  const onFilesSelected = (files) => {
    setItems(files);
  };

  const create = useCallback(async () => {
    const pdfDoc = await createPortfolio(items);
    if (isMultiTab) {
      const blob = new Blob([await pdfDoc.saveMemoryBuffer(0)], { type: 'application/pdf' });
      await tabManager.addTab(blob, {
        setActive: true,
        extension: 'pdf',
      });
    } else {
      loadDocument(dispatch, pdfDoc);
    }
    closeCreatePortfolioModalAfterCreate();
  }, [items, isMultiTab, tabManager]);

  const addFiles = (files) => {
    if (files.length > 0) {
      files = Array.from(files);
      const conflictItem = items.find((item) => files.find((file) => file.name === item.name));
      if (conflictItem) {
        const message = t('portfolio.fileAlreadyExistsMessage', { fileName: conflictItem.name });
        const title = t('portfolio.fileAlreadyExists');
        const confirmBtnText = t('portfolio.reselect');
        const warning = {
          message,
          title,
          confirmBtnText,
          onConfirm: () => openFilePicker(),
        };
        dispatch(actions.showWarningMessage(warning));
      } else {
        setItems(items.concat(files));
      }
    }
  };

  const openFilePicker = () => {
    fileInputRef?.current?.click();
  };

  const deleteItem = (index) => {
    items.splice(index, 1);
    setItems([...items]);
  };

  const onDropItems = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const modalClass = classNames({
    'CreatePortfolioModal': true,
    'is-editing': items.length > 0
  });

  return (isDisabled || !isOpen) ? null : (
    <div className={modalClass} data-element={DataElements.CREATE_PORTFOLIO_MODAL}>
      <ModalWrapper
        isOpen={isOpen}
        title={t('portfolio.createPDFPortfolio')}
        closehandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose
      >
        <div className="content-container">
          {(items.length === 0) && (
            <div className='file-picker-container'>
              <FilePicker
                onChange={onFilesSelected}
                onDrop={onFilesSelected}
                allowMultiple={true}
              />
            </div>
          )}
          {(items.length > 0) && (
            <PortfolioItemGrid
              items={items}
              onDeleteItem={deleteItem}
              onDropItems={onDropItems}
            />
          )}
          <div className="divider"></div>
          <div className="footer">
            <div>
              <Button
                className='add-item-option'
                img='icon-portfolio-file'
                onClick={openFilePicker}
                label={t('portfolio.addFiles')}
              />
              <div className="add-item-trigger" data-element={DataElements.PORTFOLIO_MODAL_ADD_ITEM_TRIGGER}></div>
            </div>
            <Button
              className='create-portfolio'
              disabled={items.length === 0}
              onClick={create}
              label={t('action.create')}
            />
          </div>
          <input
            ref={fileInputRef}
            multiple
            style={{ display: 'none' }}
            type="file"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = null;
            }}
          />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default CreatePortfolioModal;
