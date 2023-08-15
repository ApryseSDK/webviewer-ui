import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Input } from '@pdftron/webviewer-react-toolkit';
import Button from 'components/Button';
import Icon from 'components/Icon';
import PortfolioContext from 'components/PortfolioPanel/PortfolioContext';
import BookmarkOutlineContextMenuPopup from 'components/BookmarkOutlineContextMenuPopup';
import { isOpenableFile } from 'src/helpers/portfolioUtils';

import './PortfolioItemContent.scss';

const propTypes = {
  portfolioItem: PropTypes.object.isRequired,
  isAdding: PropTypes.bool,
  isPortfolioRenaming: PropTypes.bool,
  setPortfolioRenaming: PropTypes.func,
  setIsHovered: PropTypes.func,
};

const PortfolioItemContent = ({
  portfolioItem,
  isAdding,
  isPortfolioRenaming,
  setPortfolioRenaming,
  setIsHovered,
}) => {
  const {
    setAddingNewFolder,
    addNewFolder,
    refreshPortfolio,
    renamePortfolioItem,
    removePortfolioItem,
    openPortfolioItem,
    isNameDuplicated,
  } = useContext(PortfolioContext);

  const { name, id, isFolder } = portfolioItem;

  const [t] = useTranslation();
  const inputRef = useRef();
  const [isDefault, setIsDefault] = useState(false);
  const [portfolioEditName, setPortfolioEditName] = useState(name);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);

  const getIcon = () => {
    return isFolder ? 'icon-folder' : 'icon-header-page-manipulation-page-layout-single-page-line';
  };

  const isRenameButtonDisabled = () => {
    return !portfolioEditName || name === portfolioEditName || isNameDuplicated(portfolioEditName, id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (isAdding) {
        onAddFolder();
      }
      if (isPortfolioRenaming && !isRenameButtonDisabled()) {
        onRenamePortfolioItem();
      }
    }
    if (e.key === 'Escape') {
      onCancelPortfolio();
    }
  };

  const onAddFolder = () => {
    addNewFolder(portfolioEditName.trim() === '' ? '' : portfolioEditName);
  };

  const onRenamePortfolioItem = () => {
    setPortfolioRenaming(false);
    renamePortfolioItem(id, portfolioEditName);
  };

  const onCancelPortfolio = () => {
    if (isPortfolioRenaming) {
      setPortfolioRenaming(false);
      setPortfolioEditName(name);
    }
    if (isAdding) {
      setAddingNewFolder(false);
    }
    refreshPortfolio();
  };

  const onDownloadPortfolioItem = () => {
    // TODO: download document here
    /* eslint-disable no-console */
    console.log('download', name);
    /* eslint-enable no-console */
  };

  const duplicatedMessage = () => {
    if (!isNameDuplicated(portfolioEditName, id)) {
      return '';
    }
    return isFolder ? t('portfolio.folderNameAlreadyExists') : t('portfolio.fileNameAlreadyExists');
  };

  useEffect(() => {
    // when in adding or renaming mode, input is automatically focused
    if (isAdding || isPortfolioRenaming) {
      inputRef.current.focus();
      inputRef.current.select();
    }

    setIsDefault(!isAdding && !isPortfolioRenaming);
  }, [isAdding, isPortfolioRenaming]);

  useEffect(() => {
    if (!isAdding) {
      setIsHovered(isContextMenuOpen);
    }
  }, [isContextMenuOpen]);

  return (
    <div className="bookmark-outline-label-row">
      {isAdding &&
        <div className="bookmark-outline-label">
          {t('portfolio.portfolioNewFolder')}
        </div>
      }

      {isDefault &&
        <>
          <span className="portfolio-item-icon">
            <Icon glyph={getIcon()} color={'inherit'} />
          </span>
          <div
            className="bookmark-outline-text outline-text"
          >
            {name}
          </div>

          <Button
            className="bookmark-outline-more-button"
            dataElement={`portfolio-item-more-button-${id}`}
            img="icon-tool-more"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation(); // click on this button won't select the file/folder
              setContextMenuOpen(true);
            }}
          />

          {isContextMenuOpen &&
            <BookmarkOutlineContextMenuPopup
              type={'portfolio'}
              anchorButton={`portfolio-item-more-button-${id}`}
              onClosePopup={() => setContextMenuOpen(false)}
              onRenameClick={() => {
                setContextMenuOpen(false);
                setPortfolioRenaming(true);
              }}
              onDownloadClick={() => {
                setContextMenuOpen(false);
                onDownloadPortfolioItem();
              }}
              shouldDisplayDeleteButton={true}
              onDeleteClick={() => {
                setContextMenuOpen(false);
                removePortfolioItem(name);
              }}
              onOpenClick={isOpenableFile(portfolioItem) ? () => {
                setContextMenuOpen(false);
                openPortfolioItem(portfolioItem);
              } : null}
            />
          }
        </>
      }

      {(isAdding || isPortfolioRenaming) &&
        <>
          <Input
            type="text"
            name="outline"
            ref={inputRef}
            wrapperClassName="portfolio-input"
            placeholder={isFolder ? t('portfolio.portfolioFolderPlaceholder') : t('portfolio.portfolioFilePlaceholder')}
            aria-label={t('action.name')}
            value={portfolioEditName}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPortfolioEditName(e.target.value)}
            fillWidth
            messageText={duplicatedMessage()}
            message={isNameDuplicated(portfolioEditName, id) ? 'error' : 'default'}
          />

          <div className="bookmark-outline-editing-controls">
            <Button
              className="bookmark-outline-cancel-button"
              label={t('action.cancel')}
              onClick={onCancelPortfolio}
            />
            {isAdding &&
              <Button
                className="bookmark-outline-save-button"
                label={t('action.add')}
                isSubmitType={true}
                onClick={onAddFolder}
              />
            }
            {isPortfolioRenaming &&
              <Button
                className="bookmark-outline-save-button"
                label={t('action.save')}
                isSubmitType={true}
                disabled={isRenameButtonDisabled()}
                onClick={onRenamePortfolioItem}
              />
            }
          </div>
        </>
      }
    </div>
  );
};

PortfolioItemContent.propTypes = propTypes;

export default PortfolioItemContent;
