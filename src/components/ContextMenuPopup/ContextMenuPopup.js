import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { useSelector, useDispatch, useStore, shallowEqual } from 'react-redux';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';
import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { isMobile as isMobileCSS, isIE, isMobileDevice, isFirefox } from 'helpers/device';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';

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
  const [
    isOpen,
    isDisabled,
    isRightClickAnnotationPopupEnabled,
    isMultiViewerMode,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.CONTEXT_MENU_POPUP),
      selectors.isElementDisabled(state, DataElements.CONTEXT_MENU_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.isMultiViewerMode(state),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

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

  useLayoutEffect(() => {
    let { left, top } = clickPosition;
    const { width, height } = popupRef.current.getBoundingClientRect();
    const documentContainer =
      isMultiViewerMode
        ? getRootNode().querySelector(`#DocumentContainer${activeDocumentViewerKey}`)
        : getRootNode().querySelector('.DocumentContainer');
    if (documentContainer) {
      const containerBox = documentContainer.getBoundingClientRect();
      const horizontalGap = 2;
      const verticalGap = 2;
      let offsetLeft = 0;
      let offsetTop = 0;

      if (window.isApryseWebViewerWebComponent) {
        const node = getRootNode();
        if (node) {
          const host = node.host;
          offsetLeft = host.offsetLeft;
          offsetTop = host.offsetTop;
        }
      }

      left -= offsetLeft;
      top -= offsetTop;

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
      setPosition({ left, top });
    }
  }, [clickPosition, isMultiViewerMode, activeDocumentViewerKey]);

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
                onClick={async () => {
                  await core.getOfficeEditor().copySelectedText();
                  core.getOfficeEditor().removeSelection();
                }}
                shortcut="Ctrl+X"
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
              <OfficeActionItem
                title="action.copy"
                img="icon-copy"
                dataElement={DataElements.OFFICE_EDITOR_COPY}
                onClick={() => core.getOfficeEditor().copySelectedText()}
                shortcut="Ctrl+C"
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
              {!isFirefox && (
                <>
                  <OfficeActionItem
                    title="action.paste"
                    img="icon-paste"
                    dataElement={DataElements.OFFICE_EDITOR_PASTE}
                    onClick={() => core.getOfficeEditor().pasteText()}
                    shortcut="Ctrl+V"
                  />
                  <OfficeActionItem
                    title="action.pasteWithoutFormatting"
                    img="icon-paste-without-formatting"
                    dataElement={DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING}
                    onClick={() => core.getOfficeEditor().pasteText(false)}
                    shortcut="Ctrl+Shift+V"
                  />
                </>
              )}
              {!core.getOfficeEditor().isCursorInTable() && (
                <OfficeActionItem
                  title="action.delete"
                  img="icon-delete-line"
                  dataElement={DataElements.OFFICE_EDITOR_DELETE}
                  onClick={() => core.getOfficeEditor().removeSelection()}
                  disabled={!(core.getOfficeEditor().isTextSelected() || core.getOfficeEditor().isImageSelected())}
                />
              )}
              {core.getOfficeEditor().isCursorInTable() && (
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

  return isIE || isMobile ? (
    contextMenuPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{contextMenuPopup}</Draggable>
  );
};

export default React.memo(ContextMenuPopup);
