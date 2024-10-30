import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import core from 'core';
import PropTypes from 'prop-types';
import Button from '../Button';
import TextButton from '../TextButton';
import DataElementWrapper from '../DataElementWrapper';
import { menuTypes } from '../MoreOptionsContextMenuFlyout/MoreOptionsContextMenuFlyout';
import DataElements from 'constants/dataElement';
import PanelListItem from 'components/PanelListItem';

import '../../constants/bookmarksOutlinesShared.scss';

const propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultLabel: PropTypes.string,
  pageIndex: PropTypes.number.isRequired,
  isAdding: PropTypes.bool,
  isMultiSelectionMode: PropTypes.bool,
  setSelected: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  panelSelector: PropTypes.string,
};

const Bookmark = ({
  text,
  label,
  defaultLabel,
  pageIndex,
  isAdding,
  isMultiSelectionMode,
  setSelected,
  onSave,
  onRemove,
  onCancel,
  panelSelector,
}) => {
  const [t] = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [bookmarkText, setBookmarkText] = useState(text);
  const [clearSingleClick, setClearSingleClick] = useState(undefined);
  const inputRef = useRef();

  const isRenameButtonDisabled = () => {
    return !bookmarkText || text === bookmarkText;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (isAdding || (isEditing && !isRenameButtonDisabled())) {
        onSaveBookmark();
      }
    }
    if (e.key === 'Escape') {
      onCancelBookmark();
    }
  };

  const onSaveBookmark = () => {
    setIsEditing(false);
    onSave(bookmarkText.trim() === '' ? t('message.untitled') : bookmarkText);
  };

  const onCancelBookmark = () => {
    setIsEditing(false);
    // on cancel reset local bookmark text
    isEditing && setBookmarkText(text);
    isAdding && onCancel();
  };

  const setCurrentPage = (pageIndex) => {
    core.setCurrentPage(pageIndex + 1);
  };

  useEffect(() => {
    if (bookmarkText !== text) {
      setBookmarkText(text);
    }
  }, [text]);

  useEffect(() => {
    if (isAdding || isEditing) {
      inputRef.current.focus();
      inputRef.current.select();
    }

    if (!isAdding && !isEditing) {
      setIsDefault(true);
    } else {
      setIsDefault(false);
    }
  }, [isEditing]);

  const handleOnClick = (val) => {
    switch (val) {
      case menuTypes.RENAME:
        setIsEditing(true);
        break;
      case menuTypes.DELETE:
        onRemove(pageIndex);
        break;
      default:
        break;
    }
  };

  const flyoutSelector = `${DataElements.BOOKMARK_FLYOUT}-${pageIndex}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));
  const bookmarkMoreOptionsDataElement = `bookmark-more-button-${panelSelector}-${pageIndex}`;
  const panelListType = 'bookmark';

  const bookmarkPanelListProps = {
    labelHeader: defaultLabel,
    description: text,
    enableMoreOptionsContextMenuFlyout: true,
    contentMenuFlyoutOptions: {
      shouldHideDeleteButton: false,
      currentFlyout: currentFlyout,
      flyoutSelector: flyoutSelector,
      type: panelListType,
      handleOnClick : handleOnClick,
    },
    contextMenuMoreButtonOptions: {
      flyoutToggleElement: flyoutSelector,
      moreOptionsDataElement: bookmarkMoreOptionsDataElement,
    },
    onClick: (e) => {
      if (isDefault && e.detail === 1) {
        setClearSingleClick(setTimeout(() => {
          setCurrentPage(pageIndex);
        }, 300));
      }
    },
    onDoubleClick: () => {
      if (isDefault) {
        setIsEditing(true);
      }
    },
    checkboxOptions: {
      id: `bookmark-checkbox-${pageIndex + 1}`,
      onChange: (e) => {
        setSelected(pageIndex, e.target.checked);
      },
      ariaLabel: `${t('action.select')} ${label}`,
      disabled: !isMultiSelectionMode
    }
  };

  return (
    <>
      {isDefault && <PanelListItem {...bookmarkPanelListProps} />}
      {(isAdding || isEditing) && <DataElementWrapper
        className={classNames({
          'bookmark-outline-single-container': true,
          'editing': isAdding || isEditing,
          'default': isDefault,
        })}
        onDoubleClick={() => {
          if (isDefault) {
            clearTimeout(clearSingleClick);
          }
        }}
      >
        <div className="bookmark-outline-label-row">
          <div className="bookmark-outline-label">{(isAdding || isEditing) ? label : defaultLabel}</div>
          <input
            type="text"
            name="bookmark"
            ref={inputRef}
            className="bookmark-outline-input bookmark-text-input"
            aria-label={t('action.name')}
            value={bookmarkText}
            onKeyDown={handleKeyDown}
            onChange={(e) => setBookmarkText(e.target.value)}
          />
          <div className="bookmark-outline-editing-controls">
            <TextButton
              label={t('action.cancel')}
              onClick={onCancelBookmark}
              ariaLabel={`${t('action.cancel')} ${t('component.bookmarkPanel')}`}
            />
            {isAdding &&
              <Button
                className="bookmark-outline-save-button"
                label={t('action.add')}
                isSubmitType
                onClick={onSaveBookmark}
                ariaLabel={`${t('action.add')} ${t('component.bookmarkPanel')}`}
              />
            }
            {isEditing &&
              <Button
                className="bookmark-outline-save-button"
                label={t('action.save')}
                isSubmitType
                disabled={isRenameButtonDisabled()}
                onClick={onSaveBookmark}
                ariaLabel={`${t('action.save')} ${t('component.bookmarkPanel')}`}
              />
            }
          </div>
        </div>
      </DataElementWrapper>}
    </>
  );
};

Bookmark.propTypes = propTypes;

export default Bookmark;