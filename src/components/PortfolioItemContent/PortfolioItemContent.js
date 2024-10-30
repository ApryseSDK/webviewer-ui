import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { menuTypes } from '../MoreOptionsContextMenuFlyout/MoreOptionsContextMenuFlyout';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';
import { Input } from '@pdftron/webviewer-react-toolkit';
import Button from 'components/Button';
import PortfolioContext from 'components/PortfolioPanel/PortfolioContext';
import { isOpenableFile } from 'helpers/portfolio';
import '../../constants/bookmarksOutlinesShared.scss';
import './PortfolioItemContent.scss';
import PanelListItem from '../PanelListItem/PanelListItem';
import classNames from 'classnames';

const propTypes = {
  portfolioItem: PropTypes.object.isRequired,
  isPortfolioRenaming: PropTypes.bool,
  setPortfolioRenaming: PropTypes.func,
  movePortfolio: PropTypes.func,
};

const PortfolioItemContent = ({
  portfolioItem,
  isPortfolioRenaming,
  setPortfolioRenaming,
  movePortfolio
}) => {
  const {
    refreshPortfolio,
    renamePortfolioItem,
    removePortfolioItem,
    openPortfolioItem,
    downloadPortfolioItem,
    isNameDuplicated,
    setActivePortfolioItem,
  } = useContext(PortfolioContext);

  const { name, nameWithoutExtension, extension, id } = portfolioItem;

  const [t] = useTranslation();
  const inputRef = useRef();
  const [isDefault, setIsDefault] = useState(false);
  const [portfolioEditName, setPortfolioEditName] = useState(nameWithoutExtension);

  const onDoubleClick = useCallback(() => {
    // If the item is in renaming-mode, double-clicking on it won't do anything
    if (isPortfolioRenaming) {
      return;
    }

    openPortfolioItem(portfolioItem);
    setActivePortfolioItem(portfolioItem.id);

  }, [isPortfolioRenaming, portfolioItem, openPortfolioItem, setActivePortfolioItem]);


  const getIcon = () => {
    return 'icon-header-page-manipulation-page-layout-single-page-line';
  };

  const isRenameButtonDisabled = () => {
    return !portfolioEditName || nameWithoutExtension === portfolioEditName || isNameDuplicated(`${portfolioEditName}.${extension}`, id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (isPortfolioRenaming && !isRenameButtonDisabled()) {
        onRenamePortfolioItem();
      }
    }
    if (e.key === 'Escape') {
      onCancelPortfolio();
    }
  };

  const onRenamePortfolioItem = () => {
    setPortfolioRenaming(false);
    renamePortfolioItem(id, `${portfolioEditName}.${extension}`);
  };

  const onCancelPortfolio = () => {
    if (isPortfolioRenaming) {
      setPortfolioRenaming(false);
      setPortfolioEditName(nameWithoutExtension);
    }
    refreshPortfolio();
  };

  const duplicatedMessage = () => {
    if (!isNameDuplicated(`${portfolioEditName}.${extension}`, id)) {
      return '';
    }
    return t('portfolio.fileNameAlreadyExists');
  };

  useEffect(() => {
    // when in adding or renaming mode, input is automatically focused
    if (isPortfolioRenaming) {
      inputRef.current.focus();
      inputRef.current.select();
    }

    setIsDefault(!isPortfolioRenaming);
  }, [isPortfolioRenaming]);

  const handleOnClick = (val) => {
    switch (val) {
      case menuTypes.MOVE_UP:
        movePortfolio(id, val);
        break;
      case menuTypes.MOVE_DOWN:
        movePortfolio(id, val);
        break;
      case menuTypes.OPENFILE:
        if (isOpenableFile(extension)) {
          openPortfolioItem(portfolioItem);
        }
        break;
      case menuTypes.RENAME:
        setPortfolioRenaming(true);
        break;
      case menuTypes.DOWNLOAD:
        downloadPortfolioItem(portfolioItem);
        break;
      case menuTypes.DELETE:
        removePortfolioItem(id);
        break;
      default:
        break;
    }
  };

  const flyoutSelector = `${DataElements.BOOKMARK_OUTLINE_FLYOUT}-${id}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  const contextMenuMoreButtonOptions = {
    moreOptionsDataElement: `portfolio-item-more-button-${id}`,
    flyoutToggleElement: flyoutSelector,
  };

  const contentMenuFlyoutOptions = {
    shouldHideDeleteButton: false,
    currentFlyout,
    flyoutSelector,
    type: 'portfolio',
    handleOnClick,
  };

  return (
    <div className='bookmark-outline-single-container'>
      {isDefault &&
         <PanelListItem iconGlyph={getIcon()} labelHeader={name} enableMoreOptionsContextMenuFlyout={true} onDoubleClick={onDoubleClick} contextMenuMoreButtonOptions={contextMenuMoreButtonOptions} contentMenuFlyoutOptions={contentMenuFlyoutOptions}/>
      }
      {isPortfolioRenaming &&
        <div className={classNames({
          'bookmark-outline-label-row': true,
          'editing': isPortfolioRenaming,
        })}>
          <label className='portfolio-input-label' htmlFor={id}>{t('portfolio.portfolioDocumentTitle')}</label>
          <Input
            id={id}
            type="text"
            name="outline"
            ref={inputRef}
            wrapperClassName="portfolio-input"
            value={portfolioEditName}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPortfolioEditName(e.target.value)}
            fillWidth
            messageText={duplicatedMessage()}
            message={isNameDuplicated(`${portfolioEditName}.${extension}`, id) ? 'warning' : 'default'}
            aria-label={`${t('action.rename')} ${portfolioEditName}.${extension}`}
          />

          <div className="bookmark-outline-editing-controls">
            <Button
              className="bookmark-outline-cancel-button"
              label={t('action.cancel')}
              onClick={onCancelPortfolio}
            />
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
        </div>
      }
    </div>
  );
};

PortfolioItemContent.propTypes = propTypes;

export default PortfolioItemContent;
