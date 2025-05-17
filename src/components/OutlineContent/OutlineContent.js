import React, { useContext, useEffect, useRef, useState, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import core from 'core';
import selectors from 'selectors';
import Button from '../Button';
import TextButton from '../TextButton';
import { menuTypes } from 'helpers/outlineFlyoutHelper';
import OutlineContext from '../Outline/Context';
import './OutlineContent.scss';
import '../../constants/bookmarksOutlinesShared.scss';
import DataElements from 'constants/dataElement';
import PanelListItem from '../PanelListItem';
import outlineUtils from 'helpers/OutlineUtils';

const Outline = lazy(() => import('../Outline'));

const propTypes = {
  text: PropTypes.string.isRequired,
  outlinePath: PropTypes.string,
  isAdding: PropTypes.bool,
  isExpanded: PropTypes.bool,
  setIsExpanded: PropTypes.func,
  isOutlineRenaming: PropTypes.bool,
  setOutlineRenaming: PropTypes.func,
  isOutlineChangingDest: PropTypes.bool,
  setOutlineChangingDest: PropTypes.func,
  onCancel: PropTypes.func,
  textColor: PropTypes.string,
  children: PropTypes.array,
  setMultiSelected: PropTypes.func,
  moveOutlineInward: PropTypes.func,
  moveOutlineBeforeTarget: PropTypes.func,
  moveOutlineAfterTarget: PropTypes.func,
};

const OutlineContent = ({
  text,
  outlinePath,
  isAdding,
  isExpanded,
  setIsExpanded,
  isOutlineRenaming,
  setOutlineRenaming,
  isOutlineChangingDest,
  setOutlineChangingDest,
  onCancel,
  textColor,
  children,
  setMultiSelected,
  moveOutlineInward,
  moveOutlineBeforeTarget,
  moveOutlineAfterTarget
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
    selectedOutlines,
    updateOutlines,
    removeOutlines,
  } = useContext(OutlineContext);

  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state), shallowEqual);
  const customizableUI = featureFlags.customizableUI;

  const [t] = useTranslation();
  const TOOL_NAME = 'OutlineDestinationCreateTool';

  const [isDefault, setIsDefault] = useState(false);
  const [outlineText, setOutlineText] = useState(text);
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

  const isSelected = selectedOutlines?.includes(outlinePath) || false;

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

  const textStyle = {
    color: textColor || 'auto'
  };

  const handleOnClick = async (val) => {
    switch (val) {
      case menuTypes.RENAME:
        setOutlineRenaming(true);
        break;
      case menuTypes.SETDEST:
        setOutlineChangingDest(true);
        core.setToolMode(TOOL_NAME);
        break;
      case menuTypes.DELETE:
        removeOutlines([outlinePath]);
        break;
      case menuTypes.MOVE_UP: {
        await outlineUtils.moveOutlineUp(outlinePath);
        updateOutlines();
        break;
      }
      case menuTypes.MOVE_DOWN: {
        await outlineUtils.moveOutlineDown(outlinePath);
        updateOutlines();
        break;
      }
      case menuTypes.MOVE_LEFT: {
        await outlineUtils.moveOutlineOutward(outlinePath);
        updateOutlines();
        break;
      }
      case menuTypes.MOVE_RIGHT: {
        await outlineUtils.moveOutlineInward(outlinePath);
        updateOutlines();
        break;
      }
      default:
        break;
    }
  };

  const flyoutSelector = DataElements.BOOKMARK_OUTLINE_FLYOUT;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));
  const type = 'outline';

  const contentMenuFlyoutOptions = {
    shouldHideDeleteButton: false,
    currentFlyout: currentFlyout,
    flyoutSelector: flyoutSelector,
    type: type,
    handleOnClick: handleOnClick
  };

  const contextMenuMoreButtonOptions = {
    flyoutToggleElement: 'bookmarkOutlineFlyout',
    moreOptionsDataElement: `outline-more-button-${outlinePath}`,
  };

  const checkboxOptions = {
    id:`outline-checkbox-${outlinePath}`,
    checked: isSelected,
    onChange: (e) => {
      setMultiSelected(outlinePath, e.target.checked);
    },
    ariaLabel: text,
    disabled: !isMultiSelectMode
  };

  const onDoubleClick = () => {
    if (isOutlineEditable) {
      setOutlineRenaming(true);
    }
  };

  const renderContent = (outline) => {
    return (
      <Outline
        key={outlineUtils.getOutlineId(outline)}
        outline={outline}
        setMultiSelected={setMultiSelected}
        moveOutlineInward={moveOutlineInward}
        moveOutlineBeforeTarget={moveOutlineBeforeTarget}
        moveOutlineAfterTarget={moveOutlineAfterTarget}
      />
    );
  };

  return (
    <div className="bookmark-outline-label-row">
      {isAdding &&
        <div className="bookmark-outline-label">
          {t('component.newOutlineTitle')}
        </div>
      }
      {isOutlineRenaming &&
        <div className="bookmark-outline-label">
          {t('component.outlineTitle')}
        </div>
      }

      {isDefault &&
        <PanelListItem
          key={outlinePath}
          labelHeader={text}
          textColor={textColor}
          enableMoreOptionsContextMenuFlyout={isOutlineEditable}
          onDoubleClick={onDoubleClick}
          checkboxOptions={checkboxOptions}
          contentMenuFlyoutOptions={contentMenuFlyoutOptions}
          contextMenuMoreButtonOptions={contextMenuMoreButtonOptions}
          expanded={isExpanded}
          setIsExpandedHandler={setIsExpanded}
        >
          {children.map((outline) => {
            return renderContent(outline);
          })}
        </PanelListItem>
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

      {(isAdding || isOutlineChangingDest) &&
        <div className="outline-destination">
          {t('component.destination')}: {t('component.bookmarkPage')} {currentDestPage},
          <span style={{ fontStyle: 'italic' }}> “{currentDestText}”</span>
        </div>
      }

      {(isAdding || isOutlineRenaming || isOutlineChangingDest) &&
        <div className="bookmark-outline-editing-controls">
          <TextButton
            className="bookmark-outline-cancel-button"
            label={t('action.cancel')}
            ariaLabel={`${t('action.cancel')} ${t('component.outlineTitle')}`}
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
