import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { useSelector, useDispatch, useStore } from 'react-redux';
import FocusTrap from 'components/FocusTrap';
import { useTranslation } from 'react-i18next';
import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { isMobile as isMobileCSS, isIE, isMobileDevice, isFirefox, isMac } from 'helpers/device';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';

import './ContextMenuPopup.scss';

const OfficeActionItem = ({ dataElement, onClick, img, title, shortcut = '', disabled = false }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled) {
      onClick();
      dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
    }
  };

  return (
    <div
      className={classNames('office-action-item', { disabled })}
      onClick={(e) => {
        if (!disabled) {
          onClick();
          dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
        }
        // prevent bubbling up click event to control when context menu is closed within this component
        e.stopPropagation();
      }}
      tabIndex={disabled ? -1 : 0}
      data-element={dataElement}
      onKeyDown={onKeyDown}
    >
      <div className="icon-title">
        {img && <Icon glyph={img} disabled={disabled} />}
        {!img && <span className="Icon"></span>}
        <div>{t(title)}</div>
      </div>
      <div className="shortcut">{shortcut}</div>
    </div>
  );
};

const ContextMenuPopup = ({
  clickPosition,
}) => {

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.CONTEXT_MENU_POPUP));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.CONTEXT_MENU_POPUP));
  const isRightClickAnnotationPopupEnabled = useSelector(selectors.isRightClickAnnotationPopupEnabled);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isCursorInTable = useSelector(selectors.isCursorInTable);
  const isSpreadsheetEditorModeEnabled = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;

  const [isSpreadsheetAndReadOnlyMode, setIsSpreadsheetAndReadOnlyMode] = useState(isSpreadsheetEditorModeEnabled && isReadOnlyMode);

  const [t] = useTranslation();
  const dispatch = useDispatch();
  // this is hacky, hopefully we can remove this when tool group button is restructured
  const store = useStore();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef();
  // if right click menu is not turned on, on tablet + phone, ContextMenuPopup won't be available
  // if it's on, on tablet + phone, it will be available without being draggable
  const isMobile = !!isMobileDevice || isMobileCSS();

  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          DataElements.ANNOTATION_POPUP,
          DataElements.TEXT_POPUP,
          DataElements.INLINE_COMMENT_POPUP,
        ])
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;
    setIsSpreadsheetAndReadOnlyMode(isSpreadsheetEditorModeEnabled && isReadOnlyMode);
  }, [isSpreadsheetEditorModeEnabled, spreadsheetEditorEditMode]);

  useLayoutEffect(() => {
    if (isSpreadsheetAndReadOnlyMode) {
      return;
    }

    const { width, height } = popupRef.current.getBoundingClientRect();
    const documentContainerSelector = isMultiViewerMode ? `#DocumentContainer${activeDocumentViewerKey}` : '.DocumentContainer';
    const documentContainer = getRootNode().querySelector(documentContainerSelector);
    if (!documentContainer) {
      return;
    }

    const containerBox = documentContainer.getBoundingClientRect();
    const { left, top } = adjustPopupPosition(clickPosition, containerBox, width, height);
    setPosition({ left, top });
  }, [clickPosition, isMultiViewerMode, activeDocumentViewerKey, isSpreadsheetAndReadOnlyMode]);

  /**
   * Adjusts the position of the popup relative to the container.
   */
  const adjustPopupPosition = (clickPos, containerBox, width, height) => {
    let { left, top } = clickPos;
    const { offsetLeft, offsetTop } = getOffsetAdjustments();

    left -= offsetLeft;
    top -= offsetTop;

    const horizontalGap = 2;
    const verticalGap = 2;

    if (left < containerBox.left - offsetLeft) {
      left = containerBox.left + horizontalGap - offsetLeft;
    }

    if (left + width > containerBox.right - offsetLeft) {
      left = containerBox.right - width - horizontalGap - offsetLeft;
    }

    if (top < containerBox.top - offsetTop) {
      top = containerBox.top + verticalGap - offsetTop;
    }

    if (top + height > containerBox.bottom - offsetTop) {
      top = containerBox.bottom - height - verticalGap;
    }

    return { left, top };
  };

  /**
   * Retrieves offset adjustments if the app is running inside a Web Component.
   */
  const getOffsetAdjustments = () => {
    let offsetLeft = 0;
    let offsetTop = 0;

    if (window.isApryseWebViewerWebComponent) {
      const host = getRootNode()?.host;
      const hostBoundingRect = host?.getBoundingClientRect();

      if (hostBoundingRect) {
        offsetLeft = hostBoundingRect.left;
        offsetTop = hostBoundingRect.top;

        // Include host scroll offsets
        offsetLeft += host.scrollLeft;
        offsetTop += host.scrollTop;
      }
    }
    return { offsetLeft, offsetTop };
  };

  const modifierKey = isMac ? '⌘ Command' : 'Ctrl';
  const modifierKeyShort = isMac ? '⌘Cmd' : 'Ctrl';

  const handlePaste = (withFormatting = true) => {
    if (!isFirefox) {
      core.getOfficeEditor().pasteText(withFormatting);
      return;
    }

    const title = withFormatting ? t('officeEditor.pastingTitle') : t('officeEditor.pastingWithoutFormatTitle');
    const message = withFormatting ? t('officeEditor.pastingMessage') : t('officeEditor.pastingWithoutFormatMessage');
    const keyboardShortcut = withFormatting ? `${modifierKey} + V` : `${modifierKey} + Shift + V`;
    const confirmBtnText = t('action.close');

    const warning = {
      message: `${message}:\n\n${keyboardShortcut}`,
      title,
      confirmBtnText,
      onConfirm: () => {
        // setTimeout needed because the focus can not be set immediately after closing the warning modal
        setTimeout(() => {
          core.getViewerElement().focus();
        });
      },
      onCancel: () => {
        setTimeout(() => {
          core.getViewerElement().focus();
        });
      },
    };
    dispatch(actions.showWarningMessage(warning));

  };

  if (isDisabled) {
    return null;
  }

  const contextMenuPopup = (
    <div
      className={classNames('Popup', 'ContextMenuPopup', {
        open: isOpen,
        closed: !isOpen,
        isOfficeEditor: isOfficeEditorMode(),
        'is-vertical': isRightClickAnnotationPopupEnabled && !isOfficeEditorMode(),
        'is-horizontal': !isRightClickAnnotationPopupEnabled && !isOfficeEditorMode(),
      })}
      ref={popupRef}
      data-element={DataElements.CONTEXT_MENU_POPUP}
      style={{ ...position }}
      onClick={() => dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP))}
    >
      <FocusTrap locked={isOpen && position.top !== 0 && position.left !== 0}>
        <div className="container">
          {isOfficeEditorMode() ? (
            <>
              <OfficeActionItem
                title="action.cut"
                img="icon-cut"
                dataElement={DataElements.OFFICE_EDITOR_CUT}
                onClick={() => core.getOfficeEditor().cutSelectedText()}
                shortcut={`${modifierKeyShort}+X`}
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
              <OfficeActionItem
                title="action.copy"
                img="icon-copy"
                dataElement={DataElements.OFFICE_EDITOR_COPY}
                onClick={() => core.getOfficeEditor().copySelectedText()}
                shortcut={`${modifierKeyShort}+C`}
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
              <OfficeActionItem
                title="action.paste"
                img="icon-paste"
                dataElement={DataElements.OFFICE_EDITOR_PASTE}
                onClick={() => handlePaste()}
                shortcut={`${modifierKeyShort}+V`}
              />
              <OfficeActionItem
                title="action.pasteWithoutFormatting"
                img="icon-paste-without-formatting"
                dataElement={DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING}
                onClick={() => handlePaste(false)}
                shortcut={`${modifierKeyShort}+Shift+V`}
              />
              {!isCursorInTable && (
                <OfficeActionItem
                  title="action.delete"
                  img="icon-delete-line"
                  dataElement={DataElements.OFFICE_EDITOR_DELETE}
                  onClick={() => core.getOfficeEditor().removeSelection()}
                  disabled={!(core.getOfficeEditor().isTextSelected() || core.getOfficeEditor().isImageSelected())}
                />
              )}
              {isCursorInTable && (
                <>
                  <div className="divider"></div>
                  <OfficeActionItem
                    title="officeEditor.insertRowAbove"
                    dataElement={DataElements.OFFICE_EDITOR_INSERT_ROW_ABOVE}
                    onClick={() => core.getOfficeEditor().insertRows(1, true)}
                  />
                  <OfficeActionItem
                    title="officeEditor.insertRowBelow"
                    dataElement={DataElements.OFFICE_EDITOR_INSERT_ROW_BELOW}
                    onClick={() => core.getOfficeEditor().insertRows(1, false)}
                  />
                  <OfficeActionItem
                    title="officeEditor.insertColumnRight"
                    dataElement={DataElements.OFFICE_EDITOR_INSERT_COLUMN_RIGHT}
                    onClick={() => core.getOfficeEditor().insertColumns(1, true)}
                  />
                  <OfficeActionItem
                    title="officeEditor.insertColumnLeft"
                    dataElement={DataElements.OFFICE_EDITOR_INSERT_COLUMN_LEFT}
                    onClick={() => core.getOfficeEditor().insertColumns(1, false)}
                  />
                  <OfficeActionItem
                    title="officeEditor.deleteRow"
                    dataElement={DataElements.OFFICE_EDITOR_DELETE_ROW}
                    onClick={() => core.getOfficeEditor().removeRows()}
                  />
                  <OfficeActionItem
                    title="officeEditor.deleteColumn"
                    dataElement={DataElements.OFFICE_EDITOR_DELETE_COLUMN}
                    onClick={() => core.getOfficeEditor().removeColumns()}
                  />
                  <OfficeActionItem
                    title="officeEditor.deleteTable"
                    dataElement={DataElements.OFFICE_EDITOR_DELETE_TABLE}
                    onClick={() => core.getOfficeEditor().removeTable()}
                  />
                </>
              )}
            </>
          ) : (
            <CustomizablePopup
              dataElement={DataElements.CONTEXT_MENU_POPUP}
              childrenClassName='main-menu-button'
            >
              <ActionButton
                className="main-menu-button"
                dataElement="panToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'tool.pan' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'tool.pan' : ''}
                img="icon-header-pan"
                onClick={() => setToolModeAndGroup(store, 'Pan')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="stickyToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.stickyNote' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.stickyNote' : ''}
                img="icon-tool-comment-line"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateSticky')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="highlightToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.highlight' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.highlight' : ''}
                img="icon-tool-highlight"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateTextHighlight')
                }
              />
              <ActionButton
                className="main-menu-button"
                dataElement="freeHandToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.freehand' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.freehand' : ''}
                img="icon-tool-pen-line"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHand')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="freeHandHighlightToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.freeHandHighlight' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.freeHandHighlight' : ''}
                img="icon-tool-pen-highlight"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHandHighlight')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="freeTextToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.freetext' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.freetext' : ''}
                img="icon-tool-text-free-text"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeText')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="markInsertTextToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.markInsertText' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.markInsertText' : ''}
                img="ic-insert text"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateMarkInsertText')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="markReplaceTextToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.markReplaceText' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.markReplaceText' : ''}
                img="ic-replace text"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateMarkReplaceText')}
              />
            </CustomizablePopup>
          )}
        </div>
      </FocusTrap>
    </div>
  );

  if (isSpreadsheetAndReadOnlyMode) {
    return null;
  }

  return isIE || isMobile ? (
    contextMenuPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{contextMenuPopup}</Draggable>
  );
};

export default React.memo(ContextMenuPopup);
