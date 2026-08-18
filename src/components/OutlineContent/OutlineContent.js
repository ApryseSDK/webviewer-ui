import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useCore from 'hooks/useCore';
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

const propTypes = {
  text: PropTypes.string.isRequired,
  outlinePath: PropTypes.string,
  isAdding: PropTypes.bool,
  isExpanded: PropTypes.bool,
  updateIsExpanded: PropTypes.func,
  isRenaming: PropTypes.bool,
  updateIsRenaming: PropTypes.func,
  isChangingDest: PropTypes.bool,
  updateIsChangingDest: PropTypes.func,
  onCancel: PropTypes.func,
  textColor: PropTypes.string,
  childrenCount: PropTypes.number,
  nestingLevel: PropTypes.number,
  setMultiSelected: PropTypes.func,
};

const OutlineContent = ({
  text,
  outlinePath,
  isAdding,
  isExpanded,
  updateIsExpanded,
  isRenaming,
  updateIsRenaming,
  isChangingDest,
  updateIsChangingDest,
  onCancel,
  textColor,
  childrenCount,
  nestingLevel,
  setMultiSelected,
}) => {
  const outlineContext = useContext(OutlineContext);

  const {
    currentDestPage,
    currentDestText,
    isMultiSelectMode,
    isOutlineEditable,
    addNewOutline,
    renameOutline,
    updateOutlineDest,
    selectedOutlines,
    updateOutlines,
    removeOutlines,
  } = outlineContext || {};

  const { core } = useCore();
  const [t] = useTranslation();
  const inputRef = useRef();
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const TOOL_NAME = 'OutlineDestinationCreateTool';

  const [outlineText, setOutlineText] = useState(text);
  const isDefault = !isAdding && !isRenaming && !isChangingDest;
  const isSelected = selectedOutlines?.includes(outlinePath) || false;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (isAdding) {
        onAddOutline();
      }
      if (isRenaming && !isRenameButtonDisabled()) {
        onRenameOutline();
      }
    }
    if (e.key === 'Escape') {
      onCancelOutline();
    }
  };

  const onAddOutline = () => {
    addNewOutline(outlineText.trim() === '' ? '' : outlineText, activeDocumentViewerKey);
  };

  const onRenameOutline = () => {
    renameOutline(outlinePath, outlineText);
    updateIsRenaming(false);
  };

  const onCancelOutline = () => {
    updateOutlines();
    if (isRenaming) {
      updateIsRenaming(false);
      setOutlineText(text);
    }
    if (isChangingDest) {
      updateIsChangingDest(false);
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
    if (isAdding || isRenaming) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming, isChangingDest]);

  const textStyle = {
    color: textColor || 'auto'
  };

  const handleOnClick = async (val) => {
    switch (val) {
      case menuTypes.RENAME:
        updateIsRenaming(true);
        break;
      case menuTypes.SETDEST:
        updateIsChangingDest(true);
        core.setToolMode(TOOL_NAME);
        break;
      case menuTypes.DELETE:
        removeOutlines([outlinePath]);
        break;
      case menuTypes.MOVE_UP: {
        await outlineUtils.moveOutlineUp(outlinePath, activeDocumentViewerKey);
        updateOutlines();
        break;
      }
      case menuTypes.MOVE_DOWN: {
        await outlineUtils.moveOutlineDown(outlinePath, activeDocumentViewerKey);
        updateOutlines();
        break;
      }
      case menuTypes.MOVE_LEFT: {
        await outlineUtils.moveOutlineOutward(outlinePath, activeDocumentViewerKey);
        updateOutlines();
        break;
      }
      case menuTypes.MOVE_RIGHT: {
        await outlineUtils.moveOutlineInward(outlinePath, activeDocumentViewerKey);
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
      updateIsRenaming(true);
    }
  };

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
          setIsExpandedHandler={updateIsExpanded}
          childrenCount={childrenCount}
          nestingLevel={nestingLevel}
        />
      }

      {isChangingDest &&
        <div
          className="bookmark-outline-text outline-text"
          css={textStyle}
        >
          {text}
        </div>
      }

      {(isAdding || isRenaming) &&
        <input
          type="text"
          name="outline"
          ref={inputRef}
          className="bookmark-outline-input"
          aria-label={t('component.newOutlineTitle')}
          value={outlineText}
          onKeyDown={handleKeyDown}
          onChange={(e) => setOutlineText(e.target.value)}
        />
      }

      {(isAdding || isChangingDest) &&
        <div className="outline-destination">
          {t('component.destination')}: {t('component.bookmarkPage')} {currentDestPage},
          <span className="outline-destination-italic"> “{currentDestText}”</span>
        </div>
      }

      {(isAdding || isRenaming || isChangingDest) &&
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
          {isRenaming &&
            <Button
              className="bookmark-outline-save-button"
              label={t('action.save')}
              isSubmitType={true}
              disabled={isRenameButtonDisabled()}
              onClick={onRenameOutline}
            />
          }
          {isChangingDest &&
            <Button
              className="bookmark-outline-save-button"
              label={t('action.save')}
              isSubmitType={true}
              onClick={() => {
                updateIsChangingDest(false);
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
