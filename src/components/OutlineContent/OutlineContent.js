import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import core from 'core';
import selectors from 'selectors';
import classNames from 'classnames';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import Button from '../Button';
import MoreOptionsContextMenuFlyout, { menuTypes } from '../MoreOptionsContextMenuFlyout/MoreOptionsContextMenuFlyout';
import OutlineContext from '../Outline/Context';
import './OutlineContent.scss';
import '../../constants/bookmarksOutlinesShared.scss';
import DataElements from 'constants/dataElement';

const propTypes = {
  text: PropTypes.string.isRequired,
  outlinePath: PropTypes.string,
  isAdding: PropTypes.bool,
  isOutlineRenaming: PropTypes.bool,
  setOutlineRenaming: PropTypes.func,
  isOutlineChangingDest: PropTypes.bool,
  setOutlineChangingDest: PropTypes.func,
  onCancel: PropTypes.func,
  textColor: PropTypes.string,
  isAnyOutlineRenaming: PropTypes.bool,
};

const OutlineContent = ({
  text,
  outlinePath,
  isAdding,
  isOutlineRenaming,
  setOutlineRenaming,
  isOutlineChangingDest,
  setOutlineChangingDest,
  onCancel,
  textColor,
  isAnyOutlineRenaming
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

  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state), shallowEqual);
  const customizableUI = featureFlags.customizableUI;

  const [t] = useTranslation();
  const TOOL_NAME = 'OutlineDestinationCreateTool';

  const [isDefault, setIsDefault] = useState(false);
  const [outlineText, setOutlineText] = useState(text);
  const [isRenaming, setIsRenaming] = useState(false);
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
    setIsRenaming(false);
    renameOutline(outlinePath, outlineText);
  };

  const onCancelOutline = () => {
    updateOutlines();
    if (isOutlineRenaming) {
      setOutlineRenaming(false);
      setIsRenaming(false);
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

  const textStyle = {
    color: textColor || 'auto'
  };

  const handleOnClick = (val) => {
    switch (val) {
      case menuTypes.RENAME:
        setOutlineRenaming(true);
        setIsRenaming(true);
        break;
      case menuTypes.SETDEST:
        setOutlineChangingDest(true);
        core.setToolMode(TOOL_NAME);
        break;
      case menuTypes.DELETE:
        removeOutlines([outlinePath]);
        break;
      default:
        break;
    }
  };

  const flyoutSelector = `${DataElements.BOOKMARK_OUTLINE_FLYOUT}-${outlinePath}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));
  const type = 'outline';

  return (
    <div className="bookmark-outline-label-row">
      {isAdding &&
        <div className="bookmark-outline-label">
          {t('component.newOutlineTitle')}
        </div>
      }
      {isRenaming &&
        <div className="bookmark-outline-label">
          {t('component.outlineTitle')}
        </div>
      }

      {isDefault &&
        <>
          <div
            className="bookmark-outline-text outline-text"
            onDoubleClick={() => {
              if (isOutlineEditable) {
                setOutlineRenaming(true);
                setIsRenaming(true);
              }
            }}
            style={textStyle}
          >
            {text}
          </div>

          {isOutlineEditable && !isAnyOutlineRenaming &&
            <>
              <ToggleElementButton
                className={classNames({
                  'bookmark-outline-more-button': true,
                })}
                dataElement={`outline-more-button-${outlinePath}`}
                img="icon-tool-more"
                toggleElement={flyoutSelector}
                disabled={false}
              />
              <MoreOptionsContextMenuFlyout
                shouldHideDeleteButton={isMultiSelectMode}
                currentFlyout={currentFlyout}
                flyoutSelector={flyoutSelector}
                type={type}
                handleOnClick={handleOnClick}
              />
            </>
          }
        </>
      }

      {isOutlineChangingDest &&
        <div
          className="bookmark-outline-text outline-text"
          style={textStyle}
        >
          {text}
        </div>
      }

      {(isAdding || isOutlineRenaming) &&
        <input
          type="text"
          name="outline"
          ref={inputRef}
          className="bookmark-outline-input"
          placeholder={customizableUI ? '' : t('component.outlineTitle')}
          aria-label={t('component.newOutlineTitle')}
          value={outlineText}
          onKeyDown={handleKeyDown}
          onChange={(e) => setOutlineText(e.target.value)}
        />
      }

      {(isAdding || isRenaming || isOutlineChangingDest) &&
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
