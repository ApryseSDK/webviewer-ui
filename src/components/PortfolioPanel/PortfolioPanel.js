import React, { useState, useRef, useCallback } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import selectors from 'selectors';
import actions from 'actions';

import Button from 'components/Button';
import PortfolioContext from './PortfolioContext';
import PortfolioItem from 'components/PortfolioItem';
import PortfolioItemContent from 'components/PortfolioItemContent';
import { PortfolioDragLayer } from './PortfolioDragLayer';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import { DropLocation as MoveDirection } from 'constants/dnd';
import { isMobileDevice } from 'helpers/device';
import { enableMultiTab } from 'helpers/TabManager';
import {
  addFile,
  deletePortfolioFile,
  downloadPortfolioFile,
  getPortfolioFiles,
  isOpenableFile,
  renamePortfolioFile,
  reorderPortfolioFile
} from 'helpers/portfolio';
import core from 'core';

import '../../constants/bookmarksOutlinesShared.scss';
import './PortfolioPanel.scss';
import { menuTypes } from 'helpers/outlineFlyoutHelper';

const PortfolioPanel = () => {
  const [
    isDisabled,
    tabManager,
    portfolioFiles,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.PORTFOLIO_PANEL),
      selectors.getTabManager(state),
      selectors.getPortfolio(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [activePortfolioItem, setActivePortfolioItem] = useState(null);
  const [isAddingNewFolder, setAddingNewFolder] = useState(false);

  const fileInputRef = useRef(null);

  const onAddFile = () => {
    fileInputRef?.current?.click();
  };

  const addNewFile = async (e) => {
    const files = e.target.files;
    if (files.length === 1) {
      const file = files[0];
      const isNameConflicted = portfolioFiles.some((item) => item.name === file.name);
      if (isNameConflicted) {
        const message = t('portfolio.fileAlreadyExistsMessage', { fileName: file.name });
        const title = t('portfolio.fileAlreadyExists');
        const confirmBtnText = t('portfolio.reselect');
        const warning = {
          message,
          title,
          confirmBtnText,
          onConfirm: () => onAddFile()
        };
        dispatch(actions.showWarningMessage(warning));
      } else {
        const doc = core.getDocument();
        if (doc) {
          const pdfDoc = await doc.getPDFDoc();
          if (pdfDoc) {
            await addFile(pdfDoc, file);
            refreshPortfolio();
          }
        }
      }
    }
  };

  const addNewFolder = (name) => {
    if (!name) {
      name = t('message.untitled');
    }
    // TODO: add new folder to portfolio here
    refreshPortfolio();
  };

  const renamePortfolioItem = async (id, newName) => {
    await renamePortfolioFile(id, newName);
    refreshPortfolio();
  };

  const refreshPortfolio = async () => {
    dispatch(actions.setPortfolio(await getPortfolioFiles()));
    setAddingNewFolder(false);
  };

  const removePortfolioItem = (id) => {
    const fileToRemove = portfolioFiles.find((file) => file.id === id);
    const message = t('portfolio.deletePortfolio', { fileName: fileToRemove.name });
    const title = t('action.delete');
    const confirmBtnText = t('action.delete');
    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: async () => {
        await deletePortfolioFile(id);
        refreshPortfolio();
      },
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const openPortfolioItem = (portfolioItem) => {
    if (!isOpenableFile(portfolioItem.extension)) {
      console.warn(`Cannot open file "${portfolioItem.name}". Extension "${portfolioItem.extension}" is not supported.`);
      return;
    }

    dispatch(enableMultiTab());
    dispatch(actions.addPortfolioTab(portfolioItem));
  };

  const isNameDuplicated = (newName, id) => {
    const otherFiles = portfolioFiles.filter((file) => file.id !== id);
    return otherFiles.some((file) => file.name === newName);
  };

  const downloadPortfolioItem = async (portfolioItem) => {
    dispatch(actions.openElement(DataElements.LOADING_MODAL));
    await downloadPortfolioFile(portfolioItem);
    dispatch(actions.closeElement(DataElements.LOADING_MODAL));
  };

  const movePortfolioInward = (dragItem, dropItem) => {
    /* eslint-disable no-console */
    // no-console function is empty for now
    console.log(dragItem.name, 'Inward', dropItem.name);
    /* eslint-enable no-console */
  };

  const moveFileInArray = async (portfolioFiles, dragItemId, dropItemId, moveDirection) => {
    // clone to another array to avoid modifying portfolioFiles
    const fileArray = [...portfolioFiles];
    const fromIndex = fileArray.findIndex((file) => file.id === dragItemId);
    const dropItemIndex = fileArray.findIndex((file) => file.id === dropItemId);
    let moveToIndex = dropItemIndex;
    // If move 1 to before 3, we want to delete 1 and re-insert at index (3-1=2)
    if (moveDirection === MoveDirection.ABOVE_TARGET && fromIndex < dropItemIndex) {
      moveToIndex = dropItemIndex - 1;
    }
    // If move 3 to after 1, we want to delete 3 and re-insert at index (1+1=2)
    if (moveDirection === MoveDirection.BELOW_TARGET && fromIndex > dropItemIndex) {
      moveToIndex = dropItemIndex + 1;
    }

    // Move elements in an array based on index
    fileArray.splice(moveToIndex, 0, fileArray.splice(fromIndex, 1)[0]);
    for (const [index, file] of fileArray.entries()) {
      if (file.order !== index) {
        await reorderPortfolioFile(file.id, index);
      }
    }
  };

  const movePortfolio = async (fileId, direction) => {
    const portfolioFiles = await getPortfolioFiles();
    const fromIndex = portfolioFiles.findIndex((file) => file.id === fileId);
    const outOfBound = (fromIndex === 0 && direction === menuTypes.MOVE_UP)
      || (fromIndex === portfolioFiles.length - 1 && direction === menuTypes.MOVE_DOWN);
    if (outOfBound) {
      return;
    }
    const moveToIndex = direction === menuTypes.MOVE_UP ? fromIndex - 1 : fromIndex + 1;
    portfolioFiles.splice(moveToIndex, 0, portfolioFiles.splice(fromIndex, 1)[0]);
    for (const [index, file] of portfolioFiles.entries()) {
      if (file.order !== index) {
        await reorderPortfolioFile(file.id, index);
      }
    }
    await refreshPortfolio();
  };

  const movePortfolioBeforeTarget = useCallback(async (dragItemId, dropItemId) => {
    await moveFileInArray(portfolioFiles, dragItemId, dropItemId, MoveDirection.ABOVE_TARGET);
    refreshPortfolio();
  }, [portfolioFiles]);

  const movePortfolioAfterTarget = useCallback(async (dragItemId, dropItemId) => {
    await moveFileInArray(portfolioFiles, dragItemId, dropItemId, MoveDirection.BELOW_TARGET);
    refreshPortfolio();
  }, [portfolioFiles]);

  return isDisabled ? null : (
    <DataElementWrapper
      className="Panel PortfolioPanel bookmark-outline-panel"
      dataElement={DataElements.PORTFOLIO_PANEL}
    >
      <div className="bookmark-outline-panel-header">
        <h2 className="header-title">
          {t('portfolio.portfolioPanelTitle')}
        </h2>

        <div className="portfolio-panel-control">
          <Button
            className="portfolio-panel-control-button"
            dataElement={DataElements.PORTFOLIO_ADD_FILE}
            img="icon-add-file"
            title={t('portfolio.addFile')}
            disabled={isAddingNewFolder}
            onClick={onAddFile}
          />

          <input
            ref={fileInputRef}
            style={{ display: 'none' }}
            type="file"
            onChange={(event) => {
              addNewFile(event);
              event.target.value = null;
            }}
          />
        </div>
      </div>

      <PortfolioContext.Provider
        value={{
          activePortfolioItem,
          setActivePortfolioItem,
          isPortfolioItemActive: (portfolioItem) => portfolioItem?.id === activePortfolioItem,
          isAddingNewFolder,
          setAddingNewFolder,
          addNewFolder,
          renamePortfolioItem,
          removePortfolioItem,
          openPortfolioItem,
          downloadPortfolioItem,
          refreshPortfolio,
          isNameDuplicated,
          tabManager,
        }}
      >
        <DndProvider backend={isMobileDevice ? TouchBackend : HTML5Backend}>
          <PortfolioDragLayer />

          <div className='portfolio-panel-list'>
            {portfolioFiles.map((item) => (
              <PortfolioItem
                key={item.id}
                portfolioItem={item}
                movePortfolioInward={movePortfolioInward}
                movePortfolioBeforeTarget={movePortfolioBeforeTarget}
                movePortfolioAfterTarget={movePortfolioAfterTarget}
                movePortfolio={movePortfolio}
              />
            ))}

            {isAddingNewFolder && (
              <DataElementWrapper className="bookmark-outline-single-container editing">
                <PortfolioItemContent
                  name={''}
                  id={'0'}
                  isFolder
                  isAdding
                />
              </DataElementWrapper>
            )}
          </div>
        </DndProvider>
      </PortfolioContext.Provider>
    </DataElementWrapper>
  );
};

export default PortfolioPanel;
