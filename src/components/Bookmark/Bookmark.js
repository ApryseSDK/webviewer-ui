import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import core from 'core';

import './Bookmark.scss';
import Button from '../Button';
import DataElementWrapper from '../DataElementWrapper';
import BookmarkOutlineContextMenuPopup from '../BookmarkOutlineContextMenuPopup';
import Choice from 'components/Choice';

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
}) => {
  const [t] = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [bookmarkText, setBookmarkText] = useState(text);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [clearSingleClick, setClearSingleClick] = useState(undefined);
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSaveBookmark();
    }
    if (e.keyCode === 27) {
      onCancelBookmark();
    }
  }

  const onSaveBookmark = () => {
    setIsEditing(false);
    onSave(bookmarkText || t('message.untitled'));
  }

  const onCancelBookmark = () => {
    setIsEditing(false);
    // on cancel reset local bookmark text
    isEditing && setBookmarkText(text);
    isAdding && onCancel();
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

  return (
    <DataElementWrapper
      className={classNames({
        'bookmark-outline-single-container': true,
        'adding': isAdding,
        'editing': isEditing,
        'default': isDefault,
        'hover': isContextMenuOpen,
      })}
      onClick={e => {
        if (isDefault && e.detail === 1) {
          setClearSingleClick(setTimeout(() => {
            core.setCurrentPage(pageIndex + 1);
          }, 300))
        }
      }}
      onDoubleClick={() => {
        if (isDefault) {
          clearTimeout(clearSingleClick)
        }
      }}
    >
      {isMultiSelectionMode &&
        <Choice
          type="checkbox"
          className="bookmark-outline-checkbox"
          id={`bookmark-checkbox-${pageIndex + 1}`}
          onClick={e => e.stopPropagation()}
          onChange={e => setSelected(pageIndex, e.target.checked)}
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
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                tabIndex={-1}
              />
            }
            {!isMultiSelectionMode &&
              <Button
                className="bookmark-outline-more-button"
                dataElement={`bookmark-more-button-${pageIndex}`}
                img="icon-tool-more"
                onClick={e => {
                  e.stopPropagation();
                  setContextMenuOpen(true);
                }}
                tabIndex={-1}
              />
            }
            {isContextMenuOpen && (
              <BookmarkOutlineContextMenuPopup
                type={'bookmark'}
                anchorButton={`bookmark-more-button-${pageIndex}`}
                onClosePopup={() => setContextMenuOpen(false)}
                onRenameClick={e => {
                  e.stopPropagation();
                  setContextMenuOpen(false);
                  setIsEditing(true);
                }}
                onDeleteClick={e => {
                  e.stopPropagation();
                  setContextMenuOpen(false);
                  onRemove(pageIndex);
                }}
              />
            )}

            <div
              className="bookmark-outline-text"
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
              className="bookmark-outline-input"
              placeholder={t('component.bookmarkTitle')}
              aria-label={t('action.name')}
              value={bookmarkText}
              onKeyDown={handleKeyDown}
              onChange={e => setBookmarkText(e.target.value)}
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
                  isSubmitType={true}
                  onClick={onSaveBookmark}
                />
              }
              {isEditing &&
                <Button
                  className="bookmark-outline-save-button"
                  label={t('action.save')}
                  isSubmitType={true}
                  disabled={bookmarkText === text}
                  onClick={onSaveBookmark}
                />
              }
            </div>
          </>
        }
      </div>
    </DataElementWrapper>
  )
}

export default Bookmark;
