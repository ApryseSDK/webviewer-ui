import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, useStore, shallowEqual } from 'react-redux';
import FocusTrap from 'components/FocusTrap';
import { useTranslation } from 'react-i18next';
import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';
import OfficeActionItem from './OfficeActionItem';
import useOnClickOutside from 'hooks/useOnClickOutside';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';
import useCore from 'hooks/useCore';
import { isMobile as isMobileCSS, isIE, isMobileDevice, isFirefox, isMac } from 'helpers/device';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';
import { EditingStreamType } from 'constants/officeEditor';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { OFFICE_EDITOR_CONTEXT_MENU_TABLE_DIVIDER } from 'src/redux/officeEditorModularComponents';

import './ContextMenuPopup.scss';

const ContextMenuPopup = ({
  clickPosition,
}) => {
  const { core } = useCore();
  const isOfficeEditor = isOfficeEditorMode();
  const officeEditor = isOfficeEditor ? core.getOfficeEditor() : null;

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.CONTEXT_MENU_POPUP));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.CONTEXT_MENU_POPUP));
  const isRightClickAnnotationPopupEnabled = useSelector(selectors.isRightClickAnnotationPopupEnabled);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const popupItems = useSelector(
    (state) => selectors.getPopupItems(state, DataElements.CONTEXT_MENU_POPUP),
    shallowEqual,
  );
  const isCursorInTable = useSelector(selectors.isCursorInTable);
  const isSpreadsheetEditorModeEnabled = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);

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

    left -= offsetLeft + window.scrollX;
    top -= offsetTop + window.scrollY;

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
      top = containerBox.bottom - offsetTop - height - verticalGap;
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

  const getTableActionItem = (title, onClick) => ({ title, onClick });

  const getTableOnlyOfficePopupItem = (dataElement) => {
    switch (dataElement) {
      case OFFICE_EDITOR_CONTEXT_MENU_TABLE_DIVIDER:
        return { type: ITEM_TYPE.DIVIDER };
      case DataElements.OFFICE_EDITOR_INSERT_ROW_ABOVE:
        return getTableActionItem('officeEditor.insertRowAbove', () => officeEditor.insertRows(true));
      case DataElements.OFFICE_EDITOR_INSERT_ROW_BELOW:
        return getTableActionItem('officeEditor.insertRowBelow', () => officeEditor.insertRows(false));
      case DataElements.OFFICE_EDITOR_INSERT_COLUMN_RIGHT:
        return getTableActionItem('officeEditor.insertColumnRight', () => officeEditor.insertColumns(true));
      case DataElements.OFFICE_EDITOR_INSERT_COLUMN_LEFT:
        return getTableActionItem('officeEditor.insertColumnLeft', () => officeEditor.insertColumns(false));
      case DataElements.OFFICE_EDITOR_DELETE_ROW:
        return getTableActionItem('officeEditor.deleteRow', () => officeEditor.removeRows());
      case DataElements.OFFICE_EDITOR_DELETE_COLUMN:
        return getTableActionItem('officeEditor.deleteColumn', () => officeEditor.removeColumns());
      case DataElements.OFFICE_EDITOR_DELETE_TABLE:
        return getTableActionItem('officeEditor.deleteTable', () => officeEditor.removeTable());
      default:
        return undefined;
    }
  };

  // `null` means the item should be explicitly hidden for current context.
  // `undefined` means there is no built-in default mapping, so caller can still render custom action items.
  const getDefaultOfficePopupItemProps = (dataElement) => {
    const tableOnlyItem = getTableOnlyOfficePopupItem(dataElement);
    if (tableOnlyItem) {
      return isCursorInTable ? tableOnlyItem : null;
    }

    if (dataElement === DataElements.OFFICE_EDITOR_DELETE && isCursorInTable) {
      return null;
    }

    switch (dataElement) {
      case DataElements.OFFICE_EDITOR_CUT:
        return {
          title: 'action.cut',
          img: 'icon-cut',
          onClick: () => officeEditor.cutSelectedText(),
          shortcut: `${modifierKeyShort}+X`,
          disabled: !officeEditor.isTextSelected(),
        };
      case DataElements.OFFICE_EDITOR_COPY:
        return {
          title: 'action.copy',
          img: 'icon-copy',
          onClick: () => officeEditor.copySelectedText(),
          shortcut: `${modifierKeyShort}+C`,
          disabled: !officeEditor.isTextSelected(),
        };
      case DataElements.OFFICE_EDITOR_PASTE:
        return {
          title: 'action.paste',
          img: 'icon-paste',
          onClick: () => handlePaste(),
          shortcut: `${modifierKeyShort}+V`,
        };
      case DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING:
        return {
          title: 'action.pasteWithoutFormatting',
          img: 'icon-paste-without-formatting',
          onClick: () => handlePaste(false),
          shortcut: `${modifierKeyShort}+Shift+V`,
        };
      case DataElements.OFFICE_EDITOR_ADD_COMMENT:
        return {
          title: 'action.addComment',
          img: 'icon-tool-comment-line',
          onClick: () => officeEditor.getCommentManager().addCommentThreadAtCurrentRange(''),
          disabled: activeStream !== EditingStreamType.BODY,
        };
      case DataElements.OFFICE_EDITOR_DELETE:
        return {
          title: 'action.delete',
          img: 'icon-delete-line',
          onClick: () => officeEditor.removeSelection(),
          disabled: !(officeEditor.isTextSelected() || officeEditor.isImageSelected()),
        };
      default:
        return undefined;
    }
  };

  const renderOfficePopupItem = (item, index) => {
    const mediaQueryClassName = item.hidden?.map((screen) => `hide-in-${screen}`).join(' ');
    const key = `${item.type || 'actionButton'}-${item.dataElement || index}`;
    const defaultOfficeItemProps = item.dataElement ? getDefaultOfficePopupItemProps(item.dataElement) : undefined;
    const shouldHideItem = defaultOfficeItemProps === null; // we explicitly filter out null items but allow undefined items that can be custom action items from the user
    if (shouldHideItem) {
      return null;
    }

    const officePopupItem = {
      ...defaultOfficeItemProps,
      ...item,
      mediaQueryClassName,
    };

    if (officePopupItem.type === 'divider' || officePopupItem.type === 'spacer') {
      return (
        <div
          key={key}
          data-element={officePopupItem.dataElement}
          className={classNames(officePopupItem.type === 'spacer' ? 'spacer' : 'divider', mediaQueryClassName)}
        />
      );
    }

    if (defaultOfficeItemProps || officePopupItem.type === 'actionButton') {
      return (
        <OfficeActionItem
          key={key}
          {...officePopupItem}
        />
      );
    }

    return null;
  };

  if (isDisabled) {
    return null;
  }

  const contextMenuPopup = (
    <div
      className={classNames('Popup', 'ContextMenuPopup', {
        open: isOpen,
        closed: !isOpen,
        isOfficeEditor,
        'is-vertical': isRightClickAnnotationPopupEnabled && !isOfficeEditor,
        'is-horizontal': !isRightClickAnnotationPopupEnabled && !isOfficeEditor,
      })}
      ref={popupRef}
      data-element={DataElements.CONTEXT_MENU_POPUP}
      css={position}
      onClick={() => dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP))}
    >
      <FocusTrap locked={isOpen && position.top !== 0 && position.left !== 0}>
        <div className="container">
          {isOfficeEditor ? (
            popupItems.map(renderOfficePopupItem)
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

ContextMenuPopup.propTypes = {
  clickPosition: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }).isRequired,
};

export default React.memo(ContextMenuPopup);
