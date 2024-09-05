import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import core from 'core';
import PropTypes from 'prop-types';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import Button from '../Button';
import DataElementWrapper from '../DataElementWrapper';
import Choice from 'components/Choice';
import MoreOptionsContextMenuFlyout, { menuTypes } from '../MoreOptionsContextMenuFlyout/MoreOptionsContextMenuFlyout';
import DataElements from 'constants/dataElement';

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

  const flyoutSelector = `${DataElements.BOOKMARK_FLYOUT}-${'outlinePath'}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  return (
    <DataElementWrapper
      className={classNames({
        'bookmark-outline-single-container': true,
        'editing': isAdding || isEditing,
        'default': isDefault,
      })}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setCurrentPage(pageIndex);
        }
      }}
      onClick={(e) => {
        if (isDefault && e.detail === 1) {
          setClearSingleClick(setTimeout(() => {
            setCurrentPage(pageIndex);
          }, 300));
        }
      }}
      onDoubleClick={() => {
        if (isDefault) {
          clearTimeout(clearSingleClick);
        }
      }}
    >
      {isMultiSelectionMode &&
        <Choice
          type="checkbox"
          className="bookmark-outline-checkbox"
          id={`bookmark-checkbox-${pageIndex + 1}`}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setSelected(pageIndex, e.target.checked)}
        />
      }

      <div className="bookmark-outline-label-row">
        <div className="bookmark-outline-label">{(isAdding || isEditing) ? label : defaultLabel}</div>

        {isDefault &&
          <>
            {isMultiSelectionMode &&
              <Button
                className="bookmark-outline-more-button"
                dataElement={`bookmark-more-button-${pageIndex}`}
                img="icon-pencil-line"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                tabIndex={-1}
              />
            }
            {!isMultiSelectionMode &&
              <ToggleElementButton
                className="bookmark-outline-more-button"
                dataElement={`bookmark-more-button-${panelSelector}-${pageIndex}`}
                img="icon-tool-more"
                toggleElement={flyoutSelector}
                disabled={false}
              />
            }
            <MoreOptionsContextMenuFlyout
              shouldHideDeleteButton={false}
              currentFlyout={currentFlyout}
              flyoutSelector={flyoutSelector}
              type={'bookmark'}
              handleOnClick={handleOnClick}
            />
            <div
              className="bookmark-outline-text bookmark-text-input"
              onDoubleClick={() => setIsEditing(true)}
            >
              {text}
            </div>
          </>
        }

        {(isAdding || isEditing) &&
          <>
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
              <Button
                className="bookmark-outline-cancel-button"
                label={t('action.cancel')}
                onClick={onCancelBookmark}
              />
              {isAdding &&
                <Button
                  className="bookmark-outline-save-button"
                  label={t('action.add')}
                  isSubmitType
                  onClick={onSaveBookmark}
                />
              }
              {isEditing &&
                <Button
                  className="bookmark-outline-save-button"
                  label={t('action.save')}
                  isSubmitType
                  disabled={isRenameButtonDisabled()}
                  onClick={onSaveBookmark}
                />
              }
            </div>
          </>
        }
      </div>
    </DataElementWrapper>
  );
};

Bookmark.propTypes = propTypes;

export default Bookmark;
