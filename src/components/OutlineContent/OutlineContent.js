import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import core from 'core';

import Button from '../Button';
import BookmarkOutlineContextMenuPopup from '../BookmarkOutlineContextMenuPopup';
import OutlineContext from '../Outline/Context';
import './OutlineContent.scss';

const propTypes = {
  text: PropTypes.string.isRequired,
  outlinePath: PropTypes.string,
  isAdding: PropTypes.bool,
  isOutlineRenaming: PropTypes.bool,
  setOutlineRenaming: PropTypes.func,
  isOutlineChangingDest: PropTypes.bool,
  setOutlineChangingDest: PropTypes.func,
  setIsHovered: PropTypes.func,
  onCancel: PropTypes.func,
};

const OutlineContent = ({
  text,
  outlinePath,
  isAdding,
  isOutlineRenaming,
  setOutlineRenaming,
  isOutlineChangingDest,
  setOutlineChangingDest,
  setIsHovered,
  onCancel,
}) => {
  const {
    currentDestPage,
    currentDestText,
    editingOutlines,
    setEditingOutlines,
    isMultiSelectMode,
    isOutlineEditable,
    addNewOutline,
    renameOutline,
    updateOutlineDest,
    updateOutlines,
    removeOutlines,
  } = useContext(OutlineContext);

  const [t] = useTranslation();
  const TOOL_NAME = 'OutlineDestinationCreateTool';

  const [isDefault, setIsDefault] = useState(false);
  const [outlineText, setOutlineText] = useState(text);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (isAdding) {
        onAddOutline();
      }
      if (isOutlineRenaming && !isRenameButtonDisabled()) {
        onRenameOutline();
      }
    }
    if (e.key === 'Escape') {
      onCancelOutline();
    }
  };

  const onAddOutline = () => {
    addNewOutline(outlineText.trim() === '' ? '' : outlineText);
  };

  const onRenameOutline = () => {
    setOutlineRenaming(false);
    renameOutline(outlinePath, outlineText);
  };

  const onCancelOutline = () => {
    updateOutlines();
    if (isOutlineRenaming) {
      setOutlineRenaming(false);
      setOutlineText(text);
    }
    if (isOutlineChangingDest) {
      setOutlineChangingDest(false);
    }
    if (isAdding) {
      onCancel();
    }
  };

  const isRenameButtonDisabled = () => {
    return !outlineText || text === outlineText;
  };

  useEffect(() => {
    if (outlineText !== text) {
      setOutlineText(text);
    }
  }, [text]);

  useEffect(() => {
    if (isAdding || isOutlineRenaming) {
      inputRef.current.focus();
      inputRef.current.select();
    }

    setIsDefault(!isAdding && !isOutlineRenaming && !isOutlineChangingDest);
  }, [isOutlineRenaming, isOutlineChangingDest]);

  useEffect(() => {
    const editingOutlinesClone = { ...editingOutlines };
    const isOutlineEditing = isOutlineRenaming || isOutlineChangingDest;
    if (isOutlineEditing) {
      editingOutlinesClone[outlinePath] = (isOutlineEditing);
    } else {
      delete editingOutlinesClone[outlinePath];
    }
    setEditingOutlines({ ...editingOutlinesClone });
  }, [isOutlineRenaming, isOutlineChangingDest]);

  useEffect(() => {
    if (!isAdding) {
      setIsHovered(isContextMenuOpen);
    }
  }, [isContextMenuOpen]);

  return (
    <div className="bookmark-outline-label-row">
      {isAdding &&
        <div className="bookmark-outline-label">
          {t('component.newOutlineTitle')}
        </div>
      }

      {isDefault &&
        <>
          <div
            className="bookmark-outline-text outline-text"
            onDoubleClick={() => {
              if (isOutlineEditable) {
                setOutlineRenaming(true);
              }
            }}
          >
            {text}
          </div>

          {isOutlineEditable &&
            <Button
              className="bookmark-outline-more-button"
              dataElement={`outline-more-button-${outlinePath}`}
              img="icon-tool-more"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setContextMenuOpen(true);
              }}
            />
          }
          {isContextMenuOpen &&
            <BookmarkOutlineContextMenuPopup
              type={'outline'}
              anchorButton={`outline-more-button-${outlinePath}`}
              shouldDisplayDeleteButton={!isMultiSelectMode}
              onClosePopup={() => setContextMenuOpen(false)}
              onRenameClick={() => {
                setContextMenuOpen(false);
                setOutlineRenaming(true);
              }}
              onSetDestinationClick={() => {
                setContextMenuOpen(false);
                setOutlineChangingDest(true);
                core.setToolMode(TOOL_NAME);
              }}
              onDeleteClick={() => {
                setContextMenuOpen(false);
                removeOutlines([outlinePath]);
              }}
            />
          }
        </>
      }

      {isOutlineChangingDest &&
        <div className="bookmark-outline-text outline-text">
          {text}
        </div>
      }

      {(isAdding || isOutlineRenaming) &&
        <input
          type="text"
          name="outline"
          ref={inputRef}
          className="bookmark-outline-input"
          placeholder={t('component.outlineTitle')}
          aria-label={t('action.name')}
          value={outlineText}
          onKeyDown={handleKeyDown}
          onChange={(e) => setOutlineText(e.target.value)}
        />
      }

      {(isAdding || isOutlineChangingDest) &&
        <div className="outline-destination">
          {t('component.destination')}: {t('component.bookmarkPage')} {currentDestPage},
          <span style={{ fontStyle: 'italic' }}> “{currentDestText}”</span>
        </div>
      }

      {(isAdding || isOutlineRenaming || isOutlineChangingDest) &&
        <div className="bookmark-outline-editing-controls">
          <Button
            className="bookmark-outline-cancel-button"
            label={t('action.cancel')}
            onClick={onCancelOutline}
          />
          {isAdding &&
            <Button
              className="bookmark-outline-save-button"
              label={t('action.add')}
              isSubmitType={true}
              onClick={onAddOutline}
            />
          }
          {isOutlineRenaming &&
            <Button
              className="bookmark-outline-save-button"
              label={t('action.save')}
              isSubmitType={true}
              disabled={isRenameButtonDisabled()}
              onClick={onRenameOutline}
            />
          }
          {isOutlineChangingDest &&
            <Button
              className="bookmark-outline-save-button"
              label={t('action.save')}
              isSubmitType={true}
              onClick={() => {
                setOutlineChangingDest(false);
                updateOutlineDest(outlinePath);
              }}
            />
          }
        </div>
      }
    </div>
  );
};

OutlineContent.propTypes = propTypes;

export default OutlineContent;
