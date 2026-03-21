import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useCore from 'hooks/useCore';
import selectors from 'selectors';
import { Virtuoso } from 'react-virtuoso';
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

export const createOutlineVirtuosoComponents = (scrollParent) => {
  const List = React.forwardRef(({ className = '', style, ...listProps }, ref) => (
    <ul
      {...listProps}
      ref={ref}
      className={className ? `${className} panel-list-children` : 'panel-list-children'}
      style={{ ...style, margin: 0 }}
    />
  ));
  List.displayName = 'OutlineChildrenList';
  List.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
  };

  const Item = React.forwardRef(({ children: itemChildren, style, ...itemProps }, ref) => (
    <li {...itemProps} ref={ref} style={style}>
      {itemChildren}
    </li>
  ));
  Item.displayName = 'OutlineChildrenItem';
  Item.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
  };

  const Scroller = React.forwardRef(({ style, ...scrollerProps }, ref) => {
    const scrollerStyle = {
      ...style,
      overflowY: 'hidden',
      overflowX: 'visible',
    };
    if (scrollerStyle.height === 0 || scrollerStyle.height === '0px') {
      scrollerStyle.height = scrollParent?.clientHeight || style?.height || '100%';
    }
    return (
      <div
        {...scrollerProps}
        ref={ref}
        style={scrollerStyle}
      />
    );
  });
  Scroller.displayName = 'OutlineChildrenScroller';
  Scroller.propTypes = {
    style: PropTypes.object,
  };

  return { List, Item, Scroller };
};

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
  updateIsExpanded,
  isRenaming,
  updateIsRenaming,
  isChangingDest,
  updateIsChangingDest,
  onCancel,
  textColor,
  children,
  setMultiSelected,
  moveOutlineInward,
  moveOutlineBeforeTarget,
  moveOutlineAfterTarget
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
  const outlineScrollParentRef = outlineContext?.outlineScrollParentRef;

  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state), shallowEqual);
  const customizableUI = featureFlags.customizableUI;
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

  const childOutlines = Array.isArray(children) ? children : [];
  const [scrollParent, setScrollParent] = useState(null);

  useEffect(() => {
    if (outlineScrollParentRef?.current) {
      setScrollParent(outlineScrollParentRef.current);
    }
  }, [outlineScrollParentRef]);

  const renderContent = useCallback((outline) => (
    <Outline
      key={outlineUtils.getOutlineId(outline)}
      outline={outline}
      setMultiSelected={setMultiSelected}
      moveOutlineInward={moveOutlineInward}
      moveOutlineBeforeTarget={moveOutlineBeforeTarget}
      moveOutlineAfterTarget={moveOutlineAfterTarget}
    />
  ), [moveOutlineAfterTarget, moveOutlineBeforeTarget, moveOutlineInward, setMultiSelected]);

  const virtuosoComponents = useMemo(
    () => createOutlineVirtuosoComponents(scrollParent),
    [scrollParent]
  );

  const virtuosoScrollParent = scrollParent ?? null;

  const renderVirtualizedChildren = useCallback(() => (
    <Virtuoso
      data={childOutlines}
      computeItemKey={(index, outline) => outlineUtils.getOutlineId(outline)}
      components={virtuosoComponents}
      {...(virtuosoScrollParent ? { customScrollParent: virtuosoScrollParent } : {})}
      itemContent={(index, outline) => renderContent(outline)}
    />
  ), [childOutlines, renderContent, virtuosoComponents, virtuosoScrollParent]);


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
          virtualizedChildrenCount={childOutlines.length}
          virtualizedChildrenRenderer={childOutlines.length ? renderVirtualizedChildren : null}
        >
          {!childOutlines.length && null}
        </PanelListItem>
      }

      {isChangingDest &&
        <div
          className="bookmark-outline-text outline-text"
          style={textStyle}
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
          placeholder={customizableUI ? '' : t('component.outlineTitle')}
          aria-label={t('component.newOutlineTitle')}
          value={outlineText}
          onKeyDown={handleKeyDown}
          onChange={(e) => setOutlineText(e.target.value)}
        />
      }

      {(isAdding || isChangingDest) &&
        <div className="outline-destination">
          {t('component.destination')}: {t('component.bookmarkPage')} {currentDestPage},
          <span style={{ fontStyle: 'italic' }}> “{currentDestText}”</span>
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
